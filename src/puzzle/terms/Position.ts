import { Stringify } from "../../utils/Stringify";
import memoize from "memoizee";
import * as D from "../../utils/DecoderEx";


export const PositionDecoder = D.tuple(D.integer, D.integer);
export type Position = D.TypeOf<typeof PositionDecoder>;
export type PositionKey = Stringify<Position>;
export const isPositionKey = (key: unknown): key is PositionKey => {
    if ("string" !== typeof key) { return false; }
    const parsed = (() => {
        try { return JSON.parse(key); } catch { /* mute */ }
    })();
    if (!parsed) { return false; }
    return D.guard(PositionDecoder, parsed);
};
export const keyProjectPosition = ([q, r]: Position): Position => [q, r];
export const _keyifyPosition = (x: Position) =>
    JSON.stringify(keyProjectPosition(x)) as PositionKey;
export const keyifyPosition = memoize(_keyifyPosition, { max: 10000 });
export const parsePosition = (s: PositionKey) => JSON.parse(s) as Position;
export const eqPosition = (
    a: Position | PositionKey,
    b: Position | PositionKey,
) =>
    ("string" === typeof a ? a : keyifyPosition(a))
    === ("string" === typeof b ? b : keyifyPosition(b));