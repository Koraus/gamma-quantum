import { css, cx } from "@emotion/css";
import { useState } from "react";
import * as problems from "../puzzle/problems";
import ProblemInSolutionList from "./ProblemInSolutionList";
import { useRecoilValue } from "recoil";
import { solutionManagerRecoil } from "./solutionManagerRecoil";
import { eqProblem } from "../puzzle/Problem";
import { useSetSolution } from "../useSetSolution";


export function SolutionsList({
    className,
    ...props
}: JSX.IntrinsicElements["div"]) {
    const solutions = useRecoilValue(solutionManagerRecoil).savedSolutions;
    const solution = useRecoilValue(solutionManagerRecoil).currentSolution;
    const setSolution = useSetSolution();

    const problemsList = Object.entries(problems)
        .map(([problemName, problem]) => <ul
            key={problemName}
            className={cx(css({
                padding: 0,
                listStyle: "none",
                background: eqProblem(solution.problem, problem)
                    ? "#303030b0"
                    : "#000000b0",
            }))}
        >
            {problemName}
            <ProblemInSolutionList
                problem={problem}
                solutions={solutions}
                solutionState={[solution, setSolution]} />
        </ul>);

    const [isShown, setIsShown] = useState(false);

    const currentSolutionKey = Object.entries(solutions)
        .find(([, s]) => s === solution)?.[0];

    return <div
        className={cx(
            css({
                background: "#000000b0",
                border: "1px solid #ffffffb0",
            }),
            className,
        )}
        {...props}
    >
        <div
            className={cx(
                css({
                    background: "#ff010Ab0",
                    margin: "0 auto",
                    padding: "2px",
                    cursor: "pointer",
                }),
            )}
            onClick={() => setIsShown(!isShown)}
        >
            <span
                className={cx(
                    css({
                        transform: isShown ? "rotate(90deg)" : "rotate(0deg)",
                        display: "inline-block",
                        transitionDuration: "0.1s",
                        paddingRight: "1px",

                    }),
                )}
            > &gt; </span>
            <span> Solutions: {currentSolutionKey ?? "*"} </span>
        </div>

        {isShown
            && <div className={cx(
                css({
                    margin: "2vmin",
                }),
            )}>
                {problemsList}
            </div>
        }

        <button
            onClick={() => {
                console.log(solution);
                navigator.clipboard.writeText(
                    JSON.stringify(solution, undefined, 4));
            }}
        >
            copy current solution json<br />into clipboard
        </button>
    </div>;
}