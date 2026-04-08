import { AssetManager } from "../engine/AssetManager";

export class Environment {
    bgX = 0;

    constructor() {}
    
    update(deltaTime: number, playerX: number) {
        // Scroll based on player X position to simulate camera Parallax
        this.bgX = (playerX * -0.2) % 800; 
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
        const bgImg = AssetManager.getImage('jungle_bg');
        if (bgImg) {
            ctx.fillStyle = '#0a2e0a';
            ctx.fillRect(0, 0, width, height);
            
            // Draw multiple copies for seamless scroll
            for(let i=-1; i<3; i++) {
                ctx.drawImage(bgImg, this.bgX + (i * width), 0, width, height);
            }
        } else {
             // Fallback
             ctx.fillStyle = '#0a2e0a';
             ctx.fillRect(0, 0, width, height);
        }

        const heli = AssetManager.getImage('helico_crash');
        if (heli) {
            // Positioned dynamically relative to the scenery scroll
            ctx.drawImage(heli, this.bgX + 100, height - 300, 300, 200);
        }
    }
}
