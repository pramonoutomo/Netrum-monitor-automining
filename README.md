# 🛠️ netrum-monitor

[![Built with Python](https://img.shields.io/badge/Built%20with-Python-blue?logo=python)](https://www.python.org/)
[![Deployed on Netrum Labs](https://img.shields.io/badge/Deployed%20on-Netrum%20Labs-blue)](https://netrum.io)
[![Status](https://img.shields.io/badge/shouldRespond-true-brightgreen)](#)
[![Mining Speed](https://img.shields.io/badge/Speed-5.3_H%2Fs-orange)](#)
[![Uptime](https://img.shields.io/badge/Uptime-99.99%25-brightgreen)](#)
[![Netrum Status](https://img.shields.io/badge/Netrum-Mining_Active-blue)](#)

A lightweight log watcher for the Netrum blockchain miner.  
It parses mining logs and sends updates to Telegram — without interrupting or slowing down your mining process.

📌 Note: Make sure to run netrum-monitor on the same server where your Netrum miner is running.
It reads logs directly from netrum-mining-log, so both must run on the same environment.

## ✨ Features

- Watches real-time logs from `netrum-mining-log`
- Parses updates: mined amount, speed, status
- Sends formatted messages to Telegram
- Automatically restarts log reading every 60 seconds
- Safe & non-intrusive to the mining process

---

## 📦 Requirements

> 💡 Requires **Node.js v18+** for native `fetch()` support  
> Use `nvm` or your package manager to install/update Node.js.

---

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/KaelVNode/netrum-monitor.git
cd netrum-monitor
npm install
```
### 2. Start a named screen session called netrum
```
screen -S netrum
```
🔐 Set up .env file
📌 Never share your .env file publicly.
It’s already ignored in .gitignore.

Create the file:
```
nano .env
```
```
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```
- You can get your TELEGRAM_BOT_TOKEN from [@BotFather](https://t.me/BotFather)

- You can retrieve your TELEGRAM_CHAT_ID using [@GetMyChatID_Bot](https://t.me/GetMyChatID_Bot)

Then save:

Press Ctrl + X

Press Y to confirm

Press Enter to finish

### 3. Run the watcher inside that screen
```
npm start
```
### 4. (Optional) Detach from the screen without stopping the process
```
Ctrl + A, then D
```

### ✉️ Example Telegram Message
<img width="166" height="143" alt="image" src="https://github.com/user-attachments/assets/8467d827-ddbe-4eb6-9d90-ff049431b8f9" />

🪵 Logs
The watcher reads log output from:
```
netrum-mining-log
```
Make sure this command is working and returns structured log lines like:
```
14:22:01 | 98% | Mined: 0.03 | Speed: 5.27 H/s | Status: ACTIVE
```
### 📄 License MIT License © 2025 [Saandy](https://github.com/KaelVNode/netrum-monitor)
Feel free to fork, modify, or integrate with your Netrum rigs.
