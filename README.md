# liri-node-app
## This is a command line node app that takes in parameters and gives you back data.
### LIRI Bot has four commands available:
* concert-this 'artist/band name here'
  - The concert-this command takes in an artist/band name and returns a list of upcoming concerts.
  - The results include the Venue, Location, and date.

    ![Concert-this command example](example-images/concert-this-command.png)

    ![Concert-this output example](example-images/concert-this-output.png)

* spotify-this-song 'song name here'
  - The spotify-this-song command takes in a song name and returns the top result from spotify.
  - The result includes: Artist(s), Song Name, Preview Link, Album

    ![Spotify-this-song command example](example-images/spotify-this-song-command.png)

    ![Spotify-this-song output example](example-images/spotify-this-song-output.png)

  - The spotify-this-song command defaults to 'The Sign' if a song is not given.

    ![Spotify-this-song command example with no song given](example-images/spotify-this-song-empty-command.png)

    ![Spotify-this-song output example with no song given](example-images/spotify-this-song-empty-output.png)

* movie-this 'movie name here'
  - The movie-this command takes in movie name and returns the top result from OMDB.
  - The result includes: Title, Ratings, Country, Language, Plot, and Actors.

    ![Movie-this command example](example-images/movie-this-command.png)

    ![Movie-this output example](example-images/movie-this-output.png)

  - The movie-this command defaults to 'Mr. Nobody' if a movie is not given.
  
    ![Movie-this command example with no movie given](example-images/movie-this-empty-command.png)

    ![Movie-this output example with no movie given](example-images/movie-this-empty-output.png)

* do-what-it-says
  - The do-what-it-says command reads a random.txt file, and runs each command contained within.

    ![Random.txt contents](example-images/random-contents.png)

    ![Do-what-it-says command example](example-images/do-what-it-says-command.png)

    ![Do-what-it-says output example](example-images/do-what-it-says-output.png)

### LIRI Bot also outputs all commands and results in a log file.

  ![Log file for all commands shown](example-images/log-file.png)

This project is meant to demonstrate our proficiency with node to create a command line app that uses node packages to retrieve data and output it.

### *Ben Houston designed and created this LIRI Bot for his coding bootcamp.*