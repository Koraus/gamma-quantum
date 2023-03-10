import { Problem, eqProblem } from "../puzzle/terms/Problem";
import { SolutionDraft, eqSolutionDraft } from "../puzzle/terms/Solution";
import { css, cx } from "@emotion/css";
import { StateProp } from "../utils/StateProp";
import { Save as SaveIcon } from "@emotion-icons/remix-fill/Save";
import { useSetRecoilState } from "recoil";
import { solutionManagerRecoil } from "./solutionManagerRecoil";
import update from "immutability-helper";

const { entries } = Object;

export default function ProblemInSolutionList({
    problem,
    solutions,
    solutionState: [solution, setSolution],
}: {
    problem: Problem,
    solutions: Record<string, SolutionDraft>,
    solutionState: StateProp<SolutionDraft>,
}) {
    const setSolutionManagerState = useSetRecoilState(solutionManagerRecoil);
    const saveCurrentSolution = () =>
        setSolutionManagerState(prev => update(prev, {
            savedSolutions: {
                [new Date().toISOString()]: { $set: solution },
            },
        }));
    const solutionList = entries(solutions)
        .filter(([, s]) => eqProblem(problem, s.problem))
        .map(([solutionName, s]) => {
            return <li
                key={solutionName}
                className={cx(
                    css({
                        listStyle: "none",
                        cursor: "pointer",
                        backgroundColor:
                            eqSolutionDraft(s, solution) ? "red" : "",
                    }),
                )}
                onClick={() => setSolution(s)}
            > {solutionName} </li>;
        });
    const showCurrentSeparately =
        eqProblem(solution.problem, problem)
        && entries(solutions).every(([, s]) => !eqSolutionDraft(s, solution));
    return <ul className={cx(css({ paddingLeft: "2vmin" }))}>
        {solutionList}
        <li
            className={cx(
                css({
                    listStyle: "none",
                    cursor: "pointer",
                }),
            )}
            onClick={() => setSolution({
                problem: problem,
                actors: {},
            })}
        > [new solution] </li>
        {showCurrentSeparately
            && <li
                className={cx(
                    css({
                        listStyle: "none",
                        backgroundColor: "red",
                    }),
                )}
            >
                current solution*
                &nbsp;<button
                    className={cx(css({
                        width: "1.5em",
                        padding: "0px",
                    }))}
                    onClick={saveCurrentSolution}
                ><SaveIcon /></button>
            </li>}
    </ul>;
}
