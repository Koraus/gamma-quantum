import { v2, v3 } from "../utils/v";
import { css } from "@emotion/css";
import { Particle, ParticleWithMomentum } from "./terms";
import { useState } from "react";
import { ReactionMomentumGraph } from "./ReactionMomentumGraph";
import { ReactionForDirections } from "./ReactionForDirections";

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
            { direction: 0, velocity: 0 },
            { direction: 0, velocity: 1 },
            { direction: 1, velocity: 1 },
            { direction: 2, velocity: 1 },
            { direction: 3, velocity: 1 },
        ].map(v => ({
            reagents: [
                { direction: 0, velocity: 1, ...particles.q },
                { ...v, ...particles.q2 },
            ],
            products: [particles.qq],
        })),
        {
            reagents: [
                { direction: 0, velocity: 0, ...particles.q },
                { direction: 0, velocity: 0, ...particles.q2 },
            ],
            products: [particles.qq],
        },

        // qq-m1 + q-m1 = qqq-m2
        ...[
            { direction: 0, velocity: 0 },
            { direction: 0, velocity: 1 },
            { direction: 1, velocity: 1 },
            { direction: 2, velocity: 1 },
            { direction: 3, velocity: 1 },
        ].map(v => ({
            reagents: [
                { direction: 0, velocity: 1, ...particles.q },
                { ...v, ...particles.qq },
            ],
            products: [particles.qqq],
        })),
        {
            reagents: [
                { direction: 0, velocity: 0, ...particles.q },
                { direction: 0, velocity: 0, ...particles.qq },
            ],
            products: [particles.qqq],
        },

        // qqq-m2 + q-m1 = qqqq-m4
        ...[
            { direction: 0, velocity: 0 },
            { direction: 0, velocity: 1 },
            { direction: 1, velocity: 1 },
            { direction: 2, velocity: 1 },
            { direction: 3, velocity: 1 },
        ].map(v => ({
            reagents: [
                { direction: 0, velocity: 1, ...particles.qqq },
                { ...v, ...particles.q },
            ],
            products: [particles.qqqq],
        })),
        {
            reagents: [
                { direction: 0, velocity: 0, ...particles.qqq },
                { direction: 0, velocity: 1, ...particles.q },
            ],
            products: [particles.qqqq],
        },
        {
            reagents: [
                { direction: 0, velocity: 0, ...particles.qqq },
                { direction: 0, velocity: 0, ...particles.q },
            ],
            products: [particles.qqqq],
        },

        // qq-m1 + qq-m1 = qqqq-m4
        ...[
            { direction: 0, velocity: 0 },
            { direction: 0, velocity: 1 },
            { direction: 1, velocity: 1 },
            { direction: 2, velocity: 1 },
            { direction: 3, velocity: 1 },
        ].map(v => ({
            reagents: [
                { direction: 0, velocity: 1, ...particles.qq },
                { ...v, ...particles.qq2 },
            ],
            products: [particles.qqqq],
        })),
        {
            reagents: [
                { direction: 0, velocity: 0, ...particles.qq },
                { direction: 0, velocity: 0, ...particles.qq2 },
            ],
            products: [particles.qqqq],
        },
    ] as Array<{
        reagents: ParticleWithMomentum[];
        products: Particle[];
    }>;

    const [selectedReaction, setSelectedReaction] = useState<{
        reagents: ParticleWithMomentum[];
        products: ParticleWithMomentum[];
        deltaMomentum: v3;
        deltaEnergy: number;
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
                    reagents={selectedReaction.reagents}
                    products={selectedReaction.products}
                    deltaEnergy={selectedReaction.deltaEnergy}
                    deltaMomentum={selectedReaction.deltaMomentum}
                />}
        </div>
    </div >
}