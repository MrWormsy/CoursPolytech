import {PageWrapper} from "../../components/pageWrapper";
import {Columns, Heading} from "react-bulma-components";
import {useEffect, useState} from "react";
import {CustomPuffLoader} from "../../components/customPuffLoader";
import {LoginForm} from "../../components/users/loginForm";
import {checkIfUserLogged} from "../../utils/utils";

/**
 * La page pour connecter un utilisateur "/login"
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 * @param showInfoMessage Fonction pour montrer un message d'information
 */
const LoginPage = ({showErrorMessage, showInfoMessage, showSuccessMessage}) => {

    /**
     * On regarde si l'utilisateur est déjà connecté (pas besoin de le connecter s'il est déjà)
     */
    const [isUserAlreadyLoggedIn, setUserAlreadyLoggedIn] = useState(false);
    const [hasCheckBeenDone, setCheckBeenDone] = useState(false);

    // Vérifie que l'utilisateur n'est pas déjà connecté et s'il l'est alors on lui dit qu'il doit se déconnecter pour se reconnecter.
    useEffect(() => {
        (async () => {
            if (!hasCheckBeenDone) {

                // On essaye de regarder si l'utilisateur est déjà connecté
                try {
                    const isUserLoggedData = await checkIfUserLogged();

                    // Si la requête est un succès alors on peut mettre la réponse de si l'utilisateur est connecté
                    setUserAlreadyLoggedIn(isUserLoggedData.isUserLogged);
                }

                    // Si on a une erreur ça veut dire que l'utilisateur n'est pas connecté
                catch (e) {
                    setUserAlreadyLoggedIn(false);
                }

                // On dit qu'on a fait la requête pour savoir si l'utilisateur est déjà connecté
                setCheckBeenDone(true);
            }
        })()
    }, [hasCheckBeenDone])

    // Si la requête pour savoir si l'utilisateur n'est pas déjà connecté n'a pas encore été faite alors on monde le loader
    if (!hasCheckBeenDone) {
        return <CustomPuffLoader/>
    }

    // Si l'utilisateur est déjà connecté alors on lui envoie un message d'info
    if (isUserAlreadyLoggedIn) {
        showInfoMessage("Vous êtes déjà connecté, si vous voulez vous reconnecter, vous devez d'abord vous déconnecter");
    }

    // Sinon on renvoie la page pour se connecter
    return (
        <PageWrapper>
            <Columns.Column className="is-4 is-offset-4 tp-notification-bigger">
                <Columns>
                    <Columns.Column className="right has-text-centered">
                        <Heading className="is-3">Formulaire de connexion</Heading>
                        <p className="description">Pour vous connecter, utilisez l'email et le mot de passe que l'administrateur vous a donné.</p>
                        <LoginForm showErrorMessage={showErrorMessage} showInfoMessage={showInfoMessage}/>
                    </Columns.Column>
                </Columns>
            </Columns.Column>
        </PageWrapper>
    );
}

export default LoginPage;