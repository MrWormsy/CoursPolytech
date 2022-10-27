import {PageWrapper} from "../../components/pageWrapper";
import {Columns, Heading} from "react-bulma-components";
import {UserCreationForm} from "../../components/users/userCreationForm";
import ProtectedRoute from "../../components/protectedRoute";

/**
 * La page pour créer un nouvel utilisateur, c'est à dire le '/newuser'
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 */
const NewUserPage = ({showErrorMessage, showSuccessMessage}) => {
    return (
        <PageWrapper>
            <Columns.Column className="is-8 is-offset-2 tp-notification">
                <Heading className="is-3">Page pour ajouter un compte utilisateur</Heading>
                <p className="description">Seul un admin peut ajouter un utilisateur</p>
                <hr/>
                <UserCreationForm showErrorMessage={showErrorMessage} showSuccessMessage={showSuccessMessage}/>
            </Columns.Column>
        </PageWrapper>
    )
}

// On exporte la page
export default ProtectedRoute(NewUserPage, true);