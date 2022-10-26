const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Ce schema sera utilisé pour stocker les utilisateurs
 * @schema : User
 */
const UserSchema = new Schema({

    /**
     * Le nom de l'utilisateur
     */
    nom: {
        type: Schema.Types.String,
        required: true
    },

    /**
     * Le prénom de l'utilisateur
     */
    prenom: {
        type: Schema.Types.String,
        required: true
    },

    /**
     * L'age de l'utilisateur
     */
    age: {
        type: Schema.Types.Number,
        required: true
    },

    /**
     * Ce champ sera pour savoir quand un utilisateur a été ajouté la base de données
     * Le fait de mettre 'default: Date.now' permettra de créer ce champ sans devoir le renseigner et sera la date au moment de l'ajout du document
     */
    createdAt: {
        type: Schema.Types.Date,
        default: Date.now
    }
});

/**
 * Ce schema sera utilisé pour stocker les comptes d'utilisateurs
 * @schema : Account
 */
const AccountSchema = new Schema(
    {

        /**
         * L'email de l'utilisateur
         */
        email: {
            type: Schema.Types.String,
            required: true
        },

        /**
         * Le mot de passe de l'utilisateur
         */
        password: {
            type: Schema.Types.String,
            required: true
        },

        /**
         * SI l'utilisateur est un "super utilisateur"
         */
        isSuperUser: {
            type: Schema.Types.Boolean,
            default: false
        },

        /**
         * la référence de l'utilisateur
         * Utilisé pour faire des .populate pour avoir la donnée de l'utilisateur dans la variable user, on veut faire une référence vers un schema user qui aura juste son identifiant unique MongoDB
         */
        user: {
            type: Schema.Types.ObjectId,
            ref: "user"
        },

        /**
         * Quand le compte a été crée
         */
        createdAt: {
            type: Date,
            default: Date.now
        }
    });

// On exporte le model
module.exports = {

    // On dit que le Model User est créé à partir du Schema UserSchema et le Model sera stocké dans la base de donnée MongoDB sous le nom "user"
    User: mongoose.model('user', UserSchema),

    // On dit que le Model Account est créé à partir du Schema AccountSchema et le Model sera stocké dans la base de donnée MongoDB sous le nom "account"
    Account: mongoose.model('account', AccountSchema)
}