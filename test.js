var songService = require('./findsong');

var link = songService.selectSong(90).then(function (link) {
  console.log(link);
  session.send(msgh);
}).catch(function (error) {
  console.error(error);
});
