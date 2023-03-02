import { Problem, eqProblem } from "../puzzle/Problem";
import { SolutionDraft } from "../puzzle/Solution";
import { css, cx } from "@emotion/css";
import { StateProp } from "../utils/StateProp";


export default function ProblemInSolutionList({
    problem,
    solutions,
    solutionState: [solution, setSolution],
}: {
    problem: Problem,
    solutions: Record<string, SolutionDraft>,
    solutionState: StateProp<SolutionDraft>,
},
) {
    const solutions1 = Object.entries(solutions)
        .filter(([key, s]) => eqProblem(problem, s.problem))
        .map(([solutionName, solution1]) => {
            return <li
                key={solutionName}
                className={cx(
                    css({
                        listStyle: "none",
                        backgroundColor: solution === solution1 ? "red" : "",
                    }),
                )}
                onClick={() => setSolution(solution1)}
            > {solutionName} </li>;
        },
        );
    return <ul>
        <li
            className={cx(
                css({
                    listStyle: "none",
                }),
            )}
            onClick={() => setSolution({
                problem: problem,
                actors: [],
            })}
        > new solution </li>
        {solutions1}
    </ul>;
}
