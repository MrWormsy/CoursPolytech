import {Navbar as BulmaNavbar} from 'react-bulma-components'
import React, {useEffect, useState} from 'react'
import Link from "next/link";
import {checkIfUserLogged} from "../utils/utils";

/**
 * La navbar
 * @param router Le router de NextJS
 */
export const Navbar = ({router}) => {

    /**
     * Si le burger de la barre de navigation est actif (pour les mobiles)
     */
    const [isActive, setIsActive] = useState(false);

    /**
     * Si l'utilisateur est connecté
     */
    const [isUserLogged, setIsUserLogged] = useState(false);

    /**
     * Si l'utilisateur est un "super utilisateur"
     */
    const [isSuperUser, setIsSuperUser] = useState(false);

    /**
     * Utilisé pour savoir si la page a changé (pour mettre à jour la navbar)
     */
    const [lastPage, setLastPage] = useState(router === null ? undefined : router.pathname);

    /**
     * useEffect utilisé pour vérifier si la page a changé pour savoir si l'utilisateur est toujours connecté
     */
    useEffect(() => {
        if (router !== null && router.pathname !== lastPage) {
            setLastPage(router.pathname)
        }
    })

    /**
     * useEffect pour savoir si l'utilisateur est toujours connecté et pour mettre à jour la barre de navigation en conséquence.
     */
    useEffect(() => {
        (async () => {

            // Si l'utilisateur semble être connecté, nous vérifions auprès du serveur si l'utilisateur est réellement connecté.
            try {
                const isUserLoggedData = await checkIfUserLogged();

                // Si la requête est un succès alors on peut mettre la réponse de si l'utilisateur est connecté et s'il est un "super utilisateur"
                setIsUserLogged(isUserLoggedData.isUserLogged);
                setIsSuperUser(isUserLoggedData.isSuperUser);
            }

                // Si on attrape une erreur alors on met que l'utilisateur n'est ni connecté, ni un "super utilisateur"
            catch (e) {
                setIsUserLogged(false);
                setIsSuperUser(false);
            }
        })();
    }, [lastPage]);

    return (
        <BulmaNavbar active={isActive} className="isFixed">
            <div className="container">
                <BulmaNavbar.Brand>
                    <BulmaNavbar.Burger onClick={() => setIsActive(!isActive)}/>
                </BulmaNavbar.Brand>
                <BulmaNavbar.Menu>
                    <BulmaNavbar.Container>
                        <BulmaNavbar.Item renderAs="span">
                            <Link href="/" passHref>
                                Home
                            </Link>
                        </BulmaNavbar.Item>

                        <BulmaNavbar.Item renderAs="span">
                            <Link href="/test" passHref>
                                Page test
                            </Link>
                        </BulmaNavbar.Item>

                        {isUserLogged ?
                            <>
                                <BulmaNavbar.Item renderAs="span">
                                    <Link href="/users" passHref>
                                        Utilisateurs
                                    </Link>
                                </BulmaNavbar.Item>

                            </> : null}
                    </BulmaNavbar.Container>

                    <div className="navbar-end">

                        {isSuperUser ?
                            <>
                                <BulmaNavbar.Item renderAs="a" className="has-dropdown is-hoverable">
                                    <BulmaNavbar.Link>
                                        Gestion administrateur
                                    </BulmaNavbar.Link>
                                    <BulmaNavbar.Dropdown>
                                        <BulmaNavbar.Item>
                                            <p style={{color: "#7a7a7a", letterSpacing: ".1em", textTransform: "uppercase"}}>Gestion utilisateurs</p>
                                        </BulmaNavbar.Item>

                                        <BulmaNavbar.Item renderAs="span">
                                            <Link href="/admin" passHref>
                                                Page admin
                                            </Link>
                                        </BulmaNavbar.Item>

                                        <BulmaNavbar.Item renderAs="span">
                                            <Link href="/newuser" passHref>
                                                Créer un utilisateur
                                            </Link>
                                        </BulmaNavbar.Item>
                                    </BulmaNavbar.Dropdown>
                                </BulmaNavbar.Item>
                            </> : null
                        }

                        {isUserLogged ?
                            <>
                                <BulmaNavbar.Item renderAs="a" className="has-dropdown is-hoverable">
                                    <BulmaNavbar.Link>
                                        <BulmaNavbar.Item renderAs="span">
                                            <Link href="/account" passHref>
                                                Compte utilisateur
                                            </Link>
                                        </BulmaNavbar.Item>
                                    </BulmaNavbar.Link>
                                    <BulmaNavbar.Dropdown>
                                        <BulmaNavbar.Item renderAs="span">
                                            <Link href="/logout" passHref>
                                                Déconnexion
                                            </Link>
                                        </BulmaNavbar.Item>
                                    </BulmaNavbar.Dropdown>
                                </BulmaNavbar.Item>
                            </>
                            :
                            <BulmaNavbar.Item renderAs="span">
                                <Link href="/login" passHref>
                                    Connexion
                                </Link>
                            </BulmaNavbar.Item>
                        }
                    </div>
                </BulmaNavbar.Menu>
            </div>
        </BulmaNavbar>
    )
}