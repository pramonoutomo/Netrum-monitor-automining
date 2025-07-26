#!/usr/bin/env node
import { spawn } from 'child_process';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

// Load from .env
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('❌ Missing Telegram credentials in .env');
  process.exit(1);
}

let lastState = {
  mined: null,
  speed: null,
  status: null,
};

// Kirim pesan ke Telegram
function notifyTelegram(logLine) {
  const parts = logLine.split('|').map(p => p.trim());

  const message = `
Mining Update:
Time: ${parts[0] || '-'}
Progress: ${parts[1] || '-'}
Mined: ${parts[2]?.replace('Mined:', '').trim() || '-'}
Speed: ${parts[3]?.replace('Speed:', '').trim() || '-'}
Status: ${parts[4]?.replace('Status:', '').trim() || '-'}
`.trim();

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    }),
  })
    .then(res => res.json())
    .then(json => {
      if (!json.ok) throw new Error(json.description);
      console.log('📤 Sent to Telegram');
    })
    .catch(err => console.error('Telegram Error:', err.message));
}

function runLogProcess() {
  console.log('🚀 Starting mining log process');

  const logProcess = spawn('netrum-mining-log');

  logProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(Boolean);
    for (const line of lines) {
      console.log('[LOG]', line);

      if (line.includes('Mined') || line.includes('Speed')) {
        const parts = line.split('|').map(p => p.trim());

        const mined = parts[2]?.replace('Mined:', '').trim();
        const speed = parts[3]?.replace('Speed:', '').trim();
        const status = parts[4]?.replace('Status:', '').trim();

        if (
          mined !== lastState.mined ||
          speed !== lastState.speed ||
          status !== lastState.status
        ) {
          lastState = { mined, speed, status };
          notifyTelegram(line);
        } else {
          console.log('⏸ No change, skipping Telegram message.');
        }
      }
    }
  });

  logProcess.stderr.on('data', (data) => {
    console.error('[ERR]', data.toString());
  });

  logProcess.on('close', (code) => {
    console.log(`ℹ️ Mining log exited with code ${code}`);
  });

  // Restart setiap 60 detik
  setTimeout(() => {
    console.log('🔁 Restarting mining log process...');
    logProcess.kill();
    runLogProcess();
  }, 60_000);
}

runLogProcess();
