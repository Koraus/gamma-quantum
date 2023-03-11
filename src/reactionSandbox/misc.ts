import { v2 } from "../utils/v";
import * as hax from "../utils/hax";

export const cxy = (h: v2) => {
    const [x, y] = hax.toFlatCart(h);
    return { cx: x, cy: y };
};

export const xy1 = (h: v2) => {
    const [x, y] = hax.toFlatCart(h);
    return { x1: x, y1: y };
};

export const xy2 = (h: v2) => {
    const [x, y] = hax.toFlatCart(h);
    return { x2: x, y2: y };
};

export const xy12 = (h1: v2, h2: v2) => {
    return { ...xy1(h1), ...xy2(h2) };
};
