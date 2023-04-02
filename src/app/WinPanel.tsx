import { solvedAtStep } from "../puzzle/world/index";
import { atom, useRecoilState } from "recoil";
import { useWorld } from "./useWorld";
import { useEffect } from "react";
import { useSetSolution } from "./useSetSolution";
import update from "immutability-helper";
import { Solution, isSolutionComplete } from "../puzzle/terms/Solution";
import { trustedEntries } from "../utils/trustedRecord";
import { particleKindText } from "./CursorToolSelectorPanel";
import { ParticleKindKey, parsePartilceKind } from "../puzzle/terms/ParticleKind";
import { CardChecklist } from "@emotion-icons/bootstrap/CardChecklist";
import { CheckmarkSquareOutline } from "@emotion-icons/evaicons-outline/CheckmarkSquareOutline";
import { SquareOutline } from "@emotion-icons/evaicons-outline/SquareOutline";



export const winRecoil = atom({
    key: "win",
    default: false,
});

function ObjectiveLine({
    particleKindKey, current, demand,
}: {
    particleKindKey: ParticleKindKey,
    current: number,
    demand: number,
}) {
    const isComplete = current >= demand;
    return (
        <div
            css={{
                color: isComplete
                    ? "grey"
                    : "white",
                textDecoration: isComplete
                    ? "line-through"
                    : "none",
            }}
        >
            {
                isComplete
                    ? <CheckmarkSquareOutline css={{ height: "1.5em" }} />
                    : <SquareOutline css={{ height: "1.5em" }} />
            }
            &nbsp;
            {current} / {demand}
            &nbsp;
            {particleKindText(parsePartilceKind(particleKindKey))}
        </div>
    );
}

export function WinPanel({
    ...props
}: JSX.IntrinsicElements["div"]) {
    const [win, setWin] = useRecoilState(winRecoil);
    const setSolution = useSetSolution();
    const world = useWorld();

    useEffect(() => {
        if (win) { return; }
        const step = solvedAtStep(world);
        if (undefined === step) { return; }

        setWin(true);
        // todo: is this a proper way and place to set solvedAtWorld?
        setSolution(s => {
            if (isSolutionComplete(s)) { return s; }
            return update(s as Solution, {
                solvedAtStep: { $set: step },
            });
        });
    }, [world]);

    return (
        <div {...props}>

            <CardChecklist css={{ width: "3vmin" }} /><br />
            {trustedEntries(world.init.problem.demand)
                .map(([key, val], i) => <ObjectiveLine
                    key={i}
                    particleKindKey={key}
                    current={world.consumed[key] ?? 0}
                    demand={val}
                />)}

            {win && <div css={{
                fontWeight: "bold",
                fontSize: "10vmin",
                color: "green",
                width: "fit-content",
            }}> Win </div>}

        </div>
    );
}