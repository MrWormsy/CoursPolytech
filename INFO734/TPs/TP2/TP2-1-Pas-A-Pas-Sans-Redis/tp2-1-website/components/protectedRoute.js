import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {CustomPuffLoader} from "./customPuffLoader";
import {checkIfUserLogged} from "../utils/utils";

/**
 * Une fonction qui permet de ne laisser l'accès à une page que si un utilisateur est connecté et dans certains cas s'il est un "super utilisateur"
 * @param WrappedComponent La page a "wrapper"
 * @param isSuperUserPage Si la page ne doit être accédée pour par un "super utilisateur"
 */
const ProtectedRoute = (WrappedComponent, isSuperUserPage) => {
    return (props) => {

        /**
         * Si la requête pour savoir si l'utilisateur est connecté est complétée
         */
        const [isLoaded, setLoaded] = useState(false);

        /**
         * S'il y a une erreur de permission, c'est-à-dire si l'utilisateur n'a pas accès à la page
         */
        const [isPermissionIssue, setIsPermissionIssue] = useState(false);

        // Nous vérifions si l'utilisateur est connecté ou non
        useEffect(() => {
            (async () => {

                // Si on n'a pas déjà vérifié si l'utilisateur était connecté et avait accès à la page
                if (!isLoaded) {

                    // Si l'utilisateur semble être connecté, nous vérifions auprès du serveur si l'utilisateur est réellement connecté.
                    try {
                        const isUserLoggedData = await checkIfUserLogged();

                        // Si la requête est un succès alors on peut mettre la réponse de si l'utilisateur est connecté et s'il est un "super utilisateur" dans le cas où la page n'est accessible qu'en mode super utilisateur
                        if (isSuperUserPage) {
                            setIsPermissionIssue(isUserLoggedData.isSuperUser);
                        } else {
                            setIsPermissionIssue(isUserLoggedData.isUserLogged);
                        }
                    }

                        // Si on attrape une erreur alors on met que l'utilisateur n'a pas accès à la page
                    catch (e) {
                        setIsPermissionIssue(false);
                    }

                    // On met que la donnée a été récupérée pour ne pas refaire la requête
                    setLoaded(true)
                }
            })()
        }, [isLoaded]);
        /**
         * Si l'utilisateur peut accéder à la page
         */
        const [canUserAccessPage, setCanUserAccessPage] = useState(false);

        // Si la donnée n'a pas été encore récupérée alors on met un loader pour montrer à l'utilisateur que ça patiente
        if (!isLoaded) {
            return <CustomPuffLoader/>;
        }

        // S'il y a un problème de permission alors on renvoie l'utilisateur à la page d'accueil, car il n'a pas accès ç cette page !
        if (!isPermissionIssue) {
            useRouter().replace("/");
            return <CustomPuffLoader/>;
        }

        // Sinon on peut montrer la page car l'utilisateur y a accès avec les props de la page !
        return <WrappedComponent {...props} />;
    };
};

export default ProtectedRoute;
