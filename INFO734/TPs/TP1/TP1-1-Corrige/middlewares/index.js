/*
On crée une fonction "middleware" avec les paramètres req, res et next comme la fonction que l'on peut mettre dans un routeur
Pour le moment vous avez vu passer la fonction next sans jamais l'utiliser, mais maintenant vous devez l'utiliser, car vous êtes dans un middleware et si cette fonction next n'est
pas appelée alors ce middleware ne saura pas que vous voulez passer à la fonction suivante, qui sera celle du router.
Une fonction middleware est utile pour faire des actions avant d'arriver dans un routeur, par exemple en regardant si un utilisateur est connecté ou si les données qu'il a envoyé sont correctes
 */
function printAnatomy(req, res, next) {

    /*
    Ici on récupère la valeur de req.get("host") qui sera notre "host", c'est à dire notre adresse de serveur "localhost:3000"
    On veut séparer la partie adresse pure du port et pour cela on utilise .split(":") qui va couper notre chaine de caractère en deux dans une liste ["adresse", "port"]
     */
    const hostSplit = req.get("host").split(":");

    /*
    Ici on veut récupérer l'user qui a été appelé, c'est à dire "/api/anatomy" mais comme on a pû lui ajouter un morceau, la queryString ("/api/anatomy?maQuery=123") et bien on coupe cet user en deux
    Avec .split("?") qui va nous mettre dans une liste l'user a proprement parlé donc "/api/anatomy" et si il y a une query string du genre "?maQuery=123" et bien on récupérera dans la liste à l'indice 1 "maQuery=123"
     */
    const pathSplit = req.originalUrl.split("?");

    // On log l'anatomie
    console.log({

        // On récupère le schema (qui sera "http" ou "https")
        "scheme": req.protocol,

        // On veut avoir le domain, c'est à dire l'adresse
        "domain": hostSplit[0],

        // On veut avoir le port s'il existe, sinon on met undefined, ici 3000
        "port": hostSplit.length > 1 ? +hostSplit[1] : undefined,

        // On veut avoir le path ou l'user, donc "/api/anatomy"
        "path": pathSplit[0],

        // On veut avoir la query string si elle existe, donc dans notre exemple "maQuery=123"
        "queryString": pathSplit.length > 1 ? pathSplit[1] : undefined,
    })

    // Par exemple si je vais sur mon navigateur et que je vais sur http://localhost:3000/api/anatomy?test=123&hello=world je vais obtenir cet object dans la console
    /*
    {
      scheme: 'http',
      domain: 'localhost',
      port: 3000,
      path: '/api/anatomy',
      queryString: 'test=123&hello=world'
    }
     */

    // Par exemple si je vais sur mon navigateur et que je vais sur http://localhost:3000/api/anatomy je vais obtenir cet object dans la console
    /*
    {
      scheme: 'http',
      domain: 'localhost',
      port: 3000,
      path: '/api/anatomy',
      queryString: 'undefined'
    }
     */

    // J'utilise la fonction next() qui va passer soit au middleware suivant, soit à la fonction du router qui appelle ce middleware
    next();
}

// Fonction middleware qui ne fait rien à part nous qu'il fait beau
function hello(req, res, next) {

    console.log("Il fait beau aujourd'hui non ?");

    // On appelle la fonction next() pour aller au middleware suivant s'il y en a un ou a la fonction du routeur
    next();
}

module.exports = {
    printAnatomy: printAnatomy,
    hello: hello
}