const express = require('express');
const router = express.Router();
const axios = require("axios");

// Cette forme d'import permet d'importer plusieurs éléments en même temps du fichier middlewares
const {printAnatomy, hello} = require("../middlewares");

// On veut que l'user "/" requêtée avec la méthode HTTP GET nous renvoie de la donnée
// req est la requête express où on peut avoir tout un tas d'informations sur les headers, le body de la requête, les cookies ect.
// res est la réponse express qui sera utilisée pour renvoyer ce qu'on veut et en l'occurrence ici un object json grâce à l'instruction res.json
// next est une fonction du routeur Express qui, lorsqu'elle est invoquée, exécute le middleware qui succède au middleware actuel. On l'utilisera plus tard
router.get('/', function (req, res, next) {

    // If faut penser le res.json(...) comme un "return" pour retourner la réponse avec de la donnée en retour,
    // s'il n'y a pas de res.json la réponse ne pourra jamais se finir, car le code ne saura pas quoi faire pour "libérer" la réponse
    res.json({
        status: "done",
        timestamp: Date.now()
    });
});

// Route pour avoir mon prénom
router.get('/me', function (req, res, next) {
    res.json("Antonin");
});

// Route pour envoyer une chaine quelconque
router.get('/get', function (req, res, next) {
    res.json("Antonin");
})

// Route pour renvoyer un object, dans un object, dans un object, dans un object
router.post('/post', function (req, res, next) {
    res.json({
        key1: {
            key2: {
                key3: {
                    key4: "Hello"
                }
            }
        }
    });
})

// Route pour renvoyer la date en mode Jour/Mois/Année
router.put('/put', function (req, res, next) {
    const theDate = new Date();
    res.json(`${theDate.getDate()}/${theDate.getMonth()}/${theDate.getFullYear()}`)
})

// Route pour renvoyer true si le nombre actuel de milliseconds est pair et false sinon
router.delete('/delete', function (req, res, next) {
    res.json(Date.now() % 2 === 0)
})

// Le paramètre ou slug peut avoir à peu près n'importe quel nom
// et doit être forcement précédé de ': puis une chaine de caractère sans espaces
router.get('/etudiant/:numEtu', function (req, res, next) {
    // Pour accèder au paramètre on peut le retrouver directement dans les
    // paramètres de la requête
    res.json(`Le numéro étudiant est récupéré et est: ${req.params.numEtu}`);
});

// On veut renvoyer une chaine de caractère avec de la donnée envoyée dans le body de la requête POST
router.post('/etudiant', function (req, res, next) {

    /*
    Pour accèder à de la donnée JSON à l'intérieur du body de la requête on peut tout simplement récupérer
    req.body qui est en fait un object JSON avec ce qu'on lui a donné lors de la requête (si on ne lui donne
    rien alors il sera juste vide: {})
    */
    res.json(`L'étudiant ${req.body.nameEtu} avec le numéro étudiant ${req.body.numEtu} a été crée !`)
});

/** Le numéro étudiant de Didier */
const numEtuDeDidier = 68105105101114;

/*
On crée une nouvelle route qui va appeler l'user `/api/etudiant/:numEtu` de notre API où numEtu sera 68105105101114 pour trouver Didier !
 */
router.get('/trouverdidier', function (req, res, next) {

    // On fait l'appel à notre propre API avec axios
    axios.get(`http://localhost:3000/api/etudiant/${numEtuDeDidier}`)

        // Si la requête est correcte est qu'il n'y a pas eu d'erreur, on renvoie la donnée trouvée avec une chaine de caractères
        .then(function (response) {
            res.json(`L'API pour trouvé Didier a bien marché et on a reçu ça comme réponse: "${response.data}"`);
        })

        // Si il y a une erreur alors on la renvoie avec du texte
        .catch(function (error) {
            res.json(`Didier n'a pas pû être trouvé à cause de l'erreur: ${error.message}`);
        })

    // On n'utilise pas res.json ici, car on veut que la réponse soit rendue seulement quand la donnée a été récupérée dans le .then ou dans le .catch...
})

