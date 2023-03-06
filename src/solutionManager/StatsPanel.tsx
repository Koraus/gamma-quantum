import { css, cx } from "@emotion/css";
import { useRecoilValue } from "recoil";
import { solutionManagerRecoil } from "./solutionManagerRecoil";
import usePromise from "react-use-promise";
import { isSolutionComplete, keyifySolution } from "../puzzle/Solution";
import { getStats } from "./statsCllient";



export function StatsPanel({
    className, ...props
}: JSX.IntrinsicElements["div"]) {
    const { currentSolution, confirmedSolutions } = 
        useRecoilValue(solutionManagerRecoil);

    // todo: create problem-stats cache
    const cachedStats = isSolutionComplete(currentSolution)
        && (keyifySolution(currentSolution) in confirmedSolutions)
        && confirmedSolutions[keyifySolution(currentSolution)]
        || undefined;

    const [freshStats] = usePromise(
        getStats(currentSolution.problem), 
        [currentSolution.problem]);

    const stats = freshStats ?? cachedStats?.data;

    return <div
        className={cx(
            css({}),
            className,
        )}
        {...props}
    >
        Stats: {JSON.stringify(stats)}
    </div>;
}
