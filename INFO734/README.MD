# INFO 734 : Fullstack

## Récapitulatif des séances

|    Cours     |    Date    | Début |  Fin  |
|:------------:|:----------:|:-----:|:-----:|
| INFO734 - CM | 10/13/2022 | 9:45  | 11:15 |
| INFO734 - CM | 10/18/2022 | 13:15 | 14:45 |
| INFO734 - TP | 10/19/2022 | 13:15 | 17:15 |
| INFO734 - CM | 10/21/2022 | 8:00  | 9:30  |
| INFO734 - CM | 10/21/2022 | 9:45  | 11:15 |
| INFO734 - TP | 10/27/2022 | 13:30 | 17:30 |
| INFO734 - CM | 11/10/2022 | 11:15 | 12:45 |
| INFO734 - TP | 11/14/2022 | 13:15 | 17:15 |
| INFO734 - CM | 11/29/2022 | 14:30 | 16:00 |
| INFO734 - TP | 12/07/2022 | 13:15 | 17:15 |
| INFO734 - TP | 12/16/2022 | 13:30 | 17:30 |
| INFO734 - CM | 01/03/2023 | 9:45  | 11:15 |

## Notation

### *Quelques (petits) tests écrits*

Il y aura des petites interrogations écrites toutes les séances ou une séance sur deux pour vérifier que l'étudiant a compris. Ces interrogations sont faites seulement pour vérifier les compétences, il faut donc jouer le jeu et s'impliquer un
minimum.

### *Note de projet finale*

Vous serez noté sur :

1) *La qualité du code*
2) *L'utilisation de Trello (pour voir comment vous avez géré votre projet)*
3) *L'utilisation de Git (voir comment et combien de temps vous avez travaillé)*
4) *Les explications sur comment et pourquoi vous avez réalisé telle ou telle tache lors des séances de restitution*

## Contenu théorique des séances

### [Séance 1 - CM 1 - 10/13/2022 de 9:45 à 11:15](https://github.com/MrWormsy/CoursPolytech/blob/8a16c6794b7b08029e36d3adf181014150056f7d/INFO734/Cours/CM1/INFO734%20-%20CM%20-%201.pdf):

###### La première séance fait office d'introduction au javascript, le but n'est pas de voir en profondeur ce langage, mais de comprendre les bases de ce dernier pour pouvoir comprendre, interagir avec et concevoir les projets fullstack.

###### Le mieux est d'avoir déjà fait du JS ou à minima de regarder le site https://fr.javascript.info/ qui donne les bases du langage.

#### Cheminement de la séance

1) *Petit Quiz pour savoir qui a déjà fait du JS*
2) *Présentation du JS à l'aide d'une diapo*
3) *Présentation de quelques cas personnels*
5) *Manipulation du JS avec quelques petits exercices*

### Pour la prochaine séance

1) Installer docker et se renseigner sur ce que ça fait: https://www.youtube.com/watch?v=8cH0ilGlQdE

#### Notes de fin de cours

***

### [Séance 2 - CM 2 - 10/18/2022 de 13:15 à 14:45](https://github.com/MrWormsy/CoursPolytech/blob/03b19ab9d659832308a899a4412c12051e4c65df/INFO734/Cours/CM2/INFO%20734%20-%20CM%20-%202.pdf):

###### La deuxième séance sera la présentation de ce qu'est la programmation Fullstack par des exemples et de ma manipulation. Plusieurs façons de faire du Fullstack seront présentées, mais le NodeJS avec Express et EJS seront la priorité.

##### Mini interrogation - CM 2 - 5 minutes

*Un petit exercice écrit sera donné sur ce que j'ai dit la semaine dernière, il ne doit pas durer plus de 5 minutes. Il sert à voir si vous avez compris les bases du JS.*

Écrire une variable chaîne de caractères à l'aide de variables (penser à la concaténation ou le formatage de chaîne de caractères) pour vous présenter en langage Javascript avec les variables suivantes (variable: type):
- nom: string
- prénom: string
- age: number
- moyenneTrimestres: object (où les clefs doivent être)
    - premierTrismestre: number
    - secondTrismestre: number
- aDejaFaitDuJs: boolean

```javascript
const nom = "ROSA--MARTIN";
const prenom = "Antonin";
const age = 24;
const moyenneTrimestre = {
  premierTrismestre: 12.4,
  secondTrismestre: 14.8
}
const aDejaFaitDuJs = true;

const phrase = `Je m'appelle ${prenom} ${nom} et j'ai ${age} ans. Au semestre dernier j'ai eu ${moyenneTrimestre.premierTrismestre}/20 et ${moyenneTrimestre.secondTrismestre}/20 ${aDejaFaitDuJs ? "j'ai déjà fait du JS" : "je n'ai jamais fait du JS"}`
const phrase2 = "Je m'appelle " + prenom + " " + nom + "et j'ai " + age + " ans. Au semestre dernier j'ai eu " + moyenneTrimestre.premierTrismestre + "/20 et " + moyenneTrimestre.secondTrismestre + "/20"

console.log(phrase)
console.log(phrase2)

// Exemple de promesses
const prom = new Promise(function (resolve, reject) {
  setTimeout(function () {
            console.log("1")
        resolve()
  }, 1000)
})

