import { pipe } from "fp-ts/lib/function";
import memoize from "memoizee";
import { Stringify } from "../../utils/Stringify";
import * as D from "../../utils/DecoderEx";
import { decode, eqByKey, guardKey } from "./keyifyUtils";


export const ParticleKindDecoder = D.struct({
    content: D.union(
        D.literal("gamma"),
        pipe(
            // todo ensure key order
            D.struct({
                red: pipe(
                    D.integer,
                    D.refine((x): x is number => x >= 0, "x >= 0"),
                ),
                green: pipe(
                    D.integer,
                    D.refine((x): x is number => x >= 0, "x >= 0"),
                ),
                blue: pipe(
                    D.integer,
                    D.refine((x): x is number => x >= 0, "x >= 0"),
                ),
            }),
            D.refine(
                (x): x is typeof x => x.red + x.green + x.blue > 0,
                "not all zeros",
            ),
        ),
    ),
});


export type ParticleKind = D.TypeOf<typeof ParticleKindDecoder>;
export type ParticleKindKey = Stringify<ParticleKind>;
export const isParticleKindKey = guardKey(ParticleKindDecoder);
export const keyProjectParticleKind = decode(ParticleKindDecoder);
export const _keyifyParticleKind = (x: ParticleKind) =>
    JSON.stringify(keyProjectParticleKind(x)) as ParticleKindKey;
export const keyifyParticleKind = memoize(_keyifyParticleKind, { max: 1000 });
export const parsePartilceKind = (key: ParticleKindKey) =>
    JSON.parse(key) as ParticleKind;
export const eqParticleKind = eqByKey(keyifyParticleKind);
