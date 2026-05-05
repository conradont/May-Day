import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
    healthBar!: Phaser.GameObjects.Graphics;
    hungerBar!: Phaser.GameObjects.Graphics;
    thirstBar!: Phaser.GameObjects.Graphics;
    controlsGroup!: Phaser.GameObjects.Group;
    phaseText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'UIScene', active: false });
    }

    create() {
        this.healthBar = this.add.graphics();
        this.hungerBar = this.add.graphics();
        this.thirstBar = this.add.graphics();
        
        // Initial draw
        this.updateBars(100, 100, 100);

        // Listen for events from GameScene
        const gameScene = this.scene.get('GameScene');
        gameScene.events.on('updateUI', this.handleUpdateUI, this);

        // Weapon icon placeholder
        this.add.rectangle(730, 530, 64, 64, 0x000000, 0.5).setStrokeStyle(2, 0xffffff);
        this.add.text(730, 530, 'FACÃO\n[X]', { font: '12px Courier', color: '#fff', align: 'center' }).setOrigin(0.5);

        // Tutorial Controls
        this.controlsGroup = this.add.group();
        const upIcon = this.add.text(400, 200, 'W / ⬆️ Pular', { font: '24px Courier', color: '#fff', backgroundColor: '#333', padding: {x:10,y:5} }).setOrigin(0.5).setAlpha(0.8);
        const leftIcon = this.add.text(300, 260, 'A / ⬅️ Esquerda', { font: '24px Courier', color: '#fff', backgroundColor: '#333', padding: {x:10,y:5} }).setOrigin(0.5).setAlpha(0.8);
        const rightIcon = this.add.text(500, 260, 'Direita ➡️ / D', { font: '24px Courier', color: '#fff', backgroundColor: '#333', padding: {x:10,y:5} }).setOrigin(0.5).setAlpha(0.8);
        this.controlsGroup.addMultiple([upIcon, leftIcon, rightIcon]);
        this.controlsGroup.setVisible(false);

        // Phase Text
        this.phaseText = this.add.text(400, 300, '', {
            font: 'bold 54px Courier',
            color: '#ffcc00',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5).setAlpha(0);

        gameScene.events.on('showControls', () => {
            this.controlsGroup.setVisible(true);
            this.controlsGroup.setAlpha(1);
        }, this);

        gameScene.events.on('hideControls', () => {
            this.tweens.add({
                targets: this.controlsGroup.getChildren(),
                alpha: 0,
                duration: 1000,
                onComplete: () => this.controlsGroup.setVisible(false)
            });
        }, this);

        gameScene.events.on('showPhase', (text: string) => {
            this.phaseText.setText(text);
            this.phaseText.setAlpha(0);
            this.tweens.add({
                targets: this.phaseText,
                alpha: 1,
                duration: 500,
                yoyo: true,
                hold: 2500
            });
        }, this);
    }

    handleUpdateUI(data: { health: number, maxHealth: number, hunger: number, maxHunger: number, thirst: number, maxThirst: number }) {
        const hpPercent = Math.max(0, data.health / data.maxHealth);
        const hunPercent = Math.max(0, data.hunger / data.maxHunger);
        const thirstPercent = Math.max(0, data.thirst / data.maxThirst);
        this.updateBars(hpPercent * 100, hunPercent * 100, thirstPercent * 100);
    }

    updateBars(healthPercent: number, hungerPercent: number, thirstPercent: number) {
        // Health (Red)
        this.healthBar.clear();
        this.healthBar.fillStyle(0x000000, 0.5);
        this.healthBar.fillRect(20, 20, 200, 12);
        this.healthBar.lineStyle(2, 0xffffff);
        this.healthBar.strokeRect(20, 20, 200, 12);
        this.healthBar.fillStyle(0xff3333, 1);
        this.healthBar.fillRect(20, 20, 200 * (healthPercent / 100), 12);

        // Hunger (Yellow)
        this.hungerBar.clear();
        this.hungerBar.fillStyle(0x000000, 0.5);
        this.hungerBar.fillRect(20, 40, 150, 12);
        this.hungerBar.lineStyle(2, 0xffffff);
        this.hungerBar.strokeRect(20, 40, 150, 12);
        this.hungerBar.fillStyle(0xffcc00, 1);
        this.hungerBar.fillRect(20, 40, 150 * (hungerPercent / 100), 12);

        // Thirst (Cyan)
        this.thirstBar.clear();
        this.thirstBar.fillStyle(0x000000, 0.5);
        this.thirstBar.fillRect(20, 60, 150, 12);
        this.thirstBar.lineStyle(2, 0xffffff);
        this.thirstBar.strokeRect(20, 60, 150, 12);
        this.thirstBar.fillStyle(0x00ccff, 1);
        this.thirstBar.fillRect(20, 60, 150 * (thirstPercent / 100), 12);
    }
}
