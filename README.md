# 🔭 Saandy Watcher

[![Built with Python](https://img.shields.io/badge/Built%20with-Python-blue?logo=python)](https://www.python.org/)
[![Deployed on Netrum Labs](https://img.shields.io/badge/Deployed%20on-Netrum%20Labs-blue)](https://netrum.io)
[![Status](https://img.shields.io/badge/shouldRespond-true-brightgreen)](#)
[![Mining Speed](https://img.shields.io/badge/Speed-5.3_H%2Fs-orange)](#)
[![Uptime](https://img.shields.io/badge/Uptime-99.99%25-brightgreen)](#)
[![Netrum Status](https://img.shields.io/badge/Netrum-Mining_Active-blue)](#)

Saandy Watcher is a lightweight CLI tool for monitoring Netrum mining logs and automatically sending alerts to Telegram.  
Built with Node.js and runs effortlessly in background using screen or systemd.

---

## ✨ Features

- ✅ Parses real-time `netrum-mining-log` output
- ✅ Sends alerts to Telegram with mining status
- ✅ Automatically restarts every 30 seconds
- ✅ Simple `.env` configuration for Telegram integration
- ✅ Lightweight and server-friendly — run via screen or tmux

---

## 📦 Requirements

> 💡 Requires **Node.js v18+** for native `fetch()` support  
> Use `nvm` or your package manager to install/update Node.js.

---

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-user/saandy-watcher.git
cd saandy-watcher
npm install

```
### 2. Start a named screen session called netrum
```
screen -S netrum
```
### 3. Run the watcher inside that screen
```
npm start
```
### 4. (Optional) Detach from the screen without stopping the process
```
Ctrl + A, then D
```
## 🔐 Edit .env file
### 📌 Do not share this file publicly. Add it to .gitignore.
### Edit called .env in the root directory
```
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
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
# 📄 License MIT License © 2025 [Saandy](https://github.com/KaelVNode/netrum-monitor)
Feel free to fork, modify, or integrate with your Netrum rigs.
