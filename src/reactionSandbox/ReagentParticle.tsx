import { v3 } from "../utils/v";
import { css, cx } from "@emotion/css";
import { directionVector } from "../puzzle/stepInPlace";
import { IntRange_0Inc_5Inc } from "../puzzle/terms";
import { cxy, xy1, xy2 } from "./misc";


export function ReagentParticle({
    direction, color, velocity,
}: {
    direction: IntRange_0Inc_5Inc;
    color: string;
    velocity: 0 | 1;
}) {
    if (velocity === 0) {
        return <g>
            <circle
                {...cxy(v3.zero())}
                r="0.18"
                fill="white" />
            <circle
                {...cxy(v3.zero())}
                r="0.15"
                fill={color} />
        </g>;
    }
    return <g>
        <line
            className={cx(css`& {
            stroke-width: 0.1;
            stroke: ${color};
            marker-end: url(#arrowHeadMarker-${color})
        }`)}
            {...xy1(v3.negate(directionVector[direction]))}
            {...xy2(v3.zero())} />
        <circle
            {...cxy(v3.negate(directionVector[direction]))}
            r="0.18"
            fill="white" />
        <circle
            {...cxy(v3.negate(directionVector[direction]))}
            r="0.15"
            fill={color} />
    </g>;
}
