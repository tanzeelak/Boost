var request = require('request');
//var searchUrl1 = "https://api.spotify.com/v1/search?q='happy'&limit=1&type=playlist";
var google = require('googleapis');
var plus = google.plus('v1');

// var searchUrl2 = "https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=AIzaSyCjQo35O-ovuHaqOUuiJJDbY4k55Udea6A&part=snippet,contentDetails,statistics,status"
//var searchUrl2 = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&playlistId=PL4ziQDgKv4ErEK9Ey_qziU0IvtXNmwjzO&key=AIzaSyCjQo35O-ovuHaqOUuiJJDbY4k55Udea6A"
var searchUrl2;


var mood;
var keyword = mood + ' mood song';
var playlistHref, wat, playlistId;
var search = require('youtube-search');

var opts = {
  maxResults: 10,
  key: 'AIzaSyCQg6fG7W5mATUZopgZDkMBfQ16_Vgt834'
};




exports.selectSong = function(score){
  console.log("if state1");
    if (score >= 50)
    {
      console.log("if state");
        searchUrl2 = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&playlistId=PL4ziQDgKv4ErEK9Ey_qziU0IvtXNmwjzO&key=AIzaSyCjQo35O-ovuHaqOUuiJJDbY4k55Udea6A"
    }
    else if (score < 50)
    {
        searchUrl2 = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&playlistId=PL0B27929980B79760&key=AIzaSyCjQo35O-ovuHaqOUuiJJDbY4k55Udea6A"
    }

    return new Promise(
      function (resolve, reject) {
        request(searchUrl2, function (error, response, body) {
          console.log("request");
          console.log("please e" + searchUrl2)
          if (!error && response.statusCode == 200) {
            resolve(getURL(body));
          }
        });
      });
};

function getURL(body) {
  if (body) {
    console.log("geturl");
    var vidId, playListId, parsedBody, ytUrl, ytPic, ytTitle;
    parsedBody = JSON.parse(body);
    var randSong = Math.floor(Math.random() * 5);
    vidId = parsedBody.items[randSong].snippet.resourceId.videoId;
    ytUrl = "https://www.youtube.com/watch?v=" + vidId;
    ytPic = parsedBody.items[randSong].snippet.thumbnails.high.url;
    ytTitle = parsedBody.items[randSong].snippet.title;

    console.log(ytPic);
    console.log(ytTitle);
    return [ytUrl, ytPic, ytTitle];
  }
}
