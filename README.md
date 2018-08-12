# liri-node-app
LIRI is a command line Node.js text (Language) interpretation app. It will display my latest tweets, display song information from Spotify,  and movie information from IMDb.


my-tweets
    //shows (up to) the last 20 tweets and when they were created in terminal/bash window
spotify-this-song <song name here>
    //shows the following info in terminal/bash window
    //Artist(s)
    //Song's name
    //Preview link of song from Spotify
    //Album that song is from
    //if no song program defaults to "the sign" by Ace of Base
movie-this <movie name here>
    //Title of movie
    //Year movie came out
    //IMDb rating
    //Rotten Tomatoes rating
    //Country where movie was produced
    //Language of movie
    //Plot
    //Actors in movie
    //*if no movie typed in, program defaults to Mr. Nobody
 do-what-it-says
    //using the fs Node Package liri will take the text inside random.txt and use it to call one of liri's commands
    //have it run 'spotify-this-song' for the song in the file
