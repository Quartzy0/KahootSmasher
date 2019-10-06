const Kahoot = require("kahoot.js-updated");
const R = require("random-js");
const random = new R.Random();
const app = require('express')();
const http = require('http').createServer(app);
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('html', require('ejs').renderFile);

function summpnDaBotos(pin) {
    let i = 0;
    while (i !== 200) {
        setTimeout(function () {
            makeBot(pin, i);
        }, 100 * i);
        i++;
    }
}

http.listen(PORT, function(){
    console.log('Listening on *:' + PORT);
});

app.get('/', function (req, res) {
    res.render(__dirname + "/public/html/okyes.html");
});

app.post('/summonDaArmy', function (req, res) {
    const pin = req.body.pin;

    if (pin!=null){
        summpnDaBotos(pin);
        res.send("ok");
    }else {
        res.send("no");
    }
});

function makeBot(pin, index) {
    const client = new Kahoot;
    let r = Math.random().toString(36).substring(7);
    client.join(pin, "bot-" + r);
    client.on("questionStart", question => {
        setTimeout(function () {
            var number = random.integer(0, 3);
            console.log("answer is " + number);
            client.answerQuestion(number);
        }, 100 * index);
    });
    client.on("feedback", () => {
        setTimeout(function () {
            console.log("Feedback Time");
            client.sendFeedback(5, 1, 1, 1);
        }, 100 * index);
    });
    client.on("disconnect", function () {
        if (client.nemeses.isKicked){
            makeBot(pin);
        }
    });
}