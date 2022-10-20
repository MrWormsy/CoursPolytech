# TD1-1 : Création d'une API complète pas à pas

## Le résultat final sera disponible après le TD sous le nom

## Etape #1 - Initier un projet

Pour commencer un projet en NodeJS il faut faire la commande dans le dossier de votre choix par exemple `TD1-1`

```shell
npm init
```

Et il faudra répondre à quelques questions demandées par npm:

```
package name: td1-1
version:  
description: 
entry point: app.js
test command: 
git repository: 
keywords: 
author: 
license:
```

Après avoir appuyé sur OK on aura le fichier `package.json` qui sera créé

```json
{
  "name": "td1-1",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

## Etape #2 - Ajouter le mode "dev"

On va ajouter le package `nodemon` pour faciliter nos tests

```shell
npm install nodemon
```

Et on va mettre à jour le fichier `package.json` avec les instructions

```json
"script": {
"start": "node app.js",
"dev": "nodemon app.js"
}
```

On pourra donc lancer le projet en mode production avec la commande `npm start` et on pourra le lancer en mode développement avec la commande `npm run dev`.

## Etape #3 - Ajouter ExpressJS

On install ExpressJS qui nous servira à créer une API et d'autres dépendances requises pour créer un serveur

```shell
npm install cookie-parser express morgan
```

Puis on peut créer le fichier `app.js` où la magie de l'API va se passer et on va ajouter ces lignes

```javascript
// On importe les packages
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const http = require("http");

/* ========== PARTIE SERVEUR ========== */

// On crée l'application express
const app = express();

// On configure le server
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Crée un serveur HTTP
const server = http.createServer(app);

// On allume le serveur au port 3000
server.listen(3000);

// Quand le serveur est allumé on le log
server.on('listening', function () {
    console.log("Le serveur est allumé");
});

// Si il y a une erreur on la log
server.on('error', function (error) {
    console.error(error);
});
```

Pour le moment on ne peut rien faire avec ce serveur, car nous n'avons pas défini de routes...

## Etape #4 - Création de routes

On va créer un dossier `routes` et y créer un fichier `api.js` qui sera le fichier où nous définirons les routes de notre API

```javascript
const express = require("express");

// On crée le router de l'api
const apiRouter = express.Router();

/**
 * Route ping
 */
apiRouter.get('/ping', function (req, res) {
    res.json({
        status: "OK",
        timestamp: (new Date()).getTime()
    });
});

// On exporte seulement le router
module.exports = apiRouter;
```

Il ne faut pas oublier de mettre à jour le fichier `app.js` avec la route `/api` pour permettre au serveur de router les requêtes qui commencent par `/api` vers les routes définies dans le fichier `routes/api.js`.

```javascript
...

const http = require("http");

// On importe les fichiers avec les routes
const apiRouter = require("./routes/api.js");

/* ========== PARTIE SERVEUR ========== */

// On crée l'application express
const app = express();

...

// Si il y a une erreur on la log
server.on('error', function (error) {
    console.error(error);
});

/* ========== DECLARATION DES ROUTES ========== */

// On déclare que la route de base '/api' sera utilisé comme base pour les routes du fichier routes/api.js
app.use('/api', apiRouter);
```

Maintenant bous pouvons aller sur http://localhost:3000/api/ping et nous auront une réponse !

```json
{
  "status": "OK",
  "timestamp": 1666284586989
}
```

Et si on regarde la console du serveur on peut voir que des choses se sont passées:

```log
Node.js v18.9.0
[nodemon] app crashed - waiting for file changes before starting...
[nodemon] restarting due to changes...
[nodemon] starting `node app.js`
Le serveur est allumé
GET /api/ping 200 3.996 ms - 41
```

## Etape #5 - Ajout de routes

Maintenant que nous avons créé la route ping nous allons commencer à créer notre API, dans le fichier `routes/api.js` nous allons ajouter 5 routes pour la gestion des utilisateurs :

```javascript
...

/**
 * Créer un utilisateur
 */
apiRouter.post('/user', async (req, res) => {
    res.json({});
});

/**
 * Récupère un utilisateur par rapport à son id
 */
apiRouter.get('/user/:userId', async (req, res) => {
    res.json({});
});

/**
 * Modifie un utilisateur par rapport à son id et le contenu de la requête
 */
apiRouter.put('/user/:userId', async (req, res) => {
    res.json({});
});

/**
 * Supprime un utilisateur par rapport à son id
 */
apiRouter.delete('/user/:userId', async (req, res) => {
    res.json({});
});

/**
 * Récupère tous les utilisateurs
 */
apiRouter.get('/users', async (req, res) => {
    res.json({});
});

// On exporte seulement le router
module.exports = apiRouter;
```

Une fois les routes créées nous allons créer le dossier `controllers` là où la logique métier va s'appliquer et dans ce dossier nous allons créer un fichier `users.js` où se trouveront toutes les actions à effectuer concernant les utilisateurs

```javascript
/**
 * Créer un utilisateur
 * @param user L'utilisateur à créer
 * @returns L'utilisateur crée
 */
async function createUser(user) {

}

/**
 * Lire un utilisateur par son id unique créé par MongoDB
 * @param userId L'identifiant de l'utilisateur à lire
 * @returns L'utilisateur trouvé
 */
async function readUser(userId) {

}

/**
 * Mettre à jour un utilisateur
 * @param userId L'id de l'utilisateur à mettre à jour
 * @param userToUpdate Les éléments de l'utilisateur à mettre à jour
 * @returns L'utilisateur modifié
 */
async function updateUser(userId, userToUpdate) {

}

/**
 * Supprime un utilisateur
 * @param userId L'identifiant de l'utilisateur à supprimer
 * @returns L'utilisateur qui vient d'être supprimé
 */
async function deleteUser(userId) {

}

/**
 * Récupère TOUS les utilisateurs depuis la base de données
 */
async function readAllUsers() {

}

// On exporte les modules
module.exports = {
    createUser: createUser,
    readUser: readUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    readAllUsers: readAllUsers
}
```

Pour le moment ces fonctions sont vides, mais on va vite les remplir !

## Etape #6 - Ajout des controllers

Nous allons importer et appeler les fonctions créées dans le fichier `controllers/users.js` dans le fichier `routes.js`

```javascript
const express = require("express");
const {createUser, deleteUser, readAllUsers, readUser, updateUser} = require("../controllers/users.js");

// On crée le router de l'api
const apiRouter = express.Router();

/**
 * Route ping
 */
apiRouter.get('/ping', function (req, res) {
    res.json({
        status: "OK",
        timestamp: (new Date()).getTime()
    });
});

/**
 * Créer un utilisateur
 */
