import { v2 } from "../../utils/v";
import { SolutionDraft } from "../terms/Solution";
import { ParticleKindKey } from "../terms/ParticleKind";
import { Particle } from "./Particle";


export type ParticleState = Particle & {
    position: v2;
    isRemoved: boolean;
};

export type World = SolutionDraft & ({
    init: SolutionDraft;
    prev?: never;
    action: "init";
    step: 0;
} | {
    prev: World;
    action: "move" | "react";
    step: number;
}) & {
    energy: number;
    momentum: v2;
    consumed: Partial<Record<ParticleKindKey, number>>;
    particles: ParticleState[];
};
