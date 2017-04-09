//Import Modules
var restify = require('restify');
var builder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');

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

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
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

intents.matches(/boost/i, [
    function (session) {
        session.beginDialog('/boost');
    },
    function (session, results){
      session.send('the string to analyze is %s', session.userData.stringToAnalyze);
      //var score = analyzeSentiment(session.userData.stringToAnalyze);
      var score = 100;
      if (score >= 50){
          var cardh = createHappyCard(session);
          var msgh = new builder.Message(session).addAttachment(cardh);
          session.send(msgh);
      }else if (score < 50) {
          var cards = createSadCard(session);
          var msgs = new builder.Message(session).addAttachment(cards);
          session.send(msgs);
      }
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
            builder.CardAction.openUrl(session, 'https://www.youtube.com/', 'YouTube')
        ]);
}

function createSadCard(session) {
    session.send("Aww, sorry to hear that you're feeling down :(");
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
