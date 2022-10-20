const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const apiRouter = require('./routes/api');
const apiRouterV2 = require('./routes/api.v2');

// On crée l'application express
const app = express();

// Utilisé pour parser le JSON, ce qui sera utile pour les API !
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// On veut ouvrir des routes sur la route principale "/api"
app.use('/api', apiRouter);

// J'ai ajouté une deuxième route principale "/v2/api" pour pouvoir avoir deux versions de mon API pour les différentes parties du TP
app.use('/v2/api', apiRouterV2);

// Le port de l'API
const port = 3000;

// On crée le serveur HTTP avec l'app
const server = http.createServer(app);

// Quand le serveur sera en train d'écouter au port donné on veut avoir un message
server.on('listening', function () {
    console.log(`Server listening on port ${port}`)
});

// On allume le serveur au port donné
server.listen(port);

// Utilisé pour exporter l'application comme module
module.exports = app;