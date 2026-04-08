export class AssetManager {
    static images: { [key: string]: HTMLImageElement } = {};
    static loaded: number = 0;
    static totalToLoad: number = 0;

    static loadImage(key: string, src: string): void {
        this.totalToLoad++;
        const img = new Image();
        img.src = src;
        img.onload = () => {
            this.images[key] = img;
            this.loaded++;
            console.log(`Loaded asset: ${key}`);
        };
        img.onerror = (err) => {
            console.error(`Failed to load asset: ${src}`, err);
            // Even if it fails, compute it so we don't lock the game
            this.loaded++;
        }
    }

    static isReady(): boolean {
        return this.loaded === this.totalToLoad && this.totalToLoad > 0;
    }

    static getImage(key: string): HTMLImageElement | null {
        return this.images[key] || null;
    }
}
