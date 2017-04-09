//Import Modules
var restify = require('restify');
var builder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');
var sentimentService = require('./analyzeResponse');
var songService = require('./findsong');

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


var link;
intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.beginDialog('/boost');
        next();
    },
    function (session, results){
        sentimentService.analyzeSentiment(session.userData.stringToAnalyze).then(function (score) {
        console.log(score);
        if (score >= 50){
          songService.selectSong(score).then(function (link) {
            console.log(link);

            var cardh = createHappyCard(session);
            var msgh = new builder.Message(session).addAttachment(cardh);
            session.send(msgh);
          }).catch(function (error) {
            console.error(error);
          });

        } else if (score < 50) {
            var cards = createSadCard(session);
            var msgs = new builder.Message(session).addAttachment(cards);
            session.send(msgs);
        }
        session.send("I hope I was able to brighten your day!");
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

bot.dialog('/boost', [
    function (session) {
        session.send('Hello there! I\'m here to BOOST your mood! :D');
        builder.Prompts.text(session, 'How are you feeling today?');
    },
    function (session, results) {
        session.userData.stringToAnalyze = results.response;
        session.endDialog();
    }
]);

//=========================================================
// Bot Functions
//=========================================================
function createHappyCard(session) {
    session.send("Glad to hear that you're feeling good today! :)");
    return new builder.HeroCard(session)
        .title('Song')
        .subtitle('Boost your mood with a song!')
        .text('Click on the link below')
        .images([
            builder.CardImage.create(session, 'http://www.clipartkid.com/images/76/cute-smiley-face-clipart-best-p6NKfr-clipart.jpeg')
        ])
        .buttons([
            builder.CardAction.openUrl(session, "https://www.youtube.com/", 'YouTube')
        ]);
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
        .text('Click on the link below')
        .images([
            builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://www.youtube.com/', 'YouTube')
        ]);
}
