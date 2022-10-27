# TP2-1 - Pas à pas

Le but de ce TP est de créer une application Fullstack avec comme backend celui du TD1-1 (modifié) et comme frontend nous allons utiliser NextJS !

L'application servira à créer des comptes utilisateurs pour se connecter à l'application. On pourra aussi modifier l'utilisateur associé au compte si on a les droits.

Si vous avez des questions ou des remarques n'hésitez pas à m'en parler (ou à m'envoyer un mail : antonin.martin.rosa@gmail.com)

### Notes

Tout au long du projet des éléments et des libraries seront importées, je ne marque pas chaque `import` car ça sera logique de bien importer le bon composant et votre IDE vous aidera.

## Etape #0 - Regarder la documentation de NextJS: https://nextjs.org/docs/ & la vidéo de Fireship: https://www.youtube.com/watch?v=Sklc_fQBmcs

Nous allons utiliser NextJS qui est une amélioration de ReactJS et qui permet de créer des Frontend optimisés et performants. Il n'y aura pas de cours dessus, toutes les informations se trouvent dans la documentation et sur internet. Je pourrai bien
entendu répondre à vos questions.

Les concepts que vous allez voir sont complexes a priori, mais la logique arrive très vite en pratiquant. Ce TP2-2 sera comme le TD1-1, un projet guidé et pas à pas, sauf que cette fois-ci vous serez seuls à suivre les instructions.

## Etape #1 - Mise à jour du Backend pour accueillir un Frontend NextJS

Dans un premier temps il faudra nettoyer le projet du TD1-1 en enlevant tout ce qui se rapporte au Frontend, car ici nous allons différencier les deux. Vous allez donc copier le contenu do dossier `/TD1/TD1-1-Pas-A-Pas` dans un dossier que vous
appellerez `tp2-1-api`. Puis vous allez effectuer les actions suivantes :

Dans le fichier `app.js`, veuillez enlever les lignes suivantes :

```diff
-const viewsRouter = require("./routes/views.js");

-// Permet de dire à Express que le moteur de "vues" (le frontend) est EJS, c'est une amélioration du HTML où on peut utiliser des variables, des boucles et tout un tas de mécanismes: https://ejs.co/#docs
-app.set('view engine', 'ejs');

-// On déclare que la route de base '/' sera utilisé comme base pour les routes du fichier routes/views.js
-app.use('/', viewsRouter);
```

Dans le fichier `package.json`, veuillez enlever la ligne:

```diff
-    "ejs": "^3.1.8",
```

Puis, il faut supprimer le dossier `views` et le fichier `routes/views.js`.

Vous pouvez aussi supprimer le fichier `docker-compose.yaml` qui ne nous servira plus, car on en fera un nouveau.

## Etape #2 - Ajout d'un model pour les comptes utilisateurs

Nous allons créer une application où un utilisateur pourra se connecter via un compte utilisateur qui sera rattaché à un utilisateur.

Dans le fichier `models/index.js` vous allez ajouter le schema et le model suivant :

```javascript
...


/**
 * Ce schema sera utilisé pour stocker les comptes d'utilisateurs
 * @schema : Account
 */
const AccountSchema = new Schema(
    {

        /**
         * L'email de l'utilisateur
         */
        email: {
            type: Schema.Types.String,
            required: true
        },

        /**
         * Le mot de passe de l'utilisateur
         */
        password: {
            type: Schema.Types.String,
            required: true
        },

        /**
         * SI l'utilisateur est un "super utilisateur"
         */
        isSuperUser: {
            type: Schema.Types.Boolean,
            default: false
        },

        /**
         * la référence de l'utilisateur
         * Utilisé pour faire des .populate pour avoir la donnée de l'utilisateur dans la variable user, on veut faire une référence vers un schema user qui aura juste son identifiant unique MongoDB
         */
        user: {
            type: Schema.Types.ObjectId,
            ref: "user"
        },

        /**
         * Quand le compte a été crée
         */
        createdAt: {
            type: Date,
            default: Date.now
        }
    });

// On exporte le model
module.exports = {

    // On dit que le Model User est créé à partir du Schema UserSchema et le Model sera stocké dans la base de donnée MongoDB sous le nom "user"
    User: mongoose.model('user', UserSchema),

    // On dit que le Model Account est créé à partir du Schema AccountSchema et le Model sera stocké dans la base de donnée MongoDB sous le nom "account"
    Account: mongoose.model('account', AccountSchema)
}
```

Puis pour utiliser ce nouveau model nous allons créer un nouveau fichier dans le dossier `controllers` qui va s'appeler `accounts.js`

```javascript
const crypto = require("crypto");
const {Account} = require("../models");
const {isObjectIdStringValid} = require("../utils");
const {createUser, deleteUser} = require("./users");

/**
 * On essaye de connecter l'utilisateur
 * @param headerAuthorization Le header authorization
 */
const logInUser = async (headerAuthorization) => {

    // On récupère le mot de passe et l'email du header authorization
    let [email, password] = Buffer.from(headerAuthorization, 'base64').toString().split(':');

    // On hash le mot de passe avec l'algorithme SHA256 et on veut le résultat en hexadecimal
    let passwordToCheck = crypto.createHash('sha256').update(password).digest("hex");

    // On cherche le compte qui a cet email avec le mot de passe.
    let accountFound = await Account.findOne({email: email.toLowerCase(), password: passwordToCheck});

    // Si le compte existe alors on renvoie ses données
    if (accountFound !== null) {
        return {
            userId: accountFound.user,
            email: accountFound.email,
            isSuperUser: accountFound.isSuperUser
        }
    }

    // Sinon on veut renvoyer une erreur
    throw new Error("Aucun compte n'a été trouvé avec ces identifiants");
}

/**
 * Récupère la donnée de l'utilisateur (son compte + l'utilisateur en lui-même) (sauf le mot de passe)
 * @param userId L'id de l'utilisateur que l'on veut récupérer
 */
const getUserData = async (userId) => {

    // Vérifier si l'userId existe et est valide
    if (userId === undefined || !isObjectIdStringValid(userId)) {
        throw new Error("L'id de l'utilisateur est invalide ou non défini");
    }

    // On Veut trouver le compte lié à l'utilisateur et le retourner avec les données de l'utilisateur (sans le mot de passe)
    // Le fait d'utiliser lean nous permet de renvoyer l'object JSON et non l'object avec le Model associé (https://mongoosejs.com/docs/tutorials/lean.html)
    // Le fait de faire un populate nous ajoute dans le champ user, les valeurs de l'utilisateur qui a pour id la valeur de la clef 'user' du compte
    let userFound = await Account.findOne({user: userId}).populate("user").lean();

    // Si l'utilisateur n'a pas été trouvé on renvoie une erreur
    if (userFound === null) {
        throw new Error("L'utilisateur n'a pas été trouvé");
    }

    // Sinon on enlève le mot de passe
    delete userFound.password;

    // On renvoie la donnée
    return userFound;
}


/**
 * Créer un nouveau compte utilisateur (avec un utilisateur associé)
 * @param email L'email avec lequel le compte doit être créé
 * @param password Le mot de passe du compte
 * @param isSuperUser Si l'utilisateur est un "super utilisateur" (un admin)
 * @param user Les informations utilisateur pour créer l'utilisateur lié au compte
 */
const signUpUser = async (email, password, isSuperUser, user) => {

    // On fait des tests...
    if (email === undefined || email === "") {
        throw new Error("L'email doit être défini et non vide pour créer un compte");
    }

    if (password === undefined || password === "") {
        throw new Error("Le mot de passe doit être défini et non vide pour créer un compte");
    }

    if (isSuperUser === undefined) {
        isSuperUser = false;
    }

    // On regarde déjà si un compte n'existe pas à cette adresse email (pour ne pas en recréer un)
    const alreadyExistingAccount = await Account.findOne({email: email});
    if (alreadyExistingAccount !== null) {
        throw new Error("Un compte existe déjà avec cette adresse email");
    }

    // On utilise le sha256 pour sécuriser le mot de passe dans la base de données
    const passwordEncrypted = crypto.createHash('sha256').update(password).digest("hex");

    // On veut d'abord essayer de créer un utilisateur pour voir si on peut créer un utilisateur associé au compte que l'on veut créer
    let userCreated;
    try {
        userCreated = await createUser(user);
    }

        // Si on attrape une erreur, c'est que l'utilisateur n'a pas pû être créé et on ne peut donc pas créer de compte...
    catch (e) {
        throw new Error(`Erreur lors de la création de l'utilisateur du compte: ${e}`)
    }

    // Une fois l'utilisateur crée on va créer le compte où l'utilisateur sera associé
    const newAccount = new Account({
        email: email.toLowerCase(),
        password: passwordEncrypted,
        isSuperUser: isSuperUser,

        // On donne à user la valeur de l'identifiant unique MongoDB de l'utilisateur créé
        user: userCreated._id
    });

    // On essaye de créer le compte, on veut faire un try/catch, car si ça ne marche pas on veut supprimer l'utilisateur associé, car il ne pourra pas être lié à un compte
    try {
        const accountCreated = await newAccount.save();

        // On veut retourner l'id du compte créé
        return accountCreated._id;
    } catch (e) {

        // On veut supprimer l'utilisateur
        await deleteUser(userCreated._id);

        // Et on throw l'erreur qu'on a catch
        throw e;
    }
}

// On exporte les fonctions
module.exports = {
    logInUser: logInUser,
    getUserData: getUserData,
    signUpUser: signUpUser
}
```

## Etape #3 - Ajout des routes pour la gestion des comptes et modifications des fonctions pour les utilisateurs

Notre façon de penser va changer, maintenant que nous allons travailler plus proprement et de facon plus optimisée, nous allons devoir repenser notre facon de gérer les erreurs.

Vous avez par exemple vu dans le fichier `accounts.js` que les erreurs ne sont plus attrapées, on ne veut retourner de la donnée QUE S'IL N'Y A PAS D'ERREURS, et nous devons donc faire en sorte de remplacer tous les renvoies d'erreurs par des throws,
qui permettent de dire qu'il y a eu une erreur, ces derniers seront récupérés par des try/catch nous permettant d'être sûr que l'application fonctionne comme on le veut !

Vous allez donc remplacer le fichier `controllers/users.js` par ces lignes :

```javascript
const {getKeysNotProvided, isObjectIdStringValid} = require("../utils");
const {Account, User} = require("../models");

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
        throw new Error(`Les informations suivantes ne sont pas fournies ou vides: '${keysNotGiven.join(', ')}'`);
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
        throw new Error("Une erreur s'est produite lors de la création de l'utilisateur");
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
        throw new Error("L'id de l'utilisateur n'existe pas ou n'est pas un id MongoDB");
    }


    // On veut chercher un object dans la collection "User" par son identifiant MongoDB
    const userFound = await User.findById(userId);

    // Si l'utilisateur trouvé est null c'est qu'il n'existe pas dans la base de données
    if (userFound === null) {
        throw new Error("L'utilisateur n'existe pas");
    }

    // Sinon c'est qu'il existe et on le renvoie
    return userFound;
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
        throw new Error("L'id de l'utilisateur n'existe pas ou n'est pas un id MongoDB");
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


    // On demande à MongoDB de modifier les couples clefs/valeurs présents dans l'object userToUpdate de l'object qui a pour identifiant unique MongoDB 'userId'
    // Noter l'option {new: true} qui veut dire que MongoDB nous renverra l'object modifié et non l'object avant sa modification (car on veut renvoyer le user modifié à l'utilisateur)
    const userUpdated = await User.findByIdAndUpdate(userId, userToUpdate, {new: true});

    // Si l'utilisateur trouvé est null c'est qu'il n'existe pas dans la base de données
    if (userUpdated === null) {
        throw new Error("L'utilisateur n'existe pas et n'a donc pas pû être modifié");
    }

    // Sinon c'est qu'il existe et on le renvoie
    return userUpdated;
}

