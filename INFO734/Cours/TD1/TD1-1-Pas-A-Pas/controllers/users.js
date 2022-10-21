const {getKeysNotProvided, isObjectIdStringValid} = require("../utils.js");
const {User} = require("../models/index.js");

/**
 * Créer un utilisateur
 * @param user L'utilisateur à créer
 * @returns L'utilisateur crée
 */
async function createUser(user) {

    // On regarde déjà si tous les champs de l'utilisateur sont présents
    const neededKeys = ["nom", "prenom", "age"];
    const keysNotGiven = getKeysNotProvided(neededKeys, user);

    // Si une ou plusieurs clefs ne sont pas données alors on renvoie un message d'erreur
    if (keysNotGiven.length !== 0) {
        return `Les informations suivantes ne sont pas fournies ou vides: '${keysNotGiven.join(', ')}'`;
    }

    // On peut essayer de créer l'utilisateur
    try {

        // On crée un utilisateur avec le model de MongoDB et les informations de l'utilisateur
        const userToCreate = new User(user);

        // Puis on le sauvegarde en n'oubliant pas le mot clef await qui va nous permettre d'attendre que l'utilisateur
        // soit sauvegarder pour nous le renvoyer
        return await userToCreate.save();
    }

        // S'il y a une erreur lors du processus alors on renvoie un message d'erreur
    catch (e) {
        return "Une erreur s'est produite lors de la création de l'utilisateur";
    }
}

/**
 * Lire un utilisateur par son id unique créé par MongoDB
 * @param userId L'identifiant de l'utilisateur à lire
 * @returns L'utilisateur trouvé
 */
async function readUser(userId) {

    // Vérifier si l'userId existe et est un id MongoBD valide
    if (userId === undefined || !isObjectIdStringValid(userId)) {
        return "L'id de l'utilisateur n'existe pas ou n'est pas un id MongoDB"
    }

    // On essaye de trouver l'utilisateur
    try {

        // On veut chercher un object dans la collection "User" par son identifiant MongoDB
        const userFound = await User.findById(userId);

        // Si l'utilisateur trouvé est null c'est qu'il n'existe pas dans la base de données
        if (userFound === null) {
            return "L'utilisateur n'existe pas"
        }

        // Sinon c'est qu'il existe et on le renvoie
        return userFound;
    }

        // S'il y a une erreur, on envoie un message à l'utilisateur
    catch (e) {
        return "Erreur lors de la recherche de l'utilisateur";
    }
}

/**
 * Mettre à jour un utilisateur
 * @param userId L'id de l'utilisateur à mettre à jour
 * @param userToUpdate Les éléments de l'utilisateur à mettre à jour
 * @returns L'utilisateur modifié
 */
async function updateUser(userId, userToUpdate) {

    // Vérifier si l'userId existe et est un id MongoBD valide
    if (userId === undefined || !isObjectIdStringValid(userId)) {
        return "L'id de l'utilisateur n'existe pas ou n'est pas un id MongoDB"
    }

    // Petite chose TRES importante, dans le doute où dans l'object userToUpdate se trouve une clef _id qui a été modifié par une personne malveillante
    // il faut la supprimer de l'object, car _id est un id généré automatiquement et il ne doit pas changer !

    // Attention vu qu'on ne peut pas faire confiance à l'utilisateur il faut vérifier si les champs qu'on veut modifier on bien de la donnée et qu'elle soit non vide,
    // sinon on pourrait remplacer de la donnée importante...
    if (userToUpdate.prenom === "") {
        delete userToUpdate.prenom;
    }

    if (userToUpdate.nom === "") {
        delete userToUpdate.nom;
    }

    if (userToUpdate.age === "") {
        delete userToUpdate.age;
    }

    // On essaye de modifier les informations de l'utilisateur
    try {

        // On demande à MongoDB de modifier les couples clefs/valeurs présents dans l'object userToUpdate de l'object qui a pour identifiant unique MongoDB 'userId'
        // Noter l'option {new: true} qui veut dire que MongoDB nous renverra l'object modifié et non l'object avant sa modification (car on veut renvoyer le user modifié à l'utilisateur)
        const userUpdated = await User.findByIdAndUpdate(userId, userToUpdate, {new: true});

        // Si l'utilisateur trouvé est null c'est qu'il n'existe pas dans la base de données
        if (userUpdated === null) {
            return "L'utilisateur n'existe pas et n'a donc pas pû être modifié"
        }

        // Sinon c'est qu'il existe et on le renvoie
        return userUpdated;
    }

        // S'il y a une erreur, on envoie un message à l'utilisateur
    catch (e) {
        return "Erreur lors de la modification de l'utilisateur";
    }
}

/**
 * Supprime un utilisateur
 * @param userId L'identifiant de l'utilisateur à supprimer
 * @returns L'utilisateur qui vient d'être supprimé
 */

async function deleteUser(userId) {

    // Vérifier si l'userId existe et est un id MongoBD valide
    if (userId === undefined || !isObjectIdStringValid(userId)) {
        return "L'id de l'utilisateur n'existe pas ou n'est pas un id MongoDB"
    }

    // On essaye de supprimer l'utilisateur
    try {

        // On demande à MongoDB de supprimer l'utilisateur qui a comme identifiant unique MongoDB 'userId'
        const userDeleted = await User.findByIdAndDelete(userId);

        // Si l'utilisateur trouvé est null c'est qu'il n'existe pas dans la base de données
        if (userDeleted === null) {
            return "L'utilisateur n'existe pas et n'a donc pas pû être supprimé"
        }

        // Sinon c'est qu'il existe et on le renvoie
        return userDeleted;
    }

        // S'il y a une erreur, on envoie un message à l'utilisateur
    catch (e) {
        return "Erreur lors de la suppression de l'utilisateur";
    }
}

/**
 * Récupère TOUS les utilisateurs depuis la base de données
 */
async function readAllUsers() {

    // On essaye de récupérer TOUS les utilisateurs (donc on ne met pas de conditions lors de la recherche, juste un object vide)
    try {
        return await User.find({})
    }

        // S'il y a une erreur, on renvoie un message
    catch (e) {
        return "Il y a eu une erreur lors de la recuperation des utilisateurs";
    }
}

// On exporte les modules
module.exports = {
    createUser: createUser,
    readUser: readUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    readAllUsers: readAllUsers
}