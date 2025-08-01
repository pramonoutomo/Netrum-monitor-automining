import { spawn } from 'child_process';

export function runMiningLogMonitor({ telegramSend, timeout, stats, runAutoClaim }) {
  function start() {
    const logProcess = spawn('netrum-mining-log');
    console.log('Started mining monitor...');

    logProcess.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        if (line.includes('Mined') || line.includes('Speed')) {
          const parts = line.split('|').map(p => p.trim());
          const mined = parseFloat(parts[2]?.replace('Mined:', '') || 0);
          if (!isNaN(mined)) stats.mined = mined;

          const message = `
<b>Mining Update</b>
Time: ${parts[0]}
Progress: ${parts[1]}
Mined: ${mined}
Speed: ${parts[3]}
Status: ${parts[4]}`.trim();

          telegramSend(message);

          if (parts[4]?.includes('Claim Pending') || parts[1]?.includes('100.00%')) {
            runAutoClaim();
          }
        }
      }
    });

    setTimeout(() => {
      console.log(`Restarting mining log after ${timeout / 1000}s...`);
      logProcess.kill();
      start();
    }, timeout);
  }

  start();
}