/**
 * Supprime un utilisateur
 * @param userId L'identifiant de l'utilisateur à supprimer
 * @returns L'utilisateur qui vient d'être supprimé
 */

async function deleteUser(userId) {

    // Vérifier si l'userId existe et est un id MongoBD valide
    if (userId === undefined || !isObjectIdStringValid(userId)) {
        throw new Error("L'id de l'utilisateur n'existe pas ou n'est pas un id MongoDB")
    }

    // On demande à MongoDB de supprimer l'utilisateur qui a comme identifiant unique MongoDB 'userId'
    const userDeleted = await User.findByIdAndDelete(userId);

    // Si l'utilisateur trouvé est null c'est qu'il n'existe pas dans la base de données
    if (userDeleted === null) {
        throw new Error("L'utilisateur n'existe pas et n'a donc pas pû être supprimé");
    }

    // Attention maintenant on veut aussi supprimer le compte associé à l'utilisateur quand on supprime un utilisateur
    await Account.findOneAndDelete({user: userId});

    // Sinon c'est qu'il existe et on le renvoie
    return userDeleted;
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
        throw new Error("Il y a eu une erreur lors de la recuperation des utilisateurs");
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

Il n'y a effectivement pas beaucoup de modifications avec la version d'avant à part les return qui sont remplacés par des throw s'il est question d'une erreur et quand un utilisateur est supprimé alors son compte associé aussi !

Nous allons donc ajouter les routes pour la gestion des comptes utilisateurs ET le refactoring lié aux erreurs, vous pouvez donc copier ces lignes dans le fichier `routes/api.js`

```javascript
const express = require("express");
const {printSession} = require("../middlewares/index.js");
const {createUser, deleteUser, readAllUsers, readUser, updateUser} = require("../controllers/users.js");
const {getUserData, logInUser, signUpUser} = require("../controllers/accounts");
const {isUserAuthenticated, checkUserNotAlreadyAuthenticated, isSuperUser, isUserAsking} = require("../middlewares");

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
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 * @middleware isSuperUser: Seul un super utilisateur a le droit d'accéder à cet endpoint
 */
apiRouter.post('/user', isUserAuthenticated, isSuperUser, async (req, res) => {

    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await createUser(req.body));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * Récupère un utilisateur par rapport à son id
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 */
apiRouter.get('/user/:userId', isUserAuthenticated, async (req, res) => {

    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await readUser(req.params.userId));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * Modifie un utilisateur par rapport à son id et le contenu de la requête
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 * @middleware isUserAsking: Seul l'utilisateur connecté OU un super utilisateur a le droit d'accéder à cet endpoint
 */
apiRouter.put('/user/:userId', isUserAuthenticated, isUserAsking, async (req, res) => {

    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await updateUser(req.params.userId, req.body));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * Supprime un utilisateur par rapport à son id
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 * @middleware isSuperUser: Seul un super utilisateur a le droit d'accéder à cet endpoint
 */
apiRouter.delete('/user/:userId', isUserAuthenticated, isSuperUser, async (req, res) => {

    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await deleteUser(req.params.userId));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * Récupère tous les utilisateurs
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 */
apiRouter.get('/users', isUserAuthenticated, async (req, res) => {

    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await readAllUsers());
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/**
 * Renvoie ce qui se trouve dans la session
 */
/* On enlève cette route, car elle n'est pas du tout sécurisée
apiRouter.get('/session', (req, res) => {
    res.json(req.session);
});
 */

/**
 * Détruis la session
 */
/* On supprime cette route, car elle sera en collision avec celle pour se déconnecter
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
*/

/**
 * La route pour que l'utilisateur se connecte
 */
apiRouter.get('/login', checkUserNotAlreadyAuthenticated, async (req, res) => {

    try {
        // On récupère le login et le mot de passe du header
        const b64auth = (req.headers.authorization || '').split(' ')[1] || '';

        // On essaye de connecter l'utilisateur
        const result = await logInUser(b64auth);

        // On veut stocker des informations dans la session
        req.session.userId = result.userId;
        req.session.email = result.email;
        req.session.isSuperUser = result.isSuperUser;

        // On renvoie le résultat
        res.json(result);
    }

        // Si on attrape une erreur, on renvoie un code HTTP disant que l'utilisateur n'a pas pu se connecter (Unauthorized)
    catch (e) {
        res.status(401).send(e.message);
    }
});

/**
 * on déconnecte l'utilisateur
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 */
apiRouter.delete('/logout', isUserAuthenticated, async (req, res) => {

    // On détruit la session
    try {
        await req.session.destroy();
    } catch (e) {
    }

    // On enlève le cookie (même si ça doit se faire tout seul, on sait jamais...)
    res.clearCookie("connect.sid");

    res.end("La session a été détruite");
});

/**
 * On récupère la donnée de l'utilisateur actuel
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 */
apiRouter.get('/userdata', isUserAuthenticated, async (req, res) => {

    // On essaye de faire la requête et s'il y a une erreur, on la renvoie avec un code d'erreur
    try {
        res.json(await getUserData(req.session.userId));
    } catch (e) {

        // On renvoie l'erreur avec un code 500 (Internal Server Error)
        res.status(500).send(e.message)
    }
});

/**
 * On regarde si l'utilisateur est connecté
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 */
apiRouter.get('/authenticated', isUserAuthenticated, async (req, res) => {

    // Comme le router fait foi que l'utilisateur est connecté on sait que si l'on retourne quelque chose alors c'est parce qu'il est connecté
    res.json({
        isUserLogged: true,
        isSuperUser: req.session.isSuperUser === true
    })
});

/**
 * Permet de créer un compte utilisateur
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 * @middleware isSuperUser: Seul un super utilisateur a le droit d'accéder à cet endpoint
 */
apiRouter.post('/signup', isUserAuthenticated, isSuperUser, async (req, res) => {

    // On fait un try catch pour intercepter une potentielle erreur
    try {
        res.json(await signUpUser(req.body.email, req.body.password, req.body.isSuperUser, req.body.user));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// On exporte seulement le router
module.exports = apiRouter;
```

On peut voir qu'il manque des middlewares pour faire attention qu'un endpoint ne soit accessible que si un utilisateur est connecté et dans certains cas s'il est un "super utilisateur". Vous allez donc ajouter les lignes suivantes dans le
fichier `middlewares/index.js`

```javascript
...

/**
 * On regarde si l'utilisateur est authentifié
 */
const isUserAuthenticated = async (req, res, next) => {

    // On regarde juste si la session de l'utilisateur contient un userId défini
    if (req.session.userId !== undefined) {

        // On utilise la fonction next qui permet de dire que l'on veut passer au prochain middleware ou à la fonction du router
        next();
    } else {

        // On renvoie une erreur avec le code 401 (Unauthorized)
        return res.status(401).send("Vous n'êtes pas authentifié");
    }
}

/**
 * On regarde si l'utilisateur n'est pas déjà authentifié
 */
const checkUserNotAlreadyAuthenticated = async (req, res, next) => {

    // On regarde juste si la session de l'utilisateur NE contient pas un userId
    if (req.session.userId === undefined) {

        // On utilise la fonction next qui permet de dire que l'on veut passer au prochain middleware ou à la fonction du router
        next();
    } else {

        // On renvoie une erreur avec le code 409 (Conflict)
        return res.status(409).send("Vous êtes déjà authentifié");
    }
}

/**
 * On regarde si l'utilisateur est un "super utilisateur"
 */
const isSuperUser = async (req, res, next) => {

    // On regarde juste si la variable isSuperUser est à true dans la session
    if (req.session.isSuperUser === true) {

        // On utilise la fonction next qui permet de dire que l'on veut passer au prochain middleware ou à la fonction du router
        next();
    } else {

        // On renvoie une erreur avec le code 403 (Forbidden)
        return res.status(403).send("Vous n'êtes pas un super utilisateur");
    }
}

/**
 * On regarde si l'utilisateur qui demande la ressource a le même userId que le paramètre "userId" OU s'il est un "super utilisateur"
 */
const isUserAsking = async (req, res, next) => {

    // On regarde juste si la variable isSuperUser est à true dans la session
    if (req.session.isSuperUser === true || req.session.userId === req.params.userId) {

        // On utilise la fonction next qui permet de dire que l'on veut passer au prochain middleware ou à la fonction du router
        next();
    } else {

        // On renvoie une erreur avec le code 403 (Forbidden)
        return res.status(403).send("Vous ne pouvez demander cette ressource que pour vous même");
    }
}

module.exports = {
    printSession: printSession,
    isUserAuthenticated: isUserAuthenticated,
    checkUserNotAlreadyAuthenticated: checkUserNotAlreadyAuthenticated,
    isSuperUser: isSuperUser,
    isUserAsking: isUserAsking
}
```

## Etape #4 - Ajout de l'utilisateur admin et mise à jour websocket

Après avoir fait ces modifications, vous avez presque créé un backend opérationnel pour créer des comptes et gérer des utilisateurs. "Presque" car pour le moment vous ne pouvez pas ajouter des utilisateurs, car il n'y a pas encore de compte
administrateur auquel vous pouvez vous connecter pour créer de nouveaux comptes...

Vous allez donc ajouter le fait qu'un utilisateur administrateur soit créé automatiquement s'il n'existe pas déjà avec les lignes suivantes dans le fichier `app.js` du backend (vous allez aussi ajouter une route qui permettra d'envoyer un message via
la
websocket envoyé par un administrateur) :

```javascript
...

// On importe les fichiers avec les routes
const apiRouter = require("./routes/api.js");
const {signUpUser} = require("./controllers/accounts");
const crypto = require("crypto");
const {isUserAuthenticated, isSuperUser} = require("./middlewares");

/* ========== PARTIE SERVEUR ========== */

...

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

    // On va créer un utilisateur admin avec lequel on se connectera pour créer d'autres utilisateurs. Son mot de passe sera admin et son email sera aussi admin
    const passwordEncrypted = crypto.createHash('sha256').update("admin").digest("hex");
    const adminUser = {
        prenom: "Ad",
        nom: "Min",
        age: 2022
    }
    signUpUser("admin", passwordEncrypted, true, adminUser).then((result) => {
        console.log("Le compte admin a été créé: ", result);
    }).catch((error) => {
        console.error(`Il y a eu une erreur lors de la création du compte admin: ${error}`);
    });
});

/* ========== PARTIE REDIS ========== */

...

/**
 * Permet à un administrateur d'envoyer un message à toutes les personnes qui sont sur le site
 * @middleware isUserAuthenticated: Seul un utilisateur connecté peut accéder à cet endpoint
 * @middleware isSuperUser: Seul un super utilisateur a le droit d'accéder à cet endpoint
 */
// Ici on est obligé de mettre cette route dans le fichier app.js car on ne pourra pas exporter la variable io pour y accéder de l'extérieur
apiRouter.post('/message', isUserAuthenticated, isSuperUser, async (req, res) => {
    try {
        // On émet un événement pour que TOUS les clients reçoivent le message
        io.emit("message_recu", req.body.message);
        res.send("ok");
    } catch (e) {
        res.status(500).send(e.message);
    }
});

/* ========== DECLARATION DES ROUTES ========== */

/* /!\ Attention, si vous utilisez express-session pour gérer les sessions, il faut OBLIGATOIREMENT que les routes soient déclarées APRES le middleware de session, sinon ça ne marchera pas :p /!\ */

// On déclare que la route de base '/api' sera utilisé comme base pour les routes du fichier routes/api.js
app.use('/api', apiRouter);
```

ATTENTION, SI VOUS AVEZ DES PROBLEMES AVEC REDIS VEUILLEZ RECUPERER L'API dans `TP2-1-Pas-A-Pas-Sans-Redis/tp2-1-api` qui n'utilisera pas Redis mais que MongoDB !

Maintenant vous pouvez un peu vous amuser avec Postman pour voir si cela fonctionne, et n'oubliez pas d'allumer votre serveur avec la commande `npm run dev` !

