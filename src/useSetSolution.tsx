import { playActionRecoil } from "./PlaybackPanel";
import { Solution, SolutionDraft } from "./puzzle/Solution";
import { cursorToolRecoil } from "./CursorToolSelectorPanel";
import { winRecoil } from "./WinPanel";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { solutionManagerRecoil, useSetCurrentSolution } from "./solutionManager/solutionManagerRecoil";

export function useSetSolution() {
    const solution = useRecoilValue(solutionManagerRecoil).currentSolution;
    const setSolution = useSetCurrentSolution();
    const resetPlayAction = useResetRecoilState(playActionRecoil);
    const resetCursorTool = useResetRecoilState(cursorToolRecoil);
    const resetWin = useResetRecoilState(winRecoil);

    const setSolutionAndResetPlayback = (
        nextSolution: (Solution | SolutionDraft) |
            ((prevSolution: (Solution | SolutionDraft)) =>
                (Solution | SolutionDraft)),
    ) => {
        const resolvedNextSolution = ("function" === typeof nextSolution)
            ? nextSolution(solution)
            : nextSolution;
        setSolution(resolvedNextSolution);

        resetPlayAction();
        resetWin();
        resetCursorTool();
    };

    return setSolutionAndResetPlayback;
}
