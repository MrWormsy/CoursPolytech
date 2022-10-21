const express = require("express");
const {printSession} = require("../middlewares/index.js");
const {createUser, deleteUser, readAllUsers, readUser, updateUser} = require("../controllers/users.js");

// On crée le router de l'api
const apiRouter = express.Router();

/**
 * Route ping où on ajoute le middleware qui va nous montrer ce qu'il y a dans la session
 */
apiRouter.get('/ping', printSession, function (req, res) {
    res.json({
        status: "OK",
        timestamp: (new Date()).getTime()
    });
});


/**
 * Créer un utilisateur
 */
apiRouter.post('/user', async (req, res) => {

    // On crée l'utilisateur
    const utilisateurCree = await createUser(req.body);

    // Pour tester la session on peut dire que le dernier utilisateur créé ira dans la session
    req.session.dernierUtilisateur = utilisateurCree;

    // On renvoie l'utilisateur créé !
    res.json(utilisateurCree);
});

/**
 * Récupère un utilisateur par rapport à son id
 */
apiRouter.get('/user/:userId', async (req, res) => {
    res.json(await readUser(req.params.userId));
});

/**
 * Modifie un utilisateur par rapport à son id et le contenu de la requête
 */
apiRouter.put('/user/:userId', async (req, res) => {
    res.json(await updateUser(req.params.userId, req.body));
});

/**
 * Supprime un utilisateur par rapport à son id
 */
apiRouter.delete('/user/:userId', async (req, res) => {
    res.json(await deleteUser(req.params.userId));
});

/**
 * Récupère tous les utilisateurs
 */
apiRouter.get('/users', async (req, res) => {
    res.json(await readAllUsers());
});

/**
 * Renvoie ce qui se trouve dans la session
 */
apiRouter.get('/session', (req, res) => {
    res.json(req.session);
});

/**
 * Détruis la session
 */
apiRouter.delete('/session', (req, res) => {

    // S'il n'y a pas de session, on renvoie un message
    if (req.session === undefined) {
        res.json("Il n'y a pas de session à détuire")
    }

    // Si elle est existe alors on peut la détruire
    else {
        req.session.destroy()
        res.json("La session a été détruite !");
    }
});

// On exporte seulement le router
module.exports = apiRouter;