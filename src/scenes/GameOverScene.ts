import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create(data: { survivalTime: number }) {
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.85);
        overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        this.add.text(this.cameras.main.width / 2, 200, 'MISSION FAILED', {
            font: '48px Courier New',
            color: '#ff3333',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.width / 2, 280, `Tempo Sobrevivido: ${Math.floor(data.survivalTime || 0)}s`, {
            font: '24px Courier New',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.createButton(this.cameras.main.width / 2, 400, 'TENTAR NOVAMENTE', () => {
            this.scene.start('GameScene');
            this.scene.start('UIScene');
        });

        this.createButton(this.cameras.main.width / 2, 480, 'VOLTAR AO MENU', () => {
            this.scene.start('MenuScene');
        });
    }

    createButton(x: number, y: number, text: string, onClick: () => void) {
        const btn = this.add.text(x, y, text, {
            font: '20px Courier New',
            color: '#ffffff',
            backgroundColor: '#1E641E',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setStyle({ color: '#000000', backgroundColor: '#55ff55' }));
        btn.on('pointerout', () => btn.setStyle({ color: '#ffffff', backgroundColor: '#1E641E' }));
        btn.on('pointerdown', onClick);
    }
}
