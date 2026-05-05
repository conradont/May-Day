import Phaser from 'phaser';

export default class VictoryScene extends Phaser.Scene {
    constructor() {
        super('VictoryScene');
    }

    create(data: { currentZone: number }) {
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.9);
        overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        const isFinal = data.currentZone >= 3;

        this.add.text(this.cameras.main.width / 2, 200, isFinal ? 'SOBREVIVÊNCIA GARANTIDA' : 'ÁREA LIMPA!', {
            font: '48px Courier New',
            color: '#55ff55',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(this.cameras.main.width / 2, 280, isFinal ? 'O resgate chegou!' : `Avançando para Zona ${data.currentZone + 1}...`, {
            font: '24px Courier New',
            color: '#ffffff'
        }).setOrigin(0.5);

        const btnText = isFinal ? 'VOLTAR AO MENU' : 'PRÓXIMA ZONA';
        
        this.createButton(this.cameras.main.width / 2, 400, btnText, () => {
            if (isFinal) {
                this.scene.start('MenuScene');
            } else {
                this.scene.start('GameScene', { zone: data.currentZone + 1 });
                this.scene.start('UIScene');
            }
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
