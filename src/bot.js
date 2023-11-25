require('dotenv').config()
const MailSlurp = require('mailslurp-client').default;
require('dotenv').config();
const fs = require('fs');
const { Telegraf, Markup } = require('telegraf')
const { message } = require('telegraf/filters');
const cheerio = require('cheerio'); 

// const { callback } = require('telegraf/typings/button');

// const { callback } = require('telegraf/typings/button');



const apiFile = './config/list';
// console.log(process.env.MAILKEY,process.env.TGTOKEN);
const keys = process.env.MAILKEY.split(",");


const bot = new Telegraf(process.env.TGTOKEN)

async function readmail_address(apiKey) {
    // create a client

    const mailslurp = new MailSlurp({ apiKey });
    let addresses = [];
    // create an inbox
    let inbox_count = await mailslurp.inboxController.getInboxCount();
    if (inbox_count.totalElements < 1) {
        await mailslurp.createInbox();
    }
    let page_inboxes = await mailslurp.inboxController.getAllInboxes(0,20);

    page_inboxes.content.forEach((ele) => {
        addresses.push(ele.emailAddress)
    })
    return addresses;
    // expect(inbox.emailAddress).toContain('@mailslurp');
}


async function receive_mail(key) {
    // create a client
    try {
        const mailslurp = new MailSlurp({ apiKey: key});
        // doc: https://mailslurp.github.io/mailslurp-client/classes/EmailControllerApi.html#getLatestEmail

        const inbox = await mailslurp.inboxController.getAllInboxes(0,20);
        const email = await mailslurp.emailController.getLatestEmail(inbox);
        const $ = cheerio.load(email.body);
        const body = $('body').text();
        const from = email.from;
        const to = email.to;
        let mail_content = `from: ${from} \n to: ${to} \n${body}`
        // console.log(mail_content);
        return mail_content;
    } catch(e) {
        const statusCode = e.status;
        const errorMessage = await e.text;
        console.log(errorMessage);
        return errorMessage;
    }
}


async function create_inbox(apikey) {
    const mailslurp = new MailSlurp({ apiKey:apikey });
    // create an inbox
    await mailslurp.createInbox();

    let inbox_count = await mailslurp.inboxController.getInboxCount();
    return inbox_count.totalElements;
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
bot.command('address', async (ctx) => {
    try {
        let addresses = [];
        for (const key of keys) {
            const inbox_addresses = await readmail_address(key);
            let index = keys.indexOf(key);
            await ctx.reply(`Account id is : ${index}:\n${inbox_addresses}`);
        }       
        // await ctx.reply(`${addresses}`);

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



bot.command('get', async (ctx) => {
    try {
        let account_id = ctx.update.message.text.split(' ')[1];
        if (account_id ===undefined) {
            for (const key of keys) {
                const mail = await receive_mail(key);
                ctx.replyWithHTML(mail);
            }
        } else if (account_id < keys.length) {
            key = keys[account_id];
            const mail = await receive_mail(key);
            ctx.replyWithHTML(mail);
        } else {
            ctx.reply('error! 请选择正确的account id!');
        }
        
    } catch(e) {
        console.log(e);
    }
});

bot.command('create', async(ctx) => {
    try {
        let account_id = ctx.update.message.text.split(' ')[1];
        if (account_id ===undefined) 
        {
            ctx.reply('error! 请选择正确的account id! /create {account index}');
        } else if (account_id < keys.length)  {
            let inbox_num = await create_inbox(keys[account_id]);
            ctx.reply(`第${account_id}用户创建邮箱成功! 现在有${inbox_num}个匿名邮箱(/address查看全部用户下邮箱)`);
        } else {
            ctx.reply('error! 请选择正确的account id!');
        }

    } catch(e) {
        console.log(e);
    }
})

bot.on(message('sticker'), (ctx) => ctx.reply('meow~'));


if(process.env.environment == "PRODUCTION"){
    bot.launch({
      webhook:{
          domain: process.env.DOMAIN,// Your domain URL (where server code will be deployed)
          port: process.env.PORT || 8000
      }
    }).then(() => {
      console.info(`The bot ${bot.botInfo.username} is running on server`);
    });
  } else { // if local use Long-polling
    bot.launch().then(() => {
      console.info(`The bot ${bot.botInfo.username} is running locally`);
    });
}


// bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))