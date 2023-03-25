import { reactions } from "./reactions";
import { css } from "@emotion/css";
import { Particle } from "../puzzle/world/Particle";
import { useEffect, useState } from "react";
import { ReactionMomentumGraph } from "./ReactionMomentumGraph";
import { prepareReactionRequests } from "./prepareReactionRequests";
import type { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { ParticleKind } from "../puzzle/terms/ParticleKind";
import { ReagentEditor } from "./ReagentEditor";
import update from "immutability-helper";
import { ParticleText } from "./ParticleText";
import { ReactionForDirections } from "./ReactionForDirections";


export function ReactionSandbox({
    standalone,
    cellContent,
    css: cssProp,
    ...props
}: {
    standalone?: boolean,
    cellContent?: Particle[],
} & EmotionJSX.IntrinsicElements["div"]) {
    const [showImpossibleReactions, setShowImpossibleReactions] =
        useState(true);

    const [selectedReaction, setSelectedReaction] = useState<{
        reagents: Particle[];
        products: Particle[];
        twins: Array<{ reagents: Particle[]; products: Particle[]; }>
    }>();

    const reagentsState = useState<Array<Particle | ParticleKind>>([{
        content: "gamma",
    }]);
    const [reagents, setReagents] = reagentsState;

    useEffect(() => {
        if (cellContent) {
            setReagents(cellContent);
        }
    }, [cellContent]);

    return <div
        css={[
            {
                display: "flex",
                flexDirection: "row",
                overflowX: "auto",
                padding: "1vmin",
            },
            standalone && {
                fontFamily: "monospace",
            },
            cssProp,
        ]}
        {...props}
    >

        <div className={css({
            overflowY: "auto",
            paddingRight: 20,
            flexShrink: 0,
            height: "100%",
        })}>
            {reactions.map((r, i) => <button
                key={i}
                css={{ 
                    display: "flex",
                    flexDirection: "row",
                }}
                onClick={() => setReagents(r.reagents)}
            >
                {r.title}{r.reagents.map(p => <ParticleText particle={p} />)}
            </button>)}
            ---
            {reagents.map((_, i) => <div key={i}>
                <ParticleText
                    css={{ display: "inline" }}
                    particle={reagents[i]} />
                <ReagentEditor
                    particleState={[
                        reagents[i],
                        _n => {
                            const n = "function" === typeof _n
                                ? _n(reagents[i])
                                : _n;
                            return setReagents(update(reagents, {
                                [i]: { $set: n },
                            }));
                        },
                    ]}
                />
                <button
                    onClick={() =>
                        setReagents(update(reagents, { $splice: [[i, 1]] }))}
                >x</button>
            </div>)}
            <button
                css={{ width: "100px" }}
                onClick={() =>
                    setReagents(update(reagents, {
                        $push: [{ content: "gamma" }],
                    }))}
            >+</button>

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
            {prepareReactionRequests(reagents)
                .map((reagents, i) => <ReactionForDirections
                    key={i}
                    reagents={reagents}
                    setSelectedReactionVariant={setSelectedReaction}
                    showImpossibleReactions={showImpossibleReactions}
                />)}
        </div>
        {
            selectedReaction &&
            <ReactionMomentumGraph
                className={css({
                    flex: 1,
                })}
                {...selectedReaction}
            />
        }
    </div >;
}
