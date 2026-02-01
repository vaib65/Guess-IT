# 🎬 Guess-IT — Real-Time Multiplayer Movie Guessing Game

Guess-IT is a real-time movie guessing game built with **React, Node.js, and Socket.IO**, featuring both **single-player (stateless)** and **multiplayer (stateful)** modes.

The multiplayer experience is implemented using a **server-authoritative architecture**, ensuring consistent game state, fair scoring, and reliable reconnection handling across all players.


## 🚀 Features

### 🎯 Single Player Mode (Stateless)
- Guess movie frames in a solo, client-driven experience.
- Game state resets on refresh.
- Designed for quick and casual gameplay.

---

### 🤝 Multiplayer Mode (Stateful & Real-Time)
- Create or join rooms using a **unique room code**.
- Requires a **minimum of 2 players** to start a game.
- **Host-controlled game start** with a synchronized countdown.
- Round-based gameplay:
  - Each round displays a movie frame with a **60-second timer**.
  - Correct guesses earn **1 point**.
  - Rounds end early if all connected players guess correctly.
- **Live player list** with scores and connection status.
- **Real-time chat** for guesses and system messages.
- **Graceful disconnect & reconnect handling**:
  - Players can refresh or temporarily disconnect without breaking the game.
  - Server re-attaches players using persistent user identity.
- **Automatic room cleanup** when all players leave.

---
## 🧠 Architecture & Design Decisions

- **Server-Authoritative Architecture**
  - All game logic (timers, guesses, scoring, round transitions) is handled on the backend.
  - Clients act purely as renderers of server state.
- **In-Memory Game Engine**
  - Rooms, players, rounds, and timers are stored in memory for low-latency gameplay.
  - No database round-trips during active matches.
- **State Synchronization**
  - New joins and reconnects receive a full game state snapshot.
  - Incremental updates are broadcast using Socket.IO events.
- **Race Condition Prevention**
  - Guess validation and round progression are centralized on the server.
  - Prevents duplicate scoring and desynchronized rounds.

---
## 🛠 Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO
- In-memory state management

---

## 📦 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn


## Run Locally

Clone the project

```bash
```bash
git clone https://github.com/vaib65/Guess-IT.git

```
Go to the project directory

```bash
  cd Guess-IT
```

Install dependencies

Backend
```bash
  cd Server
  npm install
  npm run dev
```
Frontend
```bash
  cd Client
  npm install
  npm run dev
```




## Deployment

- Deployed on Render for demo purposes.

- Optimized for low-latency real-time gameplay.

- Designed for small rooms (2–5 players), not large-scale concurrency.

## Demo

Insert gif or link to demo


