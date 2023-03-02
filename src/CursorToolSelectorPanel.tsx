import { css, cx } from "@emotion/css";
import { eqParticleKind, keyProjectParticleKind, parsePartilceKind, ParticleKind, ParticleKindKey } from "./puzzle/Particle";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { solutionManagerRecoil } from "./solutionManager/solutionManagerRecoil";

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
            .map(([key, count]) => `${key} x${count}`)
            .join(" & ");

export function CursorToolSelectorPanel({
    className,
    ...props
}: JSX.IntrinsicElements["div"]) {
    const solution = useRecoilValue(solutionManagerRecoil).currentSolution;
    const [cursor, setCursor] = useRecoilState(cursorToolRecoil);

    const availableSpawners = Object.entries(solution.problem.spawners)
        .flatMap(([kind, count]) =>
            Array.from({ length: count ?? 0 }, () => ({
                kind: "spawner" as const,
                output: parsePartilceKind(kind as ParticleKindKey),
                used: false,
            })));

    const availableConsumers = Object.entries(solution.problem.consumers)
        .flatMap(([kind, count]) =>
            Array.from({ length: count ?? 0 }, () => ({
                kind: "consumer" as const,
                input: parsePartilceKind(kind as ParticleKindKey),
                used: false,
            })));

    for (const usedActor of solution.actors) {
        if (usedActor.kind === "spawner") {
            const item = availableSpawners
                .find(a => !a.used
                    && eqParticleKind(a.output, usedActor.output));
            if (item) { item.used = true; }
        }
        if (usedActor.kind === "consumer") {
            const item = availableConsumers
                .find(a => !a.used
                    && eqParticleKind(a.input, usedActor.input));
            if (item) { item.used = true; }
        }
    }

    const availableTools = [
        { kind: "none" },
        ...availableSpawners,
        ...availableConsumers,
        { kind: "mirror" },
        // { kind: "reactor" },
        { kind: "trap" },
        { kind: "remove" },
    ] as const;
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
                    disabled={"used" in tool && tool.used}
                />
                {tool.kind}
                {tool.kind === "spawner"
                    && (": " + particleKindText(tool.output))}
                {tool.kind === "consumer"
                    && (": " + particleKindText(tool.input))}
            </label>
        </div>)}
    </div>;
}
