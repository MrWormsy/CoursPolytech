import {Columns, Heading} from "react-bulma-components";
import {PageWrapper} from "../../components/pageWrapper";
import {useEffect, useState} from "react";
import {CustomPuffLoader} from "../../components/customPuffLoader";
import moment from "moment";
import {useRouter} from "next/router";
import axios from "axios";
import {User} from "../../components/users/user";
import ProtectedRoute from "../../components/protectedRoute";

/**
 * La page montrer les informations du compte de l'utilisateur. "/account"
 * @param showErrorMessage Fonction pour montrer un message d'erreur
 * @param showSuccessMessage Fonction pour montrer un message de succès
 */
const AccountPage = ({showErrorMessage, showSuccessMessage}) => {

    /**
     * On récupère le router de NextJS
     */
    const router = useRouter();

    /**
     * Variable pour savoir si on a récupéré les informations de l'utilisateur
     */
    const [loaded, setLoaded] = useState(false);

    /**
     * Les données de l'utilisateur
     */
    const [userData, setUserData] = useState(null);

    /**
     * Variable pour mettre les boutons en mode loading et disabled, pendant qu'on attend la réponse du serveur
     */
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Met à jour la partie user dans la variable userData
     * @param newUser Le nouvel utilisateur
     */
    const setUser = (newUser) => {
        setUserData({
            ...userData,
            user: newUser
        })
    }

    // Le useEffet pour récupérer les informations de l'utilisateur
    useEffect(() => {
        (async () => {

            // Si la donnée n'a pas encore été récupérée on le fait
            if (!loaded) {

                // On essaye de faire la requête
                try {
                    let response = await axios.get("/api/userdata");

                    // On met les informations de l'utilisateur
                    setUserData(response.data);
                }

                    // Si on attrape une erreur cela veut dire qu'on n'a pas réussi à récupérer les informations de l'utilisateur actuel, donc on met ces informations à undefined
                catch (e) {
                    showErrorMessage("Les informations de l'utilisateur n'ont pas pu être récupérées", e.response.data);
                    setUserData(undefined);
                }

                // On dit que la donnée a été récupérée
                setLoaded(true);
            }
        })()
    }, [loaded]);

    // Si la données n'a pas encore été récupérée alors on renvoie le loader pour montrer que c'est en cours
    if (!loaded) {
        return <CustomPuffLoader/>
    }

    // Si la donnée de l'utilisateur est non définie alors on le renvoie à la page d'accueil
    if (userData === undefined) {
        router.replace("/");
        return null;
    }

    return (
        <PageWrapper>
            <Columns.Column className="column is-10 is-offset-1 tp-notification-bigger">
                <Columns>
                    <Columns.Column className="left">
                        <Heading>Bonjour {userData.user.prenom} {userData.user.nom}</Heading>
                        <Heading className="subtitle">Vous pouvez visualiser votre compte</Heading>
                        <p>Date de création <em title={moment(userData.createdAt).format("LLLL")}>{moment(userData.createdAt).format("LL")}</em></p>
                        <p>Email <em>{userData.email}</em></p>
                        <p>Age <em>{userData.user.age}</em></p>
                        <p color="red">{userData.isSuperUser ? "Vous êtes un super utilisateur" : "Vous n'êtes pas un super utilisateur"}</p>

                        <hr/>

                        <Heading className="subtitle">Vous pouvez modifier votre compte</Heading>
                        <User user={userData.user} setUser={setUser} showErrorMessage={showErrorMessage} showSuccessMessage={showSuccessMessage}/>
                    </Columns.Column>
                </Columns>
            </Columns.Column>
        </PageWrapper>
    )
}

// On exporte la page
export default ProtectedRoute(AccountPage);