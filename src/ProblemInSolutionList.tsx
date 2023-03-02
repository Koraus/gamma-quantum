import { Problem } from "./puzzle/Problem";
import { SolutionDraft } from "./puzzle/Solution";
import { css, cx } from "@emotion/css";
import { StateProp } from "./utils/StateProp";


export default function ProblemSolutionList({
    problems,
    solutions,
    solutionState: [solution, setSolution],
    ...props
}: {
    problems: Problem[],
    solutions: SolutionDraft[],
    solutionState: StateProp<SolutionDraft>,
}) {

    const list = Object.entries(problems).map(([problemName, problem]) => {

        const solutionsForProblem = Object.entries(solutions)
            .filter(([key, s]) => problem === s.problem);

        const listSolutions = solutionsForProblem
            .map(([solutionName, solution1]) => {
                return <li
                    key={solutionName}
                    className={cx(
                        css({
                            listStyle: 'none',
                            paddingLeft: '10px',
                            backgroundColor: solution === solution1 ? 'red' : '',
                        }),
                    )}
                > {solutionName} </li>
            }
            );
        return <ul
            key={problemName}
            className={cx(
                css({
                    listStyle: 'none',
                    paddingLeft: '0',
                }),
            )}
            onClick={() => (console.log())}
        > {problemName} =&gt; {listSolutions} </ul>
    })
    return list;
}

