const crypto = require("crypto");
const {Account} = require("../models");
const {isObjectIdStringValid} = require("../utils");
const {createUser, deleteUser} = require("./users");

/**
 * On essaye de connecter l'utilisateur
 * @param headerAuthorization Le header authorization
 */
const logInUser = async (headerAuthorization) => {

    // On récupère le mot de passe et l'email du header authorization
    let [email, password] = Buffer.from(headerAuthorization, 'base64').toString().split(':');

    // On hash le mot de passe avec l'algorithme SHA256 et on veut le résultat en hexadecimal
    let passwordToCheck = crypto.createHash('sha256').update(password).digest("hex");

    // On cherche le compte qui a cet email avec le mot de passe.
    let accountFound = await Account.findOne({email: email.toLowerCase(), password: passwordToCheck});

    // Si le compte existe alors on renvoie ses données
    if (accountFound !== null) {
        return {
            userId: accountFound.user,
            email: accountFound.email,
            isSuperUser: accountFound.isSuperUser
        }
    }

    // Sinon on veut renvoyer une erreur
    throw new Error("Aucun compte n'a été trouvé avec ces identifiants");
}

/**
 * Récupère la donnée de l'utilisateur (son compte + l'utilisateur en lui-même) (sauf le mot de passe)
 * @param userId L'id de l'utilisateur que l'on veut récupérer
 */
const getUserData = async (userId) => {

    // Vérifier si l'userId existe et est valide
    if (userId === undefined || !isObjectIdStringValid(userId)) {
        throw new Error("L'id de l'utilisateur est invalide ou non défini");
    }

    // On Veut trouver le compte lié à l'utilisateur et le retourner avec les données de l'utilisateur (sans le mot de passe)
    // Le fait d'utiliser lean nous permet de renvoyer l'object JSON et non l'object avec le Model associé (https://mongoosejs.com/docs/tutorials/lean.html)
    // Le fait de faire un populate nous ajoute dans le champ user, les valeurs de l'utilisateur qui a pour id la valeur de la clef 'user' du compte
    let userFound = await Account.findOne({user: userId}).populate("user").lean();

    // Si l'utilisateur n'a pas été trouvé on renvoie une erreur
    if (userFound === null) {
        throw new Error("L'utilisateur n'a pas été trouvé");
    }

    // Sinon on enlève le mot de passe
    delete userFound.password;

    // On renvoie la donnée
    return userFound;
}


/**
 * Créer un nouveau compte utilisateur (avec un utilisateur associé)
 * @param email L'email avec lequel le compte doit être créé
 * @param password Le mot de passe du compte
 * @param isSuperUser Si l'utilisateur est un "super utilisateur" (un admin)
 * @param user Les informations utilisateur pour créer l'utilisateur lié au compte
 */
const signUpUser = async (email, password, isSuperUser, user) => {

    // On fait des tests...
    if (email === undefined || email === "") {
        throw new Error("L'email doit être défini et non vide pour créer un compte");
    }

    if (password === undefined || password === "") {
        throw new Error("Le mot de passe doit être défini et non vide pour créer un compte");
    }

    if (isSuperUser === undefined) {
        isSuperUser = false;
    }

    // On regarde déjà si un compte n'existe pas à cette adresse email (pour ne pas en recréer un)
    const alreadyExistingAccount = await Account.findOne({email: email});
    if (alreadyExistingAccount !== null) {
        throw new Error("Un compte existe déjà avec cette adresse email");
    }

    // On utilise le sha256 pour sécuriser le mot de passe dans la base de données
    const passwordEncrypted = crypto.createHash('sha256').update(password).digest("hex");

    // On veut d'abord essayer de créer un utilisateur pour voir si on peut créer un utilisateur associé au compte que l'on veut créer
    let userCreated;
    try {
        userCreated = await createUser(user);
    }

        // Si on attrape une erreur, c'est que l'utilisateur n'a pas pû être créé et on ne peut donc pas créer de compte...
    catch (e) {
        throw new Error(`Erreur lors de la création de l'utilisateur du compte: ${e}`)
    }

    // Une fois l'utilisateur crée on va créer le compte où l'utilisateur sera associé
    const newAccount = new Account({
        email: email.toLowerCase(),
        password: passwordEncrypted,
        isSuperUser: isSuperUser,

        // On donne à user la valeur de l'identifiant unique MongoDB de l'utilisateur créé
        user: userCreated._id
    });

    // On essaye de créer le compte, on veut faire un try/catch, car si ça ne marche pas on veut supprimer l'utilisateur associé, car il ne pourra pas être lié à un compte
    try {
        const accountCreated = await newAccount.save();

        // On veut retourner l'id du compte créé
        return accountCreated._id;
    } catch (e) {

        // On veut supprimer l'utilisateur
        await deleteUser(userCreated._id);

        // Et on throw l'erreur qu'on a catch
        throw e;
    }
}

// On exporte les fonctions
module.exports = {
    logInUser: logInUser,
    getUserData: getUserData,
    signUpUser: signUpUser
}