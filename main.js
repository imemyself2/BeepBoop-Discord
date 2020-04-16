const discord = require('discord.js');
const auth_module = require('./auth_module');
const token = auth_module.bot_token;
const bot = new discord.Client();

bot.login(token);

bot.on('ready', () => {
    console.log("BeepBoop Online ...");
});

bot.on('message', (msg) => {
    if(msg.content == 'hi bot'){
        // msg.reply(`Hi ${msg.author}!`);
        var req_channel = msg.channel;
        msg.reply("Hi there!");
    }
})