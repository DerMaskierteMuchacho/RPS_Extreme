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
    res.sendFile(path.join(__dirname+'/View/index.html'))
});

app.get('/play', function(req, res) {
    let result = {outcome: "Verloren",
                  playerName : req.query.playerName,
                  playerHand: req.query.playerHand };
    res.send(result);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);