#!/usr/bin/env node
import './banner.js';

import { getConfig } from './config.js';
import { ask, closeInput } from './utils.js';
import { getBalances } from './balances.js';
import { createTelegram } from './telegram.js';
import { createClaimer } from './claimer.js';
import { runMiningLogMonitor } from './miner.js';

const args = Object.fromEntries(
  process.argv.slice(2).map(arg => {
    const [k, v] = arg.replace(/^--/, '').split('=');
    return [k, v];
  })
);

const mode = args.mode || 'manual';

async function main() {
  const config = await getConfig(args, mode);
  if (mode === 'manual') closeInput();

  const stats = { mined: 0, claims: 0 };

  const telegram = createTelegram(config.TELEGRAM_BOT_TOKEN, config.TELEGRAM_CHAT_ID);

  async function sendDailyReport() {
    const { ethBalance, nptBalance } = await getBalances(config.WALLET_ADDRESS);
    const now = new Date().toLocaleString();
    await telegram.send(`
<b>Daily Mining Report</b>
Time: ${now}
Mined: ${stats.mined.toFixed(6)} NPT
Claims: ${stats.claims}
Wallet: ${config.WALLET_ADDRESS}
ETH: ${ethBalance.toFixed(6)}
NPT: ${nptBalance.toFixed(6)}
    `.trim());
    stats.mined = 0;
    stats.claims = 0;
  }

  await sendDailyReport();

  const { runAutoClaim } = createClaimer({
    telegramSend: telegram.send,
    wallet: config.WALLET_ADDRESS,
    stats,
    getBalances,
    sendDailyReport
  });

  runMiningLogMonitor({
    telegramSend: telegram.send,
    timeout: config.TIMEOUT_MS,
    stats,
    runAutoClaim
  });
}

main();
