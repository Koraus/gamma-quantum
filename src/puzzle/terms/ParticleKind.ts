import { pipe } from "fp-ts/lib/function";
import { Stringify } from "../../utils/Stringify";
import * as DEx from "../../utils/DecoderEx";
import * as D from "io-ts/Decoder";
import { decode, eqByKey, guardKey } from "./keyifyUtils";
import { _throw } from "../../utils/_throw";


export const ParticleKindDecoder = D.struct({
    content: D.union(
        D.literal("gamma"),
        pipe(
            D.struct({
                red: pipe(
                    DEx.integer,
                    D.refine((x): x is number => x >= 0, "x >= 0"),
                ),
                green: pipe(
                    DEx.integer,
                    D.refine((x): x is number => x >= 0, "x >= 0"),
                ),
                blue: pipe(
                    DEx.integer,
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

export const keyifyParticleContent = (
    x: ParticleKind["content"],
): Stringify<ParticleKind["content"]> => {
    if (x === "gamma") { return "\"gamma\""; }
    const { red, green, blue } = x;
    if (red % 1 !== 0) { _throw("red not integer"); }
    if (red < 0) { _throw("red not zero or positive"); }
    if (green % 1 !== 0) { _throw("green not integer"); }
    if (green < 0) { _throw("green not zero or positive"); }
    if (blue % 1 !== 0) { _throw("blue not integer"); }
    if (blue < 0) { _throw("blue not zero or positive"); }
    if (red + green + blue === 0) { _throw("all zeros"); }
    return `{"red":${red},"green":${green},"blue":${blue}}`;
};
export const keyifyParticleKind = (x: ParticleKind): ParticleKindKey =>
    `{"content":${keyifyParticleContent(x.content)}}`;

export const parsePartilceKind = (key: ParticleKindKey) =>
    JSON.parse(key) as ParticleKind;
export const eqParticleKind = eqByKey(keyifyParticleKind);
