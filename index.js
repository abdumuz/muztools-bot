const { Telegraf, Markup } = require('telegraf');
const ytdlp = require('yt-dlp-exec');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "Salom jigar 👋\n\nInstagram, TikTok yoki YouTube link tashla.\n\nNimani yuklaymiz?",
    Markup.inlineKeyboard([
      [Markup.button.callback('🎬 Video', 'video')],
      [Markup.button.callback('🎧 Audio (mp3)', 'audio')]
    ])
  );
});

let lastLink = {};

bot.on('text', (ctx) => {
  const text = ctx.message.text;
  if (text.includes('http')) {
    lastLink[ctx.from.id] = text;
    ctx.reply(
      "Tanla 👇",
      Markup.inlineKeyboard([
        [Markup.button.callback('🎬 Video', 'video')],
        [Markup.button.callback('🎧 Audio (mp3)', 'audio')]
      ])
    );
  }
});

bot.action('video', async (ctx) => {
  const link = lastLink[ctx.from.id];
  if (!link) return ctx.reply("Avval link tashla jigar");

  await ctx.reply("⏳ Video yuklanmoqda...");

  try {
    const video = await ytdlp(link, {
      format: 'mp4',
      output: 'video.%(ext)s'
    });
    await ctx.replyWithVideo({ source: 'video.mp4' });
  } catch (e) {
    ctx.reply("❌ Xatolik bo‘ldi");
  }
});

bot.action('audio', async (ctx) => {
  const link = lastLink[ctx.from.id];
  if (!link) return ctx.reply("Avval link tashla jigar");

  await ctx.reply("⏳ Audio yuklanmoqda...");

  try {
    const audio = await ytdlp(link, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: 'audio.%(ext)s'
    });
    await ctx.replyWithAudio({ source: 'audio.mp3' });
  } catch (e) {
    ctx.reply("❌ Xatolik bo‘ldi");
  }
});

bot.launch();
