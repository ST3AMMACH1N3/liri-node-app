require('dotenv').config();
const fs = require('fs');
const Spotify = require('node-spotify-api');
const request = require('request');
const moment = require('moment');
const spot = require('./keys').spotify;
const bit = require('./keys').bandsintown;
const omdb = require('./keys').omdb;
const lineBreaker =    "-------------------------------";
const commandBreaker = "";

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
    // fs.appendFile("log.txt", `${commandBreaker}\ndo-what-it-says\n`);
    //Read in the file, get rid of the quotes, split on the ,
    fs.readFile("random.txt", "utf8", (err, data) => {
        if (err) throw err;
        //Split the data from the file wherever there is a new line so you can have multiple commands in the file
        data = data.split(/\r\n|\n|\r/);
        //Loop through the array of commands
        data.forEach((e) => {
            //Get rid of the quotes and split each line into the comman and the item
            e = e.replace(/['"]/g, "").split(",");
            //Use the callAction function to call the correct function for the command, using the item
            callAction(e[0], e[1]);
        });
    });
}

function findConcerts(artist) {
    if (!artist) {
        return console.log("Please enter an artists name")
    }
    //Replace spaces with +'s so the api call doesn't error
    let band = artist.split(" ").join("+");
    request(`https://rest.bandsintown.com/artists/${band}/events?app_id=${bit.id}`, (error, response, body) => {
        if (error) throw error;
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
        fs.appendFile("log.txt", com + str, (err) => {
            if (err) throw err;
        });
    });
}

function findMovie(movie = "Mr. Nobody") {
    request(`http://www.omdbapi.com/?apikey=${omdb.key}&t=${movie}`, (error, response, body) => {
        if (error) throw error;
        let str = `${lineBreaker}\n`;
        let obj = JSON.parse(body);
        let infoWanted = ["Title", "Ratings", "Country", "Language", "Plot", "Actors"];
        for (let i = 0; i < infoWanted.length; i++) {
            if (infoWanted[i] !== "Ratings") {
                str += `${infoWanted[i]}: ${obj[infoWanted[i]]}\n`
            } else {
                for (let j = 0; j < obj.Ratings.length; j++) {
                    str += `${obj.Ratings[j].Source} Rating: ${obj.Ratings[j].Value}\n`;
                }
            }
        }
        console.log(str);
        let com = `${commandBreaker}\nmovie-this ${movie}\n`;
        fs.appendFile("log.txt", com + str, (err) => {
            if (err) throw err;
        });
    });
}

function spotifySong(song = "The Sign") {
    let spotify = new Spotify({
        id: spot.id,
        secret: spot.secret
    });

    spotify.search({type: 'track', query: song, limit: 1}, (error, data) => {
        if (error) throw error;
        let str = `${lineBreaker}\n`;
        let item = data.tracks.items[0];
        str += `Artist(s): ${item.artists[0].name}\n`;
        for(let i = 1; i < item.artists.length; i++) {
            str += `       ${item.artists[i].name}\n`;
        }
        str += `Song Name: ${item.name}\n`;
        str += `Preview Link: ${item.preview_url}\n`;
        str += `Album: ${item.album.name}\n`;
        console.log(str);
        let com = `${commandBreaker}\nspotify-this-song ${song}\n`;
        fs.appendFile("log.txt", com + str, (err) => {
            if (err) throw err;
        });
    });
}

callAction();