import { useRecoilValue } from "recoil";
import { solutionManagerRecoil } from "../solutionManager/solutionManagerRecoil";
import usePromise from "react-use-promise";
import { isSolutionComplete, keyifySolution } from "../../puzzle/terms/Solution";
import { getStats } from "./statsCllient";
import { statsRecoil } from "./statsRecoil";
import { Chart } from "./Chart";
import type { EmotionJSX } from "@emotion/react/types/jsx-namespace";


export function StatsPanel({
    css: cssProp,
    ...props
}: EmotionJSX.IntrinsicElements["div"]) {
    const { currentSolution } =
        useRecoilValue(solutionManagerRecoil);
    const { confirmedSolutions } =
        useRecoilValue(statsRecoil);

    // todo: create problem-stats cache
    const cachedStats = isSolutionComplete(currentSolution)
        && (keyifySolution(currentSolution) in confirmedSolutions)
        && confirmedSolutions[keyifySolution(currentSolution)]
        || undefined;

    const [freshStats] = usePromise(
        () => getStats(currentSolution.problem),
        [currentSolution.problem]);

    const stats = freshStats ?? cachedStats?.data;

    return <div
        css={[{
            display: "flex",
            flex: "row",
        }, cssProp]}
        {...props}
    >
        <Chart
            css={{
                border: "1px solid #fff3",
            }}
            width={250}
            height={120}
            currentValue={0}
            bestValue={0}
            data={stats?.energy ?? {}}
        />

        <Chart
            css={{
                border: "1px solid #fff3",
            }}
            width={250}
            height={120}
            currentValue={0}
            bestValue={0}
            data={stats?.solvedAtStep ?? {}}
        />
    </div>;
}
