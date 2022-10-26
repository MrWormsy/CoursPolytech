import {PageWrapper} from "../../components/pageWrapper";
import {Columns, Heading} from "react-bulma-components";

// La page de test, c'est-à-dire le '/test'
const TestPage = () => {
    return (
        <PageWrapper>
            <Columns.Column className="is-8 is-offset-2 tp-notification">
                <Heading className="is-3">Page test</Heading>
                <p className="description">Ceci est une page de test</p>
            </Columns.Column>
        </PageWrapper>
    )
}

// On exporte la page
export default TestPage;