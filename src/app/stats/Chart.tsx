// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore no typings
import * as Plot from "@observablehq/plot";
import type { EmotionJSX } from "@emotion/react/types/jsx-namespace";

export function Chart({ 
    width, height, currentValue, bestValue, data, 
    ...props
}: {
    width: number;
    height: number;
    currentValue: number;
    bestValue: number | undefined;
    data: Record<number, {
        all: number;
        unique: number;
    }>;
} & EmotionJSX.IntrinsicElements["div"]) {
    const max = Math.max(currentValue, ...Object.keys(data).map(Number));
    const plot = Plot.plot({
        width,
        height,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 14,
        marginBottom: 24,
        style: {
            background: "transparent",
        },
        x: {
            domain: [-0.5, max + 2.5],
            grid: true,
            line: true,
            ticks: (max + 2) >= 10 ? 10 : (max + 2),
        },
        y: {
            line: true,
            ticks: 0,
        },
        marks: [
            Plot.rectY(Object.entries(data), {
                x1: (d: [string, {
                    all: number;
                    unique: number;
                }]) => +d[0] - 0.5,
                x2: (d: [string, {
                    all: number;
                    unique: number;
                }]) => +d[0] + 0.5,
                y1: (d: [string, {
                    all: number;
                    unique: number;
                }]) => d[1]?.all ?? 0,
                y2: 0,
            }),
            Plot.ruleX([currentValue], { stroke: "red", strokeWidth: 3 }),
            Plot.ruleX([bestValue], { stroke: "#f004", strokeWidth: 3 }),
        ],
    });

    return <div
        dangerouslySetInnerHTML={{ __html: plot.outerHTML }}
        {...props}
    ></div>;
}
