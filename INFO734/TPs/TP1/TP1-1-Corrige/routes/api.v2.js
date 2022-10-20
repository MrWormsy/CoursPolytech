const express = require('express');
const router = express.Router();

/**
 * Fonction pour transformer un string en hexadécimal
 * @param str Le string à convertir
 * @return Le string converti
 */
function toHex(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += str.charCodeAt(i).toString(16);
    }
    return result;
}

/*
Ici on veut récupérer le paramètre param1 pour le transformer en hexadécimal
 */
router.get('/get/:param1', function (req, res, next) {

    // La valeur des paramètres est stockée dans "req.params"
    res.json(toHex(req.params.param1));
})

/*
Ici on veut inverser les clefs et les valeurs du body reçu dans notre requête POST
 */
router.post('/post', function (req, res, next) {

    // On crée un object vide
    const obj = {};

    // On veut avoir toutes les clefs du body avec for (... in ...)
    for (let key in req.body) {

        // Puis on dit que les clefs de notre nouvel object sont les valeurs de l'ancien object et les valeurs du nouvel object sont les clefs de l'ancien
        obj[req.body[key]] = key;
    }

    // On renvoie le nouvel object avec les clefs inversées
    res.json(obj);
})

/*
On veut additionner deux dates et le plus simple en JS pour faire transiter de la donnée sous forme de dates c'est sous forme de nombre, on appelle ça un timestamp: https://fr.wikipedia.org/wiki/Heure_Unix
 */
router.put('/put/:timestamp', function (req, res, next) {

    // On veut créer une date à partir du timestamp récupéré dans les paramètres
    const dateFromTimestamp = new Date(+req.params.timestamp);

    // On veut créer une date à partir du timestamp récupéré dans le body
    const dateFromBody = new Date(+req.body.timestamp);

    // On veut additionner les timestamps des deux dates (.getTime() nous donne le timestamp) pour en créer une nouvelle
    const theDate = new Date(dateFromTimestamp.getTime() + dateFromBody.getTime())

    // On renvoie la date formatée
    res.json(`${theDate.getDate()}/${theDate.getMonth()}/${theDate.getFullYear()}`)
})

/*
On veut soit renvoyer null si le paramètre est une chaîne de caractère et ne peux pas être un nombre ou true si le paramètre est un nombre pair et false sinon
 */
router.delete('/delete/:param1', function (req, res, next) {

    // Pour vérifier si il y a potentiellement un nombre dans la chaîne de caractère on utilise la fonction isNaN qui renvoie true si la chaine de caractères ne peut pas être un nombre et false sinon
    if (isNaN(+req.params.param1)) {
        res.json(null);
    } else {
        res.json((+req.params.param1 % 2) === 0);
    }
})

/* ========== ETUDIANT ========== */

// Une liste qui va agir comme une base de données où les données seront sous la forme
/*
{
    "nom": string,
    "prenom": string,
    "numEtu": number
}
 */
let baseDeDonne = [];

/*
On veut trouver un étudiant suivant son numEtu
 */
router.get('/etudiant/:num', function (req, res, next) {

    // On veut parcourir la boucle avec l'expression for (... of ...) pour itérer TOUS les éléments de la liste jusqu'à trouver l'étudiant qui a le numéro d'étudiant que l'on cherche !
    let etudiantTrouve;
    for (const etudiant of baseDeDonne) {

        // Si le numEtu de l'étudiant actuel est celui que l'on cherche, on l'affecte à etudiantTrouve
        if (etudiant.numEtu === +req.params.num) {
            etudiantTrouve = etudiant;
        }
    }

    // On renvoie l'étudiant trouvé
    res.json(etudiantTrouve);
});

/*
On veut créer un étudiant suivant son nom, son prénom et son numEtu
 */
router.post('/etudiant', function (req, res, next) {

    // On récupère les infos données dans le body
    const etudiantACreer = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        numEtu: req.body.numEtu,
    };

    // On ajoute cet étudiant à la liste
    baseDeDonne.push(etudiantACreer);

    // On renvoie l'étudiant trouvé
    res.json(etudiantACreer);
});

router.put('/etudiant/:num', function (req, res, next) {

    const nouvelleBaseDeDonne = [];
    let etudiantTrouve;

    // On veut parcourir la boucle avec l'expression for (... of ...) pour itérer TOUS les éléments de la liste jusqu'à trouver l'étudiant qui a le numéro d'étudiant que l'on cherche !
    for (const etudiant of baseDeDonne) {

        // Si le numEtu de l'étudiant actuel est celui que l'on cherche, on l'affecte à etudiantTrouve
        if (etudiant.numEtu === +req.params.num) {

            // Si les champs sont définis alors on les modifie (attention si on ne fait pas de test pour savoir si la valeur n'est pas définie alors on peut écraser des infos potentiellement importantes)
            if (req.body.nom !== undefined) {

                // On met à jour cette info de l'étudiant qu'on voulait modifier
                etudiant.nom = req.body.nom;
            }

            if (req.body.prenom !== undefined) {

                // On met à jour cette info de l'étudiant qu'on voulait modifier
                etudiant.prenom = req.body.prenom;
            }

            if (req.body.numEtu !== undefined) {

                // On met à jour cette info de l'étudiant qu'on voulait modifier
                etudiant.numEtu = req.body.numEtu;
            }

            // On a l'étudiant trouvé qu'on va renvoyer
            etudiantTrouve = etudiant;
        }

        // On ajoute cet étudiant à notre nouvelle base de donnée, car les infos ont changé !
        nouvelleBaseDeDonne.push(etudiant);
    }

    // On dit la base de données est la nouvelle base de données, car des infos ont changé
    baseDeDonne = nouvelleBaseDeDonne;

    // On renvoie l'étudiant trouvé
    res.json(etudiantTrouve);
});

router.delete('/etudiant/:num', function (req, res, next) {

    const nouvelleBaseDeDonne = [];
    let etudiantTrouve;

    // On veut parcourir la boucle avec l'expression for (... of ...) pour itérer TOUS les éléments de la liste jusqu'à trouver l'étudiant qui a le numéro d'étudiant que l'on cherche !
    for (const etudiant of baseDeDonne) {

        // Si le numEtu de l'étudiant actuel est celui que l'on cherche, on l'affecte à etudiantTrouve
        if (etudiant.numEtu === +req.params.num) {
            etudiantTrouve = etudiant;
        }

        // Comme on veut supprimer l'étudiant de notre base de données on ne rajoute que les étudiants qui ne sont pas celui que l'on cherche dans la nouvelle base
        else {
            // On ajoute cet étudiant à notre nouvelle base de donnée, car les infos ont changé !
            nouvelleBaseDeDonne.push(etudiant);
        }
    }

    // On dit la base de données est la nouvelle base de données, car des infos ont changé
    baseDeDonne = nouvelleBaseDeDonne;

    // On renvoie l'étudiant trouvé
    res.json(etudiantTrouve);
});

/*
On veut renvoyer TOUS les étudiants
 */
router.get('/etudiants', function (req, res, next) {
    res.json(baseDeDonne);
});

// Utilisé pour exporter le router comme module
module.exports = router;
