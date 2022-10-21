const express = require("express");

// On crée le router des vues
const viewsRouter = express.Router();

// On veut que lorsque l'utilisateur aille sur http://localhost:3000 le serveur lui renvoie la vue hello.ejs dans le dossier views
viewsRouter.get('/', function (req, res) {
    res.render('hello');
});

// On veut que lorsque l'utilisateur aille sur http://localhost:3000/withdata le serveur lui renvoie la vue helloWithData.ejs dans le dossier views AVEC de la donnée
viewsRouter.get('/withdata', function (req, res) {

    // On rend la vue avec l'object {data: {var1: 1, var2: "World"}} comme donnée
    res.render('helloWithData', {data: {var1: 1, var2: "World"}});
});

// On veut que lorsque l'utilisateur aille sur http://localhost:3000/rest le serveur lui renvoie la vue testAPIREST.ejs.ejs dans le dossier views
viewsRouter.get('/rest', function (req, res) {
    res.render('testAPIREST.ejs');
});

// On veut que lorsque l'utilisateur aille sur http://localhost:3000/websocket le serveur lui renvoie la vue testWebsocket.ejs.ejs dans le dossier views
viewsRouter.get('/websocket', function (req, res) {
    res.render('testWebsocket.ejs');
});

// On exporte seulement le router
module.exports = viewsRouter;