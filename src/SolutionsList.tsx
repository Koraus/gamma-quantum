import { css, cx } from "@emotion/css";
import { solution1, solution2, solution3 } from './hardcodedSoultions'
import { useState } from "react";
import { Solution } from "./puzzle/terms";


export function SolutionsList({
    solution,
    changeSolution,
    ...props
}: {
    solution: Solution,
    changeSolution: (solution: Solution) => void,
} & JSX.IntrinsicElements['div']) {

    const [isShown, setIsShown] = useState(false);
    const solutions = [solution1, solution2, solution3];

    const listItems = solutions.map((solutionN, index) => {
        return  <li
            className={cx(
                css({
                    color: "white",
                    background: solution === solutionN ? "#f34494" : "#a3119F",
                    margin: "0 0 10px 0",
                    cursor: 'pointer'
                }),
            )}
            onClick={(e) => {
                changeSolution(solutionN)
            }}
            key={index}
        > {`Solution ${index + 1}`} </li>
    }
    );

    return <div
        className={cx(
            css({
                inset: "5vmin",
                background: '#000000b0',
                border: '1px solid #ffffffb0',
                position: "absolute",
                top: "20%",
                height: 'fit-content',
                width: 'fit-content',
                left: 0,
            }),
        )}
        {...props}
    >

        <div className={cx(
            css({

                height: '100%',
                width: '100%',
                background: '#ff010Ab0',
                textAlign: "center",
                margin: "0 auto",
                boxSizing: 'border-box',
                padding: '2px',
                cursor: 'pointer',
            }),
        )}
            onClick={(e) => {
                setIsShown(!isShown)
            }}
        >
            Solutions:
        </div>
        <div className={cx(
            css({
                display: isShown ? 'block' : 'none',
                margin: '2vmin',
            }),
        )}>
            <ul className={cx(
                css({
                    padding: 0,
                    listStyle: "none",
                }),
            )}
            >{listItems}</ul>
        </div>
    </div>

}