Pour vous connecter avec Postman vous allez devoir utiliser une fonction spéciale de se connecter : https://learning.postman.com/docs/sending-requests/authorization/#basic-auth. Si vous avez des questions je pourrai y répondre.

La chaine de caractère `admin` est `8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918` en SHA256 ;)

## Etape #5 - Création du Frontend avec NextJS

/!\ Attention, avant de suivre cette partie vous devez avoir compris un minimum comment marche NextJS grâce à la documentation https://nextjs.org/docs/ et à la vidéo https://www.youtube.com/watch?v=Sklc_fQBmcs /!\

Dans le même dossier d'où se trouve le dossier `tp2-1-api`, vous allez lancer la commande suivante pour créer un projet NextJS avec comme nom de projet `tp2-1-website`:

```shell
npx create-next-app@latest
```

Vous pouvez supprimer le fichier `.eslintrc.json` qui est le fichier de configuration pour le "linter", qui est en quelque chose le policier qui vous dira si votre code est propre et conforme à la norme, mais on va le supprimer pour le moment, car il
va plus nous embetter qu'autres choses...

Vous avez créé votre premier projet NextJS, félicitations ! Pour le démarrer vous devez lancer la commande `npm run dev`.

Comme le port par défaut de NextJS est 3000 il vous dira qu'il n'a pas pu lancer le serveur à ce port-là, pas de panique, on va faire en sorte de le lancer à un autre port en modifiant le fichier `package.json`

```diff
-    "dev": "next dev",
+    "dev": "next dev -p 8080",
```

Nous allons modifier le fichier `next.config.js` qui est le fichier de configuration du serveur. /!\ Attention, ce fichier est "compilé" quand on construit le projet, donc pour les variables d'environnement ce seront celles à l'instant d'où on build
le projet /!\

```javascript
/**
 * La variable pour avoir l'adresse (et le port) du Backend
 * Si la variable d'environnement BACKEND_URL est définie alors on la choisit, sinon c'est la valeur 'localhost:3000' que l'on utilisera pour le backend
 */
const backendURL = process.env.BACKEND_URL || "localhost:3000"

// On exporte les configurations
module.exports = {
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
        return [
            {
                /*
                 On veut que les routes qui commencement par '/api/ soient redirigées vers le backend pour l'API
                 */
                source: '/api/:path*',
                /*
                On utilise un Proxy pour le backend
                Ça nous évitera de mettre l'adresse complète pour faire des appels à l'API, on aura juste à mettre :
                '/api/users' aux lieu de 'http://localhost:3000/api/users'
                 */
                destination: `http://${backendURL}/api/:path*`
            },
            {
                /*
                On veut que les routes qui commencement par '/socket.io/ soient redirigées vers le backend pour la Websocket
                */
                source: '/socket.io/:path*',
                /*
                On utilise un Proxy pour la websocket du backend
                Ça nous évitera de mettre l'adresse complète pour faire des appels à la websocket, on aura juste à mettre
                */
                destination: `http://${backendURL}/socket.io//:path*`
            }
        ]
    },
    env: {
        EASTER: "EGG"
    }
}
```

**Pour que les modifications du fichier `next.config.js` soient prises en compte, il faut relancer l'application.**

## Etape #6 - Ajout de Bulma pour le CSS

NextJS marche avec un système de composants réutilisables qui permet de créer des applications avec le moins de code possible et surtout sans devoir tout dupliquer. Pour le CSS nous allons utiliser Bulma (https://bulma.io/) et son équivalent pour
NextJS: React Bulma(https://react-bulma.dev/en)

```shell
npm install bulma react-bulma-components
```

Puis pour que le CSS soit disponible de partout nous allons l'importer dans le fichier `pages/_app.js` qui est le point d'entrée de notre application et en quelque sorte la racine de toutes les pages. En plus d'importer Bulma nous allons aussi faire
quelques modifications, donc copiez le fichier

```javascript
// On importe le css que nous avons défini plus celui de Bulma qui nous permettra de donner le style aux composants
import '../styles/globals.css';
import 'bulma/css/bulma.min.css';

/**
 * Ici est le point d'entrée du Frontend, MyApp est l'application NextJS qui nous rendra les pages web
 */
function MyApp({Component, pageProps}) {
    return (
        <Component {...pageProps} />
    )
}

export default MyApp;
```

## Etape #7 - Création de la navbar et du footer

Nous allons créer le footer et la navbar, les deux éléments nécessaires à un site web. Comme ces éléments seront des composants nous allons créer un dossier `components` qui contiendra les composants que l'on utilisera partout dans le projet !

Puis nous allons créer les composants du footer : `components/footer.js`:

```javascript
import {Container, Footer as FooterBulma, Level} from 'react-bulma-components'

/**
 * Le footer de l'application
 */
export const Footer = () => {
    return (
        <FooterBulma>
            <Container>
                <Level>
                    <Level.Item>
                        <small className="level-item">
                            Le footer du TP2-1 &copy; 2022
                        </small>
                    </Level.Item>
                </Level>
            </Container>
        </FooterBulma>
    )
}
```

On peut voir que le composant est en fait une fonction que l'on a nommé 'Footer' et qui retourne du code, le composant, celui-là n'est pas compliqué, car il ne renvoie que du "HTML", et il n'y a pas besoin de logique spéciale, car c'est un simple
footer...

Puis on va créer la navbar `components/navbar.js` qui sera un peu plus compliquée, car on va ajouter de la logique pour les cas où l'utilisateur est connecté. Le composant `Link` est comme la balise `<a>` mais permet de ne pas changer de page en
changeant l'URL puis en relançant la page, mais il change le contenu de la page en changeant l'URL sans relancer la page, c'est ce qui rend l'action fluide !

```javascript
import {Navbar as BulmaNavbar} from 'react-bulma-components'
import React, {useEffect, useState} from 'react'
import Link from "next/link";

/**
 * La navbar
 * @param router Le router de NextJS
 */
export const Navbar = ({router}) => {

    /**
     * Si le burger de la barre de navigation est actif (pour les mobiles)
     */
    const [isActive, setIsActive] = useState(false);

    /**
     * Si l'utilisateur est connecté
     */
    const [isUserLogged, setIsUserLogged] = useState(false);

    /**
     * Si l'utilisateur est un "super utilisateur"
     */
    const [isSuperUser, setIsSuperUser] = useState(false);

    /**
     * Utilisé pour savoir si la page a changé (pour mettre à jour la navbar)
     */
    const [lastPage, setLastPage] = useState(router === null ? undefined : router.pathname);

    /**
     * useEffect utilisé pour vérifier si la page a changé pour savoir si l'utilisateur est toujours connecté
     */
    useEffect(() => {
        if (router !== null && router.pathname !== lastPage) {
            setLastPage(router.pathname)
        }
    })

    return (
        <BulmaNavbar active={isActive} className="isFixed">
            <div className="container">
                <BulmaNavbar.Brand>
                    <BulmaNavbar.Burger onClick={() => setIsActive(!isActive)}/>
                </BulmaNavbar.Brand>
                <BulmaNavbar.Menu>
                    <BulmaNavbar.Container>
                        <BulmaNavbar.Item renderAs="span">
                            <Link href="/" passHref>
                                Home
                            </Link>
                        </BulmaNavbar.Item>


                        <BulmaNavbar.Item renderAs="span">
                            <Link href="/test" passHref>
                                Page test
                            </Link>
                        </BulmaNavbar.Item>


                        {isUserLogged ?
                            <>
                                <BulmaNavbar.Item renderAs="span">
                                    <Link href="/users" passHref>
                                        Utilisateurs
                                    </Link>
                                </BulmaNavbar.Item>

                            </> : null}
                    </BulmaNavbar.Container>

                    <div className="navbar-end">

                        {isSuperUser ?
                            <>
                                <BulmaNavbar.Item renderAs="a" className="has-dropdown is-hoverable">
                                    <BulmaNavbar.Link>
                                        Gestion administrateur
                                    </BulmaNavbar.Link>
                                    <BulmaNavbar.Dropdown>
                                        <BulmaNavbar.Item>
                                            <p style={{color: "#7a7a7a", letterSpacing: ".1em", textTransform: "uppercase"}}>Gestion utilisateurs</p>
                                        </BulmaNavbar.Item>

                                        <BulmaNavbar.Item renderAs="span">
                                            <Link href="/admin" passHref>
                                                Page admin
                                            </Link>
                                        </BulmaNavbar.Item>

                                        <BulmaNavbar.Item renderAs="span">
                                            <Link href="/newuser" passHref>
                                                Créer un utilisateur
                                            </Link>
                                        </BulmaNavbar.Item>
                                    </BulmaNavbar.Dropdown>
                                </BulmaNavbar.Item>
                            </> : null
                        }

                        {isUserLogged ?
                            <>
                                <BulmaNavbar.Item renderAs="a" className="has-dropdown is-hoverable">
                                    <BulmaNavbar.Link>
                                        <BulmaNavbar.Item renderAs="span">
                                            <Link href="/account" passHref>
                                                Compte utilisateur
                                            </Link>
                                        </BulmaNavbar.Item>
                                    </BulmaNavbar.Link>
                                    <BulmaNavbar.Dropdown>
                                        <BulmaNavbar.Item renderAs="span">
                                            <Link href="/logout" passHref>
                                                Déconnexion
                                            </Link>
                                        </BulmaNavbar.Item>
                                    </BulmaNavbar.Dropdown>
                                </BulmaNavbar.Item>
                            </>
                            :
                            <BulmaNavbar.Item renderAs="span">
                                <Link href="/login" passHref>
                                    Connexion
                                </Link>
                            </BulmaNavbar.Item>
                        }
                    </div>
                </BulmaNavbar.Menu>
            </div>
        </BulmaNavbar>
    )
}
```

On peut voir qu'on a plusieurs parties dans ce fichier, encore une fois, on a défini une fonction qui est notre composant, qui prend un argument, le router de NextJS (qui nous servira à savoir si on a changé de page, pour savoir si on doit revérifier
que l'utilisateur est connecté ou non).

On a des variables d'état qui sont définies `const [isUserLogged, setIsUserLogged] = useState(false);` avec la variable en elle-même `isUserLogged`, la fonction pour changer son état `setIsUserLogged` et son état par défaut `false`. NextJS et plus
globalement React utilisent des states (états) pour leurs variables, ce sont des variables qui peuvent être modifiées seulement via leur fonction de modification et qui peuvent être "monitorées" concernant leur changement par NextJS. Si l'état d'une
variable change, alors le composant qui a cette variable est re rendu, ce qui lui permet de montrer les modifications en temps réels et automatiquement.

Pour savoir ce que fait useEffect voir cette page: https://fr.reactjs.org/docs/hooks-effect.html.

Vous pouvez voir que dans le retour du composant Navbar, il y a des balises HTML, des balises de composants et des sous balises de composants. Mais il y a aussi des accolades et du code javascript dedans, des opérateurs ternaires (des `if/else` mais
en écriture courte) pour montrer de la
donnée que si la condition est remplie, par exemple si l'utilisateur est connecté alors on veut montrer certaines choses.

Pour le moment le footer et la navbar ne sont pas appelées, mais pour se faire nous allons créer un nouveau composant que l'on va appeler `layoutWrapper.js`, qui va permettre de "wrapper", "entourer" les pages avec le footer et la navbar (puis
d'autres choses après).

```javascript
import React from "react";
import {Footer} from "./footer";
import {useRouter} from "next/router";
import {Navbar} from "./navbar";

/**
 * Le wrapper pour "wrapper" les pages avec des éléments qui se retrouveront sur chaque page
 * @param children Les enfants qui sont en fait les pages
 */
export const LayoutWrapper = ({children}) => {

    /**
     * Le router
     */
    const router = useRouter();

    return (
        <>
            <Navbar router={router}/>
            <div className="mainContent">
                {children}
            </div>
            <Footer/>
        </>
    )
}
```

Et nous allons appeler ce composant dans le fichier `pages/_app.js` pour que TOUTES les pages rendues aient une navbar et un footer

```javascript
import {LayoutWrapper} from "../components/layoutWrapper";

