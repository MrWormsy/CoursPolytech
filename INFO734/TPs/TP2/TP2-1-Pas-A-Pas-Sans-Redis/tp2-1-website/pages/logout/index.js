import {useEffect} from 'react';
import {useRouter} from "next/router";
import axios from "axios";
import {CustomPuffLoader} from "../../components/customPuffLoader";

/**
 * La page pour déconnecter un utilisateur "/logout"
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 */
const LogoutPage = ({showErrorMessage, showSuccessMessage}) => {

    /**
     * On récupère le router de NextJS
     */
    const router = useRouter();

    // On utilise un useEffect pour déconnecter l'utilisateur via la route delete "/api/logout"
    useEffect(() => {
        (async () => {

            // On essaye de déconnecter l'utilisateur
            try {
                await axios.delete("/api/logout");

                // Si c'est bien le cas alors on montre le message
                showSuccessMessage("Vous avez bien été déconnecté");
            } catch (e) {
            }

            // On redirige l'utilisateur vers la page d'accueil
            router.push("/");
        })()
    }, []); // Mettre une dépendance au useEffet avec un tableau vide nous permet de lui dire de ne le faire qu'une seule fois

    // On retourne que le loader pour montrer qu'une action est en cours
    return <CustomPuffLoader/>;
}

export default LogoutPage;