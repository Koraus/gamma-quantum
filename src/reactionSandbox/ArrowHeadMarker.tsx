import { css } from "@emotion/css";


export function ArrowHeadMarker({
    color,
}: {
    color: string;
}) {
    return <marker
        id={`arrowHeadMarker-${color}`}
        className={css`& path { fill: ${color}; }`}
        viewBox="0 -5 10 10"
        refX="10"
        orient="auto"><path d="M0,-5L10,0L0,5"></path>
    </marker>;
}
