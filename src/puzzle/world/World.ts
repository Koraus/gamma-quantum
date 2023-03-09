import { v3 } from "../../utils/v";
import { SolutionDraft } from "../terms/Solution";
import { ParticleKindKey, Particle } from "../terms/Particle";


export type ParticleState = Particle & {
    position: v3;
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
    momentum: v3;
    consumed: Partial<Record<ParticleKindKey, number>>;
    particles: ParticleState[];
};
