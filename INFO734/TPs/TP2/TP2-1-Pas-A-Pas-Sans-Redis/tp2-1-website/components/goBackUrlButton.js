import {Icon} from "react-bulma-components";
import {TiArrowBack} from "react-icons/ti";
import Link from "next/link";

export const GoBackUrlButton = ({url}) => {
    return (
        <Link href={url} passHref>
            <Icon title="Retourner en arrière" className="goBackButtonIcon" size="medium">
                <TiArrowBack size="larger"/>
            </Icon>
        </Link>
    )
}