// On importe le css que nous avons défini plus celui de Bulma qui nous permettra de donner le style aux composants
import '../styles/globals.css';
import 'bulma/css/bulma.min.css';

/**
 * Ici est le point d'entrée du Frontend, MyApp est l'application NextJS qui nous rendra les pages web
 * On utilise un wrapper pour "wrapper" les pages avec certaines choses obligatoire dans un projet : La navbar et le footer !
 */
function MyApp({Component, pageProps}) {
    return (
        <LayoutWrapper>
            <Component {...pageProps} />
        </LayoutWrapper>
    )
}

export default MyApp;
```

Puis il ne faut pas oublier de rajouter la classe CSS `mainContent` dans le fichier `styles/globals.css`.

```css
:root {
    --brandColor: hsl(166, 67%, 51%);
    --background: rgb(247, 247, 247);
    --textDark: hsla(0, 0%, 0%, 0.66);
}

body, .mainContent {
    background: var(--background);
    color: var(--textDark);
}

.footer {
    position: absolute;
    width: 100%;
    height: 5rem;
}

.mainContent {
    min-height: 100vh;
}
```

Si vous allez sur http://localhost:8080/ vous pourrez voir votre navbar et votre footer avec la page par défaut de NextJS.

## Etape #8 - Création des pages

Pour le moment il y a une seule page dans le projet, nous allons ajouter toutes les pages nécessaires au bon fonctionnement de notre projet :

Avant de créer les pages, on va créer un "wrapper" pour entourer les pages pour quelles soient uniformes et qu'elles aient la même tête, vous devez créer le composant le `components/pageWrapper.js`

```javascript
import {Columns, Container, Section} from "react-bulma-components";

/**
 * Le wrapper pour "wrapper" les pages et faire en sorte qu'elles aient la même forme pour chaque page
 * @param children Le contenue de la page
 */
export const PageWrapper = ({children}) => {
    return (
        <Section>
            <Container>
                <Columns className="is-multiline">
                    {children}
                </Columns>
            </Container>
        </Section>
    )
}
```

La page d'accueil qui sera à l'adresse http://localjost:8080/, la page `pages/index.js`

```javascript
import {PageWrapper} from "../components/pageWrapper";
import {Columns, Heading} from "react-bulma-components";

// La page de l'index, c'est à dire le '/'
const IndexPage = () => {
    return (
        <PageWrapper>
            <Columns.Column className="is-8 is-offset-2 tp-notification">
                <Heading className="is-3">Page d'accueil</Heading>
                <p className="description">La page d'accueil du Frontend du TP2-1</p>
                <hr/>
                <p>Dans un premier temps vous devez vous connecter avec ces identifiants:</p>
                <br/>
                <p>
                    <code>Email: admin</code>
                </p>
                <p>
                    <code>Mot de passe: admin</code>
                </p>
                <br/>
                <p>Puis faites ce que vous voulez sur le frontend !</p>
            </Columns.Column>
        </PageWrapper>
    )
}

// On exporte la page
export default IndexPage;
```

Nous allons ajouter un peu de CSS pour que la page soit plus jolie dans le fichier `styles/global.css` et on va aussi directement ajouter les classes dont on aura besoin !

```css
.tp-notification {
    margin-top: 4rem;
    background: white;
    border-radius: 10px;
}

.tp-notification-bigger {
    margin-top: 10rem;
    background: white;
    border-radius: 10px;
}

.tp-message {
    margin-top: 1.5rem !important;
    position: fixed !important;
    width: 100% !important;
    top: 0 !important;
    transform: translate(-50%, -50%) !important;
    left: 50% !important;
    z-index: 1000 !important;
}

.goBackButtonIcon {
    position: absolute;
    cursor: pointer;
}

.goBackButtonIcon:hover {
    filter: opacity(0.8);
}
```

On peut aussi créer la page http://localhost:8080/test qui sera créée ) partir du fichier `pages/test/index.js`

```javascript
import {PageWrapper} from "../../components/pageWrapper";
import {Columns, Heading} from "react-bulma-components";

// La page de test, c'est-à-dire le '/test'
const TestPage = () => {
    return (
        <PageWrapper>
            <Columns.Column className="is-8 is-offset-2 tp-notification">
                <Heading className="is-3">Page test</Heading>
                <p className="description">Ceci est une page de test</p>
            </Columns.Column>
        </PageWrapper>
    )
}

// On exporte la page
export default TestPage;
```

Puis nous allons ajouter la page `pages/login/index.js` (http://localhost:8080/login) pour qu'un utilisateur puisse se connecter au Backend et avoir une session utilisateur

```javascript
import {PageWrapper} from "../../components/pageWrapper";
import {Columns, Heading} from "react-bulma-components";
import {LoginForm} from "../../components/users/loginForm";

/**
 * La page pour connecter un utilisateur "/login"
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 * @param showInfoMessage Fonction pour montrer un message d'information
 */
const LoginPage = ({showErrorMessage, showInfoMessage, showSuccessMessage}) => {

    // Sinon on renvoie la page pour se connecter
    return (
        <PageWrapper>
            <Columns.Column className="is-4 is-offset-4 tp-notification-bigger">
                <Columns>
                    <Columns.Column className="right has-text-centered">
                        <Heading className="is-3">Formulaire de connexion</Heading>
                        <p className="description">Pour vous connecter, utilisez l'email et le mot de passe que l'administrateur vous a donné.</p>
                        <LoginForm showErrorMessage={showErrorMessage} showInfoMessage={showInfoMessage}/>
                    </Columns.Column>
                </Columns>
            </Columns.Column>
        </PageWrapper>
    );
}

export default LoginPage;
```

Vous allez avoir des erreurs, car le composant `components/customPuffLoader` n'a pas encore été crée, donc c'est ce qu'on va faire, mais comme ce dernier utilise le package `react-spinners`, nous devons l'installer avec la
commande `npm install react-spinners`

```javascript
import {PuffLoader} from "react-spinners";

/**
 * Le loader qui se montrera quand on attendra de la donnée
 */
export const CustomPuffLoader = () => {
    return <PuffLoader cssOverride={{zIndex: 100000000, position: "fixed", top: "50%", left: "50%"}} color="#EA5B0C"/>;
}
```

Ce composant créera un spinner au milieu de l'écran pour montrer que des choses se font et/ou chargent en arrière-plan.

Puis nous allons créer le composant qui sera en fait le formulaire pour qu'un utilisateur se connecte, ce composant se trouvera dans le fichier `components/users/loginForm.js`. Mais avant il faudra installer les packages `axios` et `crypto-js` avec
la commande `npm install axios crypto-js`

```javascript
import {Button, Form} from "react-bulma-components";
import {useState} from "react";
import sha256 from "crypto-js/sha256";
import {useRouter} from "next/router";
import axios from "axios";

/**
 * Le composant pour que l'utilisateur se connecte
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showInfoMessage Fonction pour montrer un message d'information
 */
export const LoginForm = ({showErrorMessage, showInfoMessage}) => {

    /**
     * Les données pour la connection de l'utilisateur
     */
    const [connectionData, setConnectionData] = useState({
        email: "",
        password: "",
    })

    /**
     * Fonction utilisée pour mettre à jour les champs
     * @param e L'événement
     */
    const updateField = (e) => {
        setConnectionData({
            ...connectionData,
            [e.target.name]: e.target.value
        });
    }

    /**
     * Fonction pour connecter l'utilisateur
     * @param event L'événement du click du button
     */
    const logUserIn = async (event) => {

        // On fait en sorte que l'événement par défaut ne se déclanche pas
        event.preventDefault();

        // Nous vérifions d'abord que tous les champs ont été remplis, sinon nous affichons un message
        for (const key in connectionData) {
            if (connectionData[key] === '') {
                return showErrorMessage(`Une ou plusieurs valeur de connexion n'a pas été remplie`, "Veuillez recommencer");
            }
        }

        // On essaye de connecter l'utilisateur
        try {
            const response = await axios.get('/api/login', {
                auth: {

                    // On n'oublie pas de trim (enlever les espaces avant et après de la chaine de caractères)
                    username: connectionData.email.trim(),

                    // On hash le mot de passe en sha256 pour la sécurité !
                    password: sha256(connectionData.password).toString()
                }
            });

            // Comme on est arrivé là, c'est que la connexion a fonctionné et on peut donc rediriger l'utilisateur vers la page de compte en montrant un message
            showInfoMessage("Vous vous êtes connecté avec succès et vous êtes redirigé vers votre compte");
            router.replace("/account");
        }

            // Si on attrape une erreur alors on montre un message d'erreur
        catch (e) {
            showErrorMessage("Il y a eu une erreur lors de la connexion de l'utilisateur", e.response.data);
        }
    }

    /**
     * Fonction qui s'exécute si un utilisateur appuie sur la touche entrée (pour que ça soit plus rapide que de cliquer sur le bouton de connexion)
     * @param event L'événement
     */
    const handleKeyDown = (event) => {

        // La touche 13 est la touche "entrer"
        if (event.keyCode === 13 && event.shiftKey === false) {
            logUserIn(event);
        }
    }

    return (
        <form>
            <Form.Field>
                <Form.Control>
                    <Form.Input name="email" className="is-medium" type="email"
                                placeholder="Email" onKeyDown={handleKeyDown}
                                onChange={updateField} value={connectionData.email} autoComplete="email"/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>
                    <Form.Input name="password" className="is-medium" type="password"
                                placeholder="Mot de passe" onKeyDown={handleKeyDown} onChange={updateField}
                                value={connectionData.password} autoComplete="current-password"/>
                </Form.Control>
            </Form.Field>

            <Button onClick={logUserIn} className="is-block is-primary is-fullwidth is-medium">Se connecter</Button>
            <br/>
            <small>
                <em>Vous vous n'avez pas de compte, demandez à l'administrateur ;)</em>
            </small>
        </form>
    )
}
```

Puis la dernière dépendance manquante est la fonction `checkIfUserLogged` qui sera utilisé dans tout le projet pour savoir si un utilisateur est connecté ou non, on va donc créer un dossier `utils` avec un fichier `utils.js` qui stockera cette
fonction

```javascript
import axios from "axios";

/**
 * Faire une demande pour savoir si l'utilisateur (lui-même) est authentifié
 */
export const checkIfUserLogged = async () => {

    // On essaye de faire la requête
    try {

        // On lance la requête
        const response = await axios.get("/api/authenticated");

        // On retourne le résultat si le try est un succès
        return response.data
    }

        // Si on attrape une erreur alors on en relance une disant que l'utilisateur n'est pas connecté
    catch (e) {
        throw new Error("L'utilisateur n'est pas connecté")
    }
}
```

Si on va sur la page http://localhost:8080/login, on peut voir qu'il manque encore une chose, les fonctions showInfoMessage et showErrorMessage, ces fonctions seront pour montrer un message à l'utilisateur pendant quelques secondes. Mais un problème
se pose, comment donner une fonction en argument pour une page ? Et bien une solution existe en ajoutant des instructions dans le fichier `components/layoutWrapper.js` :

```javascript
import React, {useState} from "react";
import {Footer} from "./footer";
import {Message} from "./messages";
import {useRouter} from "next/router";
import {Navbar} from "./navbar";

/**
 * Le wrapper pour "wrapper" les pages avec des éléments qui se retrouveront sur chaque page
 * @param children Les enfants qui sont en fait les pages
 */
