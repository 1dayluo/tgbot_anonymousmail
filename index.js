const { Telegraf } = require('telegraf');
const { Application, Router } = require('@cfworker/web');
const createTelegrafMiddware = require('cfworker-middware-telegraf');

const bot = new Telegraf('BOT_TOKEN');

// 写 bot 逻辑，但不要 bot.launch()

const router = new Router();
const uuid = process.env.UUID
// `/SECRET_PATH` 指的是一个不容易猜到的路径，以防止他人访问你的 webhook
// 可以滚键盘或者用 UUID 之类的生成，例如 '/d4507ff0-08d1-4160-bad8-1addf587374a'
router.post(`/${uuid}`, createTelegrafMiddware(bot));

new Application().use(router.middleware).listen();