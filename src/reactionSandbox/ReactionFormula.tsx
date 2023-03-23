import { ParticleText } from "./ParticleText";
import { Particle } from "../puzzle/world/Particle";
import type { EmotionJSX } from "@emotion/react/types/jsx-namespace";

export function ReactionFormula({
    reagents,
    products,
    css: cssProp,
    ...props
}: {
    reagents: Particle[];
    products: Particle[];
} & EmotionJSX.IntrinsicElements["div"]) {
    return <div
        css={[{ display: "flex", flexDirection: "row" }, cssProp]}
        {...props}
    >
        {reagents.map((p, i) => <ParticleText key={i} particle={p} />)}
        <div>&nbsp;⇒&nbsp;</div>
        {products.map((p, i) => <ParticleText key={i} particle={p} />)}
    </div>;
}
