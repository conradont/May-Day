import Phaser from 'phaser';

enum GameState {
    Phase1_Intro,
    Phase1_Combat,
    Phase1_Cleared,
    Transition,
    Phase2_Intro,
    Phase2_Combat,
    Finished
}

export default class GameScene extends Phaser.Scene {
    player!: Phaser.Physics.Arcade.Sprite;
    enemies!: Phaser.Physics.Arcade.Group;
    drops!: Phaser.Physics.Arcade.Group;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    keyX!: Phaser.Input.Keyboard.Key;
    keyA!: Phaser.Input.Keyboard.Key;
    keyD!: Phaser.Input.Keyboard.Key;
    keyW!: Phaser.Input.Keyboard.Key;
    
    // Player stats
    playerHealth = 100;
    playerMaxHealth = 100;
    playerHunger = 100;
    playerMaxHunger = 100;
    playerThirst = 100;
    playerMaxThirst = 100;

    survivalTime = 0;
    isAttacking = false;
    isDead = false;
    attackHitbox!: Phaser.GameObjects.Rectangle;

    // Progression
    currentZone = 1;
    state: GameState = GameState.Phase1_Intro;
    blockerWall!: Phaser.Physics.Arcade.Image;
    phase1Enemy: Phaser.Physics.Arcade.Sprite | null = null;
    portalTrigger!: Phaser.GameObjects.Text;

    // Background
    groundLayer!: Phaser.Tilemaps.TilemapLayer;

    constructor() {
        super('GameScene');
    }

    init(data?: { zone?: number }) {
        this.currentZone = data?.zone || 1;
        this.playerHealth = 100;
        this.playerHunger = 100;
        this.playerThirst = 100;
        this.survivalTime = 0;
        this.state = GameState.Phase1_Intro;
        this.phase1Enemy = null;
        this.isDead = false;
    }

