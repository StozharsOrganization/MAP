/**
 * Telegram Bot Notification Service for MAP Web Platform
 * Safely notifies team in Telegram upon new volunteer application or contact submission.
 */

export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    // Graceful fallback: Telegram is not configured, skip sending
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    return res.ok;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
}

export async function notifyNewVolunteer(data: {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  direction?: string;
  skills?: string;
}): Promise<void> {
  const message = [
    `🌟 <b>Нова анкета волонтера MAP!</b>`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👤 <b>Ім'я:</b> ${data.name}`,
    `📧 <b>Email:</b> ${data.email}`,
    data.phone ? `📱 <b>Тел / Telegram:</b> ${data.phone}` : null,
    data.city ? `📍 <b>Місто:</b> ${data.city}` : null,
    data.direction ? `🎯 <b>Напрям:</b> ${data.direction}` : null,
    data.skills ? `💡 <b>Навички / Інтереси:</b>\n<i>${data.skills}</i>` : null,
    `━━━━━━━━━━━━━━━━━━━━`,
    `⏰ <i>${new Date().toLocaleString('uk-UA')}</i>`,
  ]
    .filter(Boolean)
    .join('\n');

  await sendTelegramMessage(message);
}

export async function notifyNewContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<void> {
  const message = [
    `📩 <b>Нове повідомлення з сайту MAP!</b>`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👤 <b>Від:</b> ${data.name}`,
    `📧 <b>Email:</b> ${data.email}`,
    data.phone ? `📱 <b>Телефон:</b> ${data.phone}` : null,
    data.subject ? `📌 <b>Тема:</b> ${data.subject}` : null,
    `💬 <b>Текст звернення:</b>\n<i>${data.message}</i>`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `⏰ <i>${new Date().toLocaleString('uk-UA')}</i>`,
  ]
    .filter(Boolean)
    .join('\n');

  await sendTelegramMessage(message);
}
