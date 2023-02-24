import { css, cx } from "@emotion/css";
import { areParticleKindsEqual, getParticleKindKey, ParticleKind, Solution } from "./puzzle/terms";
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
    kind: "remove",
};

export function CursorToolSelectorPanel({
    solution,
    cursorToolState: [cursor, setCursor],
    className,
    ...props
}: {
    solution: Solution,
    cursorToolState: StateProp<CursorTool>;
} & JSX.IntrinsicElements["div"]) {

    const availableSpawners = solution.problem.spawners.map(output => ({
        kind: "spawner" as const,
        output,
        used: false,
    }));
    const availableConsumers = solution.problem.consumers.map(input => ({
        kind: "consumer" as const,
        input,
        used: false,
    }));
    for (const usedActor of solution.actors) {
        if (usedActor.kind === "spawner") {
            const item = availableSpawners
                .find(a => !a.used && areParticleKindsEqual(a.output, usedActor.output));
            if (item) { item.used = true; }
        }
        if (usedActor.kind === "consumer") {
            const item = availableConsumers
                .find(a => !a.used && areParticleKindsEqual(a.input, usedActor.input));
            if (item) { item.used = true; }
        }
    }

    const availableTools = [
        { kind: "none" },
        ...availableSpawners,
        ...availableConsumers,
        { kind: "mirror" },
        // { kind: "reactor" },
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
