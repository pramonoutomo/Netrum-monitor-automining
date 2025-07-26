#!/usr/bin/env node
import { spawn } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

let fetchFn;
if (typeof fetch === 'undefined') {
  fetchFn = (await import('node-fetch')).default;
} else {
  fetchFn = fetch;
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error('❌ TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in .env');
  process.exit(1);
}

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

  return fetchFn(url, {
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
        notifyTelegram(line);
      }
    }
  });

  logProcess.stderr.on('data', (data) => {
    console.error('[ERR]', data.toString());
  });

  logProcess.on('close', (code) => {
    console.log(`ℹ️ Mining log exited with code ${code}`);
  });

  setTimeout(() => {
    console.log('🔁 Restarting mining log process...');
    logProcess.kill();
    runLogProcess();
  }, 30_000);
}

runLogProcess();
