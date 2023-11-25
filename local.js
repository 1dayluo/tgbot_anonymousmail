const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.TGTOKEN);


const domain = process.env.DOMAIN;
const uuid = process.env.UUID
// 设置 webhook，请改成你自己的回调地址
bot.telegram.setWebhook(`${domain}/${uuid}`);