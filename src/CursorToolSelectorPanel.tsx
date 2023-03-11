import { css, cx } from "@emotion/css";
import { keyifyParticleKind, keyProjectParticleKind, parsePartilceKind, ParticleKind, ParticleKindKey } from "./puzzle/terms/ParticleKind";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { solutionManagerRecoil } from "./solutionManager/solutionManagerRecoil";
import { hasValueAtKey } from "ts-is-present";
import { trustedEntries, trustedValues } from "./utils/trustedRecord";
import { useEffect } from "react";

export type CursorTool = {
    kind: "none",
} | {
    kind: "spawner",
    output: ParticleKind,
} | {
    kind: "consumer",
    input: ParticleKind,
} | {
    kind: "mirror",
} | {
    kind: "reactor",
} | {
    kind: "trap",
} | {
    kind: "remove",
};

export const cursorToolRecoil = atom<CursorTool>({
    key: "cursorTool",
    default: { kind: "none" },
});

export const particleKindText = (p: ParticleKind) =>
    p.content === "gamma"
        ? p.content
        : Object.entries(keyProjectParticleKind(p).content)
            .filter(([, count]) => count > 0)
            .map(([key, count]) => `${new Array(count).fill(key[0]).join("")}`)
            .join("");

export function CursorToolSelectorPanel({
    className,
    ...props
}: JSX.IntrinsicElements["div"]) {
    const solution = useRecoilValue(solutionManagerRecoil).currentSolution;
    const [cursor, setCursor] = useRecoilState(cursorToolRecoil);

    const availableSpawners = trustedEntries(solution.problem.spawners)
        .map(([kind, count]) => ({
            kind: "spawner" as const,
            output: parsePartilceKind(kind as ParticleKindKey),
            used: trustedValues(solution.actors)
                .filter(hasValueAtKey("kind", "spawner" as const))
                .filter(a => kind === keyifyParticleKind(a.output))
                .length,
            count,
        }));
    const availableConsumers = trustedEntries(solution.problem.consumers)
        .map(([kind, count]) => ({
            kind: "consumer" as const,
            input: parsePartilceKind(kind as ParticleKindKey),
            used: trustedValues(solution.actors)
                .filter(hasValueAtKey("kind", "consumer" as const))
                .filter(a => kind === keyifyParticleKind(a.input))
                .length,
            count,
        }));

    const availableTools = [
        { kind: "none" },
        ...availableSpawners,
        ...availableConsumers,
        { kind: "mirror" },
        // { kind: "reactor" },
        { kind: "trap" },
        { kind: "remove" },
    ] as const;

    useEffect(() => {
        const selectCursor = (e: KeyboardEvent) => {
            const digits = ["Digit1", "Digit2", "Digit3", "Digit4", "Digit5",
                "Digit6", "Digit7", "Digit8", "Digit9", "Digit0"];

            if (digits.includes(e.code)) {
                if (e.shiftKey) {
                    const i = digits.indexOf(e.code);
                    setCursor(availableTools
                        .filter((el) => (el.kind === "spawner"))[i],
                    );
                }
            }
            if (e.code === "Escape") { setCursor({ kind: "none" }); }
            if (e.code === "Digit1") { setCursor({ kind: "remove" }); }
            if (e.code === "Digit2") { setCursor({ kind: "mirror" }); }
            if (e.code === "Digit3") { setCursor({ kind: "trap" }); }
        };
        window.addEventListener("keydown", selectCursor);
        return () => { window.removeEventListener("keydown", selectCursor); };
    });

    useEffect(() => {
        const selectCursor = () => { setCursor({ kind: "none" }); };
        window.addEventListener("contextmenu", selectCursor);
        return () => { window.removeEventListener("contextmenu", selectCursor)};
    });

    return <div
        className={cx(
            css({
            }),
            className,
        )}
        {...props}
    >
        {availableTools.map((tool, i) => <div key={i}>
            <label>
                <input
                    type="radio"
                    radioGroup="cursorTool"
                    checked={JSON.stringify(cursor) === JSON.stringify(tool)}
                    onChange={() => setCursor(tool)}
                    disabled={"used" in tool && tool.used >= tool.count}
                />
                {tool.kind}
                {tool.kind === "spawner"
                    && (`: ${tool.used}/${tool.count}`
                        + ` x ${particleKindText(tool.output)}`)}
                {tool.kind === "consumer"
                    && (`: ${tool.used}/${tool.count}`
                        + ` x ${particleKindText(tool.input)}`)}
            </label>
        </div>)}
    </div>;
}
