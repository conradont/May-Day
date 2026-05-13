# **README.md — MayDay Jungle Survival**

## **MayDay Jungle Survival**

**MayDay Jungle Survival** é um jogo 2D de plataforma de sobrevivência ambientado em uma selva extremamente hostil, focado em gerenciamento de recursos vitais (Vida, Fome e Sede), combate corpo-a-corpo com facão e progressão por ondas crescentes de inimigos. O visual combina Pixel Art sombria e detalhada com efeitos modernos e parallax cinematográfico.

---

## 👥 **Integrantes do Grupo**

* Luiz Conrado da Silva Neto
* Kauan Negreiros Lima
* Carlos Murilo Nogueira Portela
* Marcus David Nascimento de Sá
* Igor Vinicius Leite de Carvalho
* Pedro de Carvalho Lima
* Antonio Santana Castelo Branco Bisneto

---

## 📄 **Documento de Game Design (GDD)**

Link oficial do GDD do projeto:
[GDD no Notion](https://www.notion.so/Modelo-Game-Design-Document-GDD-ea22f3e9b0d682e6954b013816a9face?utm_source=chatgpt.com)

---

## ⚙️ **Mecânicas Principais (Core Mechanics)**

### **1. Sistema de Sobrevivência Vitalício (Trindade de Status)**

O jogo exige o gerenciamento de três barras simultâneas:

* **Health (Vida):** Ao chegar a zero → Game Over.
* **Hunger (Fome):** Drena com o tempo; zerada, começa a reduzir sua Vida.
* **Thirst (Sede):** Drena rapidamente; ao esgotar, coloca o jogador em estado crítico contínuo.

### **2. Combate Corpo-a-Corpo (Hack 'n' Slash)**

* Arma principal: **Facão**.
* Hitboxes dinâmicos e frontais.
* Inimigos possuem comportamento de perseguição baseado em física direcional.

### **3. Sistema de Loot e Punição (Risco x Recompensa)**

* Inimigos derrotados podem dropar carne, água e itens de sobrevivência.
* Os itens caem fisicamente no cenário e devem ser coletados manualmente.

### **4. Progressão por Zonas e Ondas**

* Inimigos surgem em **ondas progressivamente mais difíceis**.
* Após 3 ondas intensas, aparece o **Boss Alpha**.
* Derrotar o chefe libera o avanço para a próxima zona da selva.

---

## 🎨 **Direção de Arte e Estilo Visual**

* **Pixel Art detalhada** com paleta escura e textura suja.
* **Parallax cinematográfico** usando múltiplas camadas independentes.
* **Tilemaps físicos profissionais**, garantindo colisão precisa e natural.

---

## 💻 **Arquitetura e Stack Tecnológico**

* **Engine:** Phaser 3
* **Linguagem:** TypeScript
* **Contêiner Desktop:** Electron
* Projeto modular, sem uso de sistemas de drag-and-drop, priorizando código limpo e organizado.

---

## 🎮 **Controles**

* **A / D** → Movimentação
* **W / Espaço / Seta ↑** → Pular
* **X** → Ataque com facão

---

## 🚀 **Como Executar**

1. Instale as dependências:

```bash
npm install
```

2. Inicie o jogo:

```bash
npm start
```

---
