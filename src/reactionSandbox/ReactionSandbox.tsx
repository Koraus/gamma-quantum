import { reactions } from "./reactions";
import { v2 } from "../utils/v";
import { css } from "@emotion/css";
import { Particle } from "../puzzle/world/Particle";
import { useState } from "react";
import { ReactionMomentumGraph } from "./ReactionMomentumGraph";
import { ReactionVariants } from "./ReactionVariants";
import type { EmotionJSX } from "@emotion/react/types/jsx-namespace";


export function ReactionSandbox({
    standalone,
    css: cssProp,
    ...props
}: {
    standalone?: boolean
} & EmotionJSX.IntrinsicElements["div"]) {
    const [showImpossibleReactions, setShowImpossibleReactions] =
        useState(true);

    const [selectedReaction, setSelectedReaction] = useState<{
        reagents: Particle[];
        products: Particle[];
        twins: Array<{ reagents: Particle[]; products: Particle[]; }>
    }>();

    return <div
        css={[
            {
                display: "flex",
                flexDirection: "row",
            },
            standalone && {
                fontFamily: "monospace",
            },
            cssProp,
        ]}
        {...props}
    >
        <div className={css({
            overflow: "scroll",
            paddingRight: 20,
            flexShrink: 0,
            height: "100%",
        })}>
            <div>
                <label>
                    Show impossible reaction
                    <input
                        type="checkbox"
                        checked={showImpossibleReactions}
                        onChange={ev =>
                            setShowImpossibleReactions(ev.target.checked)}
                    />
                </label>
            </div>
            {reactions.map((r, i) =>
                <ReactionVariants
                    key={i}
                    {...r}
                    setSelectedReactionVariant={setSelectedReaction}
                    showImpossibleReactions={showImpossibleReactions}
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

