import { atom } from "recoil";
import { Solution, SolutionDraft } from "../../puzzle/terms/Solution";


export const ghostSolutionRecoil = atom< undefined | Solution | SolutionDraft>({
    key: "ghostSolutionRecoil",
    default: undefined,
});