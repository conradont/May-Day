import { GameArea } from './engine/GameArea';
import { Player } from './game/Player';
import { Environment } from './game/Environment';
import { Enemy } from './game/Enemy';
import { AssetManager } from './engine/AssetManager';
import { GameManager, GameState } from './engine/GameManager';

console.log("Renderer initialized: Booting UI System");

const gameArea = new GameArea('gameCanvas');

// Asset Loading
AssetManager.loadImage('jungle_bg', '../src/assets/jungle_bg.png');
AssetManager.loadImage('helico_crash', '../src/assets/helico_crash.png');
AssetManager.loadImage('soldier', '../src/assets/soldier.png');
AssetManager.loadImage('jaguar', '../src/assets/jaguar.png');
AssetManager.loadImage('snake', '../src/assets/snake.png');

// Global Game State
const keys: { [key: string]: boolean } = {};
let environment = new Environment();
let player = new Player(100, 100);
let enemies: Enemy[] = [];
let survivalTimer = 0;
let animationRequestId: number | null = null;
let lastTimestamp: number = 0;

// HUD Elements Cache
const healthFill = document.getElementById('hud-health-fill');
const hungerFill = document.getElementById('hud-hunger-fill');

function resetGameVars() {
    environment = new Environment();
    player = new Player(100, 100);
    enemies = [];
    survivalTimer = 0;
    
    // Initial spawn
    enemies.push(new Enemy(600, 100, 'JAGUAR'));
    
    // Default difficulty is locked at 1.0
    GameManager.difficultyMultiplier = 1.0;
}

function updateHUDDOM() {
    if (healthFill) {
        const hpPercent = Math.max(0, (player.health / player.maxHealth) * 100);
        healthFill.style.width = `${hpPercent}%`;
    }
    if (hungerFill) {
        const hunPercent = Math.max(0, (player.hunger / player.maxHunger) * 100);
        hungerFill.style.width = `${hunPercent}%`;
    }
}

function gameLoop(timestamp: number) {
    if (GameManager.state !== GameState.PLAYING) return;
    
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    survivalTimer += deltaTime;
    gameArea.clear();
    
    environment.update(deltaTime, player.x);
    player.update(deltaTime, gameArea, keys);

    enemies.forEach(enemy => {
        enemy.update(deltaTime, gameArea, player.x);

        const AABB = (r1: any, r2: any) => (
            r1.x < r2.x + r2.width && r1.x + r1.width > r2.x &&
            r1.y < r2.y + r2.height && r1.y + r1.height > r2.y
        );

        // Enemy vs Player continuous damage
        if (AABB(player, enemy)) {
            player.health -= (enemy.damageFactor * GameManager.difficultyMultiplier) * deltaTime;
        }

        // Facão Melee vs Enemy
        if (player.isAttackingMelee) {
            const reach = 60;
            let meleeHitbox = {x: player.x, y: player.y + 10, width: player.width, height: player.height - 20};
            if (player.facingRight) meleeHitbox.x += player.width;
            else { meleeHitbox.x -= reach; meleeHitbox.width = reach; }

            if (AABB(meleeHitbox, enemy)) {
                enemy.takeDamage(180 * deltaTime);
            }
        }
    });

    enemies = enemies.filter(e => e.active);

    // Random generic Spawner
    if (Math.random() < (0.006 * GameManager.difficultyMultiplier) && enemies.length < 6) {
        const spawnRight = Math.random() > 0.5;
        const isJaguar = Math.random() > 0.4;
        enemies.push(new Enemy(spawnRight ? 850 : -100, 100, isJaguar ? 'JAGUAR' : 'SNAKE'));
    }

    // Paint sequence
    environment.draw(gameArea.context, gameArea.canvas.width, gameArea.canvas.height);
    player.draw(gameArea.context);
    enemies.forEach(e => e.draw(gameArea.context));

    // Update the DOM DOM via Reactivity
    updateHUDDOM();

    // Death Condition Check
    if (player.health <= 0 || player.hunger <= 0) {
        const statsStr = document.getElementById('stats-text');
        if (statsStr) {
            statsStr.innerHTML = `Sobreviveu: <span style="color:#ffcc00">${Math.floor(survivalTimer)}</span> segundos<br>Dificuldade: ${GameManager.difficultyMultiplier}x`;
        }
        GameManager.changeState(GameState.GAMEOVER);
        return; 
    }

    animationRequestId = requestAnimationFrame(gameLoop);
}

GameManager.onStartGame = () => {
    gameArea.canvas.style.cursor = 'none';
    lastTimestamp = 0;
    for(let k in keys) keys[k] = false;
    animationRequestId = requestAnimationFrame(gameLoop);
};

GameManager.onResetGame = () => {
    resetGameVars();
};

GameManager.onStopGame = () => {
    gameArea.canvas.style.cursor = 'default';
    if (animationRequestId) cancelAnimationFrame(animationRequestId);
};

window.addEventListener('keydown', (e) => {
    if (GameManager.state !== GameState.PLAYING) return;
    keys[e.code] = true;
    if (e.code === 'Space' || e.code === 'ArrowUp') player.jump();
    if (e.code === 'KeyX') player.melee(); // Facão Attack
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// UI Event Listeners hooks
document.getElementById('btn-play')?.addEventListener('click', () => GameManager.changeState(GameState.PLAYING));
document.getElementById('btn-settings')?.addEventListener('click', () => GameManager.changeState(GameState.SETTINGS));
document.getElementById('btn-settings-back')?.addEventListener('click', () => GameManager.changeState(GameState.MENU));
document.getElementById('btn-restart')?.addEventListener('click', () => GameManager.changeState(GameState.PLAYING));
document.getElementById('btn-back-menu')?.addEventListener('click', () => GameManager.changeState(GameState.MENU));
document.getElementById('btn-exit')?.addEventListener('click', () => window.close());

// Initial Loading Poller
const waitInterval = setInterval(() => {
    if (AssetManager.isReady()) {
        clearInterval(waitInterval);
        GameManager.changeState(GameState.MENU);
    }
}, 100);

setTimeout(() => {
    if(GameManager.state === GameState.LOADING) {
        clearInterval(waitInterval);
        GameManager.changeState(GameState.MENU);
    }
}, 3000);
