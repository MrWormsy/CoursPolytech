import {Button, Form, Heading} from "react-bulma-components";
import {useState} from "react";
import sha256 from "crypto-js/sha256";
import axios from "axios";

/**
 * Le composant pour créer un utilisateur
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 */
export const UserCreationForm = ({showErrorMessage, showSuccessMessage}) => {

    /**
     * Les données pour la création d'un compte utilisateur
     */
    const [newUserAccountData, setNewUserAccountData] = useState({
        email: "",
        password: "",
        passwordConfirmation: "",
        isSuperUser: false,
        nom: "",
        prenom: "",
        age: 18
    })

    /**
     * Fonction utilisée pour mettre à jour les champs, soit le type d'input est une checkbox où alors la valeur sera stockée dans l'attribut checked et non value
     * @param e L'événement
     */
    const updateField = (e) => {
        setNewUserAccountData({
            ...newUserAccountData,
            [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value
        });
    }

    /**
     * Fonction pour créer un compte utilisateur
     * @param event L'événement du click du button
     */
    const signUserUp = async (event) => {

        // On fait en sorte que l'événement par défaut ne se déclanche pas
        event.preventDefault();

        // Nous vérifions d'abord que tous les champs ont été remplis, sinon nous affichons un message
        for (const key in newUserAccountData) {
            if (newUserAccountData[key] === '') {
                return showErrorMessage(`Une ou plusieurs valeur de connexion n'a pas été remplie`, "Veuillez recommencer");
            }
        }

        // SI le mot de passe et sa confirmation ne sont pas les mêmes alors on renvoie une erreur
        if (newUserAccountData.password !== newUserAccountData.passwordConfirmation) {
            return showErrorMessage("Le mot de passe et sa confirmation doivent être les mêmes");
        }

        // On essaye de créer un compte utilisateur
        try {
            const response = await axios.post('/api/signup', {
                email: newUserAccountData.email,
                password: sha256(newUserAccountData.password).toString(),
                isSuperUser: newUserAccountData.isSuperUser,
                user: {
                    nom: newUserAccountData.nom,
                    prenom: newUserAccountData.prenom,
                    age: newUserAccountData.age
                }
            });

            // Comme on est arrivé là, c'est que la création a fonctionné et on peut donc loe dire à l'utilisateur
            showSuccessMessage("Le compte a été créé avec succès.", "Vous dire à cet utilisateur qu'il peur se connecter avec les identifiants que vous créés");
        }

            // Si on attrape une erreur alors on montre un message d'erreur
        catch (e) {
            showErrorMessage("Il y a eu une erreur lors de la création de l'utilisateur", e.response.data);
        }
    }

    /**
     * Fonction qui s'exécute si un utilisateur appuie sur la touche entrée (pour que ça soit plus rapide que de cliquer sur le bouter de connexion)
     * @param event L'événement
     */
    const handleKeyDown = (event) => {

        // La touche 13 est la touche "entrer"
        if (event.keyCode === 13 && event.shiftKey === false) {
            signUserUp(event);
        }
    }

    return (
        <form>

            <Heading className="is-4">Partie compte</Heading>

            <Form.Field>
                <Form.Control>
                    <Form.Input name="email" className="is-medium" type="email"
                                placeholder="Email" onKeyDown={handleKeyDown}
                                onChange={updateField} value={newUserAccountData.email} autoComplete="email"/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>
                    <Form.Input name="password" className="is-medium" type="password"
                                placeholder="Mot de passe" onKeyDown={handleKeyDown} onChange={updateField}
                                value={newUserAccountData.password} autoComplete="current-password"/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>
                    <Form.Input name="passwordConfirmation" className="is-medium" type="password"
                                placeholder="Confirmation mot de passe" onKeyDown={handleKeyDown} onChange={updateField}
                                value={newUserAccountData.passwordConfirmation} autoComplete="current-password"/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>
                    <Form.Checkbox name="isSuperUser" className="is-medium" onChange={updateField} value={newUserAccountData.isSuperUser}>Est-ce que l'utilisateur est un super user</Form.Checkbox>
                </Form.Control>
            </Form.Field>

            <Heading className="is-4">Partie utilisateur</Heading>

            <Form.Field>
                <Form.Control>
                    <Form.Input name="nom" className="is-medium" type="text"
                                placeholder="Nom" onKeyDown={handleKeyDown}
                                onChange={updateField} value={newUserAccountData.nom}/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>
                    <Form.Input name="prenom" className="is-medium" type="text"
                                placeholder="Prénom" onKeyDown={handleKeyDown}
                                onChange={updateField} value={newUserAccountData.prenom}/>
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Control>
                    <Form.Input name="age" className="is-medium" type="number"
                                placeholder="Age" onKeyDown={handleKeyDown}
                                onChange={updateField} value={newUserAccountData.age}/>
                </Form.Control>
            </Form.Field>

            <Button onClick={signUserUp} className="is-block is-primary is-fullwidth is-medium">Créer le compte utilisateur</Button>
        </form>
    )
}