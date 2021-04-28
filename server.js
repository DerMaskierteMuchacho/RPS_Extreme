'use strict';

const express = require("express");
const path = require("path");
const redis = require("redis");
const jwt = require("jsonwebtoken");

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const password = "imaseriousplayer";

// App
const app = express();

const redisClient = redis.createClient({
    host: 'redis-server',
    port: 6379,
});

redisClient.on('connect', function() {
    console.log('connected');
});

app.use(express.static(path.resolve('public')));

let currentPlayer;

app.get('/', (req, res) => {
    jwt.verify(req.query.authKey, password, function(err, _) {
        if(err) {
            res.send("Authentication failed!");
        }
        else {
            res.sendFile(path.join(__dirname + '/View/index.html'));
        }
    })
});

app.get('/play', function (req, res) {
    let game = req.query.playerHand;
    if (game.outcome === "Gewonnen") {
        redisClient.get(req.query.playerName, function(err, reply) {
            redisClient.set(parseInt(reply) + 1); })
    }
    res.send(playGame(req.query.playerHand));
});

app.get('/ranking', function (req, res) {
    // get sorted ranking from redis and return as array of players
});

app.get('/player', function (req, res) {
    // get player or create if not exists
    let playerName = req.query.playerName;
    currentPlayer = new Player(playerName, redisClient.get(playerName))
});

app.get('/test', function (req, res) {
    redisClient.set('framework', 'AngularJS', function(err, reply) {
        console.log(reply);
    });
});

app.get('/test2', function (req, res) {
    redisClient.get('framework', function(err, reply) {
        console.log(reply);
    });
});

const textValMappings = {"Stein": 0, "Papier": 1, "Schere": 2};
const valTextMappings = {0: "Stein", 1: "Papier", 2: "Schere"};
const NUMBER_OF_PICKS = 3;

function playGame(playerHand) {
    const enemyPickVal = Math.round(Math.random() * 2);
    const outcomeText = evaluateGame(textValMappings[playerHand], enemyPickVal);
    return new Game(outcomeText, playerHand, valTextMappings[enemyPickVal]);
}

function evaluateGame(yourPick, enemyPick) {
    if (yourPick === enemyPick) {
        return "Unentschieden";
    } else if ((yourPick + 1) % NUMBER_OF_PICKS === enemyPick) {
        return "Verloren";
    } else {
        return "Gewonnen";
    }
}

class Game {
    constructor(outcome, yourPick, enemyPick) {
        this.outcome = outcome;
        this.yourPick = yourPick;
        this.enemyPick = enemyPick;
    }
}

class Player {
    constructor(name, wins) {
        this.name = name;
        if (wins === undefined) {
            this.wins = 0;
        } else {
            this.wins = wins;
        }
    }
    rank;
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);