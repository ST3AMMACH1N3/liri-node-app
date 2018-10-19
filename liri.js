require('dotenv').config();
const fs = require('fs');
const Spotify = require('node-spotify-api');
const request = require('request');
const moment = require('moment');
const spot = require('./keys').spotify;
const bit = require('./keys').bandsintown;
const omdb = require('./keys').omdb;
const lineBreaker =    "-------------------------------";
const commandBreaker = "*******************************";

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
    fs.appendFileSync("log.txt", `${commandBreaker}\ndo-what-it-says\n`);
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
        let str = "";
        for(let i = 0; i < obj.length; i++) {
            str += `${lineBreaker}\n`;
            str += `Venue: ${obj[i].venue.name}\n`;
            str += `Venue Location: ${obj[i].venue.city}, ${obj[i].venue.country}\n`;
            str += "Date: " + moment(obj[i].datetime).format('MM/DD/YYYY') + "\n";
        }
        console.log(str);
        let com = `${commandBreaker}\nconcert-this ${artist}\n`;
        fs.appendFileSync("log.txt", com + str);
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
        let str = `${lineBreaker}\n`;
        str += `Artist(s): ${data.tracks.items[0].artists[0].name}\n`;
        for(let i = 1; i < data.tracks.items[0].artists.length; i++) {
            str += `       ${data.tracks.items[0].artists[i].name}\n`;
        }
        str += `Song Name: ${data.tracks.items[0].name}\n`;
        str += `Preview Link: ${data.tracks.items[0].preview_url}\n`;
        str += `Album: ${data.tracks.items[0].album.name}\n`;
        console.log(str);
        let com = `${commandBreaker}\nspotify-this-song ${song}\n`;
        fs.appendFileSync("log.txt", com + str);
    });
}

function findMovie(movie = "Mr. Nobody") {
    request(`http://www.omdbapi.com/?apikey=${omdb.key}&t=${movie}`, (error, response, body) => {
        if (error) {
            return console.log(error);
        }
        let str = `${lineBreaker}\n`;
        let obj = JSON.parse(body);
        str +=`Title: ${obj.Title}\n`;
        str += `Year of Release: ${obj.Year}\n`;
        for(let i = 0; i < obj.Ratings.length - 1; i++) {
            str += `${obj.Ratings[i].Source} Rating: ${obj.Ratings[i].Value}\n`;
        }
        str += `Country(s): ${obj.Country}\n`;
        str += `Language(s): ${obj.Language}\n`;
        str += `Plot: ${obj.Plot}\n`;
        str += `Actors: ${obj.Actors}\n`;
        console.log(str);
        let com = `${commandBreaker}\nmovie-this ${movie}\n`;
        fs.appendFileSync("log.txt", com + str);
    });
}

callAction();