/*
Bien que la façon de faire plus haut fonctionne très bien, il y a une autre façon beaucoup plus compacte et à privilégier, la syntax async / await
https://www.pierre-giraud.com/javascript-apprendre-coder-cours/async-await/
On met bien le async devant la fonction qui deviendra une promesse et le await devant la promesse qui sera exécutée,
La valeur renvoyée à gauche du await sera la réponse de axios et pourra être utilisé de la même façon que dans une .then
On utilise un try/catch pour récupérer une erreur potentielle

Cette notation sera utilisée tout au long des TD/TP et nous sera indispensables pour faire des appels aux bases de données ou faire des gros calculs
 */
router.get('/trouverdidier2', async function (req, res, next) {
    try {
        // On fait l'appel à notre propre API avec axios
        const response = await axios.get(`http://localhost:3000/api/etudiant/${numEtuDeDidier}`);
        res.json(`L'API pour trouvé Didier a bien marché et on a reçu ça comme réponse: "${response.data}"`);
    }

        // S'il y a une erreur alors on la renvoie avec du texte
    catch (error) {
        res.json(`Didier n'a pas pû être trouvé à cause de l'erreur: ${error.message}`);
    }
})

/*
Ici je veux appeler les 4 users quand je veux accéder à l'user "/api/all"
 */
router.post('/all', async function (req, res, next) {
    try {
        // On fait l'appel à notre propre API avec axios pour les 4 users
        // Pour rappel mon body ressemble à ça:
        /*
        {
            get: "Hello",
            post: {
                "hello": "test",
                "bye": "no"
            },
            putParam: 1234567890000,
            putBody: 1234567890,
            delete: "1234"
        }
         */

        // Pour la requête get on met la valeur de "req.body.get" dans l'URL comme paramètre
        const responseGet = await axios.get(`http://localhost:3000/v2/api/get/${req.body.get}`);

        // Pour la requête post on lui donne comme valeur de body, l'object qui se trouve dans "req.body.post"
        const responsePost = await axios.post(`http://localhost:3000/v2/api/post`, req.body.post);

        // Pour la requête put on donne un paramètre et un object dans le body
        const responsePut = await axios.put(`http://localhost:3000/v2/api/put/${req.body.putParam}`, {timestamp: req.body.putBody});

        // Pour la requête delete on donne juste un paramètre
        const responseDelete = await axios.delete(`http://localhost:3000/v2/api/delete/${req.body.delete}`);

        // On peut voir qu'on a attendue que chaque requête soit faite les unes à la suite des autres grâce au mot clef await car axios.get,post,put,delete renvoie
        // Une promesse qui a besoin d'être attendue.

        // On renvoie l'object avec les données une fois qu'on a attendue les 4 requêtes, attention les réponses renvoyées par axios sont des objects réponse et comme
        // il nous faut que la donnée renvoyée on veut cette donnée qui se trouve à la clef data de la réponse !
        res.json({
            get: responseGet.data,
            post: responsePost.data,
            put: responsePut.data,
            delete: responseDelete.data,
        })
    }

        // S'il y a une erreur alors on la renvoie avec du texte
    catch (error) {
        res.json(`Il y a eu des erreurs !!!\n${error.message}`);
    }
});


/*
# Exercice 5.2
Ici on a créé une simple route sur "/anatomy", mais nous avons ajouté une fonction entre la route et la fonction du routeur, cette fonction est un middleware qui permet
de faire des actions avant de réaliser celles qui se trouvent dans la fonction du routeur.
Vous pouvez ajouter autant de middlewares que vous le désirez, les uns à la suite des autres !
 */
router.get('/anatomy', printAnatomy, hello, function (req, res, next) {

    // On veut juste renvoyer un petit texte car le gros du travail sera fait dans le middleware "printAnatomy"
    res.json("L'anatomie a été logguée");
})


// Utilisé pour exporter le router comme module
module.exports = router;
