const discord = require('discord.js');
const data = require('./data.js');
var auth_module;
var token;
if(process.env.DBK){
    token = process.env.DBK;
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


const about = new discord.MessageEmbed()
    .setColor('#128f97')
    .setTitle('Who am I?')
    .setURL('https://github.com/imemyself2/BeepBoop-Discord')
    .setDescription('I am a bot looking for a purpose in life....');

const currAnagramCard = new discord.MessageEmbed()
    .setColor('#c5c808')
    .setTitle('Current Anagram');

var channel_game;
var isEmojiGame = false;
var isAnagramGame = false;
var currentAnagramShuffled;
var currentAnagramAnswer;
var currentEmoji;
var movielist;

bot.on('message', (message) => {

    if (message.content.startsWith(argSpecifier)) {
        // Message directed to bot
        var commandsArray = message.content.substr(argSpecifier.length).split(' ');
        
            if(commandsArray[0] == 'greet'){
                message.react('❤️');
                message.reply('Hi there!');
            }

            if(commandsArray[0] == 'about'){
                message.channel.send(about);
            }

            if(commandsArray[0] == 'emoji'){
                // Start emoji game
            }

            if(commandsArray[0] == 'anagram'){
                // Start movie anagram game
                if(isAnagramGame)
                    message.channel.send("An instance of Anagram game is already running");
                else{
                    // Initialize and run game
                    isAnagramGame = true;
                    movielist = data.readMovieList('./movielist.txt');
                    
                    currentAnagramAnswer = movielist[Math.floor(Math.random() * movielist.length)].toLowerCase().split(" ").join('');
                    currentAnagramShuffled = data.shuffleMovie(currentAnagramAnswer);
                    currAnagramCard.setDescription(currentAnagramShuffled);
                    const firstAnagramCard = new discord.MessageEmbed()
                        .setColor("#c5c808")
                        .setTitle("The Anagram game begins!")
                        .setDescription("Decode the Anagram and find the movie\nUse \"-checkA <answer>\" to see if your answer is correct\nUse \"-showanagram\" to see the current anagram being played");
                    message.channel.send(firstAnagramCard);
                    
                }
            }
            if(commandsArray[0] == 'showanagram'){
                if(isAnagramGame){
                    // Show the current anagram, if any present
                    message.channel.send(currAnagramCard);
                    //console.log(currentAnagramAnswer);
                }
                else{
                    message.channel.send("No instance of Anagram game is currently running");
                }
            }

            if(commandsArray[0] == 'closeanagram'){
                if(isAnagramGame){
                    // close game and clear any variable used
                    isAnagramGame = false;
                }
                else{
                    message.channel.send("No instance of the game is running");
                }
            }

            if(commandsArray[0] == "checkA"){
                if(isAnagramGame){
                    var joinedMessage = commandsArray.join('');
                    joinedMessage = joinedMessage.substring(commandsArray[0].length).toLowerCase();
                    console.log(joinedMessage);
                    
                    if(joinedMessage == currentAnagramAnswer){
                        const correctAnswerCard = new discord.MessageEmbed()
                            .setColor("#39e817")
                            .setTitle(data.reply_correct[Math.floor(Math.random() * data.reply_correct.length)])
                            .setDescription(`${message.author}`);
                        message.channel.send(correctAnswerCard);
                        message.react('✅');


                        // Set new anagram
                        currentAnagramAnswer = movielist[Math.floor(Math.random() * movielist.length)].toLowerCase().split(" ").join('');
                        currentAnagramShuffled = data.shuffleMovie(currentAnagramAnswer);
                        currAnagramCard.setDescription(currentAnagramShuffled);
                    }
                    else{
                        message.react('❌');
                    }
                }
                else{
                    message.channel.send("No instance of the game is running");
                }
                
            }
            
            if(commandsArray[0] == 'howto'){
                const howtoCard = new discord.MessageEmbed()
                    .setTitle("How to use BeepBoop")
                    .setColor("#ff0000");
                var usage = [
                    {about: "Who am I?"},
                    {greet: "Say hello!"},
                    {anagram: "Start an Anagram movie guessing game"},
                    {showanagram: "Show the current anagram"},
                    {closeanagram: "Close the anagram game"}
                ];
                var i = 0;
                var usageString = "";
                while(i < usage.length){
                    usageString = usageString + (Object.keys(usage[i]) + ": " + Object.values(usage[i])) + "\n";
                    i++;
                }
                howtoCard.setDescription(usageString);
                message.channel.send(howtoCard);
            }
        

    }
});

function randomCharSelector(element) {
    // Returns index of a random character in range of the element
    var index = element[Math.floor(Math.random() * element.length)];
    return index;
}
