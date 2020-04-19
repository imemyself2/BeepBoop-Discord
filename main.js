const discord = require('discord.js');
var auth_module;
var token;
if(process.env.DBK){
    token = process.env.DBK;
    console.log(token);
}
else{
    auth_module = require('./auth_module.js');
    token = auth_module.bot_token;
}
const bot = new discord.Client();
const argSpecifier = '-';

bot.login(token);

bot.on('ready', () => {
    console.log("BeepBoop Online ...");

});

const game = [{
        emoji: '👳‍♂️⛵🐱',
        ans: 'life of pi'
    },
    {
        emoji: '👸🐸👑',
        ans: 'princess and the frog'
    },
    {
        emoji: '⚡🧔🔨',
        ans: 'thor'
    },
    {
        emoji: '🧚👹',
        ans: 'angels and demons'
    },
    {
        emoji: '🐼👊',
        ans: 'kungfu panda'
    },
    {
        emoji: '🌊🔥🌪️💥',
        ans: '2012'
    },
    {
        emoji: '🤧🤢😷🦠',
        ans: 'contagion'
    },
    {
        emoji: '🧒🐉',
        ans: 'how to train your dragon'
    },
    {
        emoji: '🎈',
        ans: 'it'
    },
    {
        emoji: '🤫🐑',
        ans: 'silence of the lambs'
    }
];

const reply_correct = ["That's correct!", "Awesome!", "You're good!", "Nice!", "Ekdum jordaar!", "Waah bhai waah", "You rock!", "Wohoo!", "On fire", "Fabulous!"];

const about = new discord.MessageEmbed()
    .setColor('#128f97')
    .setTitle('Who am I?')
    .setURL('https://github.com/imemyself2/BeepBoop-Discord')
    .setDescription('I am a bot under development. I can fetch you some data from here and there. My primary goal is to integrate different platforms and make it easy for discord users to access them without leaving discord.');

var channel_game;
var index = Math.floor(Math.random() * 10);
var isGame = false;
var currObject;
bot.on('message', (message) => {

    //message.channel.send("Waiting to learn Gujarati <3");
    if (message.content == 'Hi bot' || message.content == 'hi bot') {
        // msg.reply(`Hi ${msg.author}!`);
        var req_channel = message.channel;
        message.react('❤️');
        message.reply("Hello there!");
    }

    if (message.content.startsWith(argSpecifier)) {
        // Message directed to bot
        var commandsArray = message.content.substr(argSpecifier.length).split(' ');
        switch (commandsArray[0]) {
            case 'greet':
                message.react('❤️');
                message.reply('Hi there!');
                break;

            case 'about':
                message.channel.send(about);
                break;

            case 'opengame': // Start an emoji-movie game
                if(isGame){
                    message.channel.send("There is already an instance of game running");
                    break;
                }
                channel_game = message.channel;
                channel_game.send("Let's begin the emoji game!");
                index = Math.floor(Math.random()*10);
                currObject = game[index];
                channel_game.send(currObject.emoji);
                isGame = true;
                break;
            case 'check': // Game answers handled here
                if(isGame){
                    commandsArray.shift();
                    var message_joined = commandsArray.join(" ");
                    if(message_joined.toLowerCase() == currObject.ans){
                        message.reply(reply_correct[index]);
                        index = Math.floor(Math.random()*10);
                        var tempPrev = currObject;
                        currObject = game[index];
                        // check for similar game on second run
                        if(currObject == tempPrev){
                            index = Math.floor(Math.random()*10);
                            currObject = game[index];
                        }
                        break;
                    }
                }
                else{
                    message.channel.send("There is no game running. Please use -opengame to start a game.");
                    break;
                }
            case 'showgame': // Check the current game if it is running
                if(isGame){
                    message.channel.send(currObject.emoji);
                }
                break;
            case 'closegame':
                    isGame = false;
                    message.channel.send("Thank you for playing :)");
                    break;
            case 'howto':
            default:
                var usage = [
                    {about: "Who am I?"},
                    {greet: "Say hello!"},
                    {opengame: "Start and emoji movie guessing game"}
                ];
                var i = 0;
                while(i < usage.length){
                    message.channel.send(Object.keys(usage[i]) + ": " + Object.values(usage[i]));
                    i++;
                }
        }

    }
});

function playGame() {    

    

}