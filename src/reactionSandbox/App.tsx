import { v2, v3 } from "../utils/v";
import { css } from "@emotion/css";
import { Particle, ParticleWithMomentum } from "./terms";
import { useState } from "react";
import { ReactionMomentumGraph } from "./ReactionMomentumGraph";
import { ReactionForDirections } from "./ReactionForDirections";
import { directionVector } from "../puzzle/stepInPlace";
import { tuple } from "../utils/tuple";

export function App({

}: {
    }) {
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
        ...[
            [v3.zero(), v3.zero()],
            [directionVector[0], v3.zero()],
            [directionVector[0], directionVector[0]],
            [directionVector[0], directionVector[1]],
            [directionVector[0], directionVector[2]],
            [directionVector[0], directionVector[3]],
        ].map(([v1, v2]) => ({
            reagents: [
                { velocity: v1, ...particles.q },
                { velocity: v2, ...particles.q2 },
            ],
            products: [particles.qq],
        })),

        // qq-m1 + q-m1 = qqq-m2
        ...[
            [v3.zero(), v3.zero()],
            [v3.zero(), directionVector[0]],
            [directionVector[0], v3.zero()],
            [directionVector[0], directionVector[0]],
            [directionVector[0], directionVector[1]],
            [directionVector[0], directionVector[2]],
            [directionVector[0], directionVector[3]],
        ].map(([v1, v2]) => ({
            reagents: [
                { velocity: v1, ...particles.qq },
                { velocity: v2, ...particles.q },
            ],
            products: [particles.qqq],
        })),

        // qqq-m2 + q-m1 = qqqq-m4
        ...[
            [v3.zero(), v3.zero()],
            [v3.zero(), directionVector[0]],
            [directionVector[0], v3.zero()],
            [directionVector[0], directionVector[0]],
            [directionVector[0], directionVector[1]],
            [directionVector[0], directionVector[2]],
            [directionVector[0], directionVector[3]],
        ].map(([v1, v2]) => ({
            reagents: [
                { velocity: v1, ...particles.qqq },
                { velocity: v2, ...particles.q },
            ],
            products: [particles.qqqq],
        })),


        // qq-m1 + qq-m1 = qqqq-m4
        ...[
            [v3.zero(), v3.zero()],
            [directionVector[0], v3.zero()],
            [directionVector[0], directionVector[0]],
            [directionVector[0], directionVector[1]],
            [directionVector[0], directionVector[2]],
            [directionVector[0], directionVector[3]],
        ].map(([v1, v2]) => ({
            reagents: [
                { velocity: v1, ...particles.qq },
                { velocity: v2, ...particles.qq2 },
            ],
            products: [particles.qqqq],
        })),
    ] as Array<{
        reagents: ParticleWithMomentum[];
        products: Particle[];
    }>;

    const [selectedReaction, setSelectedReaction] = useState<{
        reagents: ParticleWithMomentum[];
        products: ParticleWithMomentum[];
        deltaMomentum: v3;
        deltaEnergy: number;
        twins: Array<{ reagents: ParticleWithMomentum[]; resolvedProducts: ParticleWithMomentum[]; }>
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