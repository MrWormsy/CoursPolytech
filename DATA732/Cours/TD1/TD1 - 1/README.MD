# DATA 732 - TD 1

Pour lancer le serveur

```shell
npm install
npm start
```

### Exercice #1

Regarder les deux fichiers de données présents dans `/public/data`. Pour créer des visualisations nous devez utiliser la plupart du temps des fichiers utilisant le format JSON, XML ou dérivés de CSV (CSV séparé par une virgule ou un point virgule,
TSV séparé par une tabulation, ect).

Ici nous avons deux fichiers :

- `/public/data/SSDB_Raw_Data.tsv` : fichier regroupant la quasi-totalité des tueries de masses dans les lieux en rapport avec l'éducation depuis 1970 sur le sol des Etats-Unis. Les données sont faciles à comprendre et elles sont relativements
  propres et bien formattées.
- `/public/data/USA_Major_Cities.csv` : fichier contenant ~3900 des plus grandes villes des Etats-Unis, avec tout un tas d'information à leur sujet, nous allons utiliser ces données pour pouvoir ajouter une dimension spaciale à notre dashboard et
  donc ajouter une carte. Bien qu'il y ait beaucoup de villes, il y a malheureusement des événements tragiques dans des plus petites villes et nous ne pourront pas ajouter de données spaciale à ces événements, nous avons donc du les tronquer lors du
  formatage des données pour ne garder que les données vraiment pertinentes.

Une fois ces données en tête, allez sur la visualisation et testez-la, vérifiez son interactivité et la façon dont ces données sont modifiées dynamiquement.

### Exercice #2

Regarder le code présent dans les fichiers `/public/index.html` et `/public/viz.js` et essayer de comprendre la logique derrière la création d'un dashboard avec DC.js. La méthodologie est toujours la même :

1) Création d’un crossfilter avec la donnée.
2) Création d’une dimension à représenter (suivant votre cas d’étude et le type de graphique).
3) Création d’un groupe à partir de la dimension à représenter (suivant le type de graphique).
4) Création d’un graphique qui répond à ce que vous voulez montrer en lui ajoutant un “chartGroup” ( Dans DC.js, les graphiques peuvent être regroupés en un seul ensemble. Tous les graphiques d'un groupe sont censés partager le même jeu de données
   Crossfilter. Ils sont rendus et redessinés simultanément.).
5) Ajout de la dimension au graphique
6) Ajout du groupe au graphique
7) Ajout des options spécifiques au graphique

Vous pouvez modifier les options et regarder sur la documentation quelles sont les options disponibles pour chacun des cas : https://dc-js.github.io/dc.js/docs/html/.

### Exercice #3

Faite ce que vous voulez/pouvez dans l'ordre que vous avez envie

### Exercice #3.1

Vous pouvez ajouter les options nécessaires pour une compréhension totale des graphiques déjà présents [La documentation](https://github.com/dc-js/dc.js/blob/master/docs/api-latest.md) (les labels, le nombre de ticks des axes, les couleurs, les "
title" (quand on passe la souris sur des éléments), ect)

### Exercice #3.2

Ajoutez un graphique (ajoutez le à la fin du fichier HTML, ne perdez pas de temps à faire du style en CSS) [`DataTable`](https://dc-js.github.io/dc.js/docs/html/DataTable.html) pour avoir une liste des événements avec au moins les champs suivants :

- Incident_ID
- Date
- Quarter
- School
- City
- State
- School_Level
- Preplanned
- Shots_Fired

### Exercice #3.3

Ajout d'un graphique [`PieChart`](https://dc-js.github.io/dc.js/docs/html/PieChart.html) pour visualiser la donnée `Location_Type`, mettre toutes les options nécessaires pour une compréhension totale.

### Exercice #3.4

Ajout d'un graphique [`RowChart`](https://dc-js.github.io/dc.js/docs/html/RowChart.html) pour visualiser la donnée `Time_Period`, mettre toutes les options nécessaires pour une compréhension totale.

### Exercice #3.5

Ajout d'un graphique [`BarChart`](https://dc-js.github.io/dc.js/docs/html/BarChart.html) pour visualiser la donnée `First_Shot` en fonction du jour de la semaine que vous pouvez avoir avec `Date`, mettre toutes les options nécessaires pour une
compréhension totale. Il y aura du formatage de données, si besoin me demander.

### Exercice #3.6

Ajout d'un graphique [`HeatMap`](https://dc-js.github.io/dc.js/docs/html/HeatMap.html) pour visualiser la donnée `Bullied` en fonction de `Gang_Related`, mettre toutes les options nécessaires pour une compréhension totale.

### Exercice #3.7

Ajout d'un graphique [`RowChart`](https://dc-js.github.io/dc.js/docs/html/RowChart.html) pour visualiser la donnée `Sources` en ne gardant que le nom du site, mettre toutes les options nécessaires pour une compréhension totale.

### Exercice #3.8

Ajout d'un graphique [`Bubble chart`](https://github.com/dc-js/dc.leaflet.js#bubble-chart) ou [ICI](https://dc-js.github.io/dc.leaflet.js/) pour visualiser la donnée `POPULATION` du dataset `/public/data/USA_Major_Cities.csv`, mettre toutes les
options nécessaires pour une compréhension totale. Le but est de pouvoir avoir une vision du nombre d'événements en fonction de la population.

### Exercice #3.9

Ajout de graphiques de votre choix pour visualiser la correlation du nombre d'événements en fonction de TOUTES les ethnies d'une ville (que vous pouvez retrouver dans le fichier `/public/data/USA_Major_Cities.csv`) (pensez à faire un composite chart
de line)