const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * Send a message via Telegram Bot API.
 * Falls back to console.log if token/chatId are not configured.
 */
async function sendMessage(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('[Telegram fallback]', text);
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('[Telegram] Error sending message:', response.status, body);
    }
  } catch (err) {
    console.error('[Telegram] Network error:', err.message);
  }
}

/**
 * Notify about a new order.
 */
async function notifyNewOrder(order) {
  const text =
    `\u{1F6D2} <b>Новый заказ #${order.order_number}</b>\n` +
    `\n` +
    `Тип: ${order.type}\n` +
    `Продукт: ${order.product_title || '—'}\n` +
    `Формат: ${order.format || '—'}\n` +
    `Сумма: ${order.total || 0} \u20BD\n` +
    `\n` +
    `\u{1F464} ${order.customer_name}\n` +
    `\u{1F4F1} ${order.customer_phone || '—'}\n` +
    `\u{1F4E7} ${order.customer_email}\n` +
    `\n` +
    `\u{1F476} Ребёнок: ${order.child_name || '—'} (${order.child_gender || '—'})`;

  await sendMessage(text);
}

/**
 * Notify about a new contact message.
 */
async function notifyNewContact(contact) {
  const text =
    `\u{1F4AC} <b>Новое сообщение с сайта</b>\n` +
    `\n` +
    `\u{1F464} ${contact.name}\n` +
    `\u{1F4E7} ${contact.email}\n` +
    (contact.subject ? `Тема: ${contact.subject}\n` : '') +
    `\n` +
    `${contact.message}`;

  await sendMessage(text);
}

/**
 * Notify about a purchased generated story.
 */
async function notifyNewStory(story) {
  const text =
    `\u{1F4D6} <b>Покупка сгенерированной сказки</b>\n` +
    `\n` +
    `Название: ${story.story_title || '—'}\n` +
    `\u{1F476} Ребёнок: ${story.child_name} (${story.child_gender || '—'}), ${story.child_age} лет\n` +
    `Проблема: ${story.problem}\n` +
    (story.favorite_character ? `Любимый персонаж: ${story.favorite_character}\n` : '') +
    (story.friend_name ? `Имя друга: ${story.friend_name}\n` : '');

  await sendMessage(text);
}

module.exports = { sendMessage, notifyNewOrder, notifyNewContact, notifyNewStory };
