# Projets INFO 734

#### Notes
/!\ Attention de ne pas laisser les clefs d'API trainer dans votre code, il faut utiliser le package `dotenv` pour créer des fichiers `.env` et ainsi ne pas divulguer des informations sensibles /!\

Vous devrez utiliser Github ou Gitlab pour votre projet qui sera en public et vous m'enverrez un mail à l'adresse suivante `antonin.martin.rosa@gmail.com` avec le lien de votre repository Git pour que je puisse regarder ce que vous faites.

Un mini tuto pour bien utiliser Git sera donné à la fin de ce fichier.

Vous devrez utiliser Github Project ou Trello pour faire de la gestion de projet

## Idées de projet

##### **[#1]** - *Complexe* - Visualisation sous forme de dashboard d'une capture Stream Twitter

1) Capture Twitter depuis son compte sur un mot clef
2) Création d'un dashboard pertinent pour montrer ces données
3) Utilisation d'une base de données "froide" pour persister les données
4) Utilisation d'une websocket (genre SocketIO) pour envoyer les données récupérées lors d'une stream vers le dashboard

##### **[#2]** - *Intermédiaire* - Création d'un système de message, style messenger avec gestion de compte utilisateur

1) Gestion de compte utilisateur (avec ou sans mot de passe) avec session
2) Il sera possible de récupérer une conversation entre un OU plusieurs utilisateurs à l'aide d'une base de données "froide" pour persister les données
3) Il y aura une interface avec plusieurs pages, une pour la "connexion", une page d'accueil avec ce que fait le projet et une page où se trouve les conversations
4) Il faut que les messages puissent être reçus en temps réel (avec SocketIO par exemple)

##### **[#3]** - *Intermédiaire* - Créer un replica de stackoverflow (ou reddit ou twitter) qui utilise un système de threads avec des commentaires

1) Gestion de compte utilisateur avec mot de passe et avec session
2) Avoir des permissions sur les utilisateurs ou groupes pour pouvoir gérer les utilisateurs si besoin
3) Faire en sorte de pouvoir créer des threads avec un titre et une description
4) Des utilisateurs pourront commenter sous ces threads et réagir
5) Si possible utiliser SocketIO pour notifier l'utilisateur que quelqu'un a répondu à son thread ou à son commentaire 
 
##### **[#4]** - *facile* - Créer un site de statistiques sur des chaines Youtube
Application pour récupérer des informations (celles que vous voulez) sur des chaines Youtube (que les vidéos dans un premier temps) grâce à l'API de Youtube et montrer ces informations sous la forme qui vous conviendra le mieux (dashboard, tableau, ect). Les données récupérées doivent être persistées dans une base de données pour ne pas devoir refaire des requêtes. Les requêtes et les traitements associés doivent tourner en arrière-plan quand on demande une requête. Vous pouvez créer un système de status pour savoir quelles sont les chaînes en cours de traitement.

1) Créer une interface pour mettre le lien d'une chaine youtube pour commencer le traitement de cette chaîne
2) Créer une interface pour lister toutes les chaines Youtube qui ont été traitées
3) Créer une interface pour voir les informations recueillies d'une chaine Youtube
4) Créer un système de mises à jour des données déjà présentes avec possibilité de faire du versioning, par exemple, on récupère les données aujourd'hui et demain et on veut voir combien de vues supplémentaires sont présentes depuis la dernière fois

##### **[#5]** - *facile* - Créer un site pour commander des Pizzas et historique de commandes
Création d'une application Fullstack pour commander des Pizzas (ou autre) en étant connecté


##### **[#6]** - *Intermédiaire* - Créer un Forum en ligne

##### **[#6]** - *Complexe* - Faire un système de ticket de support avec notifications