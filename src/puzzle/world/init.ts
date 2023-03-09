import { v3 } from "../../utils/v";
import { SolutionDraft } from "../terms/Solution";
import { World } from "./World";

export const init = (solution: SolutionDraft): World => {
    // todo: ensure solution is valid:
    //  * all the actors have unique spots
    //  * spawners and consumers match the promblem list
    //--* +anything else?
    return ({
        ...solution,
        init: solution,
        action: "init",
        step: 0,
        energy: 0,
        momentum: v3.zero(),
        consumed: {},
        particles: [],
    });
};
