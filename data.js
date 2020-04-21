const fs = require('fs');

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
const readMovieList = (movieLoc) => {
    try{
        var movie = fs.readFileSync(movieLoc, 'utf8');
        movieListArr = movie.split('\r\n');
        return movieListArr;
    }
    catch(e){
        console.log("Error reading file: ", e.stack)
    }
}



const shuffleMovie = (element) => {

    var charArr = element.toLowerCase().split(' ').join('').split('');
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