    create() {
        // Prepare base animations for when spritesheets are properly structured
        this.createAnimations();

        // Setup world bounds
        this.physics.world.setBounds(0, 0, 2400, 600);
        this.cameras.main.setBounds(0, 0, 800, 600); // Lock strictly to Phase 1 initially

        const bgScale = 600 / 1024;
        const bgWidth = 1536 * bgScale;
        for (let i = 0; i < 3; i++) {
            this.add.image(i * bgWidth, 600, 'chao_fundo').setOrigin(0, 1).setScale(bgScale).setScrollFactor(1);
        }

        // Ground Tilemap
        const map = this.make.tilemap({ tileWidth: 32, tileHeight: 32, width: 75, height: 19 });
        const tileset = map.addTilesetImage('jungle_tiles') as Phaser.Tilemaps.Tileset;
        const layer = map.createBlankLayer('Ground', tileset, 0, 0);
        if (layer) {
            this.groundLayer = layer;
            // The canvas is 600px high. 14 * 32 = 448. Floor is at 448 to match visual background path.
            this.groundLayer.fill(0, 0, 14, 75, 5); 
            this.groundLayer.setCollisionByExclusion([-1]);
            this.groundLayer.setVisible(false); // Ocultar o tilemap visualmente
        }

        // Drops Group
        this.drops = this.physics.add.group();
        this.physics.add.collider(this.drops, this.groundLayer);

        // Factory Groups
        this.enemies = this.physics.add.group();
        this.physics.add.collider(this.enemies, this.groundLayer);

        // Player
        this.player = this.physics.add.sprite(200, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(1200);
        this.player.setDisplaySize(64, 96);
        this.player.setData('facingRight', true);
        this.physics.add.collider(this.player, this.groundLayer);

        // Play idle anim if available
        this.player.anims.play('player_idle', true);

        // Collection overlap
        this.physics.add.overlap(this.player, this.drops, this.collectDrop, undefined, this);

        // Melee hitbox
        this.attackHitbox = this.add.rectangle(this.player.x, this.player.y, 60, 60, 0xffffff, 0);
        this.physics.add.existing(this.attackHitbox);
        
        // Input
        if (this.input.keyboard) {
             this.cursors = this.input.keyboard.createCursorKeys();
             this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
             this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
             this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
             this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        }

        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        // Invisible blocker wall for Phase 1 (prevents player from proceeding past x=600 until they beat the first enemy)
        this.blockerWall = this.physics.add.image(600, 300, 'bg_sky').setVisible(false);
        this.blockerWall.setImmovable(true);
        (this.blockerWall.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        this.blockerWall.setDisplaySize(20, 600);
        this.physics.add.collider(this.player, this.blockerWall);

        // Notify UI to show controls after a slight delay
        this.time.delayedCall(100, () => this.events.emit('showControls'));
    }

    createAnimations() {
        if (!this.anims.exists('jaguar_run')) {
            this.anims.create({ key: 'player_idle', frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'player_walk', frames: this.anims.generateFrameNumbers('player', { start: 6, end: 11 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'player_run', frames: this.anims.generateFrameNumbers('player', { start: 12, end: 17 }), frameRate: 12, repeat: -1 });
            this.anims.create({ key: 'player_attack', frames: this.anims.generateFrameNumbers('player', { start: 18, end: 23 }), frameRate: 15, repeat: 0 });
            this.anims.create({ key: 'player_jump', frames: this.anims.generateFrameNumbers('player', { start: 24, end: 29 }), frameRate: 10, repeat: 0 });
            this.anims.create({ key: 'player_death', frames: [ { key: 'player', frame: 29 } ], frameRate: 8, repeat: 0 });

            // Snake animations
            this.anims.create({ key: 'snake_run_right', frames: this.anims.generateFrameNumbers('snake', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'snake_run_left', frames: this.anims.generateFrameNumbers('snake', { start: 4, end: 7 }), frameRate: 8, repeat: -1 });
            this.anims.create({ key: 'snake_attack', frames: this.anims.generateFrameNumbers('snake', { start: 8, end: 11 }), frameRate: 10, repeat: 0 });
            this.anims.create({ key: 'snake_hurt', frames: this.anims.generateFrameNumbers('snake', { start: 12, end: 15 }), frameRate: 8, repeat: 0 });

            // Jaguar animations
            this.anims.create({ key: 'jaguar_run_right', frames: this.anims.generateFrameNumbers('jaguar', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'jaguar_run_left', frames: this.anims.generateFrameNumbers('jaguar', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'jaguar_attack', frames: this.anims.generateFrameNumbers('jaguar', { start: 8, end: 11 }), frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'jaguar_hurt', frames: this.anims.generateFrameNumbers('jaguar', { start: 12, end: 15 }), frameRate: 10, repeat: 0 });

            // Bat animations
            this.anims.create({ key: 'bat_fly_left', frames: this.anims.generateFrameNumbers('bat', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'bat_fly_right', frames: this.anims.generateFrameNumbers('bat', { start: 4, end: 7 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'bat_attack', frames: this.anims.generateFrameNumbers('bat', { start: 8, end: 11 }), frameRate: 12, repeat: 0 });
            this.anims.create({ key: 'bat_hurt', frames: this.anims.generateFrameNumbers('bat', { start: 12, end: 15 }), frameRate: 10, repeat: 0 });
        }
    }

    spawnSpecificEnemy(x: number, y: number, type: string) {
            let enemy: Phaser.Physics.Arcade.Sprite;

            if (type === 'bat') {
                enemy = this.enemies.create(x, this.player.y - 150, 'bat');
                (enemy.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
                enemy.setDisplaySize(128, 128); // Shrink from 256x256 to fit nicely
                enemy.setData('type', 'bat');
                enemy.setData('speed', 120);
                enemy.setData('health', 40);
                enemy.setData('damage', 15);
                enemy.anims.play('bat_fly_left', true); // Default animation
            } else {
                enemy = this.enemies.create(x, y, type);
                enemy.setGravityY(1200);
                
                if (type === 'jaguar') {
                    enemy.setDisplaySize(128, 128);
                    enemy.setData('type', 'jaguar');
                    enemy.setData('speed', 180);
                    enemy.setData('health', 80);
                    enemy.setData('damage', 20);
                    enemy.anims.play('jaguar_run_left', true);
                } else {
                    enemy.setDisplaySize(64, 64);
                    enemy.setData('type', 'snake');
                    enemy.setData('speed', 50);
                    enemy.setData('health', 30);
                    enemy.setData('damage', 10);
                    enemy.anims.play('snake_run_left', true);
                }
            }
            return enemy;
    }

    spawnLoot(x: number, y: number) {
        // Always drop a fruit
        const drop = this.drops.create(x, y, 'drop_fruit');
        drop.setGravityY(1200);
        drop.setBounce(0.5);
        
        // Despawn after 10 seconds
        this.time.delayedCall(10000, () => {
            if (drop.active) drop.destroy();
        });
    }

    collectDrop(player: any, dropObj: any) {
        const drop = dropObj as Phaser.Physics.Arcade.Sprite;

        // Fruit restores BOTH hunger and thirst
        this.playerHunger = Math.min(this.playerHunger + 30, this.playerMaxHunger);
        this.playerThirst = Math.min(this.playerThirst + 30, this.playerMaxThirst);

        // Heal a bit
        this.playerHealth = Math.min(this.playerHealth + 10, this.playerMaxHealth);

        drop.destroy(); // Remove item
    }

    update(time: number, delta: number) {
        if (this.isDead) return;

        const dTSec = delta / 1000;
        this.survivalTime += dTSec;

        this.handlePlayerMovement();
        this.handleCombat();
        this.handleSurvival(dTSec);
        this.handleEnemies(dTSec, time);
        this.handlePhaseLogic();
        
        // UI
        this.events.emit('updateUI', {
            health: this.playerHealth,
            maxHealth: this.playerMaxHealth,
            hunger: this.playerHunger,
            maxHunger: this.playerMaxHunger,
            thirst: this.playerThirst,
            maxThirst: this.playerMaxThirst
        });

        // Fail condition based on Health alone now
        if (this.playerHealth <= 0 && !this.isDead) {
            this.isDead = true;
            this.player.setVelocity(0, 0);
            
            // Animação real de morte
            this.player.anims.play('player_death', true);

            this.scene.stop('UIScene');
            
            this.time.delayedCall(2500, () => {
                this.scene.start('GameOverScene', { survivalTime: this.survivalTime });
            });
        }
    }

    handlePhaseLogic() {
        if (this.state === GameState.Phase1_Intro) {
            // Check for initial player input
            if (this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown || this.cursors.space.isDown || this.keyA?.isDown || this.keyD?.isDown || this.keyW?.isDown) {
                this.state = GameState.Phase1_Combat;
                this.events.emit('hideControls');
                this.events.emit('showPhase', 'FASE 1');
                
                // Spawn the first enemy coming from the right, slightly offscreen
                this.time.delayedCall(2000, () => {
                    this.phase1Enemy = this.spawnSpecificEnemy(800, 100, 'jaguar'); 
                });
            }
        } else if (this.state === GameState.Phase1_Combat) {
            if (this.phase1Enemy && !this.phase1Enemy.active) {
                // Defeated
                this.state = GameState.Phase1_Cleared;
                if (this.blockerWall) {
                    this.blockerWall.destroy();
                }

                // Show portal visual
                this.portalTrigger = this.add.text(750, 380, '➡️\nAVANÇAR', { font: 'bold 20px Courier', color: '#00ff00', align: 'center', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);
                this.tweens.add({
                    targets: this.portalTrigger,
                    x: 770,
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });
            }
        } else if (this.state === GameState.Phase1_Cleared) {
            // Check interaction distance to Portal
            if (this.player.x >= 750) {
                this.state = GameState.Transition;
                this.portalTrigger.destroy();
                
                // Freeze player
                this.player.setVelocityX(0);
                this.player.anims.play('player_idle', true);

                // Fade Sequence
                this.cameras.main.fadeOut(1500, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    // Reposition to Phase 2
                    this.player.x = 850;
                    this.cameras.main.setBounds(800, 0, 800, 600); // Lock to Phase 2 now
                    
                    // Stay black briefly, then fade in
                    this.time.delayedCall(1500, () => {
                        this.cameras.main.fadeIn(1500, 0, 0, 0);
                        this.cameras.main.once('camerafadeincomplete', () => {
                            this.state = GameState.Phase2_Intro;
                            this.events.emit('showPhase', 'FASE 2');
                            
                            this.time.delayedCall(2000, () => {
                                this.state = GameState.Phase2_Combat;
                                // Spawn enemies inside phase 2 constraints (x: 800-1600)
                                this.spawnSpecificEnemy(800, 100, 'jaguar'); // From Left
                                this.spawnSpecificEnemy(1550, 100, 'bat'); // From Right
                            });
                        });
                    });
                });
            }
        }
    }

    handlePlayerMovement() {
        if (this.state === GameState.Transition) return; // Block Input
        const speed = 250;
        let isMoving = false;
        
        if (this.cursors.left.isDown || this.keyA?.isDown) { 
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
            this.player.setData('facingRight', false);
            isMoving = true;
        } else if (this.cursors.right.isDown || this.keyD?.isDown) { 
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
            this.player.setData('facingRight', true);
            isMoving = true;
        } else {
            this.player.setVelocityX(0);
        }

        if ((this.cursors.up.isDown || this.cursors.space.isDown || this.keyW?.isDown) && this.player.body?.touching.down) {
            this.player.setVelocityY(-600);
        }

        // Sprite Animation state
        if (!this.isAttacking && !this.isDead) {
            if (isMoving && this.player.body?.touching.down) {
                this.player.anims.play('player_run', true);
            } else if (this.player.body?.touching.down) {
                this.player.anims.play('player_idle', true);
            } else {
                this.player.anims.play('player_jump', true);
            }
            this.player.setAngle(0);
        }
    }

    handleCombat() {
        if (this.state === GameState.Transition) return; // Block combat

        if (Phaser.Input.Keyboard.JustDown(this.keyX) && !this.isAttacking && !this.isDead) {
            this.isAttacking = true;
            this.attackHitbox.fillAlpha = 0.8;
            
            const facingRight = this.player.getData('facingRight');
            
            // Real Attack Swing
            this.player.anims.play('player_attack', true);
            const reach = 60;
            this.attackHitbox.x = facingRight ? this.player.x + reach : this.player.x - reach;
            this.attackHitbox.y = this.player.y;

            this.physics.overlap(this.attackHitbox, this.enemies, (hb, enemy) => {
                const en = enemy as Phaser.Physics.Arcade.Sprite;
                let hp = en.getData('health');
                hp -= 50; 
                en.setData('health', hp);
                
                en.setVelocityX(facingRight ? 300 : -300);
                if(en.getData('type') !== 'bat') {
                    en.setVelocityY(-200);
                }
                
                if (en.getData('type') === 'bat') {
                    en.anims.play('bat_hurt', true);
                } else if (en.getData('type') === 'jaguar') {
                    en.anims.play('jaguar_hurt', true);
                } else if (en.getData('type') === 'snake') {
                    en.anims.play('snake_hurt', true);
                }

                if (hp <= 0) {
                    if (en.getData('type') === 'boss') {
                        this.scene.stop('UIScene');
                        this.scene.start('VictoryScene', { currentZone: this.currentZone });
                    } else {
                        // Regular enemy dropped something
                        this.spawnLoot(en.x, en.y);
                    }
                    en.destroy();
                }
            });

            this.time.delayedCall(400, () => {
                this.isAttacking = false;
                this.attackHitbox.fillAlpha = 0;
            });
        }
    }

    handleEnemies(dTSec: number, time: number) {
        this.enemies.getChildren().forEach((child) => {
            const enemy = child as Phaser.Physics.Arcade.Sprite;
            const speed = enemy.getData('speed');
            const type = enemy.getData('type');
            
            if (enemy.x > this.player.x + 20) {
                enemy.setVelocityX(-speed);
                if (type !== 'bat' && type !== 'jaguar' && type !== 'snake') enemy.setFlipX(false);
            } else if (enemy.x < this.player.x - 20) {
                enemy.setVelocityX(speed);
                if (type !== 'bat' && type !== 'jaguar' && type !== 'snake') enemy.setFlipX(true); // Flip graphic towards player
            }

            // Bat wavy flight pattern and dive attack
            if (type === 'bat') {
                const targetY = this.player.y - 80;
                let isDiving = false;
                
                // If reasonably close horizontally, dive attack
                if (Math.abs(enemy.x - this.player.x) < 80) {
                    enemy.setVelocityY(200); // Dive down aggressively
                    isDiving = true;
                } else {
                    // Fly towards hover height with natural sine wave bob
                    const floatY = Math.sin(time / 150) * 50; 
                    const heightDiff = targetY - enemy.y;
                    enemy.setVelocityY((heightDiff * 2) + floatY);
                }

                // Handle bat animations (don't override hurt anim immediately if it's playing)
                if (enemy.anims.currentAnim?.key !== 'bat_hurt' || enemy.anims.currentFrame?.isLast) {
                    if (isDiving) {
                        enemy.anims.play('bat_attack', true);
                        enemy.setFlipX(false);
                    } else {
                        if (enemy.body?.velocity.x > 0) {
                            enemy.anims.play('bat_fly_right', true);
                            enemy.setFlipX(false);
                        } else if (enemy.body?.velocity.x < 0) {
                            enemy.anims.play('bat_fly_left', true);
                            enemy.setFlipX(false);
                        }
                    }
                }
            }

            // Jaguar logic
            if (type === 'jaguar') {
                if (enemy.anims.currentAnim?.key !== 'jaguar_hurt' || enemy.anims.currentFrame?.isLast) {
                    if (Math.abs(enemy.x - this.player.x) < 80) { // close enough to attack
                        enemy.anims.play('jaguar_attack', true);
                        if (enemy.x > this.player.x) {
                            enemy.setFlipX(true);
                        } else {
                            enemy.setFlipX(false);
                        }
                    } else {
                        if (enemy.body?.velocity.x > 0) {
                            enemy.anims.play('jaguar_run_right', true);
                            enemy.setFlipX(false);
                        } else if (enemy.body?.velocity.x < 0) {
                            enemy.anims.play('jaguar_run_left', true);
                            enemy.setFlipX(false);
                        }
                    }
                }
            }

            // Snake logic
            if (type === 'snake') {
                if (enemy.anims.currentAnim?.key !== 'snake_hurt' || enemy.anims.currentFrame?.isLast) {
                    if (Math.abs(enemy.x - this.player.x) < 50) { // close enough to attack
                        enemy.anims.play('snake_attack', true);
                        if (enemy.x > this.player.x) {
                            enemy.setFlipX(true);
                        } else {
                            enemy.setFlipX(false);
                        }
                    } else {
                        if (enemy.body?.velocity.x > 0) {
                            enemy.anims.play('snake_run_right', true);
                            enemy.setFlipX(false);
                        } else if (enemy.body?.velocity.x < 0) {
                            enemy.anims.play('snake_run_left', true);
                            enemy.setFlipX(false);
                        }
                    }
                }
            }

            // Damage player
            if (this.physics.overlap(this.player, enemy)) {
                this.playerHealth -= enemy.getData('damage') * dTSec;
            }
        });
    }

    handleSurvival(dTSec: number) {
        this.playerHunger -= 0.8 * dTSec;
        this.playerThirst -= 1.2 * dTSec; // Thirst drains slightly faster

        if (this.playerHunger < 0) {
            this.playerHunger = 0;
            this.playerHealth -= 2 * dTSec; // Damage over time
        }
        if (this.playerThirst < 0) {
            this.playerThirst = 0;
            this.playerHealth -= 3 * dTSec; // Dehydration kills faster
        }
    }
}
