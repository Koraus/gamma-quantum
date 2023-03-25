import { enumerateProductVelocities } from "../puzzle/reactions/enumerateProductVelocities";
import { ReactionFormula } from "./ReactionFormula";
import { ParticleText } from "./ParticleText";
import { useState } from "react";
import { Particle, particlesEnergy, particlesMomentum } from "../puzzle/world/Particle";
import { selectReactionVariant } from "../puzzle/reactions/selectReactionVariant";
import { enumerateProductCombinations } from "../puzzle/reactions/enumerateProductCombinations";
import type { EmotionJSX } from "@emotion/react/types/jsx-namespace";

function WarnSign({
    css: cssProp,
    ...props
}: EmotionJSX.IntrinsicElements["span"]) {
    return <span
        css={[{ color: "yellow" }, cssProp]}
        {...props}
    >⚠</span>;
}

export function ReactionForDirections({
    reagents, setSelectedReactionVariant, showImpossibleReactions,
}: {
    reagents: Particle[];
    setSelectedReactionVariant: (x: {
        reagents: Particle[];
        products: Particle[];
        twins: Array<{ reagents: Particle[]; products: Particle[]; }>
    }) => void;
    showImpossibleReactions: boolean;
}) {
    const reagentsEnergy = particlesEnergy(reagents);
    const reagentsMomentum = particlesMomentum(reagents);

    const variants = [
        ...enumerateProductCombinations(reagents)
            .flatMap(products => enumerateProductVelocities(
                reagentsMomentum,
                reagentsEnergy,
                products))
            .map(products => ({ reagents, products })),
    ];

    const {
        allGrouppedVariants,
        selectedVariant,
        noVariants,
    } = selectReactionVariant(variants);

    if (noVariants && !showImpossibleReactions) { return null; }

    const [isCollapsed, setIsCollapsed] = useState(true);

    const header = (() => {
        if (selectedVariant) {
            return <>
                {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
                &nbsp;⇒&nbsp;
                {selectedVariant.products.map((p, i) =>
                    <ParticleText key={i} particle={p} />)}
            </>;
        }

        if (noVariants) {
            return <>
                {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
                &nbsp;<span css={{ color: "crimson" }}>⇏</span>&nbsp;
                <ParticleText particle={{ content: "gamma" }} />
            </>;
        }

        return <>
            <span css={{ color: "yellow" }}>⚠&nbsp;</span>
            {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
            &nbsp;⇒&nbsp;
            <ParticleText particle={{ content: "gamma" }} />
        </>;
    })();

    return (
        <div css={{ padding: 1 }}>
            <div
                onClick={() => setIsCollapsed(!isCollapsed)}
                css={{ display: "flex", flexDirection: "row" }}
            >
                <button>{isCollapsed ? ">" : "⌄"}</button>
                &nbsp;
                {header}
            </div>
            {!isCollapsed && <>
                <br />
                {allGrouppedVariants.map(([key, variants], i) => <div
                    key={i}
                    css={{
                        padding: 3,
                        border: "1px solid #ffffff30",
                    }}
                >
                    # score = {key}
                    {variants.map((symGroup, i) => <div
                        key={i}
                        css={{
                            display: "flex",
                            flexDirection: "row",
                            border: "1px solid",
                            borderColor: symGroup[0] === selectedVariant
                                ? "#ffffff"
                                : "#ffffff00",
                        }}
                    >
                        {symGroup.length > 1 && <>
                            <WarnSign title={`${symGroup.length} twins`} />
                            s{symGroup.length}&nbsp;
                        </>}
                        <ReactionFormula {...symGroup[0]} />
                        <button
                            onClick={() => setSelectedReactionVariant({
                                ...symGroup[0],
                                twins: symGroup.slice(1),
                            })}
                        >&gt;</button>
                    </div>)}
                </div>)}

                <br />
            </>}
        </div>
    );
}
