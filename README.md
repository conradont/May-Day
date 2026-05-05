# MayDay Jungle Survival 🚁🌴

**MayDay Jungle Survival** é um jogo 2D de plataforma de sobrevivência com temática de selva, focado no gerenciamento de recursos sob tensão extrema e progressão por ondas de inimigos locais. Desenvolvido com uma estética de Pixel Art retrô em conjunto com efeitos visuais modernos, o jogo traz uma atmosfera densa, escura e cinemática de isolamento de um soldado que sobreviveu à queda de seu helicóptero.

---

## ⚙️ Mecânicas Principais (Core Mechanics)

### 1. Sistema de Sobrevivência Vitalício (Trindade de Status)
Enquanto a maioria dos jogos de plataforma lida apenas com Vida, *MayDay* implementa um relógio de sobrevivência brutal baseado em três barras simultâneas (vistas na HUD):
- ❤️ **Health (Vida):** Sua resistência de combate. Se chegar a zero, Game Over.
- 🍗 **Hunger (Fome):** Drena passivamente a cada segundo. Se a barra secar, você entrará em inanição e a sua vida passará a drenar exponencialmente.
- 💧 **Thirst (Sede):** Assim como a fome, porém drena ainda mais rápido devido ao desgaste térmico da floresta.

### 2. Combate Corpo-a-Corpo (Hack 'n' Slash)
Você não possui armas de fogo de munição infinita; a sobrevivência depende do seu **Facão** para combate próximo.
- **Hitboxes Dinâmicos:** Ao invés de colisões simples nos corpos, o ataque instaura uma janela de acerto de proximidade (hitbox de cone/quadrado frontal). 
- Inimigos atacam baseados num sistema de inteligência de perseguição linear ou em curvas (no caso de criaturas voadoras) usando sistema moderno de física direcional (*Arcade Physics*).

### 3. Sistema de "Loot" e Punição (Risco x Recompensa)
A única maneira de atrasar a Morte por Fome ou Sede é derrotando a fauna feroz local. Inimigos mortos têm chance de fazer **drop físico** de itens sobrevivenciais (carne, cantis d'água) que quicam no terreno e devem ser coletados fisicamente (Overlap Physics).

### 4. Progressão por Zonas e Ondas (Wave Spawner)
A selva não dá descanso. O jogo é gerido por um **State Machine e Event Loops**:
- **Ondas Crescentes:** Você inicia na Onda 1. O volume de inimigos escalona a cada invasão que você sobrevive e elimina.
- **O Gerente e o Chefe:** O *spawn* escolhe randomicamente arquétipos locais (Cobras, Jaguares/Onças brutamontes, Morcegos erráticos). Após sobreviver por 3 ondas pesadas, a engine "trava" o spawn trivial e conjura o **Boss Alpha** da área. Derrotá-lo passa de "Zone 1" para a próxima.

---

## 🎨 Direção de Arte e Estilo Visuais

- **High-Fidelity Pixel Art:** Em vez de blocos minimalistas, utiliza paletas mais sujas (marrons terrosos, verde escuro, azuis noturnos), focando em sujeira, ferrugem e textura biológica abundante (vinhas, musgo).
- **Parallax Background Cinematográfico:** O mundo ao fundo não é uma tela estática horizontal. Foi cortado e dividido em camadas independentes (*Camera Scroll Factor*):
    - Camada 0 (*Layer_0*): O Fundo do céu neblinoso estático e dramático (Dusk/Pôr do Sol).
    - Camada 1 (*Layer_1*): Árvores Parallax gigantescas do fundo movendo suavemente.
    - Midground (*Layer_2*): Os destroços orgânicos monumentais como o próprio helicóptero de fuga destruído em chamas no meio do mapa interagindo visualmente em peso com os cenários limpos.
- **Tilemaps Físicos Integrados (Colisão Exata):** Toda a arquitetura do chão foi modularizada em *Tilesets* perfeitamente alinhados, em vez de criar retângulos invisíveis "amadores", fornecendo polimento profissional no caminhar e interceptar dos monstros.

---

## 💻 Arquitetura de T.I e Stack

O jogo é inteiramente gerado proceduralmente por código estrito, com separação exata entre classes, sem depender de "Arrastar e Soltar":
*   **Engine:** **Phaser 3** (O maior framework WebGL/HTML5 focado em games 2D rápidos do mercado).
*   **Linguagem:** **TypeScript** (Orientação a objetos estrita, permitindo tipagem de entidades como "Phaser.Physics.Arcade.Sprite", prevenindo furos no sistema lógico).
*   **Contêiner Desktop:** **Electron** (Ao rodar, ele aciona o transpilador TypeScript local simultâneo com o Wrapper desktop local, rodando livre de limitações pesadas dos navegadores).

### 🎮 Controles
*   **A e D** ou **Setas** 👉 Andar Esquerda/Direita.
*   **W / Espaço / Seta pra Cima** 👉 Pular (Jump).
*   **Tecla X** 👉 Atacar (Golpe de Facão).

---

## 🚀 Como Executar

Se possui o repositório original clonado e suas ferramentas configuradas (Node.js e NPM instalados):
1. Primeiramente, baixe os módulos e instale o TypeScript globalmente via npm:
```bash
npm install
```
2. Após o setup completo, simplesmente acione o comando `start` que chamará sua injeção TS e varrerá para a inicialização no Desktop App Electron:
```bash
npm start
```
