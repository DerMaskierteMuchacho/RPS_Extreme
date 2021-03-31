'use strict';

const express = require('express');
const path = require('path');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
let random = Math.random();
const app = express();
app.use(express.static(path.resolve('public')));
//app.use(noteRoutes);
app.get('/', (req, res) => {
    //res.send('Hello World' + random),
    res.sendFile(path.join(__dirname+'/View/index.html'))
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);