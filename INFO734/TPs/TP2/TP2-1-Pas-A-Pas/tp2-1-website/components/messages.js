import {Button, Container, Message as BulmaMessage} from "react-bulma-components";
import {useEffect} from "react";

/**
 * Un message qui peut prendre plusieurs types
 * @param message Le titre du message
 * @param tooltip Le contenu du message
 * @param visible Si le message est visible
 * @param hideMessage La fonction pour cache le message
 * @param type Le type du message
 */
export const Message = ({message, tooltip, visible, hideMessage, type}) => {

    // 5 secondes après l'affichage du message, on le cache
    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                if (visible) {
                    hideMessage();
                }
            }, 5000)
        }
    })

    // S'il n'est pas visible on ne montre rien grâce à null
    if (!visible) {
        return null;
    }

    return (
        <Container className="tp-message">
            <BulmaMessage color={type} style={{position: "absolute", width: "100%"}}>
                <BulmaMessage.Header>
                    <p>{message}</p>
                    <Button style={{backgroundColor: "rgba(10,10,10,.2)"}} onClick={() => hideMessage()} className="delete" aria-label="delete"/>
                </BulmaMessage.Header>
                <BulmaMessage.Body>
                    {tooltip}
                </BulmaMessage.Body>
            </BulmaMessage>
        </Container>
    )
}