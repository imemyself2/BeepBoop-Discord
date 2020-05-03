const fs = require('fs');

// Playlist to save songs from the music bot

let playlistMap = new Map();

const addToPlaylist = (user, song) => {
    // Add songs to playlistMap
    if(playlistMap.has(user) == false){
        // If no user entry in playlist
        var songs = [song];
        playlistMap.set(user, songs);
    }
    else{
        if(playlistMap.get(user).includes(song) == false){
            playlistMap.get(user).push(song);
        }
        else{
            console.log("Song already in the playlist");
        }
    }
};

// Emoji game content

const emojiGame = [{
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

// Correct answer content
const reply_correct = ["That's correct!", "Awesome!", "You're good!", "Nice!", "Ekdum jordaar!", "Waah bhai waah", "You rock!", "Wohoo!", "On fire", "Fabulous!"];

// Anagram game content
var movieListArr;
const readMovieList = async (movieLoc) => {
    try{
        var movie = fs.readFileSync(movieLoc, 'utf8');
        movieListArr = movie.split('\r\n');
        console.log("Movie list read into array...");
        return movieListArr;
    }
    catch(e){
        console.log("Error reading file: ", e.stack)
    }
}



const shuffleMovie = (element) => {

    let charArr = element.toString().toLowerCase().split(' ').join('').split('');
    for(var i = 0; i < charArr.length; i++){
        var shuffler = Math.floor(Math.random() * charArr.length);
        var temp = charArr[shuffler];
        if((shuffler + 1) == charArr.length){
            charArr[shuffler] = charArr[0];
            charArr[0] = temp;
        }
        else{
            charArr[shuffler] = charArr[shuffler + 1];
            charArr[shuffler + 1] = temp;
        }
    }
    return charArr.join('');
};

exports.emojiGame = emojiGame;
exports.reply_correct = reply_correct;
exports.shuffleMovie = shuffleMovie;
exports.readMovieList = readMovieList;
exports.addToPlaylist = addToPlaylist;
exports.playlistMap =  playlistMap;