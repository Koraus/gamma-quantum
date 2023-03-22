import type { ReadonlyDeep } from "ts-toolbelt/out/Object/Readonly";
import { _never } from "../../utils/_never";
import { ParticleKind } from "../terms/ParticleKind";

export function* enumerateSubparticles(p: ParticleKind) {
    if (p.content === "gamma") {
        yield "gamma";
    } else {
        for (const _k in p.content) {
            const k = _k as keyof typeof p.content; // trusted
            for (let i = 0; i < p.content[k]; i++) {
                yield k;
            }
        }
    }
}

function* selectGroupInAllPossibleWays<T>(
    arr: T[],
): Generator<T[], undefined, undefined> {
    if (arr.length === 0) {
        _never();
    }
    if (arr.length === 1) {
        yield arr;
        return;
    }
    const [head, ...tail] = arr;
    for (const g of selectGroupInAllPossibleWays(tail)) {
        yield [head, ...g];
        yield g;
    }
}

function* enumerateCombinations<T>(
    arr: T[],
): Generator<T[][], undefined, undefined> {
    if (arr.length === 0) {
        yield [];
        return;
    }
    if (arr.length === 1) {
        yield [arr];
        return;
    }
    for (const g of selectGroupInAllPossibleWays(arr)) {
        const rest = arr.filter(sp => !g.includes(sp)); // ref cmp!!!
        for (const gs of enumerateCombinations(rest)) {
            yield [g, ...gs];
        }
    }
}


export function* enumerateProductCombinations(
    reagents: ReadonlyDeep<ParticleKind[]>,
) {
    const allSubparticles = reagents
        .flatMap(p => [...enumerateSubparticles(p)].map((sp, i) => ({
            subparticle: sp as typeof sp,
            particle: p,
            i,
        })));
    const nonGammaSubparticles = allSubparticles
        .filter(sp => sp.subparticle !== "gamma");

    for (const c of enumerateCombinations(nonGammaSubparticles)) {
        yield c
            .map(p => p.reduce((acc, v) => {
                const sp = v.subparticle;
                if (sp === "gamma") { return _never(); }
                acc[sp]++;
                return acc;
            }, {
                red: 0,
                green: 0,
                blue: 0,
            }))
            .map(c => ({ content: c }));
    }
}
