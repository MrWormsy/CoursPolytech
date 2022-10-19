const express = require('express');
const router = express.Router();

// On veut que l'endpoint "/" requêtée avec la méthode HTTP GET nous renvoie de la donnée
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

router.get('/me', function (req, res, next) {
    res.json("Antonin");
});

router.get('/get', function (req, res, next) {
    res.json("Antonin");
})

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

router.put('/put', function (req, res, next) {
    const theDate = new Date();
    res.json(`${theDate.getDate()}/${theDate.getMonth()}/${theDate.getFullYear()}`)
})

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

// Utilisé pour exporter le router comme module
module.exports = router;
