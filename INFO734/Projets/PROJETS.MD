# Projets INFO 734

#### Notes

/!\ Attention de ne pas laisser les clefs d'API trainer dans votre code, il faut utiliser le package `dotenv` pour créer des fichiers `.env` et ainsi ne pas divulguer des informations sensibles /!\

Vous devrez utiliser Github ou Gitlab pour votre projet qui sera en public et vous m'enverrez un mail à l'adresse suivante `antonin.martin.rosa@gmail.com` avec le lien de votre repository Git pour que je puisse regarder ce que vous faites.

Un mini tuto pour bien utiliser Git sera donné à la fin de ce fichier.

Vous devrez utiliser Github Project ou Trello pour faire de la gestion de projet

## Idées de projet

##### **[#1]** - *Complexe* - Visualisation sous forme de dashboard d'une capture Stream Twitter

Création d'un projet qui permet de récupérer des tweets via l'API de Twitter en mode streaming sur un sujet, il y aura un engine pour la collecte de tweet qui opérera sur le backend ou sur une autre application. Ces tweets seront stockés dans une
base de données et vous pourrez les retrouver via une interface.

Puis en rapport avec le projet de DATA732 vous allez créer un dashboard qui montrera les données de Twitter sous forme de diagrammes, de nuages de mots, de courbes et pourquoi pas de graphs en temps réel. Si vous avez des questions je peux vous
aiguiller.

1) Capture Twitter depuis son compte sur un mot clef
2) Création d'un dashboard pertinent pour montrer ces données
3) Utilisation d'une base de données "froide" pour persister les données
4) Utilisation d'une websocket (genre SocketIO) pour envoyer les données récupérées lors d'une stream vers le dashboard

##### **[#2]** - *Intermédiaire* - Création d'un système de message, style messenger avec gestion de compte utilisateur

Application pour créer un système de messagerie où un ou plusieurs utilisateurs peuvent discuter dans des salons (utiliser le principe de rooms pour SocketIO). Faire un replica de Facebook Messenger...

1) Gestion de compte utilisateur (avec ou sans mot de passe) avec session
2) Il sera possible de récupérer une conversation entre un OU plusieurs utilisateurs à l'aide d'une base de données "froide" pour persister les données
3) Il y aura une interface avec plusieurs pages, une pour la "connexion", une page d'accueil avec ce que fait le projet et une page où se trouve les conversations
4) Il faut que les messages puissent être reçus en temps réel (avec SocketIO par exemple)

##### **[#3]** - *Intermédiaire* - Créer un replica de stackoverflow (ou reddit ou twitter) qui utilise un système de threads avec des commentaires, comme un forum

Application pour créer un forum qui est composé d'un sujet ou thread et où des utilisateurs peuvent y répondre avec des commentaires, ils peuvent aussi les modifier ou les supprimer.

1) Gestion de compte utilisateur avec mot de passe et avec session
2) Avoir des permissions sur les utilisateurs ou groupes pour pouvoir gérer les utilisateurs si besoin
3) Faire en sorte de pouvoir créer des threads avec un titre et une description
4) Des utilisateurs pourront commenter sous ces threads et réagir
5) Si possible utiliser SocketIO pour notifier l'utilisateur que quelqu'un a répondu à son thread ou à son commentaire

##### **[#4]** - *facile* - Créer un site de statistiques sur des chaines Youtube

Application pour récupérer des informations sur des chaines Youtube (que les vidéos dans un premier temps) grâce à l'API de Youtube et montrer ces informations dans l'interface sous la forme qui vous conviendra le mieux (dashboard, tableau,
ect). Les données récupérées doivent être persistées dans une base de données pour ne pas devoir refaire des requêtes. Les requêtes et les traitements associés doivent tourner si possible en arrière-plan quand on demande une requête. Vous pouvez
créer un système de status pour savoir quelles sont les chaînes en cours de traitement.

1) Créer une interface pour mettre le lien d'une chaine youtube pour commencer le traitement de cette chaîne
2) Créer une interface pour lister toutes les chaines Youtube qui ont été traitées
3) Créer une interface pour voir les informations recueillies d'une chaine Youtube
4) Créer un système de mises à jour des données déjà présentes avec possibilité de faire du versioning, par exemple, on récupère les données aujourd'hui et demain et on veut voir combien de vues supplémentaires sont présentes depuis la dernière fois

##### **[#5]** - *facile* - Créer un site pour commander des Pizzas et historique de commandes

Création d'une application Fullstack pour commander des Pizzas (ou autre) en étant connecté à un compte, il y aura un formulaire complet pour créer son compte et commander des pizzas. Il y aura un compte admin qui permettra de voir les commandes de
pizzas pour les réaliser (fictivement). L'admin pourra ainsi accepter la commande ou la refuser et l'utilisateur pourra suivre l'état de sa commande depuis son interface.

1) Gestion de compte utilisateur avec mot de passe et avec session
2) Avoir des permissions sur les utilisateurs ou groupes pour pouvoir gérer les utilisateurs si besoin
3) Faire une interface pour commander UNE ou PLUSIEURS pizza(s)
4) Les pizzas commandées sont envoyées à un administrateur pour qu'il valide ou non la commande
5) L'utilisateur pourra suivre ses commandes depuis son interface et voir son historique de commande
6) Optionnel : Vous pouvez faire des stats sur la pizza la plus achetée ou faire un système de recommandation

##### **[#6]** - *Complexe* - Faire un système de ticket de support avec notifications

Création d'une application pour créer des tickets de support qui auront des états (ouverts, fermés, en cours, ect) et qu'un admin pourra actualiser et mettre à jour. Dès que le status d'un ticket est mis à jour alors une notification est envoyé à
l'utilisateur.

1) Gestion de compte utilisateur avec mot de passe et avec session
2) Avoir des permissions sur les utilisateurs ou groupes pour pouvoir gérer les utilisateurs si besoin
3) Créer une interface pour créer un ticket avec au minimum les champs suivants : `titre`, `description`, `status`, `priorité`, `type` et `dateDeCreation`
4) Créer une interface pour visualiser SEULEMENT ses tickets ou tous les tickets si on est un admin
5) Créer une interface pour mettre à jour l'état d'un ticket
6) Optionnel : Vous pouvez utiliser SocketIO pour envoyer des notifications à l'utilisateur qui a créé le ticket si son état a changé et des notifications à l'administrateur pour chaque mise à jour de ticket et lors de la création de ticket