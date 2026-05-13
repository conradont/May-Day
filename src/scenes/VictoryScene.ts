import Phaser from 'phaser';

export default class VictoryScene extends Phaser.Scene {
    constructor() {
        super('VictoryScene');
    }

    create(data: { survivalTime?: number }) {
        this.sound.stopByKey('in_game_soundtrack');

        // Play main soundtrack if not already playing
        if (!this.sound.get('main_soundtrack') || !this.sound.get('main_soundtrack').isPlaying) {
            this.sound.play('main_soundtrack', { loop: true, volume: 0.5 });
        }

        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.9);
        overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        this.add.text(this.cameras.main.width / 2, 180, 'MISSÃO CUMPRIDA!', {
            font: '48px Courier New',
            color: '#55ff55',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.width / 2, 260, 'Você sobreviveu à selva e derrotou as feras.', {
            font: '20px Courier New',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Buttons
        this.createButton(this.cameras.main.width / 2, 380, 'JOGAR DE NOVO', () => {
            this.scene.start('GameScene');
            this.scene.launch('UIScene');
        });

        this.createButton(this.cameras.main.width / 2, 460, 'MENU PRINCIPAL', () => {
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
