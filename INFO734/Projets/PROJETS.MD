# Projets INFO 734

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