import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/Either";
import * as G from "io-ts/Guard";
import * as D from "io-ts/Decoder";
export * from "io-ts/Decoder";


export const record2 = <Key extends string, A>(
    codomain: D.Decoder<unknown, A>,
    options?: {
        checkKeyOrder?: boolean
        refineKey?: (key: string) => key is Key,
    },
): D.Decoder<unknown, Partial<Record<Key, A>>> => {
    if (!options) { return D.record(codomain); }
    const { checkKeyOrder, refineKey } = options;
    if (!checkKeyOrder && !refineKey) { return D.record(codomain); }
    const expected = "Partial<Record<Key, unknown>> with " + [
        checkKeyOrder ? " ordered keys" : "",
        refineKey ? "refined keys" : "",
    ].join(", ");
    return pipe(
        D.fromRefinement(
            (u: unknown): u is Partial<Record<Key, unknown>> =>
                G.UnknownRecord.is(u)
                && (!refineKey || Object.keys(u)
                    .every(refineKey))
                && (!checkKeyOrder || Object.keys(u)
                    .every((k, i, arr) =>
                        i === 0 || (arr[i - 1].localeCompare(k, "en") <= 0))),
            expected),
        D.compose(D.fromRecord(codomain)));
};



export const integer: D.Decoder<unknown, number> = pipe(
    D.number,
    D.refine((n): n is number => n % 1 === 0, "integer"),
);


export const guard = <I, A extends I>(
    decoder: D.Decoder<I, A>,
    x: I,
): x is A => E.isRight(decoder.decode(x));

export function assert<I, A extends I>(
    decoder: D.Decoder<I, A>,
    x: I,
): asserts x is A {
    return pipe(x,
        decoder.decode,
        E.fold(
            e => { throw new Error(JSON.stringify(e)); },
            () => undefined,
        ),
    );
}