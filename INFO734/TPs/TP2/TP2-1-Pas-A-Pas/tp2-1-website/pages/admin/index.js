import {useState} from 'react';
import axios from "axios";
import ProtectedRoute from "../../components/protectedRoute";
import {Button, Columns, Form, Heading} from "react-bulma-components";
import {PageWrapper} from "../../components/pageWrapper";

/**
 * La page administrateur "/admin"
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 */
const AdminPage = ({showErrorMessage, showSuccessMessage}) => {

    /**
     * Le message qu'un admin pourra envoyer
     */
    const [messageToSend, setMessageToSend] = useState("");

    /**
     * Fonction utilisée pour mettre à jour le message à envoyer
     * @param e L'événement
     */
    const updateField = (e) => {
        setMessageToSend(e.target.value);
    }

    /**
     * Envoie le message à tous les utilisateurs du site
     * @param event L'événement
     */
    const handleMessageSending = async (event) => {

        // On fait en sorte que l'événement par défaut ne se déclanche pas
        event.preventDefault();

        // On essaye de faire la requête post pour envoyer le message. Si on n'attrape une erreur ça veut dire qu'il y a eu des soucis, sinon le message apparaitra tout seul...
        try {
            await axios.post("/api/message", {message: messageToSend});
        } catch (e) {
            showErrorMessage("Il y a eu une error lors de l'envoie du message", e.response.data);
        }
    }

    /**
     * Fonction qui s'exécute si un utilisateur appuie sur la touche entrée (pour que ça soit plus rapide que de cliquer sur le bouton)
     * @param event L'événement
     */
    const handleKeyDown = (event) => {

        // La touche 13 est la touche "entrer"
        if (event.keyCode === 13 && event.shiftKey === false) {
            handleMessageSending(event);
        }
    }

    return (
        <PageWrapper>
            <Columns.Column className="column is-10 is-offset-1 tp-notification-bigger">
                <Columns>
                    <Columns.Column className="left">

                        <Heading>Envoie d'un message à tous les utilisateurs</Heading>
                        <form>
                            <Form.Field>
                                <Form.Control>
                                    <Form.Input name="message" className="is-medium"
                                                placeholder="Message à envoyer" onKeyDown={handleKeyDown}
                                                onChange={updateField} value={messageToSend}/>
                                </Form.Control>
                            </Form.Field>
                            <Button onClick={handleMessageSending} className="is-block is-primary is-fullwidth is-medium">Envoyer le message</Button>
                        </form>

                    </Columns.Column>
                </Columns>
            </Columns.Column>
        </PageWrapper>
    );
}

// C'est une page protégée
export default ProtectedRoute(AdminPage, true);
