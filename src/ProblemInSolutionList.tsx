import { Problem } from "./puzzle/Problem";
import { SolutionDraft } from "./puzzle/Solution";
import { css, cx } from "@emotion/css";
import { StateProp } from "./utils/StateProp";


export default function ProblemSolutionList({
    problems,
    solutions,
    ...props
}: {
    problems: Problem,
    solutions: SolutionDraft,
}) {
    const list = Object.entries(problems).map(([problemName, problem]) => {
        const solutionsForProblem = Object.entries(solutions).filter(([key, s]) => problem === s.problem);
        const listSolutions = solutionsForProblem.map(([solutionName, solution]) =>
            <li
                key={solutionName}
                className={cx(
                    css({
                        listStyle: 'none',
                        paddingLeft: '10px',
                    }),
                )}
            > {solutionName} </li>
        );
        return <ul
            key={problemName}
            className={cx(
                css({
                    listStyle: 'none',
                    paddingLeft: '0',
                }),
            )}> {problemName} =&gt; {listSolutions} </ul>
    })
    return list
}

