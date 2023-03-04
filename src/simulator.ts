import memoize from "memoizee";
import { SolutionDraft } from "./puzzle/Solution";
import { init as _init, step as _step, World } from "./puzzle/step";

// export type StateChain<State, InitArgs> =
//     InitArgs & ({
//         init: InitArgs;
//     } | {
//         prev: StateChain<State, InitArgs>;
//     }) & State;

// export type StateAtPlaytimeGetter<TState, TInitArgs> =
//     (initArgs: TInitArgs, playtime: number) => StateChain<TState, TInitArgs>;


const init = memoize(_init);
const step = memoize(_step);
const getWorldAtStep = memoize(
    (solution: SolutionDraft, x: number): World =>
        x === 0
            ? init(solution)
            : step(getWorldAtStep(solution, x - 1)));

export const getStepAtPlaytime = (playtime: number) =>
    Math.max(0, Math.floor(playtime));

export const getWorldAtPlaytime = (solution: SolutionDraft, playtime: number) =>
    getWorldAtStep(solution, getStepAtPlaytime(playtime));

export const trustedEntries =
    <TRecord extends Partial<Record<keyof object, unknown>>>(obj: TRecord) =>
        Object.entries(obj) as [
            keyof TRecord,
            NonNullable<TRecord[keyof TRecord]>
        ][];

export function isWin(world: World) {
    return trustedEntries(world.problem.demand)
        .every(([key, count]) => (world.consumed[key] ?? 0) >= count);
}


