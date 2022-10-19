# TP1 - 1

## Exercice 0

Pour ce module, il faut installer NodeJS et NPM et ça se fait juste ici: https://nodejs.org/fr/download/. Si vous avez des soucis demandez-moi.

Nous utiliserons Express JS et sa documentation peut se trouver ici https://expressjs.com/en/guide/routing.html.

## Exercice 1

Après avoir suivi les informations du `README.MD` du TP1-1 votre serveur doit être allumé, mais il ne possède qu'une seule route `/`, vous allez donc en créer une autre appelée `/me` qui vous renverra votre nom. Une fois cette route créée vous pouvez
aller sur http://localhost:3000/me.

## Exercice 2

Si vous n'avez pas relancé votre serveur, vous avez dû avoir une erreur (`Cannot GET /me`) lors de l'exercice 1, en effet vous n'avez pas relancé le serveur et ce dernier n'a donc pas pû mettre en place votre nouvelle route et c'est normal.

Pour régler ce problème dans un environnement de development, vous pouvez ajouter le package `nodemon` qui permettra au serveur de se relancer à chaque modification du code, ce qui est pratique pour ne pas devoir casser et relancer le serveur.

Dans votre console vous devez lancer la commande `npm install <package>` où `<package>` est le nom du package que vous voulez installer. Donc pour installer `nodemon` vous devez lancer la commande suivante:

```shell
npm install nodemon
```

Votre fichier `package.json` se mettra à jour avec le package nouvellement installé et pour faire en sorte de lancer le serveur en mode 'développement' (qui se relance automatiquement) vous devez ajouter la ligne suivante dans l'object `scripts` du
fichier `package.json`.

```json
"dev": "nodemon app.js"
```

Puis vous devez avoir votre serveur éteint et au lieu de lancer la commande `npm start` vous pouvez dès maintenant utiliser la commande `npm run dev` qui va lancer la valeur de `dev` dans l'object `script`, et donc lancer la commande `nodemon app.js`
qui va lancer le serveur en mode "hot reload", c'est-à-dire qui se relance à chaque modification.

Maintenant si vous allez sur http://localhost:3000/me, votre nom apparaîtra et toutes les modifications apportées sans relancer le serveur à la main !

## Exercice 3

