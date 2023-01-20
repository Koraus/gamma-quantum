import { v3 } from "../utils/v";
import { css } from "@emotion/css";
import { Particle, ParticleWithMomentum } from "./terms";
import { useState } from "react";
import { ReactionForDirections } from "./ReactionForDirections";
import { directionVector } from "../puzzle/stepInPlace";
import { tuple } from "../utils/tuple";
import { groupReactionVariantsBySymmetries } from "./groupReactionVariantsBySymmetries";
import * as hg from "../utils/hg";


const velocityVariants = [
    v3.zero(),
    directionVector[0],
    directionVector[1],
    directionVector[2],
    directionVector[3],
    directionVector[4],
    directionVector[5],
];

const velocityVariants2 = velocityVariants.flatMap(vel1 => velocityVariants.map(vel2 => tuple(vel1, vel2)));

const velocityVariants3 = velocityVariants.flatMap(vel1 => velocityVariants.flatMap(vel2 => velocityVariants.map(vel3 => tuple(vel1, vel2, vel3))));

const prepareReactionRequests = ({ reagents, products }: {
    reagents: Particle[];
    products: Particle[];
}) => groupReactionVariantsBySymmetries(velocityVariants3.map((vels) => ({
    reagents: reagents
        .map((p, i) => ({ velocity: vels[i], ...p }))
        .filter(p => p.mass > 0 || hg.cubeLen(p.velocity) > 0),
    products: [],
}))).map(vars => ({
    ...vars[0],
    products,
}));

export function ReactionVariants({
    title, reaction, setSelectedReactionVariant,
}: {
    title: string;
    reaction: {
        reagents: Particle[]; products: Particle[];
    };
    setSelectedReactionVariant: (x: {
        reagents: ParticleWithMomentum[];
        products: ParticleWithMomentum[];
        deltaMomentum: v3;
        deltaEnergy: number;
        twins: Array<{ reagents: ParticleWithMomentum[]; products: ParticleWithMomentum[]; }>;
    }) => void;
}) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return <div>
        <div
            onClick={() => setIsCollapsed(!isCollapsed)}
        >
            <button>{isCollapsed ? ">" : "⌄"}</button>
            &nbsp;
            {title}
        </div>
        {!isCollapsed && <div className={css({ paddingLeft: 20 })}>
            {prepareReactionRequests(reaction).map((reaction, i) => <ReactionForDirections
                key={i}
                {...reaction}
                setSelectedReactionVariant={setSelectedReactionVariant} />)}
        </div>}
    </div>;
}
