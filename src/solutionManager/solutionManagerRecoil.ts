import { atom, useSetRecoilState } from "recoil";
import * as amplitude from "@amplitude/analytics-browser";
import update from "immutability-helper";
import { localStorageAtomEffect } from "../utils/localStorageAtomEffect";
import { Solution, SolutionDraft } from "../puzzle/terms/Solution";
import { onChangeAtomEffect } from "../utils/onChangeAtomEffect";
import * as solutions from "./hardcodedSoultions";
import { SetStateAction } from "react";
import { puzzleId } from "../puzzle/puzzleId";


const solutionManagerRecoilDefault = {
    // single current solution, loaded from saved or created empty
    // being edited by player at the moment
    currentSolution: solutions.fourSpawnersParallel,

    // all solutions (draft and complete)
    // the player explicitely decided to save
    // using player-generated string key (name)
    savedSolutions: {
        ...solutions,
    } as Record<string, SolutionDraft | Solution>,
};

export const solutionManagerRecoil = atom({
    key: "solutionManager",
    default: solutionManagerRecoilDefault,
    effects: [
        localStorageAtomEffect({
            key: k => `${puzzleId}/${k}`,
        }),
        onChangeAtomEffect({ // analytics effect
            select: x => x.currentSolution.problem,
            onChange: newProblem =>
                amplitude.track("problem changed", newProblem),
        }),
    ],
});

export const useSetCurrentSolution = () => {
    const set = useSetRecoilState(solutionManagerRecoil);
    return (_nextCurrentSolution: SetStateAction<SolutionDraft>) =>
        set((prev) => {
            const nextCurrentSolution =
                "function" === typeof _nextCurrentSolution
                    ? _nextCurrentSolution(prev.currentSolution)
                    : _nextCurrentSolution;
            return update(prev, {
                currentSolution: { $set: nextCurrentSolution },
            });
        });
};
