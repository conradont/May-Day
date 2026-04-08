export enum GameState {
    LOADING = 0,
    MENU = 1,
    SETTINGS = 2,
    PLAYING = 3,
    GAMEOVER = 4
}

export class GameManager {
    static state: GameState = GameState.LOADING;
    static difficultyMultiplier: number = 1.0;
    
    // Callbacks to interact with the renderer loop safely
    static onStartGame: () => void;
    static onStopGame: () => void;
    static onResetGame: () => void;
    
    static changeState(newState: GameState) {
        this.state = newState;
        this.updateDOM();
        
        switch (newState) {
            case GameState.PLAYING:
                if (this.onResetGame) this.onResetGame();
                if (this.onStartGame) this.onStartGame();
                break;
            case GameState.GAMEOVER:
            case GameState.MENU:
            case GameState.SETTINGS:
                if (this.onStopGame) this.onStopGame();
                break;
        }
    }

    static updateDOM() {
        const loadingUI = document.getElementById('ui-loading');
        const menuUI = document.getElementById('ui-menu');
        const settingsUI = document.getElementById('ui-settings');
        const gameOverUI = document.getElementById('ui-gameover');
        const hudUI = document.getElementById('ui-hud');
        
        if(loadingUI) loadingUI.style.display = this.state === GameState.LOADING ? 'flex' : 'none';
        if(menuUI) menuUI.style.display = this.state === GameState.MENU ? 'flex' : 'none';
        if(settingsUI) settingsUI.style.display = this.state === GameState.SETTINGS ? 'flex' : 'none';
        if(gameOverUI) gameOverUI.style.display = this.state === GameState.GAMEOVER ? 'flex' : 'none';
        
        // Show HUD only during gameplay
        if(hudUI) hudUI.style.display = this.state === GameState.PLAYING ? 'block' : 'none';
    }
}
