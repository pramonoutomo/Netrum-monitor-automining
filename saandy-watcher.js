#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import { spawn } from 'child_process';
import fetch from 'node-fetch';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

const args = process.argv.slice(2);
let cliArgs = {};
for (const arg of args) {
  const [key, value] = arg.replace(/^--/, '').split('=');
  cliArgs[key] = value;
}

async function main() {
  let TELEGRAM_BOT_TOKEN = cliArgs.token || process.env.TELEGRAM_BOT_TOKEN;
  let TELEGRAM_CHAT_ID = cliArgs.chat || process.env.TELEGRAM_CHAT_ID;
  let WALLET_ADDRESS = cliArgs.wallet || process.env.WALLET_ADDRESS;

  if (!TELEGRAM_BOT_TOKEN) TELEGRAM_BOT_TOKEN = await ask('Enter TELEGRAM_BOT_TOKEN: ');
  if (!TELEGRAM_CHAT_ID) TELEGRAM_CHAT_ID = await ask('Enter TELEGRAM_CHAT_ID: ');
  if (!WALLET_ADDRESS) WALLET_ADDRESS = await ask('Enter WALLET_ADDRESS: ');

  let timeoutMinutes = cliArgs.timeout || process.env.TIMEOUT_MINUTES || await ask('Enter log restart timeout in minutes (default: 5): ');
  const TIMEOUT_MS = parseInt(timeoutMinutes) * 60000 || 300000;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || !WALLET_ADDRESS) {
    console.error('All values are required!');
    process.exit(1);
  }

  rl.close();

  let logStarted = false;
  let dailyStats = { mined: 0, claims: 0 };
  let claimInProgress = false;
  let lastSentLog = '';
  let lastSentAt = 0;

  async function getBalances() {
    const rpc = 'https://base-rpc.publicnode.com';
    const NPT_CONTRACT = '0xB8c2CE84F831175136cebBFD48CE4BAb9c7a6424';

    const [ethRes, nptRes] = await Promise.all([
      fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 1, method: 'eth_getBalance',
          params: [WALLET_ADDRESS, 'latest']
        })
      }),
      fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 2, method: 'eth_call',
          params: [{
            to: NPT_CONTRACT,
            data: '0x70a08231000000000000000000000000' + WALLET_ADDRESS.replace(/^0x/, '')
          }, 'latest']
        })
      })
    ]);

    const ethBalance = parseInt((await ethRes.json()).result, 16) / 1e18;
    const nptBalance = parseInt((await nptRes.json()).result, 16) / 1e18;
    return { ethBalance, nptBalance };
  }

  async function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML'
      })
    })
    .then(res => res.json())
    .then(json => {
      if (!json.ok) console.error('Telegram Error:', json);
    });
  }

  async function sendDailyReport() {
    const { ethBalance, nptBalance } = await getBalances();
    const now = new Date().toLocaleString();
    await sendToTelegram(`
<b>Daily Mining Report</b>
Time: ${now}
Mined: ${dailyStats.mined.toFixed(6)} NPT
Claims: ${dailyStats.claims}
Wallet: ${WALLET_ADDRESS}
ETH Balance: ${ethBalance.toFixed(6)}
NPT Balance: ${nptBalance.toFixed(6)}
    `.trim());
    dailyStats = { mined: 0, claims: 0 };
  }

  await sendDailyReport();

  async function runAutoClaim() {
    if (claimInProgress) return;
    claimInProgress = true;

    await sendToTelegram('Starting automatic NPT claim...');

    const claimProcess = spawn('node', ['/root/netrum-lite-node/cli/claim-cli.js']);
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
      const match = output.match(/https:\/\/basescan\.org\/tx\/\S+/);
      const txLink = match ? match[0] : null;
      if (code === 0) {
        dailyStats.claims += 1;
        sendToTelegram(`
<b>Claim Result</b>
Status: Success
Transaction: <a href="${txLink || '#'}">${txLink || 'Link not found'}</a>`);
        if (logStarted) sendDailyReport();
      } else {
        sendToTelegram(`<b>Claim Result</b>\nStatus: Failed\nExit Code: ${code}`);
      }
      claimInProgress = false;
    });
  }

  function runLogProcess() {
    console.log('Starting mining log monitoring...');
    const logProcess = spawn('netrum-mining-log');
    if (!logStarted) logStarted = true;

    logProcess.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        console.log('[LOG]', line);

        if (line.includes('Mining session completed')) {
          logProcess.kill();
          return runLogProcess();
        }

        if (line.includes('Mined') || line.includes('Speed')) {
          const parts = line.split('|').map(p => p.trim());
          const mined = parseFloat(parts[2]?.replace('Mined:', '') || 0);
          const speed = parts[3]?.replace('Speed:', '').trim();
          const status = parts[4]?.replace('Status:', '').trim();
          const progress = parts[1] || '-';

          if (!isNaN(mined)) dailyStats.mined = mined;

          const message = `
<b>Mining Update</b>
Time: ${parts[0] || '-'}
Progress: ${progress}
Mined: ${mined}
Speed: ${speed}
Status: ${status}`.trim();

          const now = Date.now();
          if (message !== lastSentLog || (now - lastSentAt > 10000)) {
            lastSentLog = message;
            lastSentAt = now;
            sendToTelegram(message);
          }

          if (
            status === 'Claim Pending' ||
            (progress && progress.includes('100.00%'))
          ) {
            runAutoClaim();
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
      console.log(`Restarting mining log process after ${TIMEOUT_MS / 1000}s...`);
      logProcess.kill();
      runLogProcess();
    }, TIMEOUT_MS);
  }

  runLogProcess();
}

main();
