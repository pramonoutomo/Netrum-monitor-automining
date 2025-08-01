import fetch from 'node-fetch';

export function createTelegram(token, chatId) {
  async function send(text) {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
    const json = await res.json();
    if (!json.ok) console.error('Telegram Error:', json);
  }

  return { send };
}
