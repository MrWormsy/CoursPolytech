/**
 * On crée la variable qui contiendra le nom du groupe de graphique du dashboard
 */
const groupName = "dataset";

/**
 * Fonction pour reset les filtres et redessiner les graphiques
 */
function reset() {
    dc.filterAll(groupName);
    dc.renderAll(groupName);
}

/**
 * Permet de montrer les % des tranches du pie chart
 * @param chart Le pie chart sur quoi faire la modification
 */
const montrerPourcentagesPieChart = (chart) => {
    chart.selectAll('text.pie-slice').text(function (d) {
        if (((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) !== 0) {
            return dc.utils.printSingleValue(Math.round((d.endAngle - d.startAngle) / (2 * Math.PI) * 100)) + '%';
        }
    })
}

/**
 * La fonction pour créer la visualisation
 */
async function createDataViz() {

    // On récupère le dataset et on le met dans la variable dataset
    let dataset = await d3.tsv("/data/SSDB_Raw_Data.tsv");

    // On récupère les données des grandes villes des USA
    const dataCities = await d3.csv("/data/USA_Major_Cities.csv");

    // On fait un formatage pour créer un object qui aura comme clef l'état et le nom de la vile qui correspondra à la ville, ce qui nous facilitera la vie pour l'étape d'après
    const stateCityToCity = dataCities.reduce((acc, value) => {
        acc[`${value.ST} - ${value.NAME}`] = value;
        return acc;
    });

    // On veut garder une copie du dataset où la clef est l'id d'un événement et où la valeur sera l'événement
    const idToMassShooting = {}

    // On formate un peu la donnée pour nous éviter des soucis
    dataset.forEach((d) => {

        // On veut l'année en chiffre
        d.year = moment(d.Date).year();

        // On veut récupérer les données de la ville avec l'état et la ville, si cette paire n'existe pas alors on ne montrera pas de données pour ce Mass Shooting
        const location = stateCityToCity[`${d.State} - ${d.City}`];
        if (location !== undefined) {
            d.lat = +location.Y;
            d.lng = +location.X;
        }

        // On sauvegarde l'événement à son id
        idToMassShooting[d.Incident_ID] = d;
    });

    // Malheureusement vu que le dataset n'est pas "propre" et certaines villes ne sont pas identifiées, on va devoir enlever les éléments qui n'auront pas de latitude ni de longitude
    dataset = dataset.filter((d) => {
        return d.lat !== undefined && d.lng !== undefined;
    })

    // On crée le crossfilter que l'on va nommer ndx (une pseudo norme)
    const ndx = crossfilter(dataset);

    /* ===== ATTENTION DES MEDIAS - PIE CHART ===== */

    // On crée la dimension qui sera l'attention des médias (ou "Aucune information" si il n'y a pas d'info)
    const attentionDesMediasDimension = ndx.dimension(function (d) {
        return d["Media_Attention"] || "Aucune information";
    });

    // On crée le groupe, on veut le nombre de mass shooting par type d'attention de medias
    const attentionDesMediasGroup = attentionDesMediasDimension.group().reduceCount();

    // On crée le graphique avec le groupName
    const attentionDesMediasChart = dc.pieChart('#attentionDesMediasChart', groupName)
        .dimension(attentionDesMediasDimension) // On ajoute la dimension
        .group(attentionDesMediasGroup) // On ajoute le groupe
        .renderLabel(true) // On rend les labels
        .renderTitle(true) // On rend les titres (quand on passe la sourie sur un élément)
        .ordering(function (p) { // On veut trier par valeur croissante
            return -p.value;
        })
        .ordinalColors(['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']) // Les couleurs des éléments
        .legend(dc.legend().highlightSelected(true).x(0).y(13)) // On ajoute la légende
        .title(function (d) {
            return d.value
        }) // Le titre à montrer quand la sourie est passée sur un élément
        .on('pretransition', montrerPourcentagesPieChart); // On veut montrer les % dans les tranches

    /* ===== FIN ATTENTION DES MEDIAS - PIE CHART ===== */

    /* ===== SCHOOL LEVEL - ROW CHART ===== */

    // On crée la dimension qui sera le niveau scolaire (ou "Unknown" s'il n'y a pas d'info)
    const schoolLevelDimension = ndx.dimension(function (d) {
        return d["School_Level"] || "Unknown";
    });

    // On crée le groupe, on veut le nombre de mass shooting par niveau scolaire
    const schoolLevelGroup = schoolLevelDimension.group().reduceCount();

    // On crée le graphique avec le groupName
    const schoolLevelChart = new dc.RowChart("#schoolLevelChart", groupName)
        .dimension(schoolLevelDimension) // On ajoute la dimension
        .group(schoolLevelGroup) // On ajoute le groupe
        .ordinalColors(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"])
        .elasticX(true) // On veut que l'axe des X puisse redimensionner tout seul
        .ordering(function (p) { // On veut trier par valeur croissante
            return -p.value;
        });

    // On veut mettre 4 ticks pour l'axe des X
    schoolLevelChart.xAxis().ticks(4)

    /* ===== END SCHOOL LEVEL SAISONS - ROW CHART ===== */

    /* ===== SAISONS - PIE CHART ===== */

    // On crée la dimension qui sera la saison (ou "Aucune information" s'il n'y a pas d'info)
    const saisonsDimension = ndx.dimension(function (d) {
        return d["Quarter"] || "Aucune information";
    });

    // On crée le groupe, on veut le nombre de mass shooting par saison
    const saisonsGroup = saisonsDimension.group().reduceCount();

    // On crée le graphique avec le groupName
    const saisonsChart = dc.pieChart('#saisonsChart', groupName)
        .dimension(saisonsDimension) // On ajoute la dimension
        .group(saisonsGroup) // On ajoute le groupe
        .renderLabel(true) // On rend les labels
        .renderTitle(true) // On rend les titres (quand on passe la sourie sur un élément)
        .ordering(function (p) { // On veut trier par valeur croissante
            return -p.value;
        })
        .ordinalColors(['#F94144', '#F3722C', '#F9C74F', '#90BE6D', '#43AA8B']) // Les couleurs des éléments
        .legend(dc.legend().highlightSelected(true).x(0).y(13)) // On ajoute la légende
        .title(function (d) {
            return d.value
        }) // Le titre à montrer quand la sourie est passée sur un élément
        .on('pretransition', montrerPourcentagesPieChart); // On veut montrer les % dans les tranches

    /* ===== FIN SAISONS - PIE CHART ===== */

    /* ===== LOCATION - ROW CHART ===== */

    // On crée la dimension qui sera la localisation de l'événement (ou "Unknown" s'il n'y a pas d'info)
    const locationsDimension = ndx.dimension(function (d) {
        return d["Location"] || "Unknown";
    });

    // On crée le groupe, on veut le nombre de mass shooting par localisation
    const locationsGroup = locationsDimension.group().reduceCount();

    // On crée le graphique avec le groupName
    const locationsChart = new dc.RowChart("#locationsChart", groupName)
        .dimension(locationsDimension) // On ajoute la dimension
        .group(locationsGroup) // On ajoute le groupe
        .cap(8) // On ne veux que 8 résultats et le reste est dans "Reste"
        .ordinalColors(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"])
        .othersLabel("Autres") // Le label du reste des éléments
        .elasticX(true) // On veut que l'axe des X puisse redimensionner tout seul
        .ordering(function (p) { // On veut trier par valeur croissante
            return -p.value;
        });

    // On veut mettre 4 ticks pour l'axe des X
    locationsChart.xAxis().ticks(4)

    /* ===== END SAISONS - ROW CHART ===== */

    /* ===== NOMBRE DE MASS SHOOTING PAR ANNÉE - LINE CHART ===== */

    // On crée la dimension qui sera l'année de l'événement
    const nbMassShootingParDateDimension = ndx.dimension(function (d) {
        return d.year;
    });

    // On crée le groupe, on veut le nombre de mass shooting par an
    const nbMassShootingParDateGroup = nbMassShootingParDateDimension.group().reduceCount();

    // On crée le graphique avec le groupName
    const nbMassShootingParDateChart = dc.lineChart('#nbMassShootingParDateChart', groupName)
        .dimension(nbMassShootingParDateDimension) // On ajoute la dimension
        .group(nbMassShootingParDateGroup) // On ajoute le groupe
        .yAxisLabel("Nombre de Mass Shooting") // On met le label de l'axe y
        .xAxisLabel("Année") // On met le label de l'axe x
        .elasticY(true)// On veut que l'axe des Y puisse redimensionner tout seul
        .elasticX(true)// On veut que l'axe des X puisse redimensionner tout seul
        .x(d3.scaleLinear().domain([1970, 2022]))

    // On veux enlever les ',' des milliers
    nbMassShootingParDateChart.xAxis().tickFormat(function (s) {
        return `${s}`.replaceAll(",", "");
    });

    /* ===== FIN NOMBRE DE MASS SHOOTING PAR ANNÉE - LINE CHART ===== */

    /* ===== LOCALISATION ON MAP - MARKER MAP ===== */

    // On crée la dimension qui prendra la latitude, la longitude et l'id de l'événement, si la longitude et/ou latitude
    // n'existe pas alors le marker ne sera pas créé et la donnée ne sera pas montrée, c'est le risque de ne pas avoir des données propres...
    const localisationOnMapDimension = ndx.dimension(function (d) {
        return [d.lat, d.lng, d.Incident_ID];
    });

    // On crée le groupe, on veut le nombre de mass shooting par latitude, longitude et id similaire
    const localisationOnMapGroup = localisationOnMapDimension.group().reduceCount();

    // On crée la carte leaflet
    const localisationOnMap = L.map('localisationOnMap', {})
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(localisationOnMap);

    // On crée le graphique avec le groupName
    const localisationOnMapChart = dc_leaflet.markerChart("#localisationOnMapChart", groupName)
        .dimension(localisationOnMapDimension) // On applique la dimension
        .group(localisationOnMapGroup) // On applique le groupe
        .map(localisationOnMap) // On applique la carte
        .filterByArea(true) // On veut filtrer par aire
        .cluster(true) // On veut faire des clusters
        .clusterOptions({showCoverageOnHover: false, spiderfyDistanceMultiplier: 1.2, maxClusterRadius: 113, spiderLegPolylineOptions: {weight: 5, color: '#222', opacity: 0.5},})
        .locationAccessor((d) => { // On dit que la longitude est le premier élément de notre dimension et la longitude le second
            return [d.key[0], d.key[1]];
        })
        .popup((d, marker) => {
            const popup = L.popup({autoPan: true, closeButton: true, maxWidth: 300});
            popup.setContent(`
                <div style="overflow-y: scroll;max-height: 25vh;">
                    <h4>${d.key[2]}</h4>
                    ${Object.entries(idToMassShooting[d.key[2]]).map(([key, value]) => {
                return `<b>${key}:</b> ${value}<br/>`
            }).join("")}
                </div>`)
            return popup
        }) // On veut joindre un popup au marker qui sera créé à la latitude et la longitude

    /* ===== FIND LOCALISATION ON MAP - MARKER MAP ===== */

    // On veut rendre tous les graphiques qui proviennent du chart group "dataset"
    dc.renderAll(groupName);
}