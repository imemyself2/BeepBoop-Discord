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

bot.on('ready', async () => {
    movielist = await data.readMovieList('./movielist.txt');
    console.log("BeepBoop Online ...");
});


const about = new discord.MessageEmbed()
    .setColor('#128f97')
    .setTitle('Who am I?')
    .setURL('https://github.com/imemyself2/BeepBoop-Discord')
    .setDescription('I am a bot looking for a purpose in life....');

var currAnagramCard = new discord.MessageEmbed()
    .setColor('#c5c808')
    .setTitle('Current Anagram')
    .setDescription("");

var channel_game;
var isEmojiGame = false;
var isAnagramGame = false;
var currentAnagramShuffled;
var currentAnagramAnswer;
var currentEmoji;
var movielist;
var currSong;
var currSongUser;
var currSongObj;

bot.on('message', async (message) => {

    /**
     * Available commands: 
     * -greet, -howto, -about
     */

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
                    //message.channel.send(currAnagramCard).then(()=> console.log(currentAnagramAnswer)).catch(()=>console.log("Promise failed."));
                    message.reply(currAnagramCard).then(() => console.log("Anagram send success")).catch((err) => console.log("Anagram send failed: " + err));
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
                    {save: "Save a song to your playlist, use -save <songname>"},
                    {savecurrent: "Save the song being played currently to your playlist"},
                    {showplaylist: "See your playlist. To see other user's playlist, use -showplaylist <userID>"},
                    {setPlaylistPrivacy: "Set your playlist privacy useing -setPrivacyPublic or -setPrivacyPrivate"}
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

            if(commandsArray[0] == 'savecurrent'){
                // Save song playing currently to user's playlist
                if(currSongObj == null){
                    message.reply("There is no song being played currently");
                }
                else{
                    data.addToPlaylist(currSongObj.currSongUser, currSongObj.currSong);
                    message.react('❤️');
                }
                
            }

            if(commandsArray[0] == 'save'){
                if(commandsArray.length == 1){
                    console.log("Please specify a song name or use -savecurrent to save the song currently being played");
                }
                else{
                    if(commandsArray[1].includes('open.spotify.com')){
                        // append 'spotify link'
                        var tempString = commandsArray[1] + " (Spotify Link)";
                        data.addToPlaylist(message.author, tempString);
                    }
                    else if(commandsArray[1].includes('youtube.com')){
                        // append 'youtube link'
                        var tempString = commandsArray[1] + " (Youtube Link)";
                        data.addToPlaylist(message.author, tempString);
                    }
                    else{
                        data.addToPlaylist(message.author, commandsArray.slice(1).join(" "));
                    }
                }
                message.react('❤️');

            }

            if(commandsArray[0] == 'showplaylist'){
                var isAuthor;
                var userString;
                if(commandsArray.length != 1){
                    // requesting other user's playlist
                    if(commandsArray[1] == message.author){
                        isAuthor = true;
                        userString = message.author;
                    }
                    else{
                        isAuthor = false;
                        userString = commandsArray[1];
                    }
                    
                } 
                else{
                    isAuthor = true;
                    userString = message.author;
                }
                var dispPlaylistString = data.getPlaylist(userString, isAuthor);
                if(dispPlaylistString == 'empty'){
                    dispPlaylistString = "The playlist is empty";
                }
                else if(dispPlaylistString == 'inaccessible'){
                    dispPlaylistString = "The playlist is inaccessible";
                }
                const dispPlaylistCard = new discord.MessageEmbed()
                                            .setTitle("Your playlist")
                                            .setColor("#00e5ff")
                                            .setDescription(dispPlaylistString);
                message.channel.send(dispPlaylistCard);

            }

            if(commandsArray[0] == 'play'){
                currSong = commandsArray.slice(1).join(" ");
                currSongUser = message.author;
                currSongObj = {currSongUser, currSong};
                console.log("Current song object: " + currSongObj.currSongUser + " ~ " + currSongObj.currSong);
            }

            if(commandsArray[0] == 'stop'){
                // Clear currSongObject
                currSong = null;
                currSongUser = null;
                currSongObj = null;
            }

            if(commandsArray[0] == 'setPlaylistPrivate'){
                // make playlist private
                var check = data.setPlaylistPrivacy(message.author, 0);
                if(check == 'empty'){
                    message.channel.send('The playlist is inaccessible');
                }
                else if(check == 'success'){
                    message.react('👍');
                }
            }
            if(commandsArray[0] == 'setPlaylistPublic'){
                var check = data.setPlaylistPrivacy(message.author, 1);
                if(check == 'empty'){
                    message.channel.send('The playlist is inaccessible');
                }
                else if(check == 'success'){
                    message.react('👍');
                }
            }
        

    }
});

// function calcCurrAnagramCard() {
//     return new Promise(resolve => {
//         currentAnagramAnswer = movielist[Math.floor(Math.random() * movielist.length)].toLowerCase().split(" ").join('');
//         resolve('done calculating');
//     })
    
// }

// async function getCurrAnagramCard() {
//     await calcCurrAnagramCard();
//     console.log("Result sent");
// }

function randomCharSelector(element) {
    // Returns index of a random character in range of the element
    var index = element[Math.floor(Math.random() * element.length)];
    return index;
}