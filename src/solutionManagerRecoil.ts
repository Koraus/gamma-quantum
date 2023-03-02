import { atom, useSetRecoilState, DefaultValue } from "recoil";
import { useRecoilValue } from "recoil";
import * as problems from "./puzzle/problems";
import * as amplitude from "@amplitude/analytics-browser";
import update from "immutability-helper";
import memoize from "memoizee";
import { localStorageAtomEffect } from "./utils/localStorageAtomEffect";
import { isSolutionComplete, keyifySolution, parseSolution, Solution, SolutionDraft, SolutionKey } from "./puzzle/Solution";
import { keyifyProblem as _keyifyProblem, Problem } from "./puzzle/Problem";
import { onChangeAtomEffect } from "./utils/onChangeAtomEffect";

// todo: implement postSolution & statsClient
const postSolution = (solution: Solution) => Promise.resolve(solution);

const keyifyProblem = memoize(_keyifyProblem, { max: 1000 });
const eqProblem = (a: Problem, b: Problem) =>
    keyifyProblem(a) === keyifyProblem(b);

const solutionManagerRecoilDefault = {
    currentSolution: {
        problem: Object.values(problems)[0],
        actors: [],
    } as SolutionDraft,
    savedSolutions: {} as Record<string, SolutionDraft | Solution>,
    knownSolutions: {} as Partial<Record<SolutionKey, true>>,
    confirmedSolutions: {} as Partial<Record<
        SolutionKey,
        Awaited<ReturnType<typeof postSolution>>
    >>,
};

export const solutionManagerRecoil = atom({
    key: "solution",
    default: solutionManagerRecoilDefault,
    effects: [
        localStorageAtomEffect(),
        onChangeAtomEffect({ // analytics effect
            select: x => x.currentSolution.problem,
            onChange: newProblem =>
                amplitude.track("problem changed", newProblem),
        }),
        onChangeAtomEffect({ // stats submission effect
            select: x => x.savedSolutions,
            onChange: (
                newKnownSolutions, oldKnownSolutions, _, __, ___, { setSelf },
            ) => {
                const oldKnownSolutions1 =
                    (oldKnownSolutions instanceof DefaultValue)
                        ? {}
                        : oldKnownSolutions;

                const addedSolutions = Object.keys(newKnownSolutions)
                    .filter(solutionId => !(solutionId in oldKnownSolutions1))
                    .map(solutionId => newKnownSolutions[solutionId])
                    .filter(isSolutionComplete);

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
    ],
});

export const useSetCurrentSolution = () => {
    // todo: make it effect
    const set = useSetRecoilState(solutionManagerRecoil);
    return (solution: SolutionDraft) => set((prev) => {
        let next = update(prev, {
            currentSolution: { $set: solution },
        });
        if (isSolutionComplete(solution)) {
            const isSolutionKnown = false; // todo
            if (!isSolutionKnown) {
                const solutionId = keyifySolution(solution);
                next = update(next, {
                    knownSolutions: {
                        [solutionId]: { $set: true },
                    },
                });
            }
        }
        return next;
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
