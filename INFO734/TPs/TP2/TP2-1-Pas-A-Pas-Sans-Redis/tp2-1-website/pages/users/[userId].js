import {Columns, Heading, Section} from "react-bulma-components";
import {PageWrapper} from "../../components/pageWrapper";
import {CustomPuffLoader} from "../../components/customPuffLoader";
import {useEffect, useState} from "react";
import {GoBackUrlButton} from "../../components/goBackUrlButton";
import {useRouter} from "next/router";
import {User} from "../../components/users/user";
import axios from "axios";
import ProtectedRoute from "../../components/protectedRoute";

/**
 * La page pour visionner un utilisateur "/users/:userId"
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 */
const UserEditorPage = ({showErrorMessage, showSuccessMessage}) => {

    /**
     * Le router
     */
    const router = useRouter()

    /**
     * l'id de l'utilisateur
     */
    const userId = router.query.userId;

    /**
     * Si la donnée de l'utilisateur a été récupérée
     */
    const [loaded, setLoaded] = useState(false);

    /**
     * L'utilisateur
     */
    const [user, setUser] = useState(null);

    // On utilise un useEffet pour récupérer l'utilisateur
    useEffect(() => {
        (async () => {

            // On veut faire la requête une seule fois
            if (!loaded) {

                // On essaye de faire la requête pour récupérer l'utilisateur
                try {
                    const response = await axios.get(`/api/user/${userId}`);

                    // On met à jour l'utilisateur
                    setUser(response.data);
                }

                    // Si on attrape une erreur alors on montre un message d'erreur et on met que l'utilisateur est non défini
                catch (e) {
                    showErrorMessage("Il y a eu une erreur lors de la récupération de l'utilisateur", e.response.data);

                    setUser(undefined);
                }

                // On dit que la donnée est mise à jour
                setLoaded(true);
            }
        })()
    }, [loaded]);

    // Si la donnée n'a pas encore été récupérée on montre le loader
    if (!loaded) {
        return <CustomPuffLoader/>
    }

    // Si l'utilisateur n'est pas défini ça veut dire qu'il n'existe pas et donc on veut revenir à la page des utilisateurs
    if (user === undefined) {
        router.replace("/users");
        return null;
    }

    return (
        <PageWrapper>
            <Columns.Column className="is-10 is-offset-1 tp-notification">
                <Columns>
                    <Columns.Column className="right">
                        <GoBackUrlButton url={"/users"}/>
                        <div className="has-text-centered">
                            <Heading className="is-3">Gestion utilisateur</Heading>
                            <p className="description">L'utilisateur actuel est {user.prenom} {user.nom}</p>
                            <hr/>
                        </div>
                        <Section>
                            <User user={user} setUser={setUser} showErrorMessage={showErrorMessage} showSuccessMessage={showSuccessMessage}/>
                        </Section>
                    </Columns.Column>
                </Columns>
            </Columns.Column>
        </PageWrapper>
    );
}

export default ProtectedRoute(UserEditorPage, true);