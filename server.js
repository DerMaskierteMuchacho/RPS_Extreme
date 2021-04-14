'use strict';

const express = require('express');
const path = require('path');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.static(path.resolve('public')));
//app.use(noteRoutes);
app.get('/', (req, res) => {
    //res.send('Hello World' + random),
    res.sendFile(path.join(__dirname + '/View/index.html'))
});

app.get('/play', function (req, res) {
    res.send(playLocalGame(req.query.playerHand));
});

const textValMappings = {0: "Stein", 1: "Papier", 2: "Schere"}; //, 3: "Brunnen", 4: "Streichholz"};
const textValMappings2 = {"Stein": 0, "Papier": 1, "Schere": 2}; //, 3: "Brunnen", 4: "Streichholz"};
const NUMBER_OF_PICKS = 3;


function playLocalGame(playerHand) {
    const enemyPickVal = Math.round(Math.random() * 2);
    const outcomeText = evaluateLocalGame(textValMappings2[playerHand], enemyPickVal);
    return new Game(outcomeText, playerHand.yourPickText, textValMappings[enemyPickVal]);
}

function evaluateLocalGame(yourPick, enemyPick) {
    console.info("yourpick " + yourPick);
    console.info("enemyPick " + enemyPick);
    console.info("NUMBER_OF_PICKS " + NUMBER_OF_PICKS);
    if (yourPick === enemyPick) {
        return "Unentschieden";
    } else if ((yourPick + 1) % NUMBER_OF_PICKS === enemyPick) {
        return "Verloren";
    } else {
        //localRanking[localRanking.length - 1].wins++;
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

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);