export const LayoutWrapper = ({children}) => {

    /**
     * Le router
     */
    const router = useRouter();

    /**
     * L'objet du message
     */
    const [messageObject, setMessageObject] = useState({
        message: undefined,
        tooltip: undefined,
        visible: false,
        type: undefined
    });

    /**
     * Montre un message d'erreur
     * @param message Le titre du message à montrer
     * @param tooltip Le contenu du message
     */
    const showErrorMessage = (message, tooltip) => {

        if (tooltip === undefined) {
            tooltip = "Essayer encore"
        }

        setMessageObject({
            message: message,
            tooltip: tooltip,
            visible: true,
            type: "danger"
        });
    }

    /**
     * Montre un message de succès
     * @param message Le titre du message à montrer
     * @param tooltip Le contenu du message
     */
    const showSuccessMessage = (message, tooltip) => {

        if (tooltip === undefined) {
            tooltip = "Succès"
        }

        setMessageObject({
            message: message,
            tooltip: tooltip,
            visible: true,
            type: "success"
        });
    }

    /**
     * Montre un message d'info
     * @param message Le titre du message à montrer
     * @param tooltip Le contenu du message
     */
    const showInfoMessage = (message, tooltip) => {

        if (tooltip === undefined) {
            tooltip = "Pour information"
        }

        setMessageObject({
            message: message,
            tooltip: tooltip,
            visible: true,
            type: "info"
        });
    }

    /**
     * Cache le message
     */
    const hideMessage = () => {
        setMessageObject({
            message: undefined,
            tooltip: undefined,
            visible: false,
            type: undefined
        });
    }

    return (
        <>
            <Navbar router={router}/>
            <Message hideMessage={hideMessage} message={messageObject.message} tooltip={messageObject.tooltip} visible={messageObject.visible} type={messageObject.type}/>
            <div className="mainContent">

                {/* Faire ça nous permet de donner à TOUTES les pages les fonctions pour montrer les messages */}
                {React.Children.map(children, (child, index) =>
                    React.cloneElement(child, {
                        showErrorMessage: showErrorMessage,
                        showSuccessMessage: showSuccessMessage,
                        showInfoMessage: showInfoMessage
                    })
                )}
            </div>
            <Footer/>
        </>
    )
}
```

Ces lignes permettent de cloner les pages en leur donnant de la donnée en plus dans leurs paramètres et dans notre cas les fonctions showErrorMessage, showSuccessMessage et showInfoMessage pour montrer des messages

```javascript
{
    React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
            showErrorMessage: showErrorMessage,
            showSuccessMessage: showSuccessMessage,
            showInfoMessage: showInfoMessage
        })
    )
}
```

On peut cependant noter qu'il y a un appel au composant `Message` mais nous n'avons pas encore créé ce dernier, vous allez créer un fichier `components/messages.js` pour créer ce message

```javascript
import {Button, Container, Message as BulmaMessage} from "react-bulma-components";
import {useEffect} from "react";

/**
 * Un message qui peut prendre plusieurs types
 * @param message Le titre du message
 * @param tooltip Le contenu du message
 * @param visible Si le message est visible
 * @param hideMessage La fonction pour cache le message
 * @param type Le type du message
 */
export const Message = ({message, tooltip, visible, hideMessage, type}) => {

    // 5 secondes après l'affichage du message, on le cache
    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                if (visible) {
                    hideMessage();
                }
            }, 5000)
        }
    })

    // S'il n'est pas visible on ne montre rien grâce à null
    if (!visible) {
        return null;
    }

    return (
        <Container className="tp-message">
            <BulmaMessage color={type} style={{position: "absolute", width: "100%"}}>
                <BulmaMessage.Header>
                    <p>{message}</p>
                    <Button style={{backgroundColor: "rgba(10,10,10,.2)"}} onClick={() => hideMessage()} className="delete" aria-label="delete"/>
                </BulmaMessage.Header>
                <BulmaMessage.Body>
                    {tooltip}
                </BulmaMessage.Body>
            </BulmaMessage>
        </Container>
    )
}
```

On peut se connecter maintenant avec l'email `admin` and le mot de passe `admin` à la page http://localhost:8080/login.

## Etape #9 - Page account et logout

On atterrit sur la page http://localhost:8080/account qui n'a pas encore été créé, on va donc la créer avec le fichier `/pages/account/index.js` et ajouter le package `moment` pour formatter les dates plus facilement qu'avec le package de base de
NodeJS: `npm install moment`

```javascript
import {Columns, Heading} from "react-bulma-components";
import {PageWrapper} from "../../components/pageWrapper";
import {useEffect, useState} from "react";
import {CustomPuffLoader} from "../../components/customPuffLoader";
import moment from "moment";
import {useRouter} from "next/router";
import axios from "axios";

/**
 * La page montrer les informations du compte de l'utilisateur. "/account"
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 */
const AccountPage = ({showErrorMessage, showSuccessMessage}) => {

    /**
     * On récupère le router de NextJS
     */
    const router = useRouter();

    /**
     * Variable pour savoir si on a récupéré les informations de l'utilisateur
     */
    const [loaded, setLoaded] = useState(false);

    /**
     * Les données de l'utilisateur
     */
    const [userData, setUserData] = useState(null);

    /**
     * Variable pour mettre les boutons en mode loading et disabled, pendant qu'on attend la réponse du serveur
     */
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Met à jour la partie user dans la variable userData
     * @param newUser Le nouvel utilisateur
     */
    const setUser = (newUser) => {
        setUserData({
            ...userData,
            user: newUser
        })
    }

    // Le useEffet pour récupérer les informations de l'utilisateur
    useEffect(() => {
        (async () => {

            // Si la donnée n'a pas encore été récupérée on le fait
            if (!loaded) {

                // On essaye de faire la requête
                try {
                    let response = await axios.get("/api/userdata");

                    // On met les informations de l'utilisateur
                    setUserData(response.data);
                }

                    // Si on attrape une erreur cela veut dire qu'on n'a pas réussi à récupérer les informations de l'utilisateur actuel, donc on met ces informations à undefined
                catch (e) {
                    showErrorMessage("Les informations de l'utilisateur n'ont pas pu être récupérées", e.response.data);
                    setUserData(undefined);
                }

                // On dit que la donnée a été récupérée
                setLoaded(true);
            }
        })()
    }, [loaded]);

    // Si la données n'a pas encore été récupérée alors on renvoie le loader pour montrer que c'est en cours
    if (!loaded) {
        return <CustomPuffLoader/>
    }

    // Si la donnée de l'utilisateur est non définie alors on le renvoie à la page d'accueil
    if (userData === undefined) {
        router.replace("/");
        return null;
    }

    return (
        <PageWrapper>
            <Columns.Column className="column is-10 is-offset-1 tp-notification-bigger">
                <Columns>
                    <Columns.Column className="left">
                        <Heading>Bonjour {userData.user.prenom} {userData.user.nom}</Heading>
                        <Heading className="subtitle">Vous pouvez visualiser votre compte</Heading>
                        <p>Date de création
                            <em title={moment(userData.createdAt).format("LLLL")}>{moment(userData.createdAt).format("LL")}</em>
                        </p>
                        <p>Email
                            <em>{userData.email}</em>
                        </p>
                        <p>Age
                            <em>{userData.user.age}</em>
                        </p>
                        <p color="red">{userData.isSuperUser ? "Vous êtes un super utilisateur" : "Vous n'êtes pas un super utilisateur"}</p>
                    </Columns.Column>
                </Columns>
            </Columns.Column>
        </PageWrapper>
    )
}

// On exporte la page
export default AccountPage;
```

On peut maintenant voir nos informations, pour le moment il n'y a pas de modification possible, nous allons ajouter ça plus tard !

Mais d'abord nous allons ajouter une page pour se déconnecter, la page http://localhost:8080/logout en créant le fichier `pages/logout/index.js`

```javascript
import {useEffect} from 'react';
import {useRouter} from "next/router";
import axios from "axios";
import {CustomPuffLoader} from "../../components/customPuffLoader";

/**
 * La page pour déconnecter un utilisateur "/logout"
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 */
const LogoutPage = ({showErrorMessage, showSuccessMessage}) => {

    /**
     * On récupère le router de NextJS
     */
    const router = useRouter();

    // On utilise un useEffect pour déconnecter l'utilisateur via la route delete "/api/logout"
    useEffect(() => {
        (async () => {

            // On essaye de déconnecter l'utilisateur
            try {
                await axios.delete("/api/logout");

                // Si c'est bien le cas alors on montre le message
                showSuccessMessage("Vous avez bien été déconnecté");
            } catch (e) {
            }

            // On redirige l'utilisateur vers la page d'accueil
            router.push("/");
        })()
    }, []); // Mettre une dépendance au useEffet avec un tableau vide nous permet de lui dire de ne le faire qu'une seule fois

    // On retourne que le loader pour montrer qu'une action est en cours
    return <CustomPuffLoader/>;
}

export default LogoutPage;
```

C'est bien beau de se déconnecter en allant sur une page web, mais il faudrait qu'on ait un bouton pour se déconnecter directement, et en fait, c'est déjà le cas dans la navbar, mais nous n'y avons pas encore accès, car la navbar n'a pas ses états de
mis à jour, il faut ajouter les lignes dans `components/navbar.js`

```javascript
...

/**
 * useEffect utilisé pour vérifier si la page a changé pour savoir si l'utilisateur est toujours connecté
 */
useEffect(() => {
    if (router !== null && router.pathname !== lastPage) {
        setLastPage(router.pathname)
    }
})

/**
 * useEffect pour savoir si l'utilisateur est toujours connecté et pour mettre à jour la barre de navigation en conséquence.
 */
useEffect(() => {
    (async () => {

        // Si l'utilisateur semble être connecté, nous vérifions auprès du serveur si l'utilisateur est réellement connecté.
        try {
            const isUserLoggedData = await checkIfUserLogged();

            // Si la requête est un succès alors on peut mettre la réponse de si l'utilisateur est connecté et s'il est un "super utilisateur"
            setIsUserLogged(isUserLoggedData.isUserLogged);
            setIsSuperUser(isUserLoggedData.isSuperUser);
        }

            // Si on attrape une erreur alors on met que l'utilisateur n'est ni connecté, ni un "super utilisateur"
        catch (e) {
            setIsUserLogged(false);
            setIsSuperUser(false);
        }
    })();
}, [lastPage]);

...
```

On peut maintenant voir que si on est connecté, la navbar change et on peut se déconnecter et accéder à pleins de pages !

## Etape #10 - Modification et visualisation utilisateurs

Le but de ce projet est de modifier des utilisateurs, mais pour le moment ce n'est pas le cas, et dans un but pratique il faudrait déjà être capable de se modifier soit même !

Nous allons donc créer un composant `components/users/user.js` qui nous servira de visualiser les champs d'un utilisateur, mais surtout de les modifier si on en a les droits !

```javascript
import {Button, Form} from "react-bulma-components";
import axios from "axios";
import {useState} from "react";
import {useRouter} from "next/router";

