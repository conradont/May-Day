import { GameArea } from '../engine/GameArea';
import { AssetManager } from '../engine/AssetManager';

export class Player {
    x: number;
    y: number;
    width: number = 96; 
    height: number = 96;
    
    velocityY: number = 0;
    gravity: number = 1200; 
    jumpForce: number = -600; 
    isGrounded: boolean = false;
    speedX: number = 250;

    health: number = 100;
    maxHealth: number = 100;
    hunger: number = 100;
    maxHunger: number = 100;
    hungerDecayRate: number = 0.8;

    // "Facão" mechanics only
    isAttackingMelee: boolean = false;
    meleeTimer: number = 0;

    // Movement
    facingRight: boolean = true;
    canvasW: number = 800;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update(deltaTime: number, gameArea: GameArea, keys: any) {
        this.canvasW = gameArea.canvas.width;
        
        if (keys['ArrowRight'] || keys['KeyD']) {
            this.x += this.speedX * deltaTime;
            this.facingRight = true;
        }
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.x -= this.speedX * deltaTime;
            this.facingRight = false;
        }
        
        // clamp inside window
        if(this.x < 0) this.x = 0;
        if(this.x > this.canvasW - this.width) this.x = this.canvasW - this.width;

        // Gravity
        this.velocityY += this.gravity * deltaTime;
        this.y += this.velocityY * deltaTime;

        // Floor collision
        if (this.y + this.height >= gameArea.canvas.height - 30) {
            this.y = gameArea.canvas.height - 30 - this.height;
            this.velocityY = 0;
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
        }

        // Facão logic
        if (this.isAttackingMelee) {
            this.meleeTimer -= deltaTime;
            if (this.meleeTimer <= 0) {
                this.isAttackingMelee = false;
            }
        }

        // Survival
        this.hunger -= this.hungerDecayRate * deltaTime;
        if (this.hunger < 0) this.hunger = 0;
    }

    jump() {
        if (this.isGrounded) {
            this.velocityY = this.jumpForce;
            this.isGrounded = false;
        }
    }

    melee() {
        if (!this.isAttackingMelee) {
            this.isAttackingMelee = true;
            this.meleeTimer = 0.2; // 200ms swipe duration
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        const img = AssetManager.getImage('soldier');
        
        ctx.save();
        if (!this.facingRight) {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            if(img) ctx.drawImage(img, 0, 0, this.width, this.height);
        } else {
            if(img) ctx.drawImage(img, this.x, this.y, this.width, this.height);
        }
        ctx.restore();

        // Draw Facão slash effect
        if (this.isAttackingMelee) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            const reach = 60;
            if (this.facingRight) {
                ctx.beginPath();
                ctx.arc(this.x + this.width, this.y + this.height/2, reach, -Math.PI/2, Math.PI/2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(this.x, this.y + this.height/2, reach, Math.PI/2, -Math.PI/2);
                ctx.fill();
            }
        }
    }
}
