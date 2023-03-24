import { atom } from "recoil";
import { Particle } from "../../puzzle/world/Particle";

export const cellContentRecoil = atom({
    key: "cellContent",
    default: undefined as (undefined | Particle[]),
});
