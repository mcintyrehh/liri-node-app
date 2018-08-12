
//pulling in the .env file full of keys
require("dotenv").config();
//fs package to read/write to local file system
var fs = require("fs");
//pulling in twitter/spotify/request npm packages
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
//setting an environmental variable for the keys
var keys = require("./keys");
//setting spotify keys for api calls
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret,
});
//access for spotify and twitter keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//setting the desired command as a variable, argv[0] is 'node' argv[1] is 'liri.js'
var command = process.argv[2];
//easily expandable function calls for our 4 commands
if (command == "my-tweets") {
    myTweets();
}
else if (command == "spotify-this-song") {
    spotifySong();
}
else if (command == "movie-this") {
    movieThis();
}
else if (command == "do-what-it-says") {
    doWhatItSays();
}
//my-tweets
//*shows (up to) the last 20 tweets and when they were created in terminal/bash window*
function myTweets() {
    var params = { screen_name: 'blue_tang_clan' };
    client.get('statuses/user_timeline', params, function (err, tweets, response) {
        if (!err) {
            var appendTweet
            for (var i = 0; i < 20; i++) {
                //if there is data for the tweet, print the tweet text and timestamp
                if (tweets[i]) {
                    //text block to console.log() and to append to LIRILog.txt using the fs package
                    appendTweet = (
                        "*************************" + 
                        "\nUsername: @" + tweets[i].user.screen_name +
                        "\nTweet: " + tweets[i].text +
                        "\nTime: " + tweets[i].created_at +
                        "\n*************************\n"
                    )
                    //appending 'appendTweet' to LIRILog.txt, confirming to user if successfull 
                    fs.appendFile("LIRILog.txt", appendTweet, function(err) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log("Tweet logged in the LIRI Log!");
                    })
                    console.log(appendTweet);
                    
                }
                // if no data (i.e. less than 20 tweets from user), exit loop
                else {
                    return;
                }
            }
        }
    })
}

function spotifySong(song) {

    var songName
    //if the fxn has a song passed through, it is being called as a part of "do-what-it-says", uses that info in spotify api call
    if (song) {
        songName = song;
    }
    //default song if nothing is entered
    else {
        songName = "The Sign Ace of Base";
        //checks to see if something is added after 'spotify-this-song', if so it concatinates everything into a string to use as the search query
    }
    if (process.argv[3]) {
        songName = "";
        for (var i = 3; i < process.argv.length; i++) {
            songName += process.argv[i] + " ";
        }
    }
    //spotify API search call
    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log("Error occured: " + err);
        }
        //stores the first returned song as a var, prints song data from the var
        var song = data.tracks.items[0];
        //text block to console.log() and to append to LIRILog.txt using the fs package
        var appendSong = (
            "\n*************************" +
            "\nSong: " + song.name +
            "\nArtist: " + song.artists[0].name +
            "\n30 second preview url: " + song.preview_url +
            "\nAlbum: " + song.album.name +
            "\n**************************\n"
        )
        fs.appendFile("LIRILog.txt", appendSong, function(err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Song info logged in the LIRI Log!");
        })
        console.log(appendSong);
    });
}

function movieThis(movie) {
    var movieName;
    //if called with data, that data is the movie name (i.e. do-what-it-says calls)
    if (movie) {
        movieName = movie;
    }
    //checks to see if something is added after 'movie-this', if so it concatinates everything into a string to use as the search query
    else {
        if (process.argv[3]) {
            movieName = "";
            for (var i = 3; i < process.argv.length; i++) {
                movieName += process.argv[i] + "+";
            }
        }
        //if not the default is 'mr. nobody'
        else {
            movieName = "Mr. Nobody";
        }
    }
    //using the request package to call data from the OMDB API
    //passing through the movieName query generated by the users entry
    var queryURL = "https://www.omdbapi.com/?t=" + movieName + "&plot=short&type=movie&apikey=e73085d6";
    request(queryURL, function (err, response, body) {
        if (err) {
            console.log(err);
            return;
        }
        //parsing the returned data as JSON, so it can be accessed as a JSON object 
        var movieData = (JSON.parse(body));
        //text block to console.log() and to append to LIRILog.txt using the fs package
        var appendMovie = (
        "\n*************************" +
        "\nMovie Title: " + movieData.Title +
        "\nYear of release: " + movieData.Year +
        "\nIMDb Rating: " + movieData.Ratings[0].Value +
        "\nRotten Tomatoes Rating: " + movieData.Ratings[1].Value +
        "\nCountry: " + movieData.Country +
        "\nLanguage: " + movieData.Language +
        "\nPlot: " + movieData.Plot +
        "\nActors: " + movieData.Actors +
        "\n**************************\n")
        fs.appendFile("LIRILog.txt", appendMovie, function(err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Movie info logged in the LIRI Log!");
        })
        console.log(appendMovie);
    })
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        var simonSays = data.toString();
        simonSays = simonSays.split(",", 2);
        simonSaysData = simonSays[1];
        if (simonSays[0] === "spotify-this-song") {
            spotifySong(simonSaysData);
        }
        else if (simonSays[0] === "movie-this") {
            movieThis(simonSaysData);
        }
        else if (simonSays[0] === "my-tweets") {
            myTweets();
        }
    })
}
 //do-what-it-says
    //using the fs Node Package liri will take the text inside random.txt and use it to call one of liri's commands
    //have it run 'spotify-this-song' for the song in the file

//*BONUS* have the data log to terminal and output to .txt file **append data not overwrite**
//** */