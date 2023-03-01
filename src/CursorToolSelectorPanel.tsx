import { css, cx } from "@emotion/css";
import { keyifyParticleKind, parsePartilceKind, ParticleKind, ParticleKindKey } from "./puzzle/Particle";
import { SolutionDraft } from "./puzzle/Solution";
import { StateProp } from "./utils/StateProp";

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

export function CursorToolSelectorPanel({
    solution,
    cursorToolState: [cursor, setCursor],
    className,
    ...props
}: {
    solution: SolutionDraft,
    cursorToolState: StateProp<CursorTool>;
} & JSX.IntrinsicElements["div"]) {

    const availableSpawners = Object.entries(solution.problem.spawners)
        .flatMap(([kind, count]) =>
            new Array(count!).fill({
                kind: "spawner" as const,
                output: parsePartilceKind(kind as ParticleKindKey),
                used: false,
            }));

    const availableConsumers = Object.entries(solution.problem.consumers)
        .flatMap(([kind, count]) =>
            new Array(count!).fill({
                kind: "consumer" as const,
                input: parsePartilceKind(kind as ParticleKindKey),
                used: false,
            }));

    for (const usedActor of solution.actors) {
        if (usedActor.kind === "spawner") {
            const item = availableSpawners
                .find(a => !a.used && (keyifyParticleKind(a.output) === keyifyParticleKind(usedActor.output)));
            if (item) { item.used = true; }
        }
        if (usedActor.kind === "consumer") {
            const item = availableConsumers
                .find(a => !a.used && (keyifyParticleKind(a.input) === keyifyParticleKind(usedActor.input)));
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
            className
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
                {tool.kind === "spawner" && (":" + tool.output.content)}
                {tool.kind === "consumer" && (":" + tool.input.content)}
            </label>
        </div>)}
    </div>;
}
