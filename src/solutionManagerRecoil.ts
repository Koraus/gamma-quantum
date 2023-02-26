import { atom, useSetRecoilState, DefaultValue } from "recoil";
import { useUpdRecoilState } from "./utils/useUpdRecoilState";
import { useRecoilValue } from "recoil";
import * as problems from "./puzzle/problems";
import * as amplitude from "@amplitude/analytics-browser";
import update from "immutability-helper";
import memoize from "memoizee";
import { localStorageAtomEffect } from "./utils/localStorageAtomEffect";
import { Problem, Solution } from "./puzzle/terms";
import { onChangeAtomEffect } from "./utils/onChangeAtomEffect";

// todo: implement getProblemCmp
// todo: implement getSolutionCmpObj && getSolutionCmp

// todo: implement isSolved for Solution (should I preemulate it for like 1k steps? Ideas?)

// todo: implement postSolution & statsClient
const postSolution = (solution: Solution) => undefined;

const getProblemCmp = memoize(_getProblemCmp, { max: 1000 });

const solutionManagerRecoilDefault = {
    currentSolution: { problem: Object.values(problems)[0], actors: [] },
    knownSolutions: {} as Record<string, Solution>,
    confirmedSolutions: {} as Record<string, Awaited<ReturnType<typeof postSolution>>>,
};

export const solutionManagerRecoil = atom({
    key: "solution",
    default: solutionManagerRecoilDefault,
    effects: [
        localStorageAtomEffect(),
        onChangeAtomEffect({ // analytics effect
            select: x => x.confirmedSolutions.problem,
            onChange: newProblem => amplitude.track(`problem changed`, newProblem),
        }),
        onChangeAtomEffect({ // stats submission effect
            select: x => x.knownSolutions,
            onChange: (newKnownSolutions, oldKnownSolutions, _, __, ___, { setSelf }) => {
                const oldKnownSolutions1 =
                    (oldKnownSolutions instanceof DefaultValue) ? {} : oldKnownSolutions;

                const addedSolutions = Object.keys(newKnownSolutions)
                    .filter(solutionId => !(solutionId in oldKnownSolutions1))
                    .map(solutionId => newKnownSolutions[solutionId]);

                for (const solution of addedSolutions) {
                    (async () => {
                        const result = await postSolution(solution);
                        setSelf(s => update(s, {
                            confirmedSolutions: {
                                [getSolutionCmp(solution)]: { $set: result },
                            }
                        }));
                    })(); // just run, do not await
                }

            }
        }),
    ]
});

export const useSetProblem = () => {
    const upd = useUpdRecoilState(solutionManagerRecoil);
    return (problem: Problem) => upd({
        currentSolution: { $set: { problem, actors: [] } },
    });
}

export const useSetNextProblem = () => {
    const problem = useRecoilValue(solutionManagerRecoil).currentSolution.problem;
    const setProblem = useSetProblem();
    let currentLevelIndex = Object.values(problems)
        .findIndex(lp => getProblemCmp(lp) === getProblemCmp(problem));
    if (currentLevelIndex < 0) {
        currentLevelIndex = 0;
    }
    const nextLevelIndex = (currentLevelIndex + 1) % Object.values(problems).length;
    return () => setProblem(Object.values(problems)[nextLevelIndex]);
}

export const firstNotSolvedProblem = (knownSolutions: Record<string, Solution>) => {
    const knownSovledProblemCmps =
        new Set(Object.values(knownSolutions).map(s => getProblemCmp(s.problem)));
    const firstNotSolvedProblem =
        Object.values(problems).find(p => !knownSovledProblemCmps.has(getProblemCmp(p)))
        ?? Object.values(problems)[0];
    return firstNotSolvedProblem;
}

export const useSetHighestProblem = () => {
    const { knownSolutions } = useRecoilValue(solutionManagerRecoil);
    const setProblem = useSetProblem();
    return () => setProblem(firstNotSolvedProblem(knownSolutions));
}

export const useSetCurrentSolution = () => {
    // todo: make it effect
    const set = useSetRecoilState(solutionManagerRecoil);
    return (solution: Solution) => set((prev) => {
        let next = update(prev, {
            confirmedSolutions: { $set: solution },
        });
        if (isSolved(solution)) {
            const solutionId = getSolutionCmp(solution);
            next = update(next, {
                knownSolutions: {
                    [solutionId]: { $set: getSolutionCmpObj(solution) }
                }
            });
        }
        return nextState;
    });
}
