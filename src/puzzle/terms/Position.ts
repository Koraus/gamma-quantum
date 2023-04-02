import { Stringify } from "../../utils/Stringify";
import * as D from "../../utils/DecoderEx";
import { decode, eqByKey, guardKey } from "./keyifyUtils";


export const PositionDecoder = D.tuple(D.integer, D.integer);

export type Position = D.TypeOf<typeof PositionDecoder>;
export type PositionKey = Stringify<Position>;
export const isPositionKey = guardKey(PositionDecoder);
export const keyProjectPosition = decode(PositionDecoder);
export const keyifyPosition = (x: Position) =>
    JSON.stringify(keyProjectPosition(x)) as PositionKey;
export const parsePosition = (key: PositionKey) => JSON.parse(key) as Position;
export const eqPosition = eqByKey(keyifyPosition);