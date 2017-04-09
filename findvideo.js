var request = require('youtube-search');
 
var opts = {
  maxResults: 10,
  key: 'AIzaSyCQg6fG7W5mATUZopgZDkMBfQ16_Vgt834'
};

exports.selectVideo = function(keyword) {

  return new Promise(
    function (resolve, reject) {
      request(keyword, opts, function(err, results) {
        if(err) return console.log(err);
        console.dir(results);
        resolve(getURL(results));
      });
    }
  );
  
}

function getURL(body) {
  if (body) {
    console.log("geturl");
    for (var i in body) {
      if (body[i].kind != "youtube#video") continue;
      else {
        console.log(body[i].link);
        return body[i].link;
      }
    }
  }
}
