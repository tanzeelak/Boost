var request = require('request');var searchUrl1 = "https://api.spotify.com/v1/search?q='happy'&limit=1&type=playlist";
var google = require('googleapis');
var plus = google.plus('v1');

// var searchUrl2 = "https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=AIzaSyCjQo35O-ovuHaqOUuiJJDbY4k55Udea6A&part=snippet,contentDetails,statistics,status"
var searchUrl2 = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&playlistId=PL4ziQDgKv4ErEK9Ey_qziU0IvtXNmwjzO&key=AIzaSyCjQo35O-ovuHaqOUuiJJDbY4k55Udea6A"



var mood;
var keyword = mood + ' mood song';
var playlistHref, wat, playlistId;
var search = require('youtube-search');

var opts = {
  maxResults: 10,
  key: 'AIzaSyCjQo35O-ovuHaqOUuiJJDbY4k55Udea6A'
};


function selectSong(mood){
    if (mood === 'happy')
    {
        searchUrl2 = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&playlistId=PL4ziQDgKv4ErEK9Ey_qziU0IvtXNmwjzO&key=AIzaSyCjQo35O-ovuHaqOUuiJJDbY4k55Udea6A"
    }
    else if (mood === 'sad')
    {
        searchUrl2 = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&playlistId=PL0B27929980B79760&key=AIzaSyCjQo35O-ovuHaqOUuiJJDbY4k55Udea6A"
    }
}



request(searchUrl2, function (error, response, body) {
  if (!error && response.statusCode == 200)
  {
      var vidId, playListId, parsedBody, ytUrl;
      parsedBody = JSON.parse(body);
      var randSong = Math.floor(Math.random() * 10);
      vidId = parsedBody.items[randSong].snippet.resourceId.videoId;
      ytUrl = "https://www.youtube.com/watch?v=" + vidId;
      console.log(ytUrl);

}
});
