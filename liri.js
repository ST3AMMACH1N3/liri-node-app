require('dotenv').config();
const fs = require('fs');
const Spotify = require('node-spotify-api');
const request = require('request');
const moment = require('moment');
const spot = require('./keys').spotify;
const bit = require('./keys').bandsintown;
const omdb = require('./keys').omdb;

function callAction(command = process.argv[2], item = process.argv[3]) {
    switch (command.toLowerCase()) {
        case "concert-this":
            findConcerts(item);
            break;
        case "spotify-this-song":
            spotifySong(item);
            break;
        case "movie-this":
            findMovie(item);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
    }
}

function doWhatItSays() {
    //Read in the file, get rid of the quotes, split on the ,
    let data = fs.readFileSync("random.txt", "utf8");
    //Split the data from the file wherever there is a new line so you can have multiple commands in the file
    data = data.split(/\r\n|\n|\r/);
    //Loop through the array of commands
    data.forEach((e) => {
        //Get rid of the quotes and split each line into the comman and the item
        e = e.replace(/['"]/g, "").split(",");
        //Use the callAction function to call the correct function for the command, using the item
        callAction(e[0], e[1]);
    });
}

function findConcerts(artist) {
    //Replace spaces with +'s so the api call doesn't error
    let band = artist.split(" ").join("+");
    request(`https://rest.bandsintown.com/artists/${band}/events?app_id=${bit.id}`, (error, response, body) => {
        if (error) {
            return console.log(error);
        }

        let obj = JSON.parse(body);
        for(let i = 0; i < obj.length; i++) {
            console.log("*******************************");
            console.log(`Venue: ${obj[i].venue.name}`);
            console.log(`Venue Location: ${obj[i].venue.city}, ${obj[i].venue.country}`);
            console.log("Date: " + moment(obj[i].datetime).format('MM/DD/YYYY'));
        }
    });
}

function spotifySong(song = "The Sign") {
    let spotify = new Spotify({
        id: spot.id,
        secret: spot.secret
    });

    spotify.search({type: 'track', query: song}, (error, data) => {
        if (error) {
            return console.log(error);
        }
        console.log("*******************************");
        console.log(`Artist(s): ${data.tracks.items[0].artists[0].name}`);
        for(let i = 1; i < data.tracks.items[0].artists.length; i++) {
            console.log(`       ${data.tracks.items[0].artists[i].name}`)
        }
        console.log(`Song Name: ${data.tracks.items[0].name}`);
        console.log(`Preview Link: ${data.tracks.items[0].preview_url}`);
        console.log(`Album: ${data.tracks.items[0].album.name}`);
    });
}

function findMovie(movie = "Mr. Nobody") {
    request(`http://www.omdbapi.com/?apikey=${omdb.key}&t=${movie}`, (error, response, body) => {
        if (error) {
            return console.log(error);
        }
        console.log("*******************************");
        let obj = JSON.parse(body);
        console.log(`Title: ${obj.Title}`);
        console.log(`Year of Release: ${obj.Year}`);
        for(let i = 0; i < obj.Ratings.length - 1; i++) {
            console.log(`${obj.Ratings[i].Source} Rating: ${obj.Ratings[i].Value}`);
        }
        console.log(`Country(s): ${obj.Country}`);
        console.log(`Language(s): ${obj.Language}`);
        console.log(`Plot: ${obj.Plot}`);
        console.log(`Actors: ${obj.Actors}`);
    });
}

callAction();