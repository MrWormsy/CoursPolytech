import {Container, Footer as FooterBulma, Level} from 'react-bulma-components'

/**
 * Le footer de l'application
 */
export const Footer = () => {
    return (
        <FooterBulma>
            <Container>
                <Level>
                    <Level.Item>
                        <small className="level-item">
                            Le footer du TP2-1 &copy; 2022
                        </small>
                    </Level.Item>
                </Level>
            </Container>
        </FooterBulma>
    )
}