#!/usr/bin/env node
import { spawn } from 'child_process';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import readline from 'readline';
import fs from 'fs';
import path from 'path';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

// Parse CLI args: --token=xxx --chat=yyy
const args = process.argv.slice(2);
let cliArgs = {};
for (const arg of args) {
  const [key, value] = arg.replace(/^--/, '').split('=');
  cliArgs[key] = value;
}

async function main() {
  let TELEGRAM_BOT_TOKEN = cliArgs.token || process.env.TELEGRAM_BOT_TOKEN;
  let TELEGRAM_CHAT_ID = cliArgs.chat || process.env.TELEGRAM_CHAT_ID;

  // Prompt if values are missing
  if (!TELEGRAM_BOT_TOKEN) {
    TELEGRAM_BOT_TOKEN = await ask('Enter TELEGRAM_BOT_TOKEN: ');
  }

  if (!TELEGRAM_CHAT_ID) {
    TELEGRAM_CHAT_ID = await ask('Enter TELEGRAM_CHAT_ID: ');
  }

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Token and Chat ID are required!');
    process.exit(1);
  }

  rl.close();

  // Create .env file if it doesn't exist
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    const envContent =
`TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID}
`;
    fs.writeFileSync(envPath, envContent);
    console.log('.env file created successfully.');
  } else {
    console.log('.env file found. Skipping creation.');
  }

  let lastState = {
    mined: null,
    speed: null,
    status: null,
  };

  function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    })
      .then(res => res.json())
      .then(json => {
        if (!json.ok) console.error('Telegram Error:', json);
      });
  }

  function runAutoClaim() {
    sendToTelegram('Starting automatic NPT claim...');

    const claimProcess = spawn('node', ['/root/netrum-monitor/claim-cli.js']);

    let output = '';
    claimProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      if (text.includes('(y/n)')) {
        claimProcess.stdin.write('y\n');
      }
    });

    claimProcess.stderr.on('data', (data) => {
      console.error('[CLAIM ERROR]', data.toString());
    });

    claimProcess.on('close', (code) => {
      const match = output.match(/https:\/\/basescan\.org\/tx\/[^\s]+/);
      const txLink = match ? match[0] : null;
      if (code === 0) {
        sendToTelegram(`
<b>Claim Result</b>
Status: Success
Transaction: <a href="${txLink || '#'}">${txLink || 'Link not found'}</a>`.trim());
      } else {
        sendToTelegram(`<b>Claim Result</b>\nStatus: Failed\nExit Code: ${code}`);
      }
    });
  }

  function runLogProcess() {
    console.log('Starting mining log monitoring...');
    const logProcess = spawn('netrum-mining-log');

    logProcess.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        console.log('[LOG]', line);

        if (line.includes('Mining session completed')) {
          console.log('Detected mining session complete. Restarting...');
          logProcess.kill();
          return runLogProcess();
        }

        if (line.includes('Mined') || line.includes('Speed')) {
          const parts = line.split('|').map(p => p.trim());

          const mined = parts[2]?.replace('Mined:', '').trim();
          const speed = parts[3]?.replace('Speed:', '').trim();
          const status = parts[4]?.replace('Status:', '').trim();
          const progress = parts[1] || '-';

          if (mined !== lastState.mined || speed !== lastState.speed || status !== lastState.status) {
            lastState = { mined, speed, status };

            sendToTelegram(`
<b>Mining Update</b>
Time: ${parts[0] || '-'}
Progress: ${progress}
Mined: ${mined}
Speed: ${speed}
Status: ${status}
            `.trim());

            if (progress.includes('100.00%') && status.includes('INACTIVE')) {
              runAutoClaim();
            }
          } else {
            console.log('No change in mining state. Skipping Telegram update.');
          }
        }
      }
    });

    logProcess.stderr.on('data', (data) => {
      console.error('[ERROR]', data.toString());
    });

    logProcess.on('close', (code) => {
      console.log(`Mining log process exited with code ${code}`);
    });

    setTimeout(() => {
      console.log('Restarting mining log process after timeout...');
      logProcess.kill();
      runLogProcess();
    }, 300000); // 5 minutes
  }

  // Start monitoring
  runLogProcess();
}

// Start main script
main();
