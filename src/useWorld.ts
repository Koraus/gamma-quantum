import { useRecoilValue } from "recoil";
import { nowPlaytime, playActionRecoil } from "./PlaybackPanel";
import { solutionManagerRecoil } from "./solutionManager/solutionManagerRecoil";
import { useEffect, useState } from "react";
import { SolutionDraft } from "./puzzle/Solution";
import { worldAtStep } from "./puzzle/world";


export const getStepAtPlaytime = (playtime: number) =>
    Math.max(0, Math.floor(playtime));

export const getWorldAtPlaytime = (solution: SolutionDraft, playtime: number) =>
    worldAtStep(solution, getStepAtPlaytime(playtime));

export function useWorld() {
    const playAction = useRecoilValue(playActionRecoil);
    const solution = useRecoilValue(solutionManagerRecoil).currentSolution;
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
