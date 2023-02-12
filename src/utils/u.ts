import { v3 } from "./v";

export const inc = (x: number) => x + 1;
export const v3_add = (a: v3) => (b: v3) => v3.add(a, b);