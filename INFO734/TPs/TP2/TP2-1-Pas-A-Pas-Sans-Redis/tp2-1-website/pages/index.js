import {PageWrapper} from "../components/pageWrapper";
import {Columns, Heading} from "react-bulma-components";

// La page de l'index, c'est à dire le '/'
const IndexPage = () => {
    return (
        <PageWrapper>
            <Columns.Column className="is-8 is-offset-2 tp-notification">
                <Heading className="is-3">Page d'accueil</Heading>
                <p className="description">La page d'accueil du Frontend du TP2-1</p>
                <hr/>
                <p>Dans un premier temps vous devez vous connecter avec ces identifiants:</p>
                <br/>
                <p><code>Email: admin</code></p>
                <p><code>Mot de passe: admin</code></p>
                <br/>
                <p>Puis faites ce que vous voulez sur le frontend !</p>
            </Columns.Column>
        </PageWrapper>
    )
}

// On exporte la page
export default IndexPage;