/**
 * Le composant pour visionner un utilisateur et le modifier si l'utilisateur en a les droits
 * @param user L'utilisateur
 * @param setUser La fonction pour mettre à jour l'utilisateur
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 */
export const User = ({user, setUser, showSuccessMessage, showErrorMessage}) => {

    /**
     * Le router
     */
    const router = useRouter()

    /**
     * L'utilisateur modifiable
     */
    const [userToUpdate, setUserToUpdate] = useState(user);

    /**
     * Si une requête est en cours pour mettre les champs en disabled et loading
     */
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Fonction utilisée pour mettre à jour les champs
     * @param e L'événement
     */
    const updateField = (e) => {
        setUserToUpdate({
            ...userToUpdate,
            [e.target.name]: e.target.value
        });
    }

    /**
     * Quand l'utilisateur veut supprimer un utilisateur
     * @param event L'événement
     */
    const handleUserDelete = async (event) => {
        // On fait en sorte que l'événement par défaut ne se déclanche pas
        event.preventDefault();

        // On veut mettre les champs en mode disabled et loading
        setIsLoading(true);

        // On veut faire la suppression de l'utilisateur
        await deleteUser(user);

        // Peu importe s'il y a une erreur ou un succès, on veut remettre les champs à la normale (plus en mode loading et disabled)
        setIsLoading(false);
    }

    /**
     * Quand l'utilisateur veut mettre à jour un utilisateur
     * @param event L'événement
     */
    const handleUserUpdate = async (event) => {
        // On fait en sorte que l'événement par défaut ne se déclanche pas
        event.preventDefault();

        // On veut mettre les champs en mode disabled et loading
        setIsLoading(true);

        // On veut faire la modification
        const updateUserResult = await updateUser(userToUpdate);

        // Peu importe s'il y a une erreur ou un succès, on veut remettre les champs à la normale (plus en mode loading et disabled)
        setIsLoading(false);
    }

    /**
     * Supprime l'utilisateur
     * @param userToDelete L'utilisateur à supprimer
     */
    const deleteUser = async (userToDelete) => {

        // On essaye de faire la requête de suppression
        try {
            const response = await axios.delete(`/api/user/${userToDelete._id}`);

            // On montre un message de succès
            showSuccessMessage("La suppression de l'utilisateur est un succès", `L'utilisateur ${response.data.prenom} ${response.data.nom} a été supprimé !`)

            // Si la suppression est un succès alors on renvoie l'utilisateur vers la page "/users" car cet utilisateur n'existe plus
            router.replace("/users");
        }

            // Si on attrape une erreur alors on montre un message d'erreur
        catch (e) {
            showErrorMessage("Il y a eu une erreur lors de la suppression de l'utilisateur", e.response.data);
        }
    }

    /**
     * Met l'utilisateur à jour
     * @param userToUpdate L'utilisateur à mettre à jour
     */
    const updateUser = async (userToUpdate) => {

        // On essaye de faire la requête de mise à jour
        try {
            const response = await axios.put(`/api/user/${userToUpdate._id}`, userToUpdate);

            // On montre un message de succès
            showSuccessMessage("La mise à jour de l'utilisateur est un succès", `L'utilisateur ${response.data.prenom} ${response.data.nom} a été modifié !`)

            // On veut mettre à jour l'utilisateur
            setUser(response.data);

            // On renvoie la donnée de la réponse pour permettre au composant de faire ce qu'il veut avec
            return response.data;
        }

            // Si on attrape une erreur alors on montre un message d'erreur
        catch (e) {
            showErrorMessage("Il y a eu une erreur lors de la mise à jour de l'utilisateur", e.response.data);

            // On renvoie undefined
            return undefined;
        }
    }

    return (
        <div>
            <Form.Field>
                <Form.Control>
                    <Form.Label>Nom</Form.Label>
                    <Form.Input name="nom" className="is-medium"
                                placeholder="Nom" onChange={updateField}
                                value={userToUpdate.nom} disabled={isLoading}/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>
                    <Form.Label>Prénom</Form.Label>
                    <Form.Input name="prenom" className="is-medium"
                                placeholder="Prénom" onChange={updateField}
                                value={userToUpdate.prenom} disabled={isLoading}/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>
                    <Form.Label>Age</Form.Label>
                    <Form.Input name="age" className="is-medium" type="number"
                                placeholder="Age" onChange={updateField}
                                value={userToUpdate.age} disabled={isLoading}/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>

                    <Button.Group align="right">
                        <Button onClick={handleUserDelete} disabled={isLoading} loading={isLoading} color="danger">Supprimer l'utilisateur</Button>
                        <Button onClick={handleUserUpdate} disabled={isLoading} loading={isLoading} color="success">Mettre à jour l'utilisateur</Button>
                    </Button.Group>
                </Form.Control>
            </Form.Field>
        </div>
    )
}
```

Puis, il faudra ajouter ce composant dans la page `pages/account/index.js`

```javascript
    return (
    <PageWrapper>
        <Columns.Column className="column is-10 is-offset-1 tp-notification-bigger">
            <Columns>
                <Columns.Column className="left">
                    <Heading>Bonjour {userData.user.prenom} {userData.user.nom}</Heading>
                    <Heading className="subtitle">Vous pouvez visualiser votre compte</Heading>
                    <p>Date de création
                        <em title={moment(userData.createdAt).format("LLLL")}>{moment(userData.createdAt).format("LL")}</em>
                    </p>
                    <p>Email
                        <em>{userData.email}</em>
                    </p>
                    <p>Age
                        <em>{userData.user.age}</em>
                    </p>
                    <p color="red">{userData.isSuperUser ? "Vous êtes un super utilisateur" : "Vous n'êtes pas un super utilisateur"}</p>

                    <hr/>

                    <Heading className="subtitle">Vous pouvez modifier votre compte</Heading>
                    <User user={userData.user} setUser={setUser} showErrorMessage={showErrorMessage} showSuccessMessage={showSuccessMessage}/>
                </Columns.Column>
            </Columns>
        </Columns.Column>
    </PageWrapper>
)
```

Si vous retournez sur la page http://localhost:8080/account vous pouvez modifier vos informations d'utilisateur ! Mais en tant qu'utilisateur vous voulez aussi modifier les informations utilisateurs des autres utilisateurs et c'est ce que l'on va
ajouter !

On va déjà créer la page qui contiendra une liste simplifiée des utilisateurs présents dans la base de données, cette page sera dans le fichier `/pages/users/index.js` et qui sera accessible via l'adresse http://localhost:8080/users

```javascript
import {Columns, Heading} from "react-bulma-components";
import {PageWrapper} from "../../components/pageWrapper";
import {useEffect, useState} from "react";
import axios from "axios";
import {UsersList} from "../../components/users/usersList";

/**
 * La page pour visionner les utilisateurs "/users"
 * @param showSuccessMessage Fonction pour montrer un message de succès
 */
const UsersPage = ({showErrorMessage}) => {

    /**
     * Variable pour savoir si la donnée a été récupérée
     */
    const [loaded, setLoaded] = useState(false);

    /**
     * Les utilisateurs
     */
    const [users, setUsers] = useState([]);

    // On utilise un useEffet pour récupérer les utilisateurs
    useEffect(() => {
        (async () => {

            // On veut faire la requête une seule fois
            if (!loaded) {

                // On essaye de faire la requête pour récupérer les utilisateurs
                try {
                    const response = await axios.get(`/api/users`);

                    // On met à jour les utilisateurs
                    setUsers(response.data);
                }

                    // Si on attrape une erreur alors on montre un message d'erreur
                catch (e) {
                    showErrorMessage("Il y a eu une erreur lors de la récupération des utilisateurs", e.response.data);
                }

                // On dit que la donnée est mise à jour
                setLoaded(true);
            }
        })()
    }, [loaded]);

    return (
        <PageWrapper>
            <Columns.Column className="is-8 is-offset-2 tp-notification">
                <Columns>
                    <Columns.Column className="right">
                        <Heading className="is-3">Liste des utilisateurs</Heading>
                        <Heading className="subtitle">Clicker dessus pour y accéder</Heading>
                        <hr/>
                        <UsersList users={users}/>
                    </Columns.Column>
                </Columns>
            </Columns.Column>
        </PageWrapper>
    );
}

export default UsersPage;
```

Si on essaye d'accéder à cette page, on aura une erreur, car le composant `components/users/usersList.js` n'existe pas encore, on le crée

```javascript
import {Panel} from "react-bulma-components";
import {UserPreview} from "./userPreview";

/**
 * Le composant pour montrer les utilisateurs sous forme de liste
 * @param users Les utilisateurs
 */
export const UsersList = ({users}) => {
    return (
        <Panel>
            {/* On veut montrer la liste d'utilisateur avec un composant <UserPreview/> par utilisateur */}
            {users.map((user) => <UserPreview key={user._id} user={user}/>)}
        </Panel>
    );
}
```

Mais encore une fois, il nous manque un élément... Il faut donc ajouter le composant `components/users/userPreview.js` qui montrera une version simplifiée de l'utilisateur et qui nous permettra de naviguer sur la page de l'utilisateur en question en
cliquant dessus.

```javascript
import {Card, Heading} from "react-bulma-components";
import Link from "next/link";
import moment from "moment";

export const UserPreview = ({user}) => {
    return (
        <Link href={`/users/${user._id}`}>
            <Card style={{cursor: "pointer", marginBottom: "0.5rem"}}>
                <Card.Content>
                    <Heading className="is-4">{user.prenom} {user.nom}, {user.age} ans. Crée {moment(user.createdAt).from()}</Heading>
                </Card.Content>
            </Card>
        </Link>
    )
}
```

Maintenant si on va sur la page http://localhost:8080/users, on peut voir tous les utilisateurs dans la base de données, mais ça se résume à vous.

Puis on voudra modifier un utilisateur et on a déjà fait une grande partie du travail grâce au composant `components/users/user.js`, on va donc créer une page pour prendre dans son endpoint un identifiant d'utilisateur qui servira à récupérer la
donnée de ce dernier et ainsi pouvoir modifier ces données. Vous avez dû le lire, pour créer une page qui se comporte comme ça http://localhost:8080/users/:userId il faut créer le fichier `pages/users/[userId].js` et voici son contenu

```javascript
import {Columns, Heading, Section} from "react-bulma-components";
import {PageWrapper} from "../../components/pageWrapper";
import {CustomPuffLoader} from "../../components/customPuffLoader";
import {useEffect, useState} from "react";
import {GoBackUrlButton} from "../../components/goBackUrlButton";
import {useRouter} from "next/router";
import {User} from "../../components/users/user";
import axios from "axios";

/**
 * La page pour visionner un utilisateur "/users/:userId"
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 */
const UserEditorPage = ({showErrorMessage, showSuccessMessage}) => {

    /**
     * Le router
     */
    const router = useRouter()

    /**
     * l'id de l'utilisateur
     */
    const userId = router.query.userId;

    /**
     * Si la donnée de l'utilisateur a été récupérée
     */
    const [loaded, setLoaded] = useState(false);

    /**
     * L'utilisateur
     */
    const [user, setUser] = useState(null);

    // On utilise un useEffet pour récupérer l'utilisateur
    useEffect(() => {
        (async () => {

            // On veut faire la requête une seule fois
            if (!loaded) {

                // On essaye de faire la requête pour récupérer l'utilisateur
                try {
                    const response = await axios.get(`/api/user/${userId}`);

                    // On met à jour l'utilisateur
                    setUser(response.data);
                }

                    // Si on attrape une erreur alors on montre un message d'erreur et on met que l'utilisateur est non défini
                catch (e) {
                    showErrorMessage("Il y a eu une erreur lors de la récupération de l'utilisateur", e.response.data);

                    setUser(undefined);
                }

                // On dit que la donnée est mise à jour
                setLoaded(true);
            }
        })()
    }, [loaded]);

    // Si la donnée n'a pas encore été récupérée on montre le loader
    if (!loaded) {
        return <CustomPuffLoader/>
    }

    // Si l'utilisateur n'est pas défini ça veut dire qu'il n'existe pas et donc on veut revenir à la page des utilisateurs
    if (user === undefined) {
        router.replace("/users");
        return null;
    }

    return (
        <PageWrapper>
            <Columns.Column className="is-10 is-offset-1 tp-notification">
                <Columns>
                    <Columns.Column className="right">
                        <GoBackUrlButton url={"/users"}/>
                        <div className="has-text-centered">
                            <Heading className="is-3">Gestion utilisateur</Heading>
                            <p className="description">L'utilisateur actuel est {user.prenom} {user.nom}</p>
                            <hr/>
                        </div>
                        <Section>
                            <User user={user} setUser={setUser} showErrorMessage={showErrorMessage} showSuccessMessage={showSuccessMessage}/>
                        </Section>
                    </Columns.Column>
                </Columns>
            </Columns.Column>
        </PageWrapper>
    );
}

export default UserEditorPage
```

Il y aura une petite erreur d'import, car le composant `components/goBackUrlButton.js` n'a pas encore été créé et il faudra installer le package `react-icons` via la commande `npm install react-icons` :

```javascript
import {Icon} from "react-bulma-components";
import {TiArrowBack} from "react-icons/ti";
import Link from "next/link";

