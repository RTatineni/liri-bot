require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");

var arg_api = process.argv[2];
var spotify = new Spotify(keys.spotify);

// Displays Events given an artist namethe Bands in Town Artist Event api
if (arg_api == "concert-this") {
  var artist = "";
  if (process.argv[3] != null) {
    for (i = 3; i < process.argv.length; i++) {
      artist += process.argv[i];
    }
  } else {
    artist = process.argv[2];
  }
  getConcert(artist)
}

// Display Spotify song info
if (arg_api == "spotify-this-song") {
  var song = "";
  if (process.argv[3] != null) {
    for (i = 3; i < process.argv.length; i++) {
      song += process.argv[i] + " ";
    }
  } else {
    song = process.argv[2];
  }
  getSong(song)
}

if (arg_api == "movie-this") {
  var movie = "";
  if (process.argv[3] != null) {
    for (i = 3; i < process.argv.length; i++) {
      movie += process.argv[i] + " ";
    }
  } else {
    movie = process.argv[2];
  }
  getMovie(movie)
}

// Do what it says

if (arg_api == "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
          return console.log(err);
        }
        var output = data.split(",")
        console.log(output)
        var command = output[0]
        var query = output[1].replace('"',"").replace('"',"")
        if(command == "spotify-this-song"){
            getSong(query)
        }
        else if(command == "movie-this"){
            getMovie(query)
        }
        else if(command == "concert-this"){
            getConcert(query)
        }

    })
}


// Helper Functions

function getMovie(movie){
    axios
    .get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy")
    .then(function(response) {
      var title = response.data.Title;
      var year = response.data.Year;
      var imdb_rating = response.data.imdbRating;
      //console.log(response.data.Rated)
      var country = response.data.Country;
      var language = response.data.Language;
      var plot = response.data.Plot;
      var actors = response.data.Actors;

      console.log("Title: " + title);
      console.log("Year: " + year);
      console.log("IMDB Rating: " + imdb_rating);
      console.log("Rotten Tomatoes Rating: " + "");
      console.log("Country: " + country);
      console.log("Language: " + language);
      console.log("Plot: " + plot);
      console.log("Actors: " + actors);
    });
}

function getSong(song){
    spotify.search({ type: "track", query: song }).then(function(response) {
        console.log("Artist: " + response.tracks.items[0].album.artists[0].name);
        console.log("Song Name: " + response.tracks.items[0].name);
        console.log(
          "Preview Link: " + response.tracks.items[0].external_urls.spotify
        );
        console.log("Album Name: " + response.tracks.items[0].album.name);
      });
}

function getConcert(artist)
{
    axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        artist +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      for (i in response.data) {
        var name = response.data[i].venue.name;
        var location = response.data[i].venue.city;
        var date = moment(response.data[i].datetime).format("MM/DD/YYYY");
        console.log(name + ", " + location + ", " + date);
      }
    });
}