![](https://cascadingmedia.com/assets/images/insites/2015/02/url-anatomy/url-anatomy-55598c24.png)
Maintenant que vous avez créé une nouvelle route vous allez faire changer la "route principale" du router (le `/` défini dans le fichier `app.js`) pour qu'on puisse avoir accès aux routes du fichier `api.js` non plus par `/` mais par `/api`.

En faisant ça vous allez changer le "path" ou "endpoint" de votre API et donc vous allez faire des choses un peu plus complexes.

Vous pouvez donc maintenant avoir accès à http://localhost:3000/api et http://localhost:3000/api/me.

Il faut garder à l'esprit cette notion d'endpoint qui commence forcément par `/api` pour les API pour que votre projet soit bien structuré.

### Exercice 3.1

Vous allez maintenant construire des routes d'API un peu plus complexes. Avec Express construisez les routes suivantes :

- `/api/get` en méthode HTTP **GET** qui renvoie une chaine de caractères quelconque
- `/api/post` en méthode HTTP **POST** qui renvoie un object quelconque dans un object quelconque
- `/api/put` en méthode HTTP **PUT** qui renvoie la date actuelle sous format "Jour/Mois/Année" (regardez sur internet comment faire)
- `/api/delete` en méthode HTTP **DELETE** qui renvoie un boolean `true` si le nombre de secondes au moment de l'appel est pair et `false` sinon

Voilà comment utiliser les autres méthodes HTTP

```javascript
router.get('/...', function (req, res, next) {
})
router.post('/...', function (req, res, next) {
})
router.put('/...', function (req, res, next) {
})
router.delete('/...', function (req, res, next) {
})
```

Notez qu'il est aussi possible de faire comme ça avec router.all qui capturera TOUTES les méthodes HTTP sur l'endpoint demandé (GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE)

```javascript
router.all('/...', function (req, res, next) {
    switch (req.method) {
        case "GET":
            break;
        case "POST":
            break;
        case "PUT":
            break;
        case "DELETE":
            break;
    }
})
```

Une fois ces routes créées vous n'avez (presque) aucun moyen de les tester et c'est bien le problème en development, surtout si on crée une API indépendamment d'un frontend.

Pour réaliser des tests et vérifier que notre API est fonctionnelle nous pouvons utiliser un outil appelé [Postman](https://www.postman.com/downloads/), téléchargez le car il sera utile pour tous les TPs ainsi que vos projets. Si vous ne connaissez
pas Postman vous pouvez (devez) suivre ce tutoriel pour comment marche ce dernier: https://fre.myservername.com/postman-tutorial-api-testing-using-postman

Une fois que vous avez compris comment marche Postman vous pouvez créer vos requêtes dessus pour requêter vos routes créées lors de l'exercice 3.1...

Vérifier visuellement que les choses concordent.

### Exercice 3.3

Normalement les méthodes HTTP comme `get`, `post`, `put` et `delete` ont un sens propre et ne doivent (devraient) être utilisées que pour faire une certaine chose :

- `get`: Utilisées que pour obtenir des données (ex: récupération données utilisateur)
- `post`: Envoie les données à traiter à une source spécifiée (ex: création d'un utilisateur)
- `put`: Utilisé pour modifier de la donnée (ex: modification d'un utilisateur)
- `delete`: Utilisé pour supprimer de la donnée (ex: suppression d'un utilisateur)

Mais il se pose un problème, comment faire transiter de la donnée avec des URLs et ces méthodes HTTP ?

Il y a plusieurs façons de faire transiter de la donnée avec le protocol HTTP !

### Exercice 3.4

Faire transiter de la donnée directement dans l'URL pour toutes les méthodes HTTP à l'aide d'un **paramètre** ou **slug**. Pour après utiliser cet endpoint il faudra renseigner le paramètre directement dans l'URL du genre :

- http://localhost:3000/api/etudiant/12345
- http://localhost:3000/api/etudiant/pasunnombre
- http://localhost:3000/api/etudiant/1a2z3e4r

Imaginons que l'on veuille avoir une route qui puisse être utilisé pour requêter un étudiant suivant son numéro d'étudiant (`numEtu`), il faut donc avoir une façon de récupérer cet étudiant et cette façon est la suivante :

```javascript
// Le paramètre ou slug peut avoir à peu près n'importe quel nom 
// et doit être forcement précédé de ': puis une chaine de caractère sans espaces
router.get('/etudiant/:numEtu', function (req, res, next) {
    // Pour accèder au paramètre on peut le retrouver directement dans les 
    // paramètres de la requête 
    res.json(`Le numéro étudiant est récupéré et est: ${req.params.numEtu}`);
});
```

Sachant cela, maintenant faites en sorte que les endpoints

- `/api/get` Renvoie non plus une chaîne de caractère quelconque, mais une représentation hexadécimale d'un paramètre qui viendra s'ajouter à l'endpoint et que vous nommerez comme bon vous semble
- `/api/delete` Renvoie non plus un boolean en fonction du nombre de secondes au moment de l'appel, mais `undefined` si le paramètre qui viendra s'ajouter à l'endpoint ne peut pas être une représentation d'un nombre, `true` si le paramètre peut être
  traduit comme un nombre pair et `false` si le paramètre peut être traduit comme un nombre impair. Le paramètre pourra être nommé comme bon vous semble, attention à la conversion d'une string en nombre.

### Exercice 3.5

Faire transiter de la donnée dans le "corp" (body) de la requête HTTP, que pour les méthodes `POST` & `PUT` (GET et DELETE n'ont pas de "corps").

Imaginons que l'on veuille avoir une route qui puisse être utilisé pour créer un étudiant suivant son numéro d'étudiant (`numEtu`) et son nom (`nameEtu`), il faut donc avoir une façon de dire au serveur que l'on veut créer cet étudiant cette façon
est la suivante :

```javascript
router.post('/etudiant', function (req, res, next) {

    /*
    Pour accèder à de la donnée JSON à l'intérieur du body de la requête on peut tout simplement récupérer 
    req.body qui est en fait un object JSON avec ce qu'on lui a donné lors de la requête (si on ne lui donne 
    rien alors il sera juste vide: {})
    */
    res.json(`L'étudiant ${req.body.nameEtu} avec le numéro étudiant ${req.body.numEtu} a été crée !`)
});
```

On pourrait évidement utiliser un formulaire HTML pour requêter cet endpoint mais le faire avec Postman est plus simple pour nos tests.

Pour faire une telle demande avec Postman il faut créer une requête `POST` et dans l'onglet `Body` cocher le text `raw` qui indique qu'on veut envoyer du texte "cru", puis on choisi `JSON` dans le menu déroulant à la place de `Text` pour indiquer que
l'on veut envoyer du JSON et que le body ait les données que l'on veut envoyer en lui.

On peut par exemple tester ce body dans notre requête Postman et on aura comme réponse: `"L'étudiant Didier avec le numéro étudiant 68105105101114 a été crée !"`

```json
{
  "nameEtu": "Didier",
  "numEtu": 68105105101114
}
```

Sachant cela, maintenant faites en sorte que les endpoints

- `/api/post` Renvoie non plus un object quelconque dans un object quelconque, mais un object qui a les clefs qui deviennent les valeurs et les valeurs qui deviennent les clefs (genre `{"a": "b", "c": "d"}` deviendra `{"b": "a", "d": "c"}`)
- `/api/put` Renvoie non plus la date actuelle sous format "Jour/Mois/Année", mais la représentation d'une date où l'année provient d'un paramètre qui se trouvera dans l'endpoint sous forme d'un timestamp unix et le jour et le mois se trouveront dans le body de la requête. Le
  format de retour devra être sous la forme "Jour/Mois/Année".

## Exercice 4

Maintenant que vous avez vu comment utiliser Express pour le routage vous allez apprendre à faire des requêtes directement depuis le code Javascript.

/!\ Attention /!\ Cette partie va traiter des promesses, concept un peu compliqué à comprendre MAIS ESSENTIEL pour le développement moderne, les promesses sont faites pour rendre le code ou une partie du code asynchrone (une explication peut se
trouver ici : https://waytolearnx.com/2019/01/difference-entre-une-execution-synchrone-et-asynchrone.html). Pour avoir des informations sur les promesses et comprendre leur fonctionnement, vous pouvez aller sur ces
liens: https://www.pierre-giraud.com/javascript-apprendre-coder-cours/promesse-promise/ & https://www.pierre-giraud.com/javascript-apprendre-coder-cours/async-await/.

Nous allons faire des appels grâce à une library nommée `axios` https://axios-http.com/fr/docs/intro, vous pouvez dès à présenter l'ajouter au projet via la commande `npm install axios`.

Voici quelques exemples d'utilisation de la library `axios`, vous pouvez créer un fichier nommé `test.js` et mettre le code si dessous dedans. Vous pouvez aussi rajouter une ligne `"test": "node test.js"` dans le fichier `package.json` dans la
partie script pour lancer le fichier de script à l'aide de la commande `npm run axios`

```javascript
// Il faut déjà importer axios dans le projet
const axios = require("axios");

/*
Pour faire un appel à un server ou une API avec axios il faut utiliser le mot clef
axios.<méthode http en minuscule> qui est une fonction avec plusieurs arguments dont le premier est l'URL
cette fonction renvoie une promesse qui doit être "attendue" avec le mot clef then, qui nous donnera la réponse de cette requête.
Pour accéder à la donnée de cette requête (le résultat) il se trouve dans le champ "data" de la réponse
 */
axios.get("http://localhost:3000/api/me").then(function (response) {

    // Vous retrouverez votre nom dans la console
    console.log(response.data);
})

/*
Pour utiliser un endpoint qui possède un ou plusieurs paramètres il faut le renseigner dans l'URL au moment de l'appel
Ici l'URL appelée sera http://localhost:3000/api/etudiant/68105105101114
En lançant ce code vous aurez comme donnée de réponse: "Le numéro étudiant est récupéré et est: 68105105101114"
 */
const numEtu = 68105105101114;
axios.get(`http://localhost:3000/api/etudiant/${numEtu}`).then(function (response) {
    console.log(response.data);
})

/*
Pour exécuter des requêtes à des URL avec les méthodes HTTP POST et PUT on va pouvoir utiliser la même syntax qu'avant sauf
Que la fonction axios.post et axios.put prend un paramètre en plus de l'URL, c'est un object que vous pouvez envoyer (le body)
Et dans notre cas si on veut créer un étudiant, on va donner comme body un object avec le nom et le numéro de l'étudiant
 */
const numEtuToCreate = 68105105101114;
const nameEtuToCreate = "Didier";
axios.post(`http://localhost:3000/api/etudiant`, {nameEtu: nameEtuToCreate, numEtu: numEtuToCreate}).then(function (response) {
    console.log(response.data);
})

/*
Si un endpoint n'existe pas ou qu'un serveur est éteint, alors il sera impossible d'accéder à de la donnée et si vous lancez
une requête axios comme ça un pavé d'erreur vous arrivera dessus en vous disant que la requête a échoué en erreur 404...
 */
/*
axios.get("http://localhost:3000/api/existepas").then(function (response) {
    console.log(response.data);
})
*/

/*
Pour remédier aux erreurs, en plus du mot clef .then d'une promesse, il y a deux autres mots clefs:
.catch qui attrape les erreurs qui se sont produisent dans la promesse, ce qui veut dire quelle a été rejetée
.finally qui exécutera la fonction en paramètre peu importe si la promesse a été acceptée (.then) ou rejetée (.catch)
 */
axios.get("http://localhost:3000/api/existepas").then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.error(error.message);
}).finally(function () {
    console.log("Code exécuté dans les deux cas");
})
```

Maintenant imaginons que notre API a besoin de récupérer de la donnée depuis d'autres API, il faudra donc trouver un moyen de créer une route dans notre API qui va appeler à son tour une API !

```javascript
/** Le numéro étudiant de Didier */
const numEtuDeDidier = 68105105101114;

/*
On crée une nouvelle route qui va appeler l'endpoint `/api/etudiant/:numEtu` de notre API où numEtu sera 68105105101114 pour trouver Didier !
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

    // On n'utilise pas res.json ici, car on veut que la réponse soit rendue seulement quand la donnée a été récupérée...
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
```

Maintenant que vous savez faire ça vous allez pouvoir créer une route `/api/all` avec la méthode POST (pour donner tous les paramètres dont vos endpoints auront besoin) qui va faire des appels aux 4 routes suivantes : `/api/get/:text`
, `/api/delete/:number`, `/api/post` & `/api/put` et qui renverra un object avec les réponses de chaque API sous la forme :

```json
{
  "get": "...",
  "post": {
    ...
  },
  "put": "...",
  "delete": ...
}
```

# Exercice 5.1 (optionnel)

Si vous avez le temps (ou l'envie), vous allez pouvoir créer votre propre API CRUD (Create/Read/Update/Delete) pour créer/lire/modifier/supprimer un étudiant.

Comme vous travaillerez sans base de données pour le moment, vous pouvez juste créer un object "global" qui servira à stocker vous étudiants (soit une liste, soit un object, soit un HashMap, soit une Map bref comme vous voulez).

Vous allez donc créer 5 endpoints :

- méthode HTTP GET `/api/etudiant/:num` qui vous renverra les données de l'étudiant qui a ce numéro, sinon une erreur
- méthode HTTP POST `/api/etudiant/` qui va créer un étudiant suivant les informations que vous lui donnerez
- méthode HTTP POST `/api/etudiant/:num` qui modifiera un étudiant suivant nom numéro ou les éléments à modifier seront dans le body, s'il n'existe pas une erreur sere renvoyée
- méthode HTTP DELETE `/api/etudiant/:num` qui supprimera l'étudiant et s'il n'existe pas une erreur sera renvoyée
- méthode HTTP GET `/api/etudiants` qui vous renverra les données de tous les étudiants

N'oubliez pas d'utiliser Postman pour tester vos requêtes !!!

# Exercice 5.2 (optionnel)

Faites en sorte de créer un middleware Express https://expressjs.com/en/guide/writing-middleware.html qui va décortiquer l'anatomie de TOUS les endpoints que vous avez implémenté. Pour finalement avoir un object "printé" à chaque appel :

L'anatomie peut être retrouvée en haut du fichier

```json
{
  "scheme": "",
  "subdomain": "",
  "domain": "",
  "topLevelDomain": "",
  "port": "",
  "path": "",
  "queryString": "",
  "fragment": ""
}
```