export const GoBackUrlButton = ({url}) => {
    return (
        <Link href={url} passHref>
            <Icon title="Retourner en arrière" className="goBackButtonIcon" size="medium">
                <TiArrowBack size="larger"/>
            </Icon>
        </Link>
    )
}
```

On peut maintenant aller sur la page http://localhost:8080/users et clicker sur un utilisateur pour modifier ses données ou le supprimer.

## Etape #11 - Création d'utilisateur

On peut maintenant lire, modifier et supprimer des utilisateurs, mais il n'est pas encore possible de créer un utilisateur. Nous allons donc ajouter la page `pages/newuser/index.js` qui contiendra un formulaire pour créer un nouvel utilisateur

```javascript
import {PageWrapper} from "../../components/pageWrapper";
import {Columns, Heading} from "react-bulma-components";
import {UserCreationForm} from "../../components/users/userCreationForm";

/**
 * La page pour créer un nouvel utilisateur, c'est à dire le '/newuser'
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 */
const NewUserPage = ({showErrorMessage, showSuccessMessage}) => {
    return (
        <PageWrapper>
            <Columns.Column className="is-8 is-offset-2 tp-notification">
                <Heading className="is-3">Page pour ajouter un compte utilisateur</Heading>
                <p className="description">Seul un admin peut ajouter un utilisateur</p>
                <hr/>
                <UserCreationForm showErrorMessage={showErrorMessage} showSuccessMessage={showSuccessMessage}/>
            </Columns.Column>
        </PageWrapper>
    )
}

// On exporte la page
export default NewUserPage;
```

Comme le composant `components/users/userCreationForm.js` (le formulaire) n'existe pas on va le créer, il servira à créer un compte et son utilisateur associé. Dans une vraie application, c'est l'utilisateur qui se créer lui-même son compte, mais
dans ce projet, c'est plus intéressant de faire en sorte qu'un administrateur créé lui-même les utilisateurs et leurs comptes.

```javascript
import {Button, Form, Heading} from "react-bulma-components";
import {useState} from "react";
import sha256 from "crypto-js/sha256";
import axios from "axios";

