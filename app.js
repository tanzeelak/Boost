var request = require('request');var searchUrl1 = "https://api.spotify.com/v1/search?q='happy'&limit=1&type=playlist";
var google = require('googleapis');
var plus = google.plus('v1');

// var searchUrl2 = "https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=AIzaSyCjQo35O-ovuHaqOUuiJJDbY4k55Udea6A&part=snippet,contentDetails,statistics,status"
var searchUrl2 = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&playlistId=PL4ziQDgKv4ErEK9Ey_qziU0IvtXNmwjzO&key=AIzaSyCjQo35O-ovuHaqOUuiJJDbY4k55Udea6A"



var mood = 'happy';
var keyword = mood + ' mood song';

var search = require('youtube-search');

var opts = {
  maxResults: 10,
  key: 'AIzaSyCjQo35O-ovuHaqOUuiJJDbY4k55Udea6A'
};

// search(keyword, opts, function(err, results) {
//   if(err) return console.log(err);
//
//   var randSong = Math.floor(Math.random() * 10);
//   var playlistHref = results[randSong].link
//
//   console.dir(results)
//   console.dir(playlistHref);
// });

// function init(){
//     gapi.client.setApiKey("AIzaSyCjQo35O-ovuHaqOUuiJJDbY4k55Udea6A");
//     gapi.client.load("youtube", "v3", function() {
//
//     });
// }
//
// // After the API loads, call a function to enable the search box.
// function handleAPILoaded() {
//   $('#search-button').attr('disabled', false);
// }
//
// // Search for a specified string.
//
//
// function search(value) {
//   // var q = $('#query').val();
//   var q = value;
//   console.log(q);
//   var request = gapi.client.youtube.search.list({
//     // q: encodeURIComponent($('#search').val()).replace('/%20/g', '+'),
//     q: q,
//     part: 'snippet',
//     type: 'video',
//     maxResults: 3,
//     order: 'viewCount'
//   });
//
//   request.execute(function(response) {
//     var str = JSON.stringify(response.result);
//     $('#search-container').html('<pre>' + str + '</pre>');
//     console.log(response);
//   });
// }

request(searchUrl2, function (error, response, body) {
  if (!error && response.statusCode == 200) {



    //   console.log(body);

      var vidId, playListId, parsedBody, ytUrl;
      parsedBody = JSON.parse(body);
      vidId = parsedBody.items[0].snippet.resourceId.videoId;
    //   playlistId = parsedBody.items[0].snippet.playlistId;
      console.log(vidId);
    //   console.log(playlistId);
      ytUrl = "https://www.youtube.com/watch?v=" + vidId;
      console.log(ytUrl);


//    linkOfPlaylist = JSON.parse(body).playlists.href;
//    console.log(linkOfPlaylist);
    // foodPicUrl = JSON.parse(body).recipes[0].image_url;
    // console.log("HELLYE");
    // var html = '';
  }

  // scrape(recipeUrl, {
  //    description: "li"
  // }, (err, data) => {
  //   //   console.log(err || data);
  //     ingredients = data.description.split(',').map(function(item){
  //         var arr = item.split(' ')
  //         return arr[arr.length - 1]
  //     });
  //
  //     console.log(ingredients);
  //
  //
  //   //   ingredients = JSON.parse(data);
  //   //   console.log(ingredients);
  // });

});
