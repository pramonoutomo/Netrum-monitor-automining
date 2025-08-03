import fetch from 'node-fetch';

export function createTelegram(token, chatId, topicId) {
  async function send(text) {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const messageData = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML'
    };
    
    if (topicId) {
      messageData.message_thread_id = topicId;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    });
    const json = await res.json();
    if (!json.ok) console.error('Telegram Error:', json);
  }

  return { send };
}
