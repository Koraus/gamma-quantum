import * as problems from "../../puzzle/problems";
import ProblemInSolutionList from "./ProblemInSolutionList";
import { useRecoilValue } from "recoil";
import { solutionManagerRecoil } from "./solutionManagerRecoil";
import { eqProblem } from "../../puzzle/terms/Problem";
import { useSetSolution } from "../useSetSolution";
import type { EmotionJSX } from "@emotion/react/types/jsx-namespace";


export function SolutionManagerPanel({
    css: cssProp,
    ...props
}: EmotionJSX.IntrinsicElements["div"]) {
    const solutions = useRecoilValue(solutionManagerRecoil).savedSolutions;
    const solution = useRecoilValue(solutionManagerRecoil).currentSolution;
    const setSolution = useSetSolution();

    const problemsList = Object.entries(problems)
        .map(([problemName, problem]) => <ul
            key={problemName}
            css={{
                padding: 0,
                listStyle: "none",
                background: eqProblem(solution.problem, problem)
                    ? "#303030b0"
                    : "#000000b0",
            }}
        >
            {problemName}
            <ProblemInSolutionList
                problem={problem}
                solutions={solutions}
                solutionState={[solution, setSolution]} />
        </ul>);

    const currentSolutionKey = Object.entries(solutions)
        .find(([, s]) => s === solution)?.[0];

    return <div
        css={[{
            background: "#000000b0",
            border: "1px solid #ffffffb0",
        }, cssProp]}
        {...props}
    >
        <div
            css={{
                background: "#ff010Ab0",
                margin: "0 auto",
                padding: "2px",
            }}
        >
            <span> Solutions: {currentSolutionKey ?? "*"} </span>
        </div>

        <div css={{ margin: "2vmin" }}>{problemsList}</div>

        <button
            onClick={() => {
                // eslint-disable-next-line no-console
                console.log(solution);
                navigator.clipboard.writeText(
                    JSON.stringify(solution, undefined, 4));
            }}
        >
            copy current solution json into clipboard
        </button>
    </div>;
}