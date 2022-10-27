import {Card, Heading} from "react-bulma-components";
import Link from "next/link";
import moment from "moment";

export const UserPreview = ({user}) => {
    return (
        <Link href={`/users/${user._id}`}>
            <Card style={{cursor: "pointer", marginBottom: "0.5rem"}}>
                <Card.Content>
                    <Heading className="is-4">{user.prenom} {user.nom}, {user.age} ans. Crée {moment(user.createdAt).from()}</Heading>
                </Card.Content>
            </Card>
        </Link>
    )
}