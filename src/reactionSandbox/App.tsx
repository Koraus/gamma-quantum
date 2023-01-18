import { v2, v3 } from "../utils/v";
import { css } from "@emotion/css";
import { Particle, ParticleWithMomentum } from "./terms";
import { useState } from "react";
import { ReactionMomentumGraph } from "./ReactionMomentumGraph";
import { ReactionForDirections } from "./ReactionForDirections";
import { directionVector } from "../puzzle/stepInPlace";
import { tuple } from "../utils/tuple";
import { groupReactionVariantsBySymmetries } from "./groupReactionVariantsBySymmetries";

export function App({

}: {
    }) {
    const velocityVariants = [
        v3.zero(),
        directionVector[0],
        directionVector[1],
        directionVector[2],
        directionVector[3],
        directionVector[4],
        directionVector[5],
    ];

    const velocityVariants2 = velocityVariants.flatMap(vel1 =>
        velocityVariants.map(vel2 =>
            tuple(vel1, vel2)));

    const velocityVariants3 = velocityVariants.flatMap(vel1 =>
        velocityVariants.flatMap(vel2 =>
            velocityVariants.map(vel3 =>
                tuple(vel1, vel2, vel3))));

    const prepareReactionRequests = ({ reagents, products }: {
        reagents: Particle[];
        products: Particle[];
    }) => groupReactionVariantsBySymmetries(velocityVariants3.map((vels) => ({
        reagents: reagents.map((p, i) => ({ velocity: vels[i], ...p })),
        products: [],
    }))).map(vars => ({
        ...vars[0],
        products: [products[0]],
    }))



    const particles = {
        q: { color: "red", mass: 1 }, // 1 quark
        q2: { color: "blue", mass: 1 }, // 1 quark
        qq: { color: "lime", mass: 1 }, // 2 quarks
        qq2: { color: "orange", mass: 1 }, // 2 quarks
        qqq: { color: "yellow", mass: 2 }, // 3 quarks
        qqqq: { color: "purple", mass: 4 }, // 4 quarks

    } as const;

    const reactions = [
        // q-m1 + q-m1 => qq-m1
        ...prepareReactionRequests({
            reagents: [particles.q, particles.q2],
            products: [particles.qq],
        }),

        // qq-m1 + q-m1 = qqq-m2
        ...prepareReactionRequests({
            reagents: [particles.qq, particles.q],
            products: [particles.qqq],
        }),

        // qqq-m2 + q-m1 = qqqq-m4
        ...prepareReactionRequests({
            reagents: [particles.qqq, particles.q],
            products: [particles.qqqq],
        }),

        // qq-m1 + qq-m1 = qqqq-m4
        ...prepareReactionRequests({
            reagents: [particles.qq, particles.qq2],
            products: [particles.qqqq],
        }),
    ] as Array<{
        reagents: ParticleWithMomentum[];
        products: Particle[];
    }>;

    const [selectedReaction, setSelectedReaction] = useState<{
        reagents: ParticleWithMomentum[];
        products: ParticleWithMomentum[];
        deltaMomentum: v3;
        deltaEnergy: number;
        twins: Array<{ reagents: ParticleWithMomentum[]; products: ParticleWithMomentum[]; }>
    }>();

    return <div className={css({
        padding: 10,
        fontFamily: "monospace",
        position: "fixed",
        inset: 0,
    })}>
        <div className={css({
            display: "flex",
            flexDirection: "row",
            height: "100%",
        })}>
            <div className={css({
                overflow: "scroll",
                paddingRight: 20,
                flexShrink: 0,
                height: "100%",
            })}>
                {reactions.map((reaction, i) => <ReactionForDirections
                    key={i}
                    {...reaction}
                    setSelectedReactionVariant={setSelectedReaction}
                />)}
            </div>
            {selectedReaction &&
                <ReactionMomentumGraph
                    className={css({
                        flex: 1,
                    })}
                    {...selectedReaction}
                />}
        </div>
    </div >
}