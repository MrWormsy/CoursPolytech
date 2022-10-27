import {PageWrapper} from "../../components/pageWrapper";
import {Columns, Heading} from "react-bulma-components";
import {LoginForm} from "../../components/users/loginForm";

/**
 * La page pour connecter un utilisateur "/login"
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 * @param showInfoMessage Fonction pour montrer un message d'information
 */
const LoginPage = ({showErrorMessage, showInfoMessage, showSuccessMessage}) => {

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