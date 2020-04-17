const discord = require('discord.js');
const auth_module = require('./auth_module');
const token = auth_module.bot_token;
const bot = new discord.Client();
const argSpecifier = '-';

bot.login(token);

bot.on('ready', () => {
    console.log("BeepBoop Online ...");
});

const about = new discord.MessageEmbed()
            .setColor('#128f97')
            .setTitle('Who am I?')
            .setURL('https://github.com/imemyself2/BeepBoop-Discord')
            .setDescription('I am a bot under development. I can fetch you some data from here and there. My primary goal is to integrate different platforms and make it easy for discord users to access them without leaving discord.');
            

bot.on('message', (message) => {
    if(message.content == 'hi bot'){
        // msg.reply(`Hi ${msg.author}!`);
        var req_channel = message.channel;
        message.react('❤️');
        message.reply("Hi there!");
    }
    
    if(message.content.startsWith(argSpecifier)){
        // Message directed to bot
        var commandsArray = message.content.substr(argSpecifier.length).split(' ');
        switch(commandsArray[0]){
            case 'greet':   message.react('❤️');
                            message.reply('Hi there!');
                            break;

            case 'about':   message.channel.send(about);
                            break;

            default: message.channel.send("Usage: \n-greet: Say hello to the bot\n-about: See what it's all about!");
        }
    
    }
});