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
Pour utiliser un user qui possède un ou plusieurs paramètres il faut le renseigner dans l'URL au moment de l'appel
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
Si un user n'existe pas ou qu'un serveur est éteint, alors il sera impossible d'accéder à de la donnée et si vous lancez
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

/*
Je construis mon object qui va être envoyé via une requête HTPP POST avec les données qui seront utilisé par les 4 users
 */
const allData = {
    get: "Hello",
    post: {
        "hello": "test",
        "bye": "no"
    },
    putParam: 1234567890000,
    putBody: 1234567890,
    delete: "1234"
}

/*
J'effectue la requête sur l'user "/api/all" avec comme body de la requête l'object allData
 */
axios.post("http://localhost:3000/api/all", allData)

    // Si il n'y a pas eu d'erreur
    .then(function (response) {
        console.log(response.data);
    })

    // Si il y a eu une erreur
    .catch(function (error) {
        console.error(error.message);
    })