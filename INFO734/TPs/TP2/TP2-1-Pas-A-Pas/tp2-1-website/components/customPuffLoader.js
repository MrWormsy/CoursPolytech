import {PuffLoader} from "react-spinners";

/**
 * Le loader qui se montrera quand on attendra de la donnée
 */
export const CustomPuffLoader = () => {
    return <PuffLoader cssOverride={{zIndex: 100000000, position: "fixed", top: "50%", left: "50%"}} color="#EA5B0C"/>;
}
