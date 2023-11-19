require('dotenv').config()
const MailSlurp = require('mailslurp-client').default;
const fs = require('fs');
const { Telegraf, Markup } = require('telegraf')
const { message } = require('telegraf/filters');
// const { callback } = require('telegraf/typings/button');

// const { callback } = require('telegraf/typings/button');



const apiFile = './config/list';

const bot = new Telegraf(process.env.TGTOKEN)

async function readmail_address(apiKey) {
    // create a client
    
    const mailslurp = new MailSlurp({ apiKey });

    // create an inbox
    const inbox = await mailslurp.inboxController.createInbox({});

    return inbox.emailAddress;
    // expect(inbox.emailAddress).toContain('@mailslurp');
}


async function receive_mail(key) {
    // create a client
    try {
        const mailslurp = new MailSlurp({ apiKey: key});

    // create an inbox
        const { id: inboxId } = await mailslurp.createInbox();
        const inbox = await mailslurp.getInbox(inboxId);
        const email = await mailslurp.waitForLatestEmail(inbox.id)
        // const latestEmail =  await mailslurp.emailController.getEmail({emailId:email.id});
        return email.body;
    } catch(e) {
        const statusCode = e.status;
        const errorMessage = await e.text;
        return errorMessage;
    }
}

async function read_keys() {
    return fs.readFileSync(apiFile, 'utf-8', (err, data) => {
        if (err) {
            console.error('err', err);
            return [];
        }
    })

}




bot.start(async(ctx) => {
    ctx.reply('Welcome');
});

bot.telegram.getMe().then((botInfo) => {bot.options.username = botInfo.username});

bot.command('address', async (ctx) => {
    try {
        let addresses = [];
        let keys = await read_keys();
        keys = keys.split(/\r?\n/);
        for (const key of keys) {
            const address = await readmail_address(key);
            addresses.push(`${address}\n`);
        }       
        await ctx.reply(`${addresses}`);

    } catch(e) {
        console.log(e);
    }
});

bot.command('receive', async (ctx) => {
    try {
        let email = ctx.update.message.text.split(' ')[1];
        if (email === undefined ) {
            ctx.reply(`Please set receive email address! current is: ${email}`)
        }
        await ctx.reply(`test ${email}`);

    } catch(e) {
        console.log(e);
    }
});


bot.command('receive_all', async (ctx) => {
    try {
        let keys = await read_keys();
        let mails = [];
        keys = keys.split(/\r?\n/);
        for (const key of keys) {
            const mail = await receive_mail(key);
            mails.push(`${mail}\n`);
        }
        ctx.reply(`Test:\n ${mails}`);

    } catch(e) {
        console.log(e);
    }
});
// bot.help( async(ctx)=> {
//     let commands =  await ctx.getMyCommands();
//     console.log(commands);
//     let value = "Here's the list of commands i know:\n";
//     commands.forEach(cmd => {
//         value += `/${cmd.command} - ${cmd.description}\n`;
//     })
//     ctx.inlineQuery;
//     ctx.reply(value);
// })

bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.launch();
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))