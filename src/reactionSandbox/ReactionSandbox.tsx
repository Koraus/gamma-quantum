import { v3 } from "../utils/v";
import { css } from "@emotion/css";
import { Particle } from "../puzzle/terms/Particle";
import { useState } from "react";
import { ReactionMomentumGraph } from "./ReactionMomentumGraph";
import { ReactionVariants } from "./ReactionVariants";
import { particles } from "./particles";


export function ReactionSandbox() {
    const reactions = [{
        title: "Annihilation (q-m1 + q-m1 => g-m0)",
        reaction: {
            reagents: [particles.q, particles.q],
            products: [particles.g],
        },
    }, {
        title: "Shift (q-m1 + q-m1 => q-m1), Fusion (... => qq-m1)",
        reaction: {
            reagents: [particles.q, particles.q],
            products: [particles.qq],
        },
    }, {
        title: "Shift (q-m1 => q-m1 + q-m1), Fusion (qq-m1 => ...)",
        reaction: {
            reagents: [particles.qq],
            products: [particles.q, particles.q],
        },
    }, {
        title: "Oscillation (qq-m1 + q-m1 => qqq-m2)",
        reaction: {
            reagents: [particles.qq, particles.q],
            products: [particles.qqq],
        },
    }, {
        title: "Oscillation (qqq-m2 => qq-m1 + q-m1)",
        reaction: {
            reagents: [particles.qqq],
            products: [particles.qq, particles.q],
        },
    }, {
        title: "Fission-31 (qqq-m2 + q-m1 => qqqq-m4)",
        reaction: {
            reagents: [particles.qqq, particles.q],
            products: [particles.qqqq],
        },
    }, {
        title: "Fission-31 (qqqq-m4 => qqq-m2 + q-m1)",
        reaction: {
            reagents: [particles.qqqq],
            products: [particles.qqq, particles.q],
        },
    }, {
        title: "Fission-22 (qq-m1 + qq-m1 => qqqq-m4)",
        reaction: {
            reagents: [particles.qq, particles.qq],
            products: [particles.qqqq],
        },
    }, {
        title: "Fission-22 (qqqq-m4 => qq-m1 + qq-m1)",
        reaction: {
            reagents: [particles.qqqq],
            products: [particles.qq, particles.qq],
        },
    }];

    const [selectedReaction, setSelectedReaction] = useState<{
        reagents: Particle[];
        products: Particle[];
        deltaMomentum: v3;
        deltaEnergy: number;
        twins: Array<{ reagents: Particle[]; products: Particle[]; }>
    }>();

    return <div className={css({
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
    </div>;
}

