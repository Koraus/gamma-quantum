import SHA256 from "crypto-js/sha256";
import { _never } from "./_never";

export function createRand(seed: string) {
    let arr = SHA256(seed).words;
    const randUInt32 = () => {
        if (arr.length === 1) {
            const seed = arr.shift()?.toString() ?? _never();
            arr = SHA256(seed).words;
        }
        return ((arr.shift() ?? _never()) >>> 0);
    };
    const rand = Object.assign(() => randUInt32() / (~0 >>> 0), {
        uint32: randUInt32,
        rangeInt: (maxExcl: number) => Math.floor(rand() * maxExcl),
        el: <T>(arr: T[]) => arr[rand.rangeInt(arr.length)],
    });
    return rand;
}