apiRouter.post('/user', async (req, res) => {
    res.json(await createUser(req.body));
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

// On exporte seulement le router
module.exports = apiRouter;
```

Si à ce stade on essaie de tester notre API avec par exemple http://localhost:3000/api/users, on peut voir qu'il se ne passe rien et pire encore on a une page blanche. C'est dû au fait qu'on ne renvoie rien et notre navigateur n'aime pas ça !

Si on fait en sorte que la fonction `readAllUsers` renvoie quelque chose alors http://localhost:3000/api/users nous renverra cette chose-là !

## Etape #7 - Ajout de MongoDB

Pour pouvoir créer notre API nous avons besoin d'une base de données et nous utiliserons MongoDB où le package `mongoose` sera notre interface a le JS et MongoDB

```shell
npm install mongoose
```

On va maintenant faire en sorte de pouvoir se connecter à MongoDB et tout se fera depuis le fichier `app.js`

```javascript
...

const http = require("http");
const mongoose = require("mongoose");

// On importe les fichiers avec les routes
const apiRouter = require("./routes/api.js");

/* ========== PARTIE SERVEUR ========== */

...


// Si il y a une erreur on la log
server.on('error', function (error) {
    console.error(error);
});

/* ========== PARTIE MONGODB ========== */

// Les options à donner à MongoDB
const options = {
    keepAlive: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

// L'host, c'est-à-dire l'adresse d'où se trouve la base MongoDB
// La notation a = b || c en JS veut dire, j'affecte à a la valeur de b si elle existe (non chaine de caractère vide, non null et non undefined), sinon je prends la valeur c
// Il faut lire ça: mongoDBHost est la variable d'environnement MONGO_HOST si elle est définie sinon c'est "localhost"
const mongoDBHost = process.env.MONGO_HOST || "localhost";

/*
Connexion à Mongodb avec les options définies auparavant
- mongodb : est le protocol que MongoDB utilise pour se connecter, comme http ou ssh par exemple (ne bouge jamais)
- mongoDBHost : est l'adresse locale d'où se trouve la base de données (localhost), et si la variable d'environnement MONGO_HOST existe et n'est pas vide alors on prendra cette valeur la => utilisé pour docker
- 27017 : est le port où MongoDB écoute (c'est le port par défaut)
- maBaseDeDonnee : est le nom de la base de données, il peut être ce que vous voulez
 */
mongoose.connect(`mongodb://${mongoDBHost}:27017/maBaseDeDonnee`, options, function (err) {
    if (err) {
        throw err;
    }
    console.log('Connexion à Mongodb réussie');
});

/* ========== DECLARATION DES ROUTES ========== */

// On déclare que la route de base '/api' sera utilisé comme base pour les routes du fichier routes/api.js
app.use('/api', apiRouter);
```

Si vous n'avez pas MongoDB installé sur votre machine (qui est sûrement le cas), vous devez soit l'installer (ce qui est conseillé), soit si vous avez Docker, vous pouvez créer une base de donnée MongoDB avec Docker via la commande suivante :

```shell
# Cette commande va créer un container Docker qui a pour image une base de données MongoDB (l'image 'mongo') avec comme nom 'mongo-bdd' en mode détaché '-d' (qui permet de le faire tourner en arrière plan) où le port '27017' de votre ordinateur est mappé avec le port '27017' du container créé
docker run -d --name mongo-bdd -p 27017:27017 mongo

# Si vous voulez stopper ce container vous pouvez lancer la commande suivante
docker stop mongo-bdd

# Si vous essayez de relancer la commande du dessus pour créer le container avec la base de données il va surement vous dire que ce nom existe déjà et pour ne pas s'embêter, on va supprimer ce container par son nom 'mongo-bdd' pour pouvoir ensuite le recréer
docker rm mongo-bdd
```

Vous pouvez maintenant rallumer votre serveur et vous serez connecté à MongoDB

## Etape #8 - Ajout des models

Maintenant que MongoDB est installé et que vous savez à peu près comment ça marche nous allons créer plusieurs choses.

Nous allons créer le modèle d'un utilisateur que l'on utilisera pour effectuer les actions avec MongoDB, vous devez créer un dossier nommé `models` et dans ce dossier un fichier `index.js`

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Ce schema sera utilisé pour stocker les utilisateurs
 * @schema : User
 */
const UserSchema = new Schema({

    /**
     * Le nom de l'utilisateur
     */
    nom: {
        type: Schema.Types.String,
        required: true
    },

    /**
     * Le prénom de l'utilisateur
     */
    prenom: {
        type: Schema.Types.String,
        required: true
    },

    /**
     * L'age de l'utilisateur
     */
    age: {
        type: Schema.Types.Number,
        required: true
    },

    /**
     * Ce champ sera pour savoir quand un utilisateur a été ajouté la base de données
     * Le fait de mettre 'default: Date.now' permettra de créer ce champ sans devoir le renseigner et sera la date au moment de l'ajout du document
     */
    createdAt: {
        type: Schema.Types.Date,
        default: Date.now
    }
});

// On exporte le model
module.exports = {

    // On dit que le Model User est créé à partir du Schema UserSchema et le Model sera stocké dans la base de donnée MongoDB sous le nom "user"
    User: mongoose.model('user', UserSchema)
}
```

Une fois les modèles créés on peut commencer à implementer la logique qui ira de pair avec la base de données. Dans le fichier `controllers/users.js` nous allons importer le model `User` et remplir les différentes fonctions :

```javascript
const {getKeysNotProvided, isObjectIdStringValid} = require("../utils.js");
const {User} = require("../models/index.js");

/**
 * Créer un utilisateur
 * @param user L'utilisateur à créer
 * @returns L'utilisateur crée
 */
async function createUser(user) {

    // On regarde déjà si tous les champs de l'utilisateur sont présents
    const neededKeys = ["nom", "prenom", "age"];
    const keysNotGiven = getKeysNotProvided(neededKeys, user);

    // Si une ou plusieurs clefs ne sont pas données alors on renvoie un message d'erreur
    if (keysNotGiven.length !== 0) {
        return `Les informations suivantes ne sont pas fournies ou vides: '${keysNotGiven.join(', ')}'`;
    }

    // On peut essayer de créer l'utilisateur
    try {

        // On crée un utilisateur avec le model de MongoDB et les informations de l'utilisateur
        const userToCreate = new User(user);

        // Puis on le sauvegarde en n'oubliant pas le mot clef await qui va nous permettre d'attendre que l'utilisateur
        // soit sauvegarder pour nous le renvoyer
        return await userToCreate.save();
    }

        // S'il y a une erreur lors du processus alors on renvoie un message d'erreur
    catch (e) {
        return "Une erreur s'est produite lors de la création de l'utilisateur";
    }
}

/**
 * Lire un utilisateur par son id unique créé par MongoDB
 * @param userId L'identifiant de l'utilisateur à lire
 * @returns L'utilisateur trouvé
 */
async function readUser(userId) {

    // Vérifier si l'userId existe et est un id MongoBD valide
    if (userId === undefined || !isObjectIdStringValid(userId)) {
        return "L'id de l'utilisateur n'existe pas ou n'est pas un id MongoDB"
    }

    // On essaye de trouver l'utilisateur
    try {

        // On veut chercher un object dans la collection "User" par son identifiant MongoDB
        const userFound = await User.findById(userId);

        // Si l'utilisateur trouvé est null c'est qu'il n'existe pas dans la base de données
        if (userFound === null) {
            return "L'utilisateur n'existe pas"
        }

        // Sinon c'est qu'il existe et on le renvoie
        return userFound;
    }

        // S'il y a une erreur, on envoie un message à l'utilisateur
    catch (e) {
        return "Erreur lors de la recherche de l'utilisateur";
    }
}

/**
 * Mettre à jour un utilisateur
 * @param userId L'id de l'utilisateur à mettre à jour
 * @param userToUpdate Les éléments de l'utilisateur à mettre à jour
 * @returns L'utilisateur modifié
 */
async function updateUser(userId, userToUpdate) {

    // Vérifier si l'userId existe et est un id MongoBD valide
    if (userId === undefined || !isObjectIdStringValid(userId)) {
        return "L'id de l'utilisateur n'existe pas ou n'est pas un id MongoDB"
    }

    // Petite chose TRES importante, dans le doute où dans l'object userToUpdate se trouve une clef _id qui a été modifié par une personne malveillante
    // il faut la supprimer de l'object, car _id est un id généré automatiquement et il ne doit pas changer !

    // Attention vu qu'on ne peut pas faire confiance à l'utilisateur il faut vérifier si les champs qu'on veut modifier on bien de la donnée et qu'elle soit non vide,
    // sinon on pourrait remplacer de la donnée importante...
    if (userToUpdate.prenom === "") {
        delete userToUpdate.prenom;
    }

    if (userToUpdate.nom === "") {
        delete userToUpdate.nom;
    }

    if (userToUpdate.age === "") {
        delete userToUpdate.age;
    }

    // On essaye de modifier les informations de l'utilisateur
    try {

        // On demande à MongoDB de modifier les couples clefs/valeurs présents dans l'object userToUpdate de l'object qui a pour identifiant unique MongoDB 'userId'
        // Noter l'option {new: true} qui veut dire que MongoDB nous renverra l'object modifié et non l'object avant sa modification (car on veut renvoyer le user modifié à l'utilisateur)
        const userUpdated = await User.findByIdAndUpdate(userId, userToUpdate, {new: true});

        // Si l'utilisateur trouvé est null c'est qu'il n'existe pas dans la base de données
        if (userUpdated === null) {
            return "L'utilisateur n'existe pas et n'a donc pas pû être modifié"
        }

        // Sinon c'est qu'il existe et on le renvoie
        return userUpdated;
    }

        // S'il y a une erreur, on envoie un message à l'utilisateur
    catch (e) {
        return "Erreur lors de la modification de l'utilisateur";
    }
}

/**
 * Supprime un utilisateur
 * @param userId L'identifiant de l'utilisateur à supprimer
 * @returns L'utilisateur qui vient d'être supprimé
 */

async function deleteUser(userId) {

    // Vérifier si l'userId existe et est un id MongoBD valide
    if (userId === undefined || !isObjectIdStringValid(userId)) {
        return "L'id de l'utilisateur n'existe pas ou n'est pas un id MongoDB"
    }

    // On essaye de supprimer l'utilisateur
    try {

        // On demande à MongoDB de supprimer l'utilisateur qui a comme identifiant unique MongoDB 'userId'
        const userDeleted = await User.findByIdAndDelete(userId);

        // Si l'utilisateur trouvé est null c'est qu'il n'existe pas dans la base de données
        if (userDeleted === null) {
            return "L'utilisateur n'existe pas et n'a donc pas pû être supprimé"
        }

        // Sinon c'est qu'il existe et on le renvoie
        return userDeleted;
    }

        // S'il y a une erreur, on envoie un message à l'utilisateur
    catch (e) {
        return "Erreur lors de la suppression de l'utilisateur";
    }
}

/**
 * Récupère TOUS les utilisateurs depuis la base de données
 */
async function readAllUsers() {

    // On essaye de récupérer TOUS les utilisateurs (donc on ne met pas de conditions lors de la recherche, juste un object vide)
    try {
        return await User.find({})
    }

        // S'il y a une erreur, on renvoie un message
    catch (e) {
        return "Il y a eu une erreur lors de la recuperation des utilisateurs";
    }
}

// On exporte les modules
module.exports = {
    createUser: createUser,
    readUser: readUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    readAllUsers: readAllUsers
}
```

Vous remarquez que nous importons deux fonctions qui proviennent d'un fichier `utils.js` à la racine du projet que nous n'avons pas encore créé, alors c'est ce que nous allons faire :

```javascript
/**
 * Vérifier si une chaîne objectId est valide pour MongoDB
 * @param objectId La chaîne objectId à tester
 * @return true si la chaîne objectId est valide, false sinon
 */
function isObjectIdStringValid(objectId) {
    return new RegExp("^[0-9a-fA-F]{24}$").test(objectId);
}

/**
 * Récupérer les clés qui ne sont pas données dans l'objet ou vides
 * @param keys Les clés nécessaires
 * @param object L'objet où les clés sont censées se trouver
 */
function getKeysNotProvided(keys, object) {
    return keys.filter((key) => !object.hasOwnProperty(key) || object[key] === "");
}

// On exporte les modules
module.exports = {
    isObjectIdStringValid: isObjectIdStringValid,
    getKeysNotProvided: getKeysNotProvided
}
```

Si on essaye de tester notre API pour avoir par exemple tous les utilisateurs: http://localhost:3000/api/users, on aura comme résultat une liste vide, ce qui est normal, car aucun utilisateur existe dans notre base de données.

## Etape #9 - Utilisation de Postman

Une fois les fonctions créés nous n'avons aucun moyen de les tester... Ou presque, on peut utiliser Postman pour créer/lire/modifier/supprimer un utilisateur

## Etape #10 - Création du frontend

Maintenant que nous avons fait le backend de l'application il est temps de s'occuper du frontend. Pour faire du frontend avec ExpressJS il existe tout un tsa de libraries mais nous allons opter pour une library simple appelée `ejs`, nous l'installons
à l'aide de la commande

```shell
npm install ejs
```

Nous allons créer un fichier nommé `views.js` dans le dossier `routes` qui nous permettra de déclarer les routes qu'il faudra rendre avec `ejs`

```javascript
const express = require("express");

// On crée le router des vues
const viewsRouter = express.Router();

// On veut que lorsque l'utilisateur aille sur http://localhost:3000 le serveur lui renvoie la vue hello.ejs dans le dossier views
viewsRouter.get('/', function (req, res) {
    res.render('hello');
});

// On exporte seulement le router
module.exports = viewsRouter;
```

Puis on va créer un dossier nommé `views` qui stockera les pages webs à rendre sous le format `.ejs`, la structure est la même que celle du `html` mais il nous permet d'utiliser des variables, des boucles et tout un tas de
mécanismes: https://ejs.co/#docs

On va créer le premier fichier ejs dans le dossier `views` que l'on va appeler `hello.ejs`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello world from EJS</title>
</head>
<body>

<h1>Hello world from EJS</h1>

</body>
</html>
```

Puis dans le fichier `app.js` nous ajoutons le fait que nous voulons utiliser `ejs` pour rendre des pages web et nous importons le fichier qui contient les routes pour rendre les pages webs

```javascript
...

// On importe les fichiers avec les routes
const apiRouter = require("./routes/api.js");
const viewsRouter = require("./routes/views");

/* ========== PARTIE SERVEUR ========== */

// On crée l'application express
const app = express();

// On configure le server
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Permet de dire à Express que le moteur de "vues" (le frontend) est EJS, c'est une amélioration du HTML où on peut utiliser des variables, des boucles et tout un tas de mécanismes: https://ejs.co/#docs
app.set('view engine', 'ejs');

// Crée un serveur HTTP
const server = http.createServer(app);

...

/* ========== DECLARATION DES ROUTES ========== */

// On déclare que la route de base '/api' sera utilisé comme base pour les routes du fichier routes/api.js
app.use('/api', apiRouter);

// On déclare que la route de base '/' sera utilisé comme base pour les routes du fichier routes/views.js
app.use('/', viewsRouter);
```

Maintenant si nous nous rendons sur la page http://localhost:3000, on pourra voir que le serveur nous a rendu la page web `hello.ejs` et si nous la modifions, on pourra vérifier les changements !

On peut aussi s'amuser à ajouter la page `helloWithData.ejs`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello world from EJS</title>
</head>
<body>

<h1>Hello world from EJS</h1>
<h3>Les données reçus sont var1 = <%= data.var1 %> & var2 = <%= data.var2 %></h3>

</body>
</html>
```

On peut remarquer qu'il y a des choses qui ne sont pas présentes en HTML classique, on peut regarder la documentation pour comprendre ce que ça veut dire.

Pour accéder à cette page web, nous allons créer une route dans le fichier `routes/views.js`

```javascript
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

// On exporte seulement le router
module.exports = viewsRouter;
```

En allant sur la page http://localhost:3000/withdata on peut voir que les variables ont bien été remplacées ! Vous pouvez jouer un peu avec pour tester les différentes fonctionnalités.

## Etape #11 - Test de l'API REST

Maintenant que l'on sait créer une page web qui sera rendue par le frontend nous allons créer la page web qui nous servira pour tester notre API ! Ajoutez la page `testAPIREST.ejs` dans le dossier `views`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test de l'API REST</title>
</head>

<!-- On importe Axios -->
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

<body>

<h1>Test de l'API REST</h1>

<hr/>

<h1>Résultat du ping</h1>
<button onclick="testerLePing()">Tester le ping</button>
<p id="etatPing">Pas encore testé</p>

<hr/>

<h1>Lire tous les utilisateurs</h1>
<button onclick="readAllUsers()">Récupérer tous les utilisateurs</button>
<br/>
<br/>
<label>
    Résultat:
</label>
<br/>
<textarea disabled id="resultatReadAllUsers" style="width: 500px;height: 100px"></textarea>

<hr/>

<h1>Créer un utilisateur</h1>
<div>
    <label for="nomCreation">Nom</label>
    <br/>
    <input id="nomCreation">
    <br/>
    <label for="prenomCreation">Prénom</label>
    <br/>
    <input id="prenomCreation">
    <br/>
    <label for="ageCreation">Age</label>
    <br/>
    <input id="ageCreation" type="number">
</div>
<br/>
<button onclick="createUser()">Créer un utilisateur</button>
<br/>
<br/>
<label>
    Résultat:
</label>
<br/>
<textarea disabled id="resultatCreateUser" style="width: 500px;height: 100px"></textarea>

<hr/>

<h1>Rechercher un utilisateur</h1>
<div>
    <label for="idRead">Id de l'utilisateur</label>
    <br/>
    <input id="idRead">
</div>
<br/>
<button onclick="readUser()">Lire un utilisateur</button>
<br/>
<br/>
<label>
    Résultat:
</label>
<br/>
<textarea disabled id="resultatReadUser" style="width: 500px;height: 100px"></textarea>

<hr/>

<h1>Modifier un utilisateur</h1>
<div>
    <label for="idUpdate">Id de l'utilisateur à modifier</label>
    <br/>
    <input id="idUpdate">
    <br/>
    <br/>
    <br/>
    <label for="nomUpdate">Nom</label>
    <br/>
    <input id="nomUpdate">
    <br/>
    <label for="prenomUpdate">Prénom</label>
    <br/>
    <input id="prenomUpdate">
    <br/>
    <label for="ageUpdate">Age</label>
    <br/>
    <input id="ageUpdate" type="number">
    <br/>
</div>
<br/>
<button onclick="updateUser()">Modifier un utilisateur</button>
<br/>
<br/>
<label>
    Résultat:
</label>
<br/>
<textarea disabled id="resultatUpdateUser" style="width: 500px;height: 100px"></textarea>

<hr/>

<h1>Supprimer un utilisateur</h1>
<div>
    <label for="idDelete">Id de l'utilisateur à supprimer</label>
    <br/>
    <input id="idDelete">
</div>
<br/>
<button onclick="deleteUser()">Supprimer un utilisateur</button>
<br/>
<br/>
<label>
    Résultat:
</label>
<br/>
<textarea disabled id="resultatDeleteUser" style="width: 500px;height: 100px"></textarea>

<hr/>

</body>
</html>

<script>

    /**
     * On veut tester le ping
     */
    function testerLePing() {

        // On utilise axios pour faire une requête get au serveur et ainsi récupérer la réponse
        axios.get("http://localhost:3000/api/ping").then(function (response) {

            // On modifie la valeur du paragraph "etatPing" avec la donnée de la réponse en parsé en chaine de caractère, si on ne met pas
            // JSON.stringify(response.data) mais que response.data on aura juste ça comme réponse "[object Object]"...
            document.getElementById("etatPing").innerHTML = JSON.stringify(response.data);
        })
    }

    /**
     * On veut lire tous les utilisateurs et mettre le résultat dans le champ associé
     */
    function readAllUsers() {
        axios.get("http://localhost:3000/api/users").then(function (response) {
            document.getElementById("resultatReadAllUsers").innerHTML = JSON.stringify(response.data);
        })
    }

    /**
     * On veut créer un utilisateur et mettre le résultat dans le champ associé
     */
    function createUser() {

        // On récupère les données de l'utilisateur à créer
        const nom = document.getElementById("nomCreation").value;
        const prenom = document.getElementById("prenomCreation").value;
        const age = document.getElementById("ageCreation").value;

        axios.post("http://localhost:3000/api/user", {nom: nom, prenom: prenom, age: age}).then(function (response) {
            document.getElementById("resultatCreateUser").innerHTML = JSON.stringify(response.data);
        })
    }

    /**
     * On veut lire un utilisateur et mettre le résultat dans le champ associé
     */
    function readUser() {

        // On récupère l'id de l'utilisateur
        const userId = document.getElementById("idRead").value;

        axios.get(`http://localhost:3000/api/user/${userId}`).then(function (response) {
            document.getElementById("resultatReadUser").innerHTML = JSON.stringify(response.data);
        })
    }

    /**
     * On veut modifier un utilisateur et mettre le résultat dans le champ associé
     */
    function updateUser() {

        // On récupère l'id de l'utilisateur
        const userId = document.getElementById("idUpdate").value;

        // On récupère les données de l'utilisateur à modifier
        const nom = document.getElementById("nomUpdate").value;
        const prenom = document.getElementById("prenomUpdate").value;
        const age = document.getElementById("ageUpdate").value;

        axios.put(`http://localhost:3000/api/user/${userId}`, {nom: nom, prenom: prenom, age: age}).then(function (response) {
            document.getElementById("resultatUpdateUser").innerHTML = JSON.stringify(response.data);
        })
    }

    /**
     * On veut supprimer un utilisateur et mettre le résultat dans le champ associé
     */
    function deleteUser() {

        // On récupère l'id de l'utilisateur
        const userId = document.getElementById("idDelete").value;

        axios.delete(`http://localhost:3000/api/user/${userId}`).then(function (response) {
            document.getElementById("resultatDeleteUser").innerHTML = JSON.stringify(response.data);
        })
    }

</script>
```

Et on ajoute la route pour rendre cette page web dans le fichier `routes/views.js`

```javascript
...

// On veut que lorsque l'utilisateur aille sur http://localhost:3000/withdata le serveur lui renvoie la vue helloWithData.ejs dans le dossier views AVEC de la donnée
viewsRouter.get('/withdata', function (req, res) {

    // On rend la vue avec l'object {data: {var1: 1, var2: "World"}} comme donnée
    res.render('helloWithData', {data: {var1: 1, var2: "World"}});
});

// On veut que lorsque l'utilisateur aille sur http://localhost:3000/rest le serveur lui renvoie la vue testAPIREST.ejs.ejs dans le dossier views
viewsRouter.get('/rest', function (req, res) {
    res.render('testAPIREST.ejs');
});

// On exporte seulement le router
module.exports = viewsRouter;
```

Depuis cette page vous pouvez tester TOUTES les routes de notre API !

## Etape #12 - (NON) Merci CORS...

On a bien pû tester les routes de notre API, mais il y a un problème... Si vous essayez de copier le fichier `testAPIREST.ejs` et de remplacer le .ejs par .html, vous allez avoir un fichier HTML classique car il n'y a pas de mot ejs qui ferait que la
page ne soit pas du HTML.

Si vous essayez de lancer la page pas de soucis, mais si vous essayez d'appeler l'API rien ne marche et c'est "normal". En effet si on regarde la console de chrome, on peut voir l'erreur suivante

```log
Access to XMLHttpRequest at 'http://localhost:3000/api/ping' from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

Et bien cette erreur est pour votre sécurité et celle du site. Votre requête a été bloquée par la politique CORS (https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) qui en gros ne vous permet pas d'accéder à une ressource qui n'a pas la même
origine que le serveur.

Par exemple notre API écoute le port 3000 de localhost donc l'adresse du site est `localhost:3000`, et quand on utilise `ejs` pour rendre notre page, l'origine des requêtes est toujours `localhost:3000` car la page web a été rendue par cette adresse.
Mais si on lance le fichier `testAPIREST.html` l'origine de ce fichier ne sera plus `localhost:3000`, mais rien (`null`) car nous n'avons pas utilisé de serveur pour rendre cette page. Du coup la politique CORS s'applique et ne nous permet pas de
requêter des ressources sur la page `localhost:3000` car il y a de potentiels risques de sécurité.
C'est la même chose si vous utilisez un serveur ExpressJS uniquement pour le backend à l'adresse `localhost:3000` et si vous utilisez un serveur ExpressJS uniquement pour le frontend à l'adresse `localhost:8080`, les origines ne seront pas les mêmes
et donc vous ne pourrez pas utiliser votre API !

CORS sera votre pour cauchemar pour le développement le temps de comprendre comment il marche et de le configurer, c'est pour ça que l'on va appliquer un patch *quick and dirty* pour ne plus avoir cette erreur. MAIS ATTENTION DE NE PAS LE LAISSER EN
PRODUCTION OU VOUS AUREZ DE GROSSES FAILLES DE SECURITE !

Nous allons installer le package `cors` à l'aide de la commande

```shell
npm install cors
```

Et dans le fichier `app.js` nous allons ajouter ces lignes, qui en quelque sorte trompera le CORS en lui faisant croire que la politique de sécurité est respectée

```javascript
...

const mongoose = require("mongoose");
const cors = require("cors");

// On importe les fichiers avec les routes
const apiRouter = require("./routes/api.js");
const viewsRouter = require("./routes/views.js");

/* ========== PARTIE SERVEUR ========== */

// On crée l'application express
const app = express();

// Comme nous faisons du développement nous allons avoir des problèmes liés au CORS (https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
// Vu que l'on ne veut pas de soucis pour le développement, on va bypass cette mesure de sécurité !
app.use(cors({
    // En gros l'origin sera toujours celle qui faut pour ne plus avoir de soucis avec CORS
    origin: (requestOrigin, callback) => callback(undefined, requestOrigin),
    credentials: true
}))

// On configure le server
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

...
```

Et si on relance notre page `testAPIREST.html` nous n'avons plus de soucis ! Mais attention de garder à l'esprit que CORS doit être correctement réglé.

## Etape #13 - Redis et Session

Maintenant que nous avons notre API il nous manque quelque chose pour créer une vraie application et permettre à des utilisateurs de se connecter ou de stocker des informations sur eux, et cette chose est la session.

Pour la session nous allons utiliser le package `express-session`, pour persister la sessions nous pouvons le faire de plusieurs façons possibles, soit dans un fichier texte (très mauvais), soit avec MongoDB mais si on a une charge très très élevée
ça ne sera pas viable et nous allons donc utiliser une base de données "chaude" nommée Redis.

Nous allons donc installer `express-session`, `redis` (on bloque à la version `3.1.2` car la nouvelle version `4.x.x` ne marche pas du tout, des investigations sont en cours !) et `connect-redis` qui fera le pont entre les deux !

```shell
npm install express-session redis@3.1.2 connect-redis
```

Dans le fichier `app.js` il y aura plusieurs modifications en plus de l'import

```javascript
...

const cors = require("cors");
const session = require("express-session");
const redis = require("redis");
const connectRedis = require("connect-redis");

// On importe les fichiers avec les routes
const apiRouter = require("./routes/api.js");
const viewsRouter = require("./routes/views.js");

/* ========== PARTIE SERVEUR ========== */

...

/* ========== PARTIE REDIS ========== */

// On crée l'object qui nous permettra de gérer les sessions avec Redis
const RedisStore = connectRedis(session)

// L'host, c'est-à-dire l'adresse d'où se trouve la base Redis
// La notation a = b || c en JS veut dire, j'affecte à a la valeur de b si elle existe (non chaine de caractère vide, non null et non undefined), sinon je prends la valeur c
// Il faut lire ça: mongoDBHost est la variable d'environnement REDIS_HOST si elle est définie sinon c'est "localhost"
const redisHost = process.env.REDIS_HOST || "localhost";

// On configure le client Redis
const redisClient = redis.createClient({

    // L'adresse où se trouve la base de données Redis
    host: redisHost,

    // Le port de la base de données
    port: 6379
})

// S'il y a une erreur on veut dire laquelle
redisClient.on('error', (err) => {
    console.log("Impossible d'établir une connexion avec redis. " + err);
});

// Si la connection est un succès, on veut le dire
redisClient.on('connect', () => {
    console.log("Connexion à redis avec succès");
});

// On configure le middleware de session, ce qui servira pour ajouter un object session qui sera disponible à chaque requête
app.use(session({

    // On utilise redis pour stocker les sessions utilisateur
    store: new RedisStore({client: redisClient}),

    // C'est ce qui permet d'encoder et décoder les sessions pour des raisons de sécurité évidentes (il doit être méconnu de tous pour ne pas se faire pirater)
    secret: "JeSuisSecret!",

    // Le domain (le début de l'URL) sur lequel la session doit être active, si votre site est https://test.com
    // le domaine sera "test.com" mais comme on fait du devloppement en local, ici il le domain est "localhost"
    domain: "localhost",

    // Quelques autres options
    resave: false,
    saveUninitialized: false,
    proxy: true,

    // Le cookie qui servira à stocker la session
    cookie: {

        // Si vrai, ne transmettre le cookie que par https.
        // On est en développement donc juste en http, on doit donc mettre false
        secure: false,

        // Si vrai, empêche le JS côté client de lire le cookie
        // Comme on est en développement, on peut le mettre à false, mais en production il doit être à true
        httpOnly: false,

        // La durée de vie de la session en millisecondes, après ce délai la session sera détruite, il faudra par exemple se reconnecter pour se recréer une session
        maxAge: 86400000, // 86400000ms = 1 jour

        // On laisse le même domaine que dans les options plus haut
        domain: "localhost"
    },
}));


/* ========== DECLARATION DES ROUTES ========== */

/* /!\ Attention, si vous utilisez express-session pour gérer les sessions, il faut OBLIGATOIREMENT que les routes soient déclarées APRES le middleware de session, sinon ça ne marchera pas :p /!\ */

// On déclare que la route de base '/api' sera utilisé comme base pour les routes du fichier routes/api.js
app.use('/api', apiRouter);

// On déclare que la route de base '/' sera utilisé comme base pour les routes du fichier routes/views.js
app.use('/', viewsRouter);
```

Tout comme avec MongoDB vous devez avoir installé une base de données Redis sur votre machine et si ce n'est pas le cas vous pouvez utiliser Docker de la même façon que pour MongoDB

```shell
# Cette commande va créer un container Docker qui a pour image une base de données Redis (l'image 'redis') avec comme nom 'redis-bdd' en mode détaché '-d' (qui permet de le faire tourner en arrière plan) où le port '6379' de votre ordinateur est mappé avec le port '6379' du container créé
docker run -d --name redis-bdd -p 6379:6379 redis

# Si vous voulez stopper ce container vous pouvez lancer la commande suivante
docker stop redis-bdd

# Si vous essayez de relancer la commande du dessus pour créer le container avec la base de données il va surement vous dire que ce nom existe déjà et pour ne pas s'embêter, on va supprimer ce container par son nom 'redis-bdd' pour pouvoir ensuite le recréer
docker rm redis-bdd
```

Nous allons ajouter un dossier `middlewares` qui contiendra un fichier `index.js` qui contiendra nos middlewares qui sont des fonctions qui s'exécutent avant d'autres middlewares ou avant d'arriver dans la fonction d'une route

```javascript
/**
 * On print dans la console ce qui se trouve dans la session de l'utilisateur
 */
async function printSession(req, res, next) {

    // On log la session (de manière formatée)
    console.table(req.session)

    // On utilise la fonction next pour passer au middleware d'après ou à la fonction du routeur
    next();
}

module.exports = {
    printSession: printSession
}
```

Maintenant pour tester la session nous allons ajouter et modifier des choses dans le fichier `routes/api.js`

```javascript
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

...

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
```

Maintenant si on regarde la console pendant que l'on exécute une requête get sur http://locahost:3000/api/ping, on aura la session qui sera print dans la console !

On peut y retrouver tout un tas de choses

- path: le path à partir duquel la session est valide
- _expires: quand la session expirera dans Redis, et donc quand elle ne sera plus valide
- originalMaxAge: combien de temps en ms la session est valide
- httpOnly: si vrai, empêche le JS côté client de lire le cookie
- secure: si vrai, ne transmettre le cookie que par https
- domain: Le domain (le début de l'URL) sur lequel la session doit être active

Maintenant on peut ajouter dans le fichier `testAPIREST.ejs` les lignes suivantes

```html

...

<hr/>

<h1>Session utilisateur</h1>
<button onclick="recupererLaSession()">Récupérer le contenu de la session</button>
<button onclick="detruireLaSession()">Détruire la session</button>
<br/>
<br/>
<label>
    Résultat:
</label>
<br/>
<textarea disabled id="resultatSession" style="width: 500px;height: 100px"></textarea>

<hr/>

</body>
</html>

<script>

    ...

    /**
     * On veut supprimer un utilisateur et mettre le résultat dans le champ associé
     */
    function deleteUser() {

        // On récupère l'id de l'utilisateur
        const userId = document.getElementById("idDelete").value;

        axios.delete(`http://localhost:3000/api/user/${userId}`).then(function (response) {
            document.getElementById("resultatDeleteUser").innerHTML = JSON.stringify(response.data);
        })
    }

    /**
     * Fonction pour récupérer ce qui se trouve dans la session
     */
    function recupererLaSession() {
        axios.get("http://localhost:3000/api/session").then(function (response) {
            document.getElementById("resultatSession").innerHTML = JSON.stringify(response.data);
        })
    }

    /**
     * Fonction pour détruire la session
     */
    function detruireLaSession() {
        axios.delete("http://localhost:3000/api/session").then(function (response) {
            document.getElementById("resultatSession").innerHTML = JSON.stringify(response.data);
        })
    }

</script>
```

En revenant sur l'interface et en la testant on peut voir la session et la donnée qui se trouve à l'intérieur, notamment lorsque l'on crée un utilisateur et que l'on regarde la session, on voit que le dernier utilisateur QUE L'ON A CREE (si vous
ouvrez une page en navigation privée vous verrez que votre session sera différente de celle de votre navigateur normal).

La session est faite pour stocker des informations sur l'utilisateur, comme nom id, son username, ses préférences, voire ses permissions. Attention quand même de ne pas stocker des informations sensibles, car une session mal protégée avec un secret
trop faible peut être interceptée et utilisé de façon malhonnête.

Pour information pour sécuriser la connexion d'un utilisateur, on peut utiliser une session avec un `JWT`
ou `JSON Web Token` : https://medium.com/@prashantramnyc/difference-between-session-cookies-vs-jwt-json-web-tokens-for-session-management-4be67d2f066e

## Etape #14 - Les Websockets avec SocketIO

Quelques fois, comme lorsque l'on veut faire des systèmes de chat il nous faut un outil qui permet de mettre à jour de la donnée sans que l'utilisateur ait besoin de faire quoi que ce soit, et cette technologie s'appelle les `Websockets`.

C'est une connexion directe entre le client et le serveur qui permet de faire transiter de la donnée d'une façon différente par des flux continus et nous allons implémenter ça avec le package `socket.io` https://socket.io/docs/v4/server-api/

```shell
npm install socket.io
```

Une fois le package téléchargé il faut l'importé et ajouter ces instructions dans le fichier `app.js`

```javascript
...

const redis = require("redis");
const connectRedis = require("connect-redis");
const {Server} = require("socket.io");


// On importe les fichiers avec les routes
const apiRouter = require("./routes/api.js");
const viewsRouter = require("./routes/views.js");

/* ========== PARTIE SERVEUR ========== */

...


/* ========== PARTIE SOCKET IO ========== */

// Crée le socket io qui sera utilisé pour la websocket
const io = new Server(server, {

    // Comme nous faisons du développement nous allons avoir des problèmes liés au CORS (https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
    // Vu que l'on ne veut pas de soucis pour le développement, on va bypass cette mesure de sécurité !
    cors: {

        // En gros l'origin sera toujours celle qui faut pour ne plus avoir de soucis avec CORS
        origin: (requestOrigin, callback) => {
            callback(undefined, requestOrigin);
        },
        methods: ["GET", "POST"],
    },
});

// L'événement "connection" est réservé à quand un utilisateur se connecte à la websocket
io.on('connection', (socket) => {

    // On va donc logguer l'id qui s'est connecté !
    console.log(socket.id);

    // Il y a plusieurs façons de faire transiter de la donnée avec SocketIO...

    // Soit à une seule socket
    socket.emit("mon_evenement_que_pour_moi", "Salut !");

    // On va envoyer à cette socket que la connection a bien été établie pour la montrer sur le client
    socket.emit("est_connecte", `Vous êtes connecté à la Websocket qui a l'id: ${socket.id}`);

    // Soit à toutes les sockets
    io.emit("une_nouvelle_socket_s_est_connecte", `La socket '${socket.id}' vient de se connecter, bienvenue !`);

    // Il existe aussi d'autres principes comme les rooms (https://socket.io/docs/v3/rooms/) ou les namespaces (https://socket.io/docs/v3/namespaces/). Je vous conseille d'y jeter un coup d'œil !
    // ...

    // Ici on peut faire en sorte d'ajouter des événements à "écouter", si un événement est reçu alors la fonction est effectuée
    socket.on("mon_evenement", function (data) {

        // On renvoie à la socket d'où provient l'événement la donnée qu'elle nous a envoyé avec un événement et de la donnée
        socket.emit("mon_evenement_bien_recu", data);
    });

    socket.on("mon_evenement_pour_tout_le_monde", function (data) {

        // On à TOUTES les sockets ce que la socket nous a envoyé
        io.emit("mon_evenement_pour_tout_le_monde_bien_recu", {id: socket.id, date: data});
    });

    // Pour envoyer et recevoir le dernier message stocké dans Redis
    socket.on("envoyer_dernier_message", function (data) {

        // On met à jour le dernier message dans Redis à la clef "DERNIER_MESSAGE"
        redisClient.set("DERNIER_MESSAGE", data)

        // On a rien besoin de renvoyer
    })
    socket.on("recevoir_dernier_message", function (data) {

        // On a demandé de renvoyer le dernier message de Redis et c'est ce qu'on fait où la clef de ce dernier message est "DERNIER_MESSAGE"
        redisClient.get("DERNIER_MESSAGE", function (erreur, leDernierMessage) {
            socket.emit("recevoir_dernier_message_reponse", leDernierMessage);
        })
    })

    // Il y a un autre mot clef pour la déconnexion d'une socket !
    socket.on("disconnect", function () {
        io.emit("une_socket_s_est_deconnecte", `La socket '${socket.id}' vient de se déconnecter, au revoir !`);
    })
});

/* ========== DECLARATION DES ROUTES ========== */

...
```

On a maintenant créé un serveur Websocket en plus de notre API REST sur le même serveur. Cependant, pour utiliser la Websocket SocketIO il faut utiliser un client SocketIO sur un navigateur. Nous allons donc créer le fichier `testWebsocket.ejs` dans
le dossier `views`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test de la websocket avec SocketIO</title>
</head>

<!-- On importe SocketIO -->
<script src="https://cdn.socket.io/4.4.1/socket.io.js"></script>

<body>

<h1>Test de SocketIO</h1>

<hr/>

<h1>Etat de la socket:</h1>
<p id="etatSocket">Pas encore connecté</p>

<hr/>

<h1>Test pour envoyer un événement au serveur et qu'il le retourne seulement à nous</h1>
<button onclick="envoyerPockPourMoi()">Envoyer un pock à soi-même</button>
<p>Dernière date de mon pock: <span id="derniereDatePock">Aucun pock</span></p>

<hr/>

<h1>Test pour envoyer un événement au serveur et qu'il le retourne à tous le monde</h1>
<button onclick="derniereDatePockToutLeMonde()">Envoyer un pock à tout le monde</button>
<p>Dernière date du pock global: <span id="derniereDatePockToutLeMonde">Aucun pock</span></p>

<hr/>

<h1>Test pour envoyer un message au serveur pour qu'il soit stocké dans Redis</h1>
<input id="pourEnvoyerDernierMessage" type="text"/>
<button onclick="envoyerDernierMessage()">Envoyer le dernier message</button>
<br/>
<input disabled id="pourRecupererDernierMessage" type="text"/>
<button onclick="recevoirDernierMessage()">Recevoir le dernier message</button>

<hr/>

</body>
</html>

<script>

    // On crée la Websocket qui pointe vers notre API
    const socket = io("http://localhost:3000");

    // Si on reçoit l'événement "est_connecte" du serveur alors on veut changer le status du paragraphe "etatSocket" avec la donnée reçu
    socket.on("est_connecte", function (data) {
        document.getElementById("etatSocket").innerHTML = data;
    });

    // On ajoute un événement de quand on reçois un pock par soi-même, et on met à jour la dernière date du pock avec celle reçus par la websocket
    socket.on("mon_evenement_bien_recu", function (data) {
        document.getElementById("derniereDatePock").innerHTML = data;
    })

    // On ajoute un événement de quand on reçois un pock par un autre utilisateur, et on met à jour la dernière date du pock avec celle reçus par la websocket AVEC l'id de celui qui a lancé le dernier pock
    socket.on("mon_evenement_pour_tout_le_monde_bien_recu", function (data) {
        document.getElementById("derniereDatePockToutLeMonde").innerHTML = `Le dernier pock a été lancé le ${data.date} par ${data.id}`;
    })

    // On ajoute un événement pour mettre à jour le dernier message reçu
    socket.on("recevoir_dernier_message_reponse", function (data) {
        document.getElementById("pourRecupererDernierMessage").value = data;
    })

    /**
     * Fonction pour m'envoyer un pock à moi-même
     */
    function envoyerPockPourMoi() {

        // On va émettre un pock au serveur via la websocket avec la date de maintenant
        socket.emit("mon_evenement", new Date())
    }

    /**
     * Fonction pour envoyer un pock à tout le monde connecté
     */
    function derniereDatePockToutLeMonde() {

        // On va émettre un pock au serveur via la websocket avec la date de maintenant
        socket.emit("mon_evenement_pour_tout_le_monde", new Date())
    }

    /**
     * Fonction pour envoyer le dernier message stocké dans Redis
     */
    function envoyerDernierMessage() {

        // On va émettre un pock au serveur via la websocket avec la date de maintenant
        socket.emit("envoyer_dernier_message", document.getElementById("pourEnvoyerDernierMessage").value)
    }

    /**
     * Fonction pour recevoir le dernier message stocké dans Redis
     */
    function recevoirDernierMessage() {

        // On va émettre un pock au serveur via la websocket avec la date de maintenant. Pas besoin de donner de données si vous n'en avez pas besoin
        socket.emit("recevoir_dernier_message")
    }
</script>
```

Puis on doit ajouter uen route pour accéder à cette page web dans le fichier `routes.views.js`

```javascript
...

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
```

Vous pouvez nous rendre sur l'adresse http://localhost:3000/websocket pour accéder à la page de test de la Websocket. Ouvrez plusieurs pages web, dont une en navigation privée pour faire vos tests et vous verrez que la websocket fonctionne.

## Etape #15 - Docker et docker-compose

Vous venez de créer votre première application Fullstack avec un `backend`, un `frontend` et deux `bases de données`. Maintenant vient le temps de créer une `image Docker` votre application pour pouvoir la "transporter" et pouvoir l'utiliser sur
toutes les machines / serveurs. Vous utiliserez aussi `docker-compose` pour déployer cette `image Docker`.

Tout d'abord créez un fichier nommé `Dockerfile` avec ce contenu :

```dockerfile
# On récupère une image node à sa dernière version
FROM node:latest

# Définir le répertoire de travail
WORKDIR /usr/src/app

# On copie le package.json et le package-lock.json
COPY package*.json ./

# On installe les dépendances
RUN npm install

# On copie les fichiers
COPY . .

# On expose le port 3000
EXPOSE 3000

# Quand un container sera démarré à partir de cette image, c'est cette commande qui sera exécutée
CMD npm start
```

Maintenant vous voulez créer une image Docker de votre projet à partir de ce Dockerfile, mettez-vous dans la racine de votre projet et éxécutez la commande suivante

```shell
# Cette commande veut dire
# Crée moi une image Docker, à partir de ce fichier (le contexte) que tu vas tag (nommer) 'info734/td1-1/api'
docker build -t info734/td1-1/api .

# Si on est connecté à DockerHub on pourrait pousser cette image en utilisant la commande suivante (attention la convention veut que vous mettiez votre "pseudo" devant, cette image s'appellerait donc pour moi anrosa/info734/td1-1/api)
docker push info734/td1-1/api

# Une fois que cette image est sur DockerHub on peut la récupérer comme suit
docker pull info734/td1-1/api
```

Vous aurez ce genre d'output, Docker a exécuté les étapes les unes après les autres et à la fin il a créé notre image avec comme nom `info734/td1-1/api` dans sa dernière version (le :latest). On aurait pu lui donner un autre tag, comme une
version `info734/td1-1/api:v1` ou tout autre chose `info734/td1-1/api:la-vraie-image`...

```log
anrosa@anrosa-Latitude-geode:/data/projects/CoursPolytech/INFO734/Cours/TD1/TD1-1$ docker build -t info734/td1-1/api .
Sending build context to Docker daemon  24.39MB
Step 1/7 : FROM node:latest
 ---> ea9021b35904
Step 2/7 : WORKDIR /usr/src/app
 ---> Using cache
 ---> 3c6f50956485
Step 3/7 : COPY package*.json ./
 ---> ce44de12e7d0
Step 4/7 : RUN npm install
 ---> Running in 1f0753f4b80d

added 177 packages, and audited 178 packages in 3s

16 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Removing intermediate container 1f0753f4b80d
 ---> 959575d9467a
Step 5/7 : COPY . .
 ---> 4f0aee3c6a9e
Step 6/7 : EXPOSE 3000
 ---> Running in 0ec9af462fd2
Removing intermediate container 0ec9af462fd2
 ---> d9070b505a7c
Step 7/7 : CMD npm start
 ---> Running in a211dc78a767
Removing intermediate container a211dc78a767
 ---> be9567c8d76d
Successfully built be9567c8d76d
Successfully tagged info734/td1-1/api:latest
```

Maintenant que l'on a notre image il est tout naturel qu'on veuille la lancer, mais il y avoir des soucis car il ne pourra pas se connecter aux bases de données MongoDB et Redis

```shell
# Ici il faut lire: lance moi l'image 'info734/td1-1/api' en mode intéractif (-t : Garder STDIN ouvert, même si pas attaché) et tty (-t : Allouer un pseudo-terminal) qui aura comme nom 'api-test' et qui va mapper le port '3000' de mon ordinateur vers le port '3000' du cantainer crée
docker run -i -t --name api-test -p 3000:3000 info734/td1-1/api

# En lançant la commande ça ne marche pas car il n'arrive pas à se connecter à Redis (et à MongoDB mais lui est plus patient pour lancer l'erreur)
# On peut donc supprimer notre image et essayer autre chose...
docker rm api-test
```

Il est tout à fait possible de lancer notre API seulement avec Docker, mais la démarche sera laborieuse... Un outil va nous aider à faire ça et cet outil est `docker-compose` ! Vous pouvez dès à présent créer un fichier nommé `docker-compose.yaml` à
la racine du projet

```yaml
version: "3.8"

# Ici on définie les différents services
services:

  # le service pour la base de données MongoDB que l'on va appeler 'mongo-td1-1'
  mongo-td1-1:

    # Il utilisera l'image 'mongo' à sa dernière version
    image: mongo:latest

    # Le container aura comme nom 'mongo-td1-1'
    container_name: mongo-td1-1

    # Le hostname du container, c'est-à-dire son adresse visible aux autres containers qui seront dans le/les même(s) réseau(x), il sera utilisé pour s'y connecter
    hostname: mongo-hostname-td1-1

    # Il fera partie d'un seul réseau interne nommé 'network-td1-1'
    networks:
      - network-td1-1

  # le service pour la base de données Redis que l'on va appeler 'redis-td1-1'
  redis-td1-1:

    # Il utilisera l'image 'redis' à sa dernière version
    image: redis:latest

    # Le container aura comme nom 'redis-td1-1'
    container_name: redis-td1-1

    # Le hostname du container, c'est-à-dire son adresse visible aux autres containers qui seront dans le/les même(s) réseau(x), il sera utilisé pour s'y connecter
    hostname: redis-hostname-td1-1

    # Il fera partie d'un seul réseau interne nommé 'network-td1-1'
    networks:
      - network-td1-1

  # le service pour l'API que l'on va appeler 'api-td1-1'
  api-td1-1:

    # L'image que nous utiliserons est l'image que l'on a créée et qui s'appelle 'info734/td1-1/api'
    # On lui a donné ce nom grâce à la commande: docker build -t info734/td1-1/api .
    image: info734/td1-1/api

    # On lui donne comme nom 'api-td1-1'
    container_name: api-td1-1

    # On veut "mapper" le port 3000 de notre ordinateur (le HOST) vers le port 3000 de l'API (CONTAINER)
    ports:
      - "3000:3000"

    # Ce service doit attendre que mongo ET redis aient démarré pour démarrer à son tour
    depends_on:
      - mongo-td1-1
      - redis-td1-1

    # Il fera partie d'un seul réseau interne nommé 'network-td1-1'
    networks:
      - network-td1-1

    # On veut ajouter deux variables d'environnement à notre container, ce qu'il lui permettra de pouvoir se connecter à MongoDB et Redis en leur donnant leur hostname
    # Comme la base de données MongoDB s'appelle mongo et la base Redis redis on leur donne ces noms
    environment:
      MONGO_HOST: "mongo-hostname-td1-1"
      REDIS_HOST: "redis-hostname-td1-1"

# Après avoir créé des services, on va créer un réseau interne
networks:

  # On crée le réseau interne nommé "network-td1-1"
  network-td1-1:

    # Pour les réseaux internes mettre tout le temps cette instruction, c'est le plus simple et vous n'aurez pas besoin de plus
    driver: bridge
```

Maintenant que vous avez votre fichier `docker-compose.yaml`, vous pouvez "composer" votre projet avec la commande

```shell
# Cette commande va vous créer vos services et laisser leurs logs dans votre console
docker-compose up

# Privilégiez cette commande qui permet de lancer vos service en arrière plan, ce qui vous laissera la main sur votre console
docker-compose up -d

# Si vous voulez arrêter vos services vous avez juste à lancer la commande suivante
docker-compose down
```

Vous pouvez dorénavant utiliser votre projet Fullstack depuis votre navigateur et le porter facilement avec `Docker` et `docker-compose` !