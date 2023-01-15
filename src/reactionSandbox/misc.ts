import { v2, v3 } from "../utils/v";
import * as hg from "../utils/hg";
import { DirectionId } from "../puzzle/terms";

export const cxy = (v: v2 | v3) => {
    const [x, y] = hg.axialToFlatCart(v);
    return { cx: x, cy: y };
}

export const xy1 = (v: v2 | v3) => {
    const [x, y] = hg.axialToFlatCart(v);
    return { x1: x, y1: y };
}

export const xy2 = (v: v2 | v3) => {
    const [x, y] = hg.axialToFlatCart(v);
    return { x2: x, y2: y };
}

export const xy12 = (v1: v2 | v3, v2: v2 | v3) => {
    return { ...xy1(v1), ...xy2(v2) };
}

export const directionSymbol = [
    "\u2193", // y is flipped
    "\u2199",
    "\u2196",
    "\u2191",
    "\u2197",
    "\u2198",
] as Record<DirectionId, string>;