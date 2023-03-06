import { atom, useSetRecoilState, DefaultValue } from "recoil";
import { useRecoilValue } from "recoil";
import * as problems from "../puzzle/problems";
import * as amplitude from "@amplitude/analytics-browser";
import update from "immutability-helper";
import { localStorageAtomEffect } from "../utils/localStorageAtomEffect";
import { isSolutionComplete, keyifySolution, parseSolution, Solution, SolutionDraft, SolutionKey } from "../puzzle/Solution";
import { eqProblem, keyifyProblem, Problem } from "../puzzle/Problem";
import { onChangeAtomEffect } from "../utils/onChangeAtomEffect";
import * as solutions from "./hardcodedSoultions";
import { SetStateAction } from "react";
import { trustedKeys } from "../utils/trustedRecord";
import { postSolution } from "./statsCllient";


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

    // all solutions known to be complete
    // that were ever assigned to currentSolution
    knownSolutions: {} as Partial<Record<SolutionKey, true>>,

    // all known solutions
    // that were posted to stats backend and got positive response
    confirmedSolutions: {} as Partial<Record<
        SolutionKey,
        Awaited<ReturnType<typeof postSolution>>
    >>,
};

export const solutionManagerRecoil = atom({
    key: "solutionManager",
    default: solutionManagerRecoilDefault,
    effects: [
        localStorageAtomEffect(),
        onChangeAtomEffect({ // analytics effect
            select: x => x.currentSolution.problem,
            onChange: newProblem =>
                amplitude.track("problem changed", newProblem),
        }),
        onChangeAtomEffect({ // handle unknown complete solution
            select: x => x.currentSolution,
            onChange: (
                nextCurrentSolution, _, next, __, isReset, { setSelf },
            ) => {
                if (isReset) { return; }
                if (!isSolutionComplete(nextCurrentSolution)) { return; }
                const isSolutionKnown =
                    trustedKeys(next.knownSolutions)
                        .some(ks => ks === keyifySolution(nextCurrentSolution));
                if (isSolutionKnown) { return; }
                setSelf(update(next, {
                    knownSolutions: {
                        [keyifySolution(nextCurrentSolution)]: { $set: true },
                    },
                }));
            },
        }),
        onChangeAtomEffect({ // stats submission effect
            select: x => x.knownSolutions,
            onChange: (
                newKnownSolutions, oldKnownSolutions, _, __, ___, { setSelf },
            ) => {
                const oldKnownSolutions1 =
                    (oldKnownSolutions instanceof DefaultValue)
                        ? {}
                        : oldKnownSolutions;

                const addedSolutions = trustedKeys(newKnownSolutions)
                    .filter(solutionKey => !(solutionKey in oldKnownSolutions1))
                    .map(solutionId => parseSolution(solutionId));

                for (const solution of addedSolutions) {
                    (async () => {
                        const result = await postSolution(solution);
                        setSelf(s => update(s, {
                            confirmedSolutions: {
                                [keyifySolution(solution)]: { $set: result },
                            },
                        }));
                    })(); // just run, do not await
                }
            },
        }),

        // todo: on init, repost known solution with unkonwn submission status

        // todo handle erroneous submission
        //     - network errors -- how?
        //     - denial to accept the solution -- how?
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

export const useSetProblem = () => {
    const set = useSetCurrentSolution();
    return (problem: Problem) => set({ problem, actors: [] });
};

export const useSetNextProblem = () => {
    const state = useRecoilValue(solutionManagerRecoil);
    const problem = state.currentSolution.problem;
    const setProblem = useSetProblem();
    let currentIndex = Object.values(problems)
        .findIndex(lp => eqProblem(lp, problem));
    if (currentIndex < 0) {
        currentIndex = 0;
    }
    const nextLevelIndex =
        (currentIndex + 1) % Object.values(problems).length;
    return () => setProblem(Object.values(problems)[nextLevelIndex]);
};

export const firstNotSolvedProblem = (
    knownSolutions: Partial<Record<SolutionKey, true>>,
) => {
    const knownSovledProblemCmps =
        new Set((Object.keys(knownSolutions) as SolutionKey[])
            .map(s => parseSolution(s))
            .map(s => keyifyProblem(s.problem)));
    const firstNotSolvedProblem =
        Object.values(problems)
            .find(p => !knownSovledProblemCmps.has(keyifyProblem(p)))
        ?? Object.values(problems)[0];
    return firstNotSolvedProblem;
};

export const useSetHighestProblem = () => {
    const {
        knownSolutions,
    } = useRecoilValue(solutionManagerRecoil);
    const setProblem = useSetProblem();
    return () => setProblem(firstNotSolvedProblem(knownSolutions));
};
