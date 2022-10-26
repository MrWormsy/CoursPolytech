import {Panel} from "react-bulma-components";
import {UserPreview} from "./userPreview";

/**
 * Le composant pour montrer les utilisateurs sous forme de liste
 * @param users Les utilisateurs
 */
export const UsersList = ({users}) => {
    return (
        <Panel>
            {/* On veut montrer la liste d'utilisateur avec un composant <UserPreview/> par utilisateur */}
            {users.map((user) => <UserPreview key={user._id} user={user}/>)}
        </Panel>
    );
}