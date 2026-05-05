import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        // Background
        const bg = this.add.image(0, 0, 'menu_bg').setOrigin(0, 0);
        bg.displayWidth = this.cameras.main.width;
        bg.displayHeight = this.cameras.main.height;

        // Overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // Title
        const title = this.add.text(this.cameras.main.width / 2, 150, 'MAYDAY\nJUNGLE SURVIVAL', {
            font: '52px Courier New',
            color: '#ffcc00',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Buttons
        this.createButton(this.cameras.main.width / 2, 350, 'INICIAR MISSÃO', () => {
            this.scene.start('GameScene');
            this.scene.launch('UIScene'); // Start UI overlay concurrently
        });

        this.createButton(this.cameras.main.width / 2, 430, 'CONFIGURAÇÕES', () => {
            console.log('Settings clicked');
        });
    }

    createButton(x: number, y: number, text: string, onClick: () => void) {
        const btn = this.add.text(x, y, text, {
            font: '24px Courier New',
            color: '#ffffff',
            backgroundColor: '#1E641E',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => {
            btn.setStyle({ color: '#000000', backgroundColor: '#55ff55' });
            this.tweens.add({ targets: btn, scaleX: 1.05, scaleY: 1.05, duration: 100 });
        });

        btn.on('pointerout', () => {
            btn.setStyle({ color: '#ffffff', backgroundColor: '#1E641E' });
            this.tweens.add({ targets: btn, scaleX: 1, scaleY: 1, duration: 100 });
        });

        btn.on('pointerdown', onClick);
        return btn;
    }
}
