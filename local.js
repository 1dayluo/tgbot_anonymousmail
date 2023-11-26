/*
 * @Author: 1dayluo
 * @Date: 2023-11-26 15:39:18
 * @LastEditTime: 2023-11-26 17:33:17
 */
const { Telegraf } = require('telegraf');
const { createServer } = require("http");
const bot = new Telegraf(process.env.TGTOKEN);


const domain = process.env.DOMAIN;
const uuid = process.env.UUID
const webhook_target = `${domain}/${uuid}`
// 设置 webhook，请改成你自己的回调地址
createServer(await bot.createWebhook({ domain: 'https://mailbot.echonekoninja.workers.dev'})).listen(3000);
