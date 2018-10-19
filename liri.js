require('dotenv').config();
const fs = require('fs');
const Spotify = require('node-spotify-api');
const request = require('request');
const moment = require('moment');
const spot = require('./keys').spotify;
const bit = require('./keys').bandsintown;
const omdb = require('./keys').omdb;

function callAction() {
    switch (process.argv[2].toLowerCase()) {
        case "concert-this":
            findConcerts(process.argv[3]);
            break;
        case "spotify-this-song":
            spotifySong(process.argv[3]);
            break;
        case "movie-this":
            break;
        case "do-what-it-says":
            break;
    }
}

function findConcerts(artist) {
    request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=${bit.id}`, (error, response, body) => {
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

    spotify.search({type: 'track', query: song}, (err, data) => {
        console.log(`Artist(s): ${data.tracks.items[0].artists[0].name}`);
        for(let i = 1; i < data.tracks.items[0].artists.length; i++) {
            console.log(`   ${data.tracks.items[0].artists[i].name}`)
        }
        console.log(`Song Name: ${data.tracks.items[0].name}`);
        console.log(`Preview Link: ${data.tracks.items[0].preview_url}`);
        console.log(`Album: ${data.tracks.items[0].album.name}`);
    });
}

callAction();