prom.then(function (value) {
  setTimeout(function () {
      console.log("2")
  }, 2000)  
})
```

#### Cheminement de la séance

1) *Petit Quiz de ce qu'évoque le terme Fullstack aux étudiants*
2) *Petit Quiz nuage de mot pour évoquer les langages et / ou technologies pour faire du Fullstack*
3) *Présentation de quelques cas personnels et d'étude*
4) *Présentation de Docker et docker-compose*
5) *Présentation de quelques bases de données noSQL froides (mongoDB) et chaudes (redis)*

#### Notes de fin de cours

- Le cours n'est pas assez long
- Enseigner Docker et comment utiliser Docker, car ils connaissent un peu la théorie, mais pas assez de pratique
- Essayer d'introduire les promesses

***

### Séance 3 - TP 1 - 10/19/2022 de 13:15 à 17:15

###### Ce TP est pour vraiment prendre en main le NodeJS avec ExpressJS avec un TP guidé pour créer sa première API pour comprendre une architecture pouvant être utilisée en Fullstack avec Express. Un "corrigé" possible sera émis après le cours
###### Grâce à ce TP vous pourrez voir comment créer une API, comment utiliser des promesses et faire des requêtes http depuis du code avec la library `axios`.

#### Cheminement de la séance

1) *Lancement du projet* **TP1-1** *pour voir l'architecture d'une API (simple) avec l'encadrant*
2) *Mise à jour du projet* **TP1-1** *avec la consigne dans le README.MD et le TODO.MD de ce dernier*

#### Notes de fin de cours

- Le faire créer un vrai projet depuis 0 genre avec `npm init`

***

### [Séance 4 et 5 - CM 3 & TD 1 - 10/21/2022 de 8:00 à 9:30 et 9:45 à 11:15](https://github.com/MrWormsy/CoursPolytech/blob/de22338b17953413a3aa3ba2c21fc6e6ef286d84/INFO734/Cours/CM3/INFO%20734%20-%20CM%20-%203.pdf)

###### Cette séance servira à créer un projet Fullstack de 0 et d'utiliser Docker et docker-compose pour le déploiement

#### Cheminement de la séance

1) *Diaporama pour présenter comment créer une application Fullstack depuis 0*
2) *Façons de faire transiter la donnée, API REST et Websockets*
3) *Principe de la session et du compte utilisateur*
4) *Utilisation de Docker et docker-compose*
5) *Tutoriel pour créer sa propre API pas à pas dans le fichier Cours/TD1/README.MD*

#### Notes de fin de cours

***

### [WIP] Séance 6 - TP 2 - 10/27/2022 de 13:30 à 17:30

###### Manipulation de Redis, Session et SocketIO dans un TP. Plus mise en place de ces projets dans des images Docker avec utilisation de docker-compose qui sera un aspect du projet.

#### Cheminement de la séance

#### Notes de fin de cours

***

### [WIP] Séance 7 - CM (TD) 4 - 11/10/2022 de 11:15 à 12:45

###### /!\ Attention je serai aux USA pour cette séance, donc visio /!\

###### Mini cours de comment utiliser `GIT` pour le projet, qui sera un aspect de la note du projet !

###### Mini présentation de `Github Projects` pour la gestion de projet qui sera un aspect de la note du projet

###### Présentation des projets à réaliser en "groupe" de 1 à 3 et création de nouveaux projets s'il y a d'autres idées. Le but de ce projet est que l'étudiant comprenne comment un projet se structure et se suit en étant seul ou en équipe.

#### Cheminement de la séance

#### Notes de fin de cours

***

### [WIP] Séance 8 - TP 3 - 11/14/2022 de 13:15 à 17:15

###### /!\ Attention je serai aux USA pour cette séance, donc visio /!\

###### 1er TP de projet où je reste disponible ~H24 mais ce TP se fait en autonomie, si vous n'avez pas envie de venir en visio, pas de soucis, mais sachez que je verrai votre historique GIT et je verrai donc si vous avez travaillé lors de cette séance !

#### Cheminement de la séance

#### Notes de fin de cours

***

### [WIP] Séance 9 - CM 5 - 11/29/2022 de 14:30 à 16:00

###### /!\ Attention je serai aux USA pour cette séance, donc visio /!\

##### Séance de mi-projet avec une mini présentation de ce que vous avez fait, des problèmes rencontrés et ce que devrez encore faire

#### Cheminement de la séance

#### Notes de fin de cours

***

### [WIP] Séance 10 - TP 4 - 12/07/2022 de 13:15 à 17:15

###### 2ème TP de projet où je reste disponible ~H24 mais ce TP se fait en autonomie. Je viendrai voir chaque personne pour m'assurer que tout vas bien et régler des problèmes ou répondre à des questions.

#### Cheminement de la séance

#### Notes de fin de cours

***

### [WIP] Séance 11 - TP 5 - 12/16/2022 de 13:30 à 17:30

###### 3ème TP de projet où je reste disponible ~H24 mais ce TP se fait en autonomie. Je viendrai voir chaque personne pour m'assurer que tout vas bien et régler des problèmes ou répondre à des questions.

#### Cheminement de la séance

#### Notes de fin de cours

***

### [WIP] Séance 12 - CM 6 - 01/03/2023 de 9:45 à 11:15

###### Cette séance est prévue pour que les étudiants présentent brièvement leurs travaux par groupes en 5 minutes de présentation maximum + présentation en direct live avec un docker-compose. Pour le moment, je ne sais pas si la présentation sera notée ou si elle sera juste pour avoir des points bonus*

#### Cheminement de la séance

1) *Présentation de chaque groupe + questions (pertinentes) posées par l'encadrant et l'ensemble de la classe*
2) ...

#### Notes de fin de cours

***