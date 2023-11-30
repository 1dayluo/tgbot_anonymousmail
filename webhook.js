const { Application, Router } = require('@cfworker/web');
const createTelegrafMiddleware = require('cfworker-middleware-telegraf');


const router = new Router();
router.post(`/${process.env.UUID}`, createTelegrafMiddleware(bot));
new Application().use(router.middleware).listen();
