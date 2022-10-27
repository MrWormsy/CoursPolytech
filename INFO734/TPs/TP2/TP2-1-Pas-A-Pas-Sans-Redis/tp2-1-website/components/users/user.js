import {Button, Form} from "react-bulma-components";
import axios from "axios";
import {useState} from "react";
import {useRouter} from "next/router";

/**
 * Le composant pour visionner un utilisateur et le modifier si l'utilisateur en a les droits
 * @param user L'utilisateur
 * @param setUser La fonction pour mettre à jour l'utilisateur
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 */
export const User = ({user, setUser, showSuccessMessage, showErrorMessage}) => {

    /**
     * Le router
     */
    const router = useRouter()

    /**
     * L'utilisateur modifiable
     */
    const [userToUpdate, setUserToUpdate] = useState(user);

    /**
     * Si une requête est en cours pour mettre les champs en disabled et loading
     */
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Fonction utilisée pour mettre à jour les champs
     * @param e L'événement
     */
    const updateField = (e) => {
        setUserToUpdate({
            ...userToUpdate,
            [e.target.name]: e.target.value
        });
    }

    /**
     * Quand l'utilisateur veut supprimer un utilisateur
     * @param event L'événement
     */
    const handleUserDelete = async (event) => {
        // On fait en sorte que l'événement par défaut ne se déclanche pas
        event.preventDefault();

        // On veut mettre les champs en mode disabled et loading
        setIsLoading(true);

        // On veut faire la suppression de l'utilisateur
        await deleteUser(user);

        // Peu importe s'il y a une erreur ou un succès, on veut remettre les champs à la normale (plus en mode loading et disabled)
        setIsLoading(false);
    }

    /**
     * Quand l'utilisateur veut mettre à jour un utilisateur
     * @param event L'événement
     */
    const handleUserUpdate = async (event) => {
        // On fait en sorte que l'événement par défaut ne se déclanche pas
        event.preventDefault();

        // On veut mettre les champs en mode disabled et loading
        setIsLoading(true);

        // On veut faire la modification
        const updateUserResult = await updateUser(userToUpdate);

        // Peu importe s'il y a une erreur ou un succès, on veut remettre les champs à la normale (plus en mode loading et disabled)
        setIsLoading(false);
    }

    /**
     * Supprime l'utilisateur
     * @param userToDelete L'utilisateur à supprimer
     */
    const deleteUser = async (userToDelete) => {

        // On essaye de faire la requête de suppression
        try {
            const response = await axios.delete(`/api/user/${userToDelete._id}`);

            // On montre un message de succès
            showSuccessMessage("La suppression de l'utilisateur est un succès", `L'utilisateur ${response.data.prenom} ${response.data.nom} a été supprimé !`)

            // Si la suppression est un succès alors on renvoie l'utilisateur vers la page "/users" car cet utilisateur n'existe plus
            router.replace("/users");
        }

            // Si on attrape une erreur alors on montre un message d'erreur
        catch (e) {
            showErrorMessage("Il y a eu une erreur lors de la suppression de l'utilisateur", e.response.data);
        }
    }

    /**
     * Met l'utilisateur à jour
     * @param userToUpdate L'utilisateur à mettre à jour
     */
    const updateUser = async (userToUpdate) => {

        // On essaye de faire la requête de mise à jour
        try {
            const response = await axios.put(`/api/user/${userToUpdate._id}`, userToUpdate);

            // On montre un message de succès
            showSuccessMessage("La mise à jour de l'utilisateur est un succès", `L'utilisateur ${response.data.prenom} ${response.data.nom} a été modifié !`)

            // On veut mettre à jour l'utilisateur
            setUser(response.data);

            // On renvoie la donnée de la réponse pour permettre au composant de faire ce qu'il veut avec
            return response.data;
        }

            // Si on attrape une erreur alors on montre un message d'erreur
        catch (e) {
            showErrorMessage("Il y a eu une erreur lors de la mise à jour de l'utilisateur", e.response.data);

            // On renvoie undefined
            return undefined;
        }
    }

    return (
        <div>
            <Form.Field>
                <Form.Control>
                    <Form.Label>Nom</Form.Label>
                    <Form.Input name="nom" className="is-medium"
                                placeholder="Nom" onChange={updateField}
                                value={userToUpdate.nom} disabled={isLoading}/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>
                    <Form.Label>Prénom</Form.Label>
                    <Form.Input name="prenom" className="is-medium"
                                placeholder="Prénom" onChange={updateField}
                                value={userToUpdate.prenom} disabled={isLoading}/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>
                    <Form.Label>Age</Form.Label>
                    <Form.Input name="age" className="is-medium" type="number"
                                placeholder="Age" onChange={updateField}
                                value={userToUpdate.age} disabled={isLoading}/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>

                    <Button.Group align="right">
                        <Button onClick={handleUserDelete} disabled={isLoading} loading={isLoading} color="danger">Supprimer l'utilisateur</Button>
                        <Button onClick={handleUserUpdate} disabled={isLoading} loading={isLoading} color="success">Mettre à jour l'utilisateur</Button>
                    </Button.Group>
                </Form.Control>
            </Form.Field>
        </div>
    )
}