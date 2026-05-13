import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Loading bar
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px Courier New',
                color: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        // Characters (still using placeholders)
        // this.load.spritesheet('player', '../src/assets/soldier.png', { frameWidth: 96, frameHeight: 96 });
        // this.load.spritesheet('jaguar', '../src/assets/jaguar.png', { frameWidth: 100, frameHeight: 70 });
        // this.load.spritesheet('snake', '../src/assets/snake.png', { frameWidth: 60, frameHeight: 40 });
        
        // Generate placeholder textures for characters
        this.createCharacterPlaceholders();

        // Parallax and Ground
        this.createEnvironmentPlaceholders();

        this.load.image('menu_bg', '../src/assets/menu_bg.png');
        this.load.spritesheet('player', '../src/assets/survivor_spritesheet_fixed_b.png', { frameWidth: 170, frameHeight: 204 });
        this.load.spritesheet('bat', '../src/assets/bat_spritesheet.png', { frameWidth: 421, frameHeight: 327 });
        this.load.spritesheet('jaguar', '../src/assets/jaguar_spritesheet.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('aligator', '../src/assets/aligator_spritesheet.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('snake', '../src/assets/snake_spritesheet.png', { frameWidth: 256, frameHeight: 256 });
        this.load.image('chao_fundo', '../src/assets/chaoatualizadov2.png');

        this.createDropPlaceholders();

        // Audio files
        this.load.audio('character_death', '../src/sounds/character_death.mp3');
        this.load.audio('in_game_soundtrack', '../src/sounds/in_game_soundtrack.mp3');
        this.load.audio('knife_slice', '../src/sounds/knife_slice.mp3');
        this.load.audio('main_soundtrack', '../src/sounds/main_soundtrack.mp3');
    }

    createDropPlaceholders() {
        // Fruit drop
        const fruitGfx = this.add.graphics();
        fruitGfx.fillStyle(0xff4500, 1); // Orange
        fruitGfx.fillCircle(12, 16, 12);
        fruitGfx.fillStyle(0x228B22, 1); // Green leaf
        fruitGfx.fillTriangle(12, 4, 8, -4, 16, -4);
        fruitGfx.generateTexture('drop_fruit', 24, 32);
        fruitGfx.destroy();
    }

    createEnvironmentPlaceholders() {
        // Sky Background
        const skyGfx = this.add.graphics();
        skyGfx.fillStyle(0x87CEEB, 1);
        skyGfx.fillRect(0, 0, 800, 600);
        skyGfx.generateTexture('bg_sky', 800, 600);
        skyGfx.destroy();

        // Parallax Trees Layer
        const treesGfx = this.add.graphics();
        treesGfx.fillStyle(0x228B22, 0.4);
        for(let i=0; i<10; i++){
            treesGfx.fillTriangle(i*100, 600, i*100+50, 200, i*100+100, 600);
        }
        treesGfx.generateTexture('bg_trees', 800, 600);
        treesGfx.destroy();

        // Helicopter Crash (Midground object)
        const heliGfx = this.add.graphics();
        heliGfx.fillStyle(0x555544, 1);
        heliGfx.fillEllipse(150, 100, 200, 100);
        heliGfx.fillStyle(0x333333, 1);
        heliGfx.fillRect(100, 50, 20, 100); // rotors
        heliGfx.generateTexture('helico_crash', 300, 200);
        heliGfx.destroy();

        // Single ground tile (32x32)
        const tileGfx = this.add.graphics();
        tileGfx.fillStyle(0x55aa55, 1); // grass top
        tileGfx.fillRect(0, 0, 32, 8);
        tileGfx.fillStyle(0x8B4513, 1); // dirt bottom
        tileGfx.fillRect(0, 8, 32, 24);
        tileGfx.generateTexture('jungle_tiles', 32, 32);
        tileGfx.destroy();
    }

    createCharacterPlaceholders() {

        // Jaguar (placeholder removed, using spritesheet)

        // Snake (placeholder removed, using spritesheet)
    }

    create() {
        this.scene.start('MenuScene');
    }
}
