import { playActionRecoil } from "./PlaybackPanel";
import { Solution, SolutionDraft, eqSolutionDraft } from "./puzzle/Solution";
import { cursorToolRecoil } from "./CursorToolSelectorPanel";
import { winRecoil } from "./WinPanel";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { solutionManagerRecoil, useSetCurrentSolution } from "./solutionManager/solutionManagerRecoil";

export function useSetSolution() {
    // todo use transaction here? why? why not?
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

        if (!eqSolutionDraft(resolvedNextSolution, solution)) {
            resetPlayAction();
            resetWin();
            resetCursorTool();
        }
    };

    return setSolutionAndResetPlayback;
}
