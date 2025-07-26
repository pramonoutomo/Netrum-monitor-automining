# ⛏️ Saandy Watcher

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
### 2. Install dependencies
```bash
npm install
```
### 3. Create .env file
```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```
💡 You can get your TELEGRAM_BOT_TOKEN from @BotFather
-   And retrieve your chat ID by sending a message to your bot and accessing  https://api.telegram.org/bot<your_bot_token>/getUpdates

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





