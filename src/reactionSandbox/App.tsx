import { v3 } from "../utils/v";
import { css } from "@emotion/css";
import { ParticleWithMomentum } from "./terms";
import { useState } from "react";
import { ReactionMomentumGraph } from "./ReactionMomentumGraph";
import { ReactionVariants } from "./ReactionVariants";

export function App({

}: {
    }) {
    const particles = {
        g: { color: "white", mass: 0 }, // gamma-quant
        q: { color: "red", mass: 1 }, // 1 quark
        q2: { color: "blue", mass: 1 }, // 1 quark
        qq: { color: "lime", mass: 1 }, // 2 quarks
        qq2: { color: "orange", mass: 1 }, // 2 quarks
        qqq: { color: "yellow", mass: 2 }, // 3 quarks
        qqqq: { color: "purple", mass: 4 }, // 4 quarks

    } as const;

    const reactions = [{
        title: "Annihilation (q-m1 + q-m1 => g-m0)",
        reaction: {
            reagents: [particles.q, particles.q2, particles.g],
            products: [],
        }
    }, {
        title: "Shift (q-m1 + q-m1 <=> q-m1), Fusion (... <=> qq-m1)",
        reaction: {
            reagents: [particles.q, particles.q2, particles.g],
            products: [particles.qq],
        }
    }, {
        title: "Oscillation (qq-m1 + q-m1 <=> qqq-m2)",
        reaction: {
            reagents: [particles.qq, particles.q, particles.g],
            products: [particles.qqq],
        }
    }, {
        title: "Fission-31 (qqq-m2 + q-m1 <=> qqqq-m4)",
        reaction: {
            reagents: [particles.qqq, particles.q, particles.g],
            products: [particles.qqqq],
        }
    }, {
        title: "Fission-22 (qq-m1 + qq-m1 <=> qqqq-m4)",
        reaction: {
            reagents: [particles.qq, particles.qq2, particles.g],
            products: [particles.qqqq],
        }
    }];

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
                {reactions.map((r, i) =>
                    <ReactionVariants
                        key={i}
                        {...r}
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

