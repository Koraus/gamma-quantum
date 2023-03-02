import { Problem } from "./puzzle/Problem";
import { SolutionDraft } from "./puzzle/Solution";
import { css, cx } from "@emotion/css";
import { StateProp } from "./utils/StateProp";


export default function ProblemSolutionList({
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
        .filter(([key, s]) => problem === s.problem)
        .map(([solutionName, solution1]) => {
            return <li
                key={solutionName}
                className={cx(
                    css({
                        listStyle: "none",
                        paddingLeft: "10px",
                        backgroundColor: solution === solution1 ? "red" : "",
                    }),
                )}
                onClick={() => setSolution(solution1)}
            > {solutionName} </li>
        },
        );

    return <li>{solutions1}</li>
}
