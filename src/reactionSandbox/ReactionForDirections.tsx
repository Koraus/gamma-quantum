import { v2 } from "../utils/v";
import { css } from "@emotion/css";
import { enumerateProductVelocities } from "../puzzle/reactions/enumerateProductVelocities";
import { ReactionVariant } from "./ReactionVariant";
import { ParticleText } from "./ParticleText";
import { useState } from "react";
import { ParticleKind } from "../puzzle/terms/ParticleKind";
import { Particle } from "../puzzle/world/Particle";
import { selectReactionVariant } from "../puzzle/reactions/selectReactionVariant";

function WarnSign() {
    return <span className={css({ color: "yellow" })}>⚠</span>;
}

export function ReactionForDirections({
    reagents, products, setSelectedReactionVariant, showImpossibleReactions,
}: {
    reagents: Particle[];
    products: ParticleKind[];
    setSelectedReactionVariant: (x: {
        reagents: Particle[];
        products: Particle[];
        twins: Array<{ reagents: Particle[]; products: Particle[]; }>
    }) => void;
    showImpossibleReactions: boolean;
}) {
    const variants = [...enumerateProductVelocities({ reagents, products })];

    const {
        allGrouppedVariants,
        selectedVariant,
        noVariants,
    } = selectReactionVariant({
        variants,
    });

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
                &nbsp;<span className={css({ color: "crimson" })}>⇏</span>&nbsp;
                {products.length > 0
                    ? products.map((p, i) =>
                        <ParticleText key={i} particle={p} />)
                    : <ParticleText particle={{ content: "gamma" }} />
                }
            </>;
        }

        return <>
            <span className={css({ color: "yellow" })}>⚠&nbsp;</span>
            {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
            &nbsp;⇒&nbsp;
            {products.length > 0
                ? products.map((p, i) => <ParticleText key={i} particle={p} />)
                : <ParticleText particle={{ content: "gamma" }} />
            }
        </>;
    })();

    return (
        <div css={{ padding: 1 }}>
            <div
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={css({ display: "flex", flexDirection: "row" })}
            >
                <button>{isCollapsed ? ">" : "⌄"}</button>
                &nbsp;
                {header}
            </div>
            {!isCollapsed && <>
                <br />
                {allGrouppedVariants.map(([key, variants], i) => <div key={i}>
                    # scored group, score = {key}
                    {variants.map((symGroup, i) => {
                        const variant = symGroup[0];
                        const {
                            products,
                        } = variant;
                        const twins = symGroup.slice(1);
                        return <div key={i}>
                            ##
                            {symGroup.length > 1 && <>
                                &nbsp;<WarnSign />
                            </>}
                            &nbsp;sym group, size {symGroup.length}
                            <div
                                key={i}
                                className={css({
                                    display: "flex",
                                    flexDirection: "row",
                                })}
                            >
                                <ReactionVariant
                                    className={css({
                                        border: "1px solid",
                                        borderColor:
                                            variant === selectedVariant
                                                ? "#ffffff"
                                                : "#ffffff30",
                                    })}
                                    reagents={reagents}
                                    products={products}
                                    twins={twins} />
                                <button
                                    onClick={() => setSelectedReactionVariant({
                                        reagents: reagents,
                                        products: products,
                                        twins,
                                    })}
                                >&gt;</button>
                            </div>
                        </div>;
                    })}
                </div>)}

                <br />
            </>}
        </div>
    );
}