/**
 * Le composant pour créer un utilisateur
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 */
export const UserCreationForm = ({showErrorMessage, showSuccessMessage}) => {

    /**
     * Les données pour la création d'un compte utilisateur
     */
    const [newUserAccountData, setNewUserAccountData] = useState({
        email: "",
        password: "",
        passwordConfirmation: "",
        isSuperUser: false,
        nom: "",
        prenom: "",
        age: 18
    })

    /**
     * Fonction utilisée pour mettre à jour les champs, soit le type d'input est une checkbox où alors la valeur sera stockée dans l'attribut checked et non value
     * @param e L'événement
     */
    const updateField = (e) => {
        setNewUserAccountData({
            ...newUserAccountData,
            [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value
        });
    }

    /**
     * Fonction pour créer un compte utilisateur
     * @param event L'événement du click du button
     */
    const signUserUp = async (event) => {

        // On fait en sorte que l'événement par défaut ne se déclanche pas
        event.preventDefault();

        // Nous vérifions d'abord que tous les champs ont été remplis, sinon nous affichons un message
        for (const key in newUserAccountData) {
            if (newUserAccountData[key] === '') {
                return showErrorMessage(`Une ou plusieurs valeur de connexion n'a pas été remplie`, "Veuillez recommencer");
            }
        }

        // SI le mot de passe et sa confirmation ne sont pas les mêmes alors on renvoie une erreur
        if (newUserAccountData.password !== newUserAccountData.passwordConfirmation) {
            return showErrorMessage("Le mot de passe et sa confirmation doivent être les mêmes");
        }

        // On essaye de créer un compte utilisateur
        try {
            const response = await axios.post('/api/signup', {
                email: newUserAccountData.email,
                password: sha256(newUserAccountData.password).toString(),
                isSuperUser: newUserAccountData.isSuperUser,
                user: {
                    nom: newUserAccountData.nom,
                    prenom: newUserAccountData.prenom,
                    age: newUserAccountData.age
                }
            });

            // Comme on est arrivé là, c'est que la création a fonctionné et on peut donc loe dire à l'utilisateur
            showSuccessMessage("Le compte a été créé avec succès.", "Vous dire à cet utilisateur qu'il peur se connecter avec les identifiants que vous créés");
        }

            // Si on attrape une erreur alors on montre un message d'erreur
        catch (e) {
            showErrorMessage("Il y a eu une erreur lors de la création de l'utilisateur", e.response.data);
        }
    }

    /**
     * Fonction qui s'exécute si un utilisateur appuie sur la touche entrée (pour que ça soit plus rapide que de cliquer sur le bouter de connexion)
     * @param event L'événement
     */
    const handleKeyDown = (event) => {

        // La touche 13 est la touche "entrer"
        if (event.keyCode === 13 && event.shiftKey === false) {
            signUserUp(event);
        }
    }

    return (
        <form>

            <Heading className="is-4">Partie compte</Heading>

            <Form.Field>
                <Form.Control>
                    <Form.Input name="email" className="is-medium" type="email"
                                placeholder="Email" onKeyDown={handleKeyDown}
                                onChange={updateField} value={newUserAccountData.email} autoComplete="email"/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>
                    <Form.Input name="password" className="is-medium" type="password"
                                placeholder="Mot de passe" onKeyDown={handleKeyDown} onChange={updateField}
                                value={newUserAccountData.password} autoComplete="current-password"/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>
                    <Form.Input name="passwordConfirmation" className="is-medium" type="password"
                                placeholder="Confirmation mot de passe" onKeyDown={handleKeyDown} onChange={updateField}
                                value={newUserAccountData.passwordConfirmation} autoComplete="current-password"/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>
                    <Form.Checkbox name="isSuperUser" className="is-medium" onChange={updateField} value={newUserAccountData.isSuperUser}>Est-ce que l'utilisateur est un super user</Form.Checkbox>
                </Form.Control>
            </Form.Field>

            <Heading className="is-4">Partie utilisateur</Heading>

            <Form.Field>
                <Form.Control>
                    <Form.Input name="nom" className="is-medium" type="text"
                                placeholder="Nom" onKeyDown={handleKeyDown}
                                onChange={updateField} value={newUserAccountData.nom}/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>
                    <Form.Input name="prenom" className="is-medium" type="text"
                                placeholder="Prénom" onKeyDown={handleKeyDown}
                                onChange={updateField} value={newUserAccountData.prenom}/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>
                    <Form.Input name="age" className="is-medium" type="number"
                                placeholder="Age" onKeyDown={handleKeyDown}
                                onChange={updateField} value={newUserAccountData.age}/>
                </Form.Control>
            </Form.Field>

            <Button onClick={signUserUp} className="is-block is-primary is-fullwidth is-medium">Créer le compte utilisateur</Button>
        </form>
    )
}
```

Si maintenant on va sur la page http://localhost:8080/newuser on peut créer un compte et son utilisateur associé, mais attention il n'est possible d'utiliser la même email une seule fois !

## Etape #12 - Ajout des pages sécurisées

Si on crée un utilisateur qui n'est pas un super utilisateur et qu'on l'on va sur la page http://localhost:8080/newuser, on peut renseigner les champs, mais quand on veut lancer la création de compte, on a une erreur et c'est normal, car un
utilisateur normal n'est pas autorisé à faire ce genre de choses. Pour ne pas qu'un utilisateur n'accède à ce genre de page (car il ne pourra rien faire) on va créer un nouveau composant qui nous permettra de sécuriser les pages pour en montrer
certaines qu'aux utilisateurs connectés et d'autres aux utilisateurs "super utilisateurs". On va faire ça par le biais du composant `components/protectedRoute.js` :

```javascript
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {CustomPuffLoader} from "./customPuffLoader";
import {checkIfUserLogged} from "../utils/utils";

/**
 * Une fonction qui permet de ne laisser l'accès à une page que si un utilisateur est connecté et dans certains cas s'il est un "super utilisateur"
 * @param WrappedComponent La page a "wrapper"
 * @param isSuperUserPage Si la page ne doit être accédée pour par un "super utilisateur"
 */
const ProtectedRoute = (WrappedComponent, isSuperUserPage) => {
    return (props) => {

        /**
         * Si la requête pour savoir si l'utilisateur est connecté est complétée
         */
        const [isLoaded, setLoaded] = useState(false);

        /**
         * S'il y a une erreur de permission, c'est-à-dire si l'utilisateur n'a pas accès à la page
         */
        const [isPermissionIssue, setIsPermissionIssue] = useState(false);

        // Nous vérifions si l'utilisateur est connecté ou non
        useEffect(() => {
            (async () => {

                // Si on n'a pas déjà vérifié si l'utilisateur était connecté et avait accès à la page
                if (!isLoaded) {

                    // Si l'utilisateur semble être connecté, nous vérifions auprès du serveur si l'utilisateur est réellement connecté.
                    try {
                        const isUserLoggedData = await checkIfUserLogged();

                        // Si la requête est un succès alors on peut mettre la réponse de si l'utilisateur est connecté et s'il est un "super utilisateur" dans le cas où la page n'est accessible qu'en mode super utilisateur
                        if (isSuperUserPage) {
                            setIsPermissionIssue(isUserLoggedData.isSuperUser);
                        } else {
                            setIsPermissionIssue(isUserLoggedData.isUserLogged);
                        }
                    }

                        // Si on attrape une erreur alors on met que l'utilisateur n'a pas accès à la page
                    catch (e) {
                        setIsPermissionIssue(false);
                    }

                    // On met que la donnée a été récupérée pour ne pas refaire la requête
                    setLoaded(true)
                }
            })()
        }, [isLoaded]);
        /**
         * Si l'utilisateur peut accéder à la page
         */
        const [canUserAccessPage, setCanUserAccessPage] = useState(false);

        // Si la donnée n'a pas été encore récupérée alors on met un loader pour montrer à l'utilisateur que ça patiente
        if (!isLoaded) {
            return <CustomPuffLoader/>;
        }

        // S'il y a un problème de permission alors on renvoie l'utilisateur à la page d'accueil, car il n'a pas accès ç cette page !
        if (!isPermissionIssue) {
            useRouter().replace("/");
            return <CustomPuffLoader/>;
        }

        // Sinon on peut montrer la page car l'utilisateur y a accès avec les props de la page !
        return <WrappedComponent {...props} />;
    };
};

export default ProtectedRoute;
```

Et grâce à ce composant, on a "sécuriser" l'accès à certaines pages, et quelques-unes qu'aux super utilisateurs...

Pour `pages/account/index.js` on ne veut que les utilisateurs connectés

```javascript
...

// On exporte la page
export default ProtectedRoute(AccountPage);
```

Pour `pages/newuser/index.js` on veut que les utilisateurs connectés qui sont super utilisateur

```javascript
...

// On exporte la page
export default ProtectedRoute(NewUserPage, true);
```

Pour `pages/users/[userId].js` on veut que les utilisateurs connectés qui sont super utilisateur

```javascript
...

// On exporte la page
export default ProtectedRoute(UserEditorPage, true);
```

Pour `pages/users/index.js` on ne veut que les utilisateurs connectés

```javascript
...

// On exporte la page
export default ProtectedRoute(UsersPage);
```

Maintenant vous pouvez aller dans les différentes pages et si vous n'avez pas le droit d'y accéder vous serez redirigé vers la page d'accueil !

## Etape #13 - Socket IO, communication via websocket

Comme dans les projets vous pourriez être amenés à utiliser des websockets, notamment avec SocketIO, je vais vous montrer une façon de procéder. Nous allons créer un fichier `utils/useSocketIO.js` où sera écrite la logique avec SocketIO. Attention de
ne pas oublier d'installer `socket.io-client` via `npm install socket.io-client`

```javascript
import {useEffect, useState} from 'react';
import SocketIOClient from "socket.io-client";

/**
 * Le hook pour utiliser SocketIO et montrer un message à tous les utilisateurs si un administrateur le souhaite
 */
const useSocketIO = () => {

    /**
     * Le message à montrer
     */
    const [message, setMessage] = useState(undefined);

    /**
     * La socket de SocketIO
     * The socket from socket io
     */
    const [socketIO, setSocketIO] = useState(undefined);

    /**
     * Quand on reçoit un message à montrer, on veut changer l'état de la variable message, en "monitorant" cette variable dans un useEffect on pourra savoir quand elle a été modifiée et ainsi montrer le message
     * @param messageReceived Le message reçu
     */
    const onNewMessageReceived = (messageReceived) => {
        setMessage(JSON.stringify(messageReceived));
    }

    // Le useEffect pour initialiser la socket de SocketIO
    useEffect(() => {
        // Connect to socket server
        const socket = SocketIOClient(`/`);
        setSocketIO(socket);

        // Quand on reçoit un message de la part de la websocket, on veut exécuter la fonction onNewMessageReceived
        socket.on("message_recu", onNewMessageReceived);

        // On utilise cette syntax pour libérer le mémoire et fermer la Socket correctement
        return () => {
            // Close the connection
            if (socketIO !== undefined) {
                socketIO.close();
            }
        };
    }, []); // Mettre une liste vide comme dépendance permet d'utiliser le useEffect une seule fois


    // Return le message sous forme d'état qui se mettra à jour si un nouveau message est reçu
    return message;
}

export default useSocketIO;
```

Puis dans le composant `components/layoutWrapper.js` nous allons ajouter les lignes suivantes

```javascript
...

/**
 * Le router
 */
const router = useRouter();

/**
 * On veut avoir les messages reçus avec la Websocket
 */
const messageReceived = useSocketIO();

// On utilise un useEffect avec comme dépendance la variable messageReceived
// Il faut lire qu'à chaque fois que l'état de la variable messageReceived est mis à jour, car un message a été reçu par la websocket (sauf si ce message est non défini), alors on veut montrer ce message
useEffect(() => {
    if (messageReceived !== undefined) {
        showInfoMessage("Vous avez reçu un nouveau message de l'administrateur", messageReceived)
    }
}, [messageReceived]); // On met la variable messageReceived comme dépendance pour ne réaliser le useEffect que si l'état de la variable messageReceived change

/**
 * L'objet du message
 */
const [messageObject, setMessageObject] = useState({
    message: undefined,
    tooltip: undefined,
    visible: false,
    type: undefined
});

...
```

Si vous regardez la console de l'API vous verrez qu'un client de la websocket s'est connecté, car un id de socket a été log et c'est bon signe !

On veut maintenant créer une page pour qu'un administrateur puisse envoyer un message à l'API et que cette dernière envoie un événement SocketIO à tous les clients pour montrer un message, cette page sera la page `pages/admin/index.js`

```javascript
import {useState} from 'react';
import axios from "axios";
import ProtectedRoute from "../../components/protectedRoute";
import {Button, Columns, Form, Heading} from "react-bulma-components";
import {PageWrapper} from "../../components/pageWrapper";

/**
 * La page administrateur "/admin"
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 */
const AdminPage = ({showErrorMessage, showSuccessMessage}) => {

    /**
     * Le message qu'un admin pourra envoyer
     */
    const [messageToSend, setMessageToSend] = useState("");

    /**
     * Fonction utilisée pour mettre à jour le message à envoyer
     * @param e L'événement
     */
    const updateField = (e) => {
        setMessageToSend(e.target.value);
    }

    /**
     * Envoie le message à tous les utilisateurs du site
     * @param event L'événement
     */
    const handleMessageSending = async (event) => {

        // On fait en sorte que l'événement par défaut ne se déclanche pas
        event.preventDefault();

        // On essaye de faire la requête post pour envoyer le message. Si on n'attrape une erreur ça veut dire qu'il y a eu des soucis, sinon le message apparaitra tout seul...
        try {
            await axios.post("/api/message", {message: messageToSend});
        } catch (e) {
            showErrorMessage("Il y a eu une error lors de l'envoie du message", e.response.data);
        }
    }

    /**
     * Fonction qui s'exécute si un utilisateur appuie sur la touche entrée (pour que ça soit plus rapide que de cliquer sur le bouton)
     * @param event L'événement
     */
    const handleKeyDown = (event) => {

        // La touche 13 est la touche "entrer"
        if (event.keyCode === 13 && event.shiftKey === false) {
            handleMessageSending(event);
        }
    }

    return (
        <PageWrapper>
            <Columns.Column className="column is-10 is-offset-1 tp-notification-bigger">
                <Columns>
                    <Columns.Column className="left">

                        <Heading>Envoie d'un message à tous les utilisateurs</Heading>
                        <form>
                            <Form.Field>
                                <Form.Control>
                                    <Form.Input name="message" className="is-medium"
                                                placeholder="Message à envoyer" onKeyDown={handleKeyDown}
                                                onChange={updateField} value={messageToSend}/>
                                </Form.Control>
                            </Form.Field>
                            <Button onClick={handleMessageSending} className="is-block is-primary is-fullwidth is-medium">Envoyer le message</Button>
                        </form>

                    </Columns.Column>
                </Columns>
            </Columns.Column>
        </PageWrapper>
    );
}

// C'est une page protégée
export default ProtectedRoute(AdminPage, true);
```

Allez maintenant sur la page http://localhost:8080/admin et vous pourrez envoyer un message A TOUS LES UTILISATEURS CONNECTES !!!

## Etape #14 - Docker et docker-compose

Maintenant que notre application fonctionne on veut pouvoir la déployer avec Docker !

Suite à un "bug" que je n'arrive pas à expliquer, des fois votre serveur au port 3000 (ou autre) ne pourra pas être accessible depuis le réseau interne Docker, SAUF si le port est le 80 (je n'arrive pas à l'expliquer). Donc dans le fichier `app.js`
du backend vous allez changer la ligne :

```javascript
// On allume le serveur au port 3000 si un port n'été spécifié
server.listen(+(process.env.PORT || "3000"));
```

Pour créer une image Docker du frontend, on peut utiliser ce `Dockerfile`

```dockerfile
# On récupère la dernière image node
FROM node:latest

# On fait ça pour pouvoir donner une valeur à la variable d'environnement BACKEND_URL lors de la création de l'image
ARG BACKEND_URL=""
ENV BACKEND_URL=$BACKEND_URL

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copie le fichier package.json et package-lock.json
COPY package*.json ./

# Installe les packages
RUN npm install

# Copie tous les fichiers
COPY . .

# Construit le projet
RUN npx next build --profile

# Expose le port par défaut
EXPOSE 8080

# Lance le site web
CMD npx next start -p 8080
```

Puis pour construire cette image Docker, il faut lancer la commande `docker build --build-arg BACKEND_URL=api-tp2-1:80 -t info734/tp2-1/website .` dans le dossier `tp2-1-website` qui va construire l'image docker nommée `info734/tp2-1/website` grâce
au Dockerfile ci-dessus avec la variable d'environnement `BACKEND_URL=api-tp2-1:80`, car dans notre docker-compose l'adresse du backend sera `api-tp2-1:80`

Puis, pour le backend on peut utiliser ce `Dockerfile` là

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

# On expose le port 80
EXPOSE 80

# Quand un container sera démarré à partir de cette image, c'est cette commande qui sera exécutée
CMD npm start
```

Puis pour construire cette image Docker, il faut lancer la commande `docker build -t info734/tp2-1/api .` dans le dossier `tp2-1-api` qui va construire l'image docker nommée `info734/tp2-1/api` grâce au Dockerfile ci-dessus

Une fois ces deux images créées on va pouvoir les déployer avec le fichier `docker-compose.yaml` suivant :

```yaml
version: "3.8"

# Ici on définie les différents services
services:

  # le service pour la base de données MongoDB que l'on va appeler 'mongo-tp2-1'
  mongo-tp2-1:

    # Il utilisera l'image 'mongo' à sa dernière version
    image: mongo:latest

    # Le container aura comme nom 'mongo-tp2-1'
    container_name: mongo-tp2-1

    # Le hostname du container, c'est-à-dire son adresse visible aux autres containers qui seront dans le/les même(s) réseau(x), il sera utilisé pour s'y connecter
    hostname: mongo-hostname-tp2-1

    # Il fera partie d'un seul réseau interne nommé 'network-tp2-1'
    networks:
      - network-tp2-1

  # le service pour la base de données Redis que l'on va appeler 'redis-tp2-1'
  redis-tp2-1:

    # Il utilisera l'image 'redis' à sa dernière version
    image: redis:latest

    # Le container aura comme nom 'redis-tp2-1'
    container_name: redis-tp2-1

    # Le hostname du container, c'est-à-dire son adresse visible aux autres containers qui seront dans le/les même(s) réseau(x), il sera utilisé pour s'y connecter
    hostname: redis-hostname-tp2-1

    # Il fera partie d'un seul réseau interne nommé 'network-tp2-1'
    networks:
      - network-tp2-1

  # le service pour l'API que l'on va appeler 'api-tp2-1'
  api-tp2-1:

    # L'image que nous utiliserons est l'image que l'on a créée et qui s'appelle 'info734/tp2-1/api'
    # On lui a donné ce nom grâce à la commande: docker build -t info734/tp2-1/api .
    image: info734/tp2-1/api

    # On lui donne comme nom 'api-tp2-1'
    container_name: api-tp2-1

    # On veut "mapper" le port 3000 de notre ordinateur (le HOST) vers le port 80 de l'API (CONTAINER)
    ports:
      - "3000:80"

    # Ce service doit attendre que mongo ET redis aient démarré pour démarrer à son tour
    depends_on:
      - mongo-tp2-1
      - redis-tp2-1

    # Il fera partie d'un seul réseau interne nommé 'network-tp2-1'
    networks:
      - network-tp2-1

    # On veut ajouter deux variables d'environnement à notre container, ce qu'il lui permettra de pouvoir se connecter à MongoDB et Redis en leur donnant leur hostname
    # Comme la base de données MongoDB s'appelle mongo et la base Redis redis on leur donne ces noms
    # On veut aussi que le port de notre API soit rendu sur le port 80
    environment:
      MONGO_HOST: "mongo-hostname-tp2-1"
      REDIS_HOST: "redis-hostname-tp2-1"
      PORT: "80"

  # le service pour le site web que l'on va appeler 'website-tp2-1'
  website-tp2-1:

    # L'image que nous utiliserons est l'image que l'on a créée et qui s'appelle 'info734/tp2-1/website'
    # On lui a donné ce nom grâce à la commande: docker build --build-arg BACKEND_URL=api-tp2-1:80 -t info734/tp2-1/website .
    image: info734/tp2-1/website

    # On lui donne comme nom 'website-tp2-1'
    container_name: website-tp2-1

    # On veut "mapper" le port 8080 de notre ordinateur (le HOST) vers le port 8080 du website (CONTAINER)
    ports:
      - "8080:8080"

    # Ce service doit attendre que mongo, redis ET l'API aient démarré pour démarrer à son tour
    depends_on:
      - mongo-tp2-1
      - redis-tp2-1
      - api-tp2-1

    # Il fera partie d'un seul réseau interne nommé 'network-tp2-1'
    networks:
      - network-tp2-1

# Après avoir créé des services, on va créer un réseau interne
networks:

  # On crée le réseau interne nommé "network-tp2-1"
  network-tp2-1:

    # Pour les réseaux internes mettre tout le temps cette instruction, c'est le plus simple et vous n'aurez pas besoin de plus
    driver: bridge
```

```shell
# Vous pouvez lancer le docker-compose de cette façon en mode non détaché
docker-compose up

# Et en mode détaché
docker-compose up -d

# Puis pour arrêter le docker compose vous pouvez lancer la commande suivante
docker-compose down
```

Et HOP ! Vous venez de créer une application Fullstack avec NextJS, ExpressJS, Bulma & Docker ! Elle est déployable de partout et ultra rapide !

N'hésitez pas à utiliser cette application Fullstack comme base pour les projets (si aucun effort est fait pour "reprendre" les idées et que votre projet est une copie carbone de cette application, il y aura des sanctions ;) ).