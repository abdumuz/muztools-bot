const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Salom jigar 👋 Bot ishga tushdi!'));

// URL yuborilganda video olish
bot.on('text', async (ctx) => {
  const url = ctx.message.text;

  if (!url.startsWith('https://')) {
    return ctx.reply('Iltimos, to‘liq URL yuboring (Instagram yoki TikTok).');
  }

  try {
    await ctx.reply('Video yuklanmoqda...');

    let apiUrl = '';
    if (url.includes('instagram.com')) {
      apiUrl = https://api.instadlapi.com/download?url=${encodeURIComponent(url)};
    } else if (url.includes('tiktok.com')) {
      apiUrl = https://api.tikinstaapi.com/download?url=${encodeURIComponent(url)};
    } else {
      return ctx.reply('Faqat Instagram yoki TikTok linkini yuboring.');
    }

    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.video) {
      await ctx.replyWithDocument({ url: data.video, filename: 'video.mp4' });
    } else {
      ctx.reply('Video topilmadi yoki URL noto‘g‘ri.');
    }

  } catch (err) {
    ctx.reply('Xatolik yuz berdi: ' + err.message);
  }
});

bot.launch();
