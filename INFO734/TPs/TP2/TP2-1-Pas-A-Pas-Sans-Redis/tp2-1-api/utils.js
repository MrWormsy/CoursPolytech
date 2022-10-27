/**
 * Vérifier si une chaîne objectId est valide pour MongoDB
 * @param objectId La chaîne objectId à tester
 * @return true si la chaîne objectId est valide, false sinon
 */
function isObjectIdStringValid(objectId) {
    return new RegExp("^[0-9a-fA-F]{24}$").test(objectId);
}

/**
 * Récupérer les clés qui ne sont pas données dans l'objet ou vides
 * @param keys Les clés nécessaires
 * @param object L'objet où les clés sont censées se trouver
 */
function getKeysNotProvided(keys, object) {
    return keys.filter((key) => !object.hasOwnProperty(key) || object[key] === "");
}

// On exporte les modules
module.exports = {
    isObjectIdStringValid: isObjectIdStringValid,
    getKeysNotProvided: getKeysNotProvided
}