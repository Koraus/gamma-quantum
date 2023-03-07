import { solvedAtStep } from "./puzzle/world/index";
import { css, cx } from "@emotion/css";
import { atom, useRecoilState } from "recoil";
import { useWorld } from "./useWorld";
import { useEffect } from "react";
import { useSetSolution } from "./useSetSolution";
import update from "immutability-helper";
import { Solution, isSolutionComplete } from "./puzzle/Solution";

export const winRecoil = atom({
    key: "win",
    default: false,
});


export function WinPanel() {
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

    if (!win) { return null; }
    return <div className={cx(
        css({
            fontWeight: "bold",
            fontSize: "16px",
            color: "green",
            width: "fit-content",
        }),
    )}>  'Win' </div>;
}
