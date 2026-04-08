export class GameArea {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    lastTime: number = 0;
    deltaTime: number = 0;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error("Could not initialize 2D context");
        }
        this.context = ctx;
        // Optimization for pixel art scaling - disable smoothing
        this.context.imageSmoothingEnabled = false;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    start(gameLoop: (deltaTime: number) => void) {
        const loop = (timestamp: number) => {
            if (!this.lastTime) this.lastTime = timestamp;
            this.deltaTime = (timestamp - this.lastTime) / 1000; // in seconds
            this.lastTime = timestamp;

            gameLoop(this.deltaTime);

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}
