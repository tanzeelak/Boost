//Import Modules
var restify = require('restify');
var builder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');
var sentimentService = require('./analyzeResponse');
var songService = require('./findsong');
var search = require('./getImageSearch');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bot Intents
//=========================================================
var intents = new builder.IntentDialog();
bot.dialog('/', intents);


var link, song_title, picURL;
intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.beginDialog('/boost1');
        next();
    },
    function (session, results){
        sentimentService.analyzeSentiment(session.userData.stringToAnalyze).then(function (score) {
        console.log(score);
        if (score >= 50){
          songService.selectSong(score).then(function (song_info) {
            console.log(link);
            link = song_info[0];
            picURL = song_info[1];
            song_title = song_info[2];
            var cardh = createHappyCard(session);
            var msgh = new builder.Message(session).addAttachment(cardh);
            session.send(msgh);
            session.beginDialog('/happy');
          }).catch(function (error) {
            console.error(error);
          });

        } else if (score < 50) {
          songService.selectSong(score).then(function (song_info) {
            console.log(link);
            link = song_info[0];
            picURL = song_info[1];
            song_title = song_info[2];
            var cards = createSadCard(session);
            var msgs = new builder.Message(session).addAttachment(cards);
            session.send(msgs);
            session.send("I hope I was able to brighten your day!");
        }).catch(function (error) {
          console.error(error);
        });
        }
    }).catch(function (error) {
        console.error(error);
    });
    sentimentService.analyzeKeyTopic(session.userData.stringToAnalyze).then(function (topic) {
          console.log(topic);
          if(topic != ""){
            session.send("Tell me more about the " + topic);
          }

        }).catch(function (error) {
          console.error(error);
        });

    }
]);

intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);



intents.matches(/^song/i,[
    function (session, results){
        var card = createSongCard(session);
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
    }
]);


//=========================================================
// Bot Dialogs
//=========================================================

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

bot.dialog('/boost1', [
    function (session) {
        session.send('Hello, %s! I\'m here to BOOST your mood! :D', session.userData.name);
        builder.Prompts.text(session, 'How are you feeling?');
    },
    function (session, results) {
        session.userData.stringToAnalyze = results.response;
        session.endDialog();
    }
]);

bot.dialog('/boost2', [
    function (session) {
        builder.Prompts.text(session, 'What did you do today?');
    },
    function (session, results) {
        session.userData.stringToAnalyze = results.response;
        session.endDialog();
    }
]);

bot.dialog('/happy', [
    function(session){
        session.send("cool");
        // rand = "neat"
        // session.send("Look what I found, isn't it %s?", rand);
        // var cardh = createHappyCard(session);
        // var msgh = new builder.Message(session).addAttachment(cardh);
        // session.send(msgh);

        var card = search.imageSearch("funny memes").then(function (urlresult) {
          
        var imgURL = urlresult.slice(0, urlresult.length - 15);
        // var imgURL = urlresult;
        console.log(imgURL);
          var imgDisp = new builder.HeroCard(session)
            .title('memez')
            .subtitle('lmao')
            .text('eyyy')
            .images([
                builder.CardImage.create(session, imgURL)
            ])
            .buttons([]);

            var msg =  new builder.Message(session).addAttachment(imgDisp);
            session.send(msg);
        }).catch(function (error) {
          console.error(error);
        });

        
    }
]);

//=========================================================
// Bot Functions
//=========================================================
function createHappyCard(session) {
    session.send("Glad to hear that you're feeling good today! :)");
    var str1 = 'YouTube Link: ';
    var title = str1.concat(link);
    return new builder.HeroCard(session)
        .title(song_title)
        .subtitle('Boost your mood with a song!')
        .text('Click on the link below:')
        .images([
            builder.CardImage.create(session, picURL)
        ])
        .buttons([
            builder.CardAction.openUrl(session, link, title)
        ]);
}

function createFunnyCard(session) {
    console.log("mark4");
    search.imageSearch("funny memes").then(function (urlresult) {
          
        //var imgURL = urlresult.slice(0, urlresult.length - 15);
        var imgURL = "http://www.bing.com/cr?IG=7E952BACA994473DA6F9B92566698324&CID=25EF1EA32A1C64213D0914FC2B436549&rd=1&h=E_T3jWxvbGD1luWzJrJrs1vVh7rUFJ6425v2F6FJfuo&v=1&r=http%3a%2f%2fs5.favim.com%2forig%2f74%2ffunny-kids-funny-memes-funny-quotes-and-sayings-funny-images-funny-pictures-Favim.com-753774.jpg";
        console.log(imgURL);
          return new builder.HeroCard(session)
            .title('memez')
            .subtitle('lmao')
            .text('eyyy')
            .images([
                builder.CardImage.create(session, imgURL)
            ])
            .buttons([builder.CardAction.openUrl(session, imgURL, 'blah')]);

        }).catch(function (error) {
          console.error(error);
        });
}

var quotes = ["Vince Lombardi once said, 'It's not whether you get knocked down, it's whether you get up.'",
                "Helen Keller once said, 'Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence.'",
                "Thomas Edison tested over 3,000 types of lightbulbs, and is known for saying that 'Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.'",
                "Eleanor Roosevelt once said, 'With the new day comes new strength and new thoughts.'",
                "'Start where you are. Use what you have. Do what you can.' - Arthur Ashe",
                "Maya Angelou once said, 'We may encounter many defeats but we must not be defeated.'"];

function displayRandQuote(session) {
    index = Math.floor(Math.random() * quotes.length);
    rand_quote = quotes[index];
    session.send("%s", rand_quote);
    session.send("Don't be too hard on yourself.");
}

function createSadCard(session) {
    session.send("Aww, sorry to hear that you're feeling down :(");
    displayRandQuote(session);
    return new builder.HeroCard(session)
        .title('Song')
        .subtitle('Boost your mood with a song!')
        .text('Click on the link below:')
        .images([
            builder.CardImage.create(session, picURL)
        ])
        .buttons([
            builder.CardAction.openUrl(session, link, title)
        ]);
}
