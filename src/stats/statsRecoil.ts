import { DefaultValue, atom, useSetRecoilState } from "recoil";
import { Solution, SolutionKey, keyifySolution, parseSolution } from "../puzzle/Solution";
import { postSolution } from "./statsCllient";
import { localStorageAtomEffect } from "../utils/localStorageAtomEffect";
import update from "immutability-helper";
import { onChangeAtomEffect } from "../utils/onChangeAtomEffect";
import { trustedKeys } from "../utils/trustedRecord";

export const statsRecoil = atom({
    key: "stats",
    default: {
        // every (complete) solution ever tracked
        knownSolutions: {} as Partial<Record<SolutionKey, true>>,

        // all known solutions
        // that were posted to stats backend and got positive response
        confirmedSolutions: {} as Partial<Record<
            SolutionKey,
            Awaited<ReturnType<typeof postSolution>>
        >>,
    },
    effects: [
        localStorageAtomEffect(),
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

export const useTrackSolution = () => {
    const setStats = useSetRecoilState(statsRecoil);
    return (solution: Solution) => {
        setStats(stats => update(stats, {
            knownSolutions: {
                [keyifySolution(solution)]: { $set: true },
            },
        }));
    };
};
