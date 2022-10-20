# Projets INFO 734

## Idées de projet

##### **[#1]** - *Complexe* - Visualisation sous forme de dashboard d'une capture Stream Twitter

1) Capture Twitter depuis son compte sur un mot clef
2) Création d'un dashboard pertinent pour montrer ces données
3) Utilisation d'une base de données "froide" pour persister les données
4) Utilisation d'une websocket (genre SocketIO) pour envoyer les données récupérées lors d'une stream vers le dashboard

#### Notes
- Attention de ne pas laisser les clefs d'API trainer dans votre code, il faut utiliser le package `dotenv`

##### **[#2]** - *Intermédiaire* - Création d'un système de message, style messenger avec gestion de compte utilisateur

1) Gestion de compte utilisateur (avec ou sans mot de passe) avec session
2) Il sera possible de récupérer une conversation entre un OU plusieurs utilisateurs à l'aide d'une base de données "froide" pour persister les données
3) Il y aura une interface avec plusieurs pages, une pour la "connexion", une page d'accueil avec ce que fait le projet et une page où se trouve les conversations
4) Il faut que les messages puissent être reçus en temps réel (avec SocketIO par exemple)

##### **[#3]** - *Intermédiaire* - Créer un replica de stackoverflow

##### **[#4]** - *facile* - Créer un site de statistiques sur des chaines Youtube

#### Notes
- Attention de ne pas laisser les clefs d'API trainer dans votre code, il faut utiliser le package `dotenv`

##### **[#5]** - *facile* - Créer un site pour commander des Pizzas et historique de commandes

##### **[#6]** - *Intermédiaire* - Créer un Forum en ligne

##### **[#6]** - *Complexe* - Faire un système de ticket de support avec notifications