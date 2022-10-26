import {LayoutWrapper} from "../components/layoutWrapper";

// On importe le css que nous avons défini plus celui de Bulma qui nous permettra de donner le style aux composants
import '../styles/globals.css';
import 'bulma/css/bulma.min.css';

/**
 * Ici est le point d'entrée du Frontend, MyApp est l'application NextJS qui nous rendra les pages web
 * On utilise un wrapper pour "wrapper" les pages avec certaines choses obligatoire dans un projet : La navbar et le footer !
 */
function MyApp({Component, pageProps}) {
    return (
        <LayoutWrapper>
            <Component {...pageProps} />
        </LayoutWrapper>
    )
}

export default MyApp;
