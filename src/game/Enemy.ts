import { GameArea } from '../engine/GameArea';
import { AssetManager } from '../engine/AssetManager';

export type AnimalType = 'JAGUAR' | 'SNAKE';

export class Enemy {
    x: number;
    y: number;
    width: number;
    height: number;
    health: number;
    speed: number;
    damageFactor: number;
    active: boolean = true;
    type: AnimalType;
    
    velocityY: number = 0;
    gravity: number = 1200;
    facingRight: boolean = false;

    constructor(x: number, y: number, type: AnimalType) {
        this.x = x;
        this.type = type;
        
        if (type === 'JAGUAR') {
            this.width = 100;
            this.height = 70;
            this.health = 80;
            this.speed = 180; // Fast
            this.damageFactor = 20; // Hit hard
            this.y = y; 
        } else {
            // SNAKE
            this.width = 60;
            this.height = 40;
            this.health = 30;
            this.speed = 50; // Slow creeping
            this.damageFactor = 10; // Poison
            this.y = y;
        }
    }

    update(deltaTime: number, gameArea: GameArea, playerX: number) {
        // Chase towards player
        const chaseDistance = this.type === 'JAGUAR' ? 60 : 30;
        if (this.x > playerX + chaseDistance) {
            this.x -= this.speed * deltaTime;
            this.facingRight = false;
        } else if (this.x < playerX - chaseDistance) {
            this.x += this.speed * deltaTime;
            this.facingRight = true;
        }

        // Gravity
        this.velocityY += this.gravity * deltaTime;
        this.y += this.velocityY * deltaTime;

        // Floor collision
        if (this.y + this.height >= gameArea.canvas.height - 30) {
            this.y = gameArea.canvas.height - 30 - this.height;
            this.velocityY = 0;
        }
    }

    takeDamage(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            this.active = false; // dead
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        const assetName = this.type === 'JAGUAR' ? 'jaguar' : 'snake';
        const img = AssetManager.getImage(assetName);
        
        ctx.save();
        if (this.facingRight) {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            if(img) ctx.drawImage(img, 0, 0, this.width, this.height);
        } else {
            if(img) ctx.drawImage(img, this.x, this.y, this.width, this.height);
        }
        ctx.restore();

        // Optional minimal health bar for enemies
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(this.x + 10, this.y - 10, this.width - 20, 4);
        const maxHealth = this.type === 'JAGUAR' ? 80 : 30;
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(this.x + 10, this.y - 10, Math.max(0, (this.width - 20) * (this.health / maxHealth)), 4);
    }
}
