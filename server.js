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
    console.log('Connected to redis-server');
});

app.use(express.static(path.resolve('public')));

app.get('/', (req, res) => {
    jwt.verify(req.query.authKey, password, function(err, _) {
        if(err) {
            res.sendFile(path.join(__dirname + '/public/img/authentication failed.png'));
        }
        else {
            res.sendFile(path.join(__dirname + '/view/index.html'));
        }
    })
});

app.get('/play', function (req, res) {
    let playerHand = req.query.playerHand;
    let playerName = req.query.playerName;
    let game = playGame(playerHand);

    if (game.outcome === "Gewonnen") {
        redisClient.get(playerName, function(err, reply) {
            if (err) console.log(err);
            redisClient.set(playerName, reply + 1); })
    }
    res.send(game);
});

app.get('/players', function (req, res) {
    let playerNames = [];
    redisClient.keys('*', function(err, keys) {
        if (err) console.log(err);
        Promise.all(keys.map(key => playerNames.push(key))).then(_ => {
            res.send(playerNames);
        });
    });
});

app.get('/player', async function (req, res) {
    await createPlayerIfNotExists(req.query.playerName);
    res.status(200).send("succes");
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

async function createPlayerIfNotExists(playerName) {
    await redisClient.exists(playerName, function(err, reply) {
        if (err) console.log(err);
        if (reply !== 1) {
            redisClient.set(playerName, '0');
        }
    });
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
        this.wins = wins;
    }
    rank;
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);