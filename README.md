# 🛠️ netrum-monitor

[![Built with Node.js](https://img.shields.io/badge/Built%20with-Node.js-green?logo=node.js)](https://nodejs.org/)
[![Deployed on Netrum Labs](https://img.shields.io/badge/Deployed%20on-Netrum%20Labs-blue)](https://netrum.io)
[![Mining Speed](https://img.shields.io/badge/Speed-5.3_H%2Fs-orange)](#)
[![Uptime](https://img.shields.io/badge/Uptime-99.99%25-brightgreen)](#)
[![Netrum Status](https://img.shields.io/badge/Netrum-Mining_Active-blue)](#)
[![Node Version](https://img.shields.io/badge/node-%3E=18.0.0-green)](https://nodejs.org/)
[![Auto Start](https://img.shields.io/badge/Auto--Start-Systemd-blue)](#)
[![Last Update](https://img.shields.io/github/last-commit/KaelVNode/netrum-monitor)](https://github.com/KaelVNode/netrum-monitor/commits/main)
[![License](https://img.shields.io/github/license/KaelVNode/netrum-monitor)](LICENSE)

A lightweight log watcher for the Netrum blockchain miner.  
It parses mining logs and sends real-time updates to Telegram — without interrupting your mining process.

---

## 📌 Prerequisites

Before running the script, make sure you have:

### ✅ Telegram Bot Token

- Create a bot using [@BotFather](https://t.me/BotFather)
- Save the token you receive (e.g., `123456789:ABCDEF...`)

### ✅ Telegram Chat ID

- Send a message to your bot  
- Get your chat ID via [@userinfobot](https://t.me/userinfobot)  
  or check using Bot API:  
  `https://api.telegram.org/bot<your_token>/getUpdates`

> Group Chat IDs usually start with a minus sign (`-123456789`)

---

## ✨ Features

- Realtime log parsing from `netrum-mining-log`
- Telegram updates: time, mined amount, speed, and status
- Auto-claim when mining reaches 100%
- Auto-restarts log reading every 5 minutes
- Lightweight and safe (doesn’t interfere with mining)

---

## 📦 Requirements

> 💡 Requires **Node.js v18+** (for native `fetch()` support)  
> Use `nvm` or your package manager to install or upgrade Node.js.

---

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/KaelVNode/netrum-monitor.git
cd netrum-monitor
npm install
```

### 2. Run inside a screen session

You must run this inside a named screen session to keep it alive:

```bash
screen -S netrum
npm start
```

On first run, the script will prompt for:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

It will save them into a `.env` file automatically.

### 3. Detach the screen (optional)

To leave the process running in background:

```bash
Ctrl + A, then D
```

To return later:

```bash
screen -r netrum
```

---

### ✉️ Example Telegram Message

<img width="166" height="143" alt="Mining update" src="https://github.com/user-attachments/assets/8467d827-ddbe-4eb6-9d90-ff049431b8f9" />

---

### 🪵 Log Source

The watcher listens to output from:

```bash
netrum-mining-log
```

Make sure this command runs and outputs like:

```text
14:22:01 | 98% | Mined: 0.03 | Speed: 5.27 H/s | Status: ACTIVE
```

---

### 📄 License

MIT License © 2025 [Saandy](https://github.com/KaelVNode/netrum-monitor)  
Feel free to fork, improve, or integrate with your own mining automation.
