# ⛏️ Saandy Watcher

[![Built with Python](https://img.shields.io/badge/Built%20with-Python-blue?logo=python)](https://www.python.org/)
[![Deployed on Netrum Labs](https://img.shields.io/badge/Deployed%20on-Netrum%20Labs-blue)](https://netrum.io)
[![Status](https://img.shields.io/badge/shouldRespond-true-brightgreen)](#)
[![Mining Speed](https://img.shields.io/badge/Speed-5.3_H%2Fs-orange)](#)
[![Uptime](https://img.shields.io/badge/Uptime-99.99%25-brightgreen)](#)
[![Netrum Status](https://img.shields.io/badge/Netrum-Mining_Active-blue)](#)



**Saandy Watcher** is a lightweight Node.js script that monitors output from `netrum-mining-log`, automatically restarts the log reader every 30 seconds, and sends mining updates to your Telegram bot.

It does **not interfere with your actual mining process** — it only reads and reports logs.

---

## 🚀 Features

- 🔁 Auto-restarts `netrum-mining-log` every 30 seconds
- 📤 Sends mining updates (time, mined, speed, status) to Telegram
- ✅ Safe — doesn't touch or stop `netrum-mining`
- 🌐 Automatically uses global `fetch` (Node 18+) or falls back to `node-fetch`
- 🔐 Uses `.env` for secure configuration

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/saandy-watcher.git
cd saandy-watcher
```
🖥️ Running with screen (Recommended for servers)
To keep your watcher running in the background (even after you close SSH), use screen.
### 1. Start a new named screen session called "netrum"
```
screen -S netrum
```
### 2. Run the watcher inside that screen session
```bash
npm start
```
### 3. (Optional) Detach from the screen without stopping the process
Ctrl + A, then D
### 🔄 To reattach to the session later
```
screen -r netrum
```
### 4. Edit .env file
```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```
-   You can get your TELEGRAM_BOT_TOKEN from @BotFather
-  And retrieve your chat ID @GetMyChatID_Bot


▶️ Usage
### To start the watcher
```bash
npm start
```
### 🖼 Example Telegram Message
<img width="434" height="144" alt="image" src="https://github.com/user-attachments/assets/ab058e5e-a618-4bea-8cda-a0698275c82d" />

📄 License
MIT License © 2025 [Saandy](https://github.com/KaelVNode)
---

Let me know if you’d like:
- A Markdown badge header (for GitHub flair)
- CI integration suggestions
- A project logo

I can help polish it even more!





