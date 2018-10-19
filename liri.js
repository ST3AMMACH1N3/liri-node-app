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
        console.log(`Venue: ${obj[0].venue.name}`);
        console.log(`Venue Location: ${obj[0].venue.city}, ${obj[0].venue.country}`);
        console.log("Date: " + moment(obj[0].datetime).format('MM/DD/YYYY'));
    });
}

callAction();