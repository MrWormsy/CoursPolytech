import axios from "axios";

/**
 * Faire une demande pour savoir si l'utilisateur (lui-même) est authentifié
 */
export const checkIfUserLogged = async () => {

    // On essaye de faire la requête
    try {

        // On lance la requête
        const response = await axios.get("/api/authenticated");

        // On retourne le résultat si le try est un succès
        return response.data
    }

        // Si on attrape une erreur alors on en relance une disant que l'utilisateur n'est pas connecté
    catch (e) {
        throw new Error("L'utilisateur n'est pas connecté")
    }
}