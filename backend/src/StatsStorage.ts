import { Env } from "./Env";
import { pipe } from "fp-ts/lib/function";
import { tuple } from "../../src/utils/tuple";
import { solutionStats } from "../../src/puzzle/world";
import { RoutedDurableObject } from "./RoutedDurableObject";

type Stats = ReturnType<typeof solutionStats>;
type StatKey = keyof Stats;
type StatData = Record<number, {
    all: number,
    unique: number,
}>;
type StatsData = Record<StatKey, StatData>;

export const entriesValuesMap = <TKey, T, U>(f: (x: T, key: TKey) => U) =>
    (s: [TKey, T][]) => s.map((([key, value]) => tuple(key, f(value, key))));
export const entriesPromiseAll = <TKey, T>() =>
    (s: [TKey, Promise<T>][]) => 
        Promise.all(s.map(async ([key, x]) => tuple(key, await x)));

export class StatsStorage extends RoutedDurableObject {
    constructor(
        public state: DurableObjectState,
        public env: Env,
    ) { 
        super();
    }

    isSolutionRegistered = (() => {
        const storage = () => this.state.storage;
        const key = (solutionId: string, statKey: string) =>
            `isSolutionRegistered_${solutionId}_${statKey}`;
        return {
            get: (...args: Parameters<typeof key>) =>
                storage().get<true>(key(...args)),
            set: (...args: Parameters<typeof key>) =>
                storage().put(key(...args), true).then(() => true),
        };
    })();

    data = (() => {
        const storage = () => this.state.storage;
        const key = "data";
        const def = () => ({} as StatsData);
        return {
            get: async () => 
                ((await storage().get<StatsData>(key)) ?? def()),
            set: (value: StatsData) => 
                storage().put(key, value).then(() => value),
        };
    })();

    async add(solutionId: string, solutionStats: Stats) {
        const { entries, fromEntries } = Object;

        const [isSolutionRegistered, data] = await Promise.all([
            (async () => fromEntries(await pipe(
                solutionStats,
                entries,
                entriesValuesMap((_, key) => 
                    this.isSolutionRegistered.get(solutionId, key)),
                entriesPromiseAll(),
            )))(),
            this.data.get(),
        ] as const);

        for (const [key, stat] of entries(solutionStats)) {
            const _key = key as StatKey;
            if (!data[_key]) { data[_key] = {}; }
            if (!data[_key][stat]) { data[_key][stat] = { all: 0, unique: 0 }; }

            data[_key][solutionStats[_key]].all++;
            if (!isSolutionRegistered[_key]) {
                data[_key][solutionStats[_key]].unique++;
            }
        }

        await Promise.all([
            (async () => fromEntries(await pipe(
                solutionStats,
                entries,
                entriesValuesMap((_, key) => 
                    this.isSolutionRegistered.set(solutionId, key)),
                entriesPromiseAll(),
            )))(),
            this.data.set(data),
        ]);

        return {
            isNotOriginal: isSolutionRegistered,
            data,
        };
    }

    async getData() { return this.data.get(); }
}
