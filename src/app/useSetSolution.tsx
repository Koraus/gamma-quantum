import { playActionRecoil } from "./PlaybackPanel";
import { Solution, SolutionDraft, eqSolutionDraft, isSolutionComplete } from "../puzzle/terms/Solution";
import { cursorToolRecoil } from "./CursorToolSelectorPanel";
import { winRecoil } from "./WinPanel";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { solutionManagerRecoil, useSetCurrentSolution } from "./solutionManager/solutionManagerRecoil";
import { useTrackSolution } from "./stats/statsRecoil";
import { ghostSolutionRecoil } from "./scene/ghostSolutionRecoil";

export function useSetSolution() {
    // todo use transaction here? why? why not?
    const solution = useRecoilValue(solutionManagerRecoil).currentSolution;
    const setSolution = useSetCurrentSolution();
    const resetGhostSolution = useResetRecoilState(ghostSolutionRecoil);
    const resetPlayAction = useResetRecoilState(playActionRecoil);
    const resetCursorTool = useResetRecoilState(cursorToolRecoil);
    const resetWin = useResetRecoilState(winRecoil);
    const trackSolution = useTrackSolution();

    const setSolutionAndResetPlayback = (
        _nextSolution: (Solution | SolutionDraft) |
            ((prevSolution: (Solution | SolutionDraft)) =>
                (Solution | SolutionDraft)),
    ) => {
        const nextSolution = ("function" === typeof _nextSolution)
            ? _nextSolution(solution)
            : _nextSolution;

        setSolution(nextSolution);
        resetGhostSolution();

        if (isSolutionComplete(nextSolution)) { trackSolution(nextSolution); }

        if (!eqSolutionDraft(nextSolution, solution)) {
            resetPlayAction();
            resetWin();
            resetCursorTool();
        }
    };

    return setSolutionAndResetPlayback;
}
