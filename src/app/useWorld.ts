import { useRecoilValue } from "recoil";
import { nowPlaytime, playActionRecoil } from "./PlaybackPanel";
import { solutionManagerRecoil } from "../app/solutionManager/solutionManagerRecoil";
import { useEffect, useState } from "react";
import { SolutionDraft } from "../puzzle/terms/Solution";
import { worldAtStep } from "../puzzle/world";
import { ghostSolutionRecoil } from "./scene/ghostSolutionRecoil";


export const getStepAtPlaytime = (playtime: number) =>
    Math.max(0, Math.floor(playtime));

export const getWorldAtPlaytime = (solution: SolutionDraft, playtime: number) =>
    worldAtStep(solution, getStepAtPlaytime(playtime));

export function useWorld() {
    const playAction = useRecoilValue(playActionRecoil);
    const ghostSolution = useRecoilValue(ghostSolutionRecoil);
    const currentSolution = useRecoilValue(solutionManagerRecoil)
        .currentSolution;
    const solution = ghostSolution ?? currentSolution;

    const [step, setStep] = useState(0);
    useEffect(() => {
        const handler = setInterval(() => {
            const stepNow = Math.floor(nowPlaytime(playAction));
            if (stepNow === step) { return; }
            setStep(stepNow);
        }, 10);
        return () => clearInterval(handler);
    }, [playAction, solution]);
    return getWorldAtPlaytime(solution, step);
}
