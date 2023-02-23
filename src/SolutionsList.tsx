import { css, cx } from "@emotion/css";
import { solution1, solution2, solution3 } from './hardcodedSoultions'
import { useState } from "react";
import { Solution } from "./puzzle/terms";
import { StateProp } from "./PlaybackPanel";


export function SolutionsList({
    solutionState: [solution, setSolution],
    className,
    ...props
}: {
    solutionState: StateProp<Solution>,
} & JSX.IntrinsicElements['div']) {

    const [isShown, setIsShown] = useState(false);
    const solutions = [solution1, solution2, solution3];

    const listItems = solutions.map((solutionN, index) => {
        return <li
            className={cx(
                css({
                    color: "white",
                    background: solution === solutionN ? "#f34494" : "#a3119F",
                    margin: "0 0 10px 0",
                    cursor: 'pointer',
                    width: 'fit-content'
                }),
            )}
            onClick={(e) => setSolution(solutionN)}
            key={index}
        > {`Solution ${index + 1}`} </li>
    }
    );

    return <div
        className={cx(
            css({
                background: '#000000b0',
                border: '1px solid #ffffffb0',
            }),
            className,
        )}
        {...props}
    >
        <div className={cx(
            css({
                height: '100%',
                width: 'fit-content',
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
            <span>Solutions </span>  <span
                className={cx(
                    css({
                        transform: isShown ? 'rotate(-90deg)' : 'rotate(90deg)',
                        display: 'inline-block',
                        transitionDuration: '0.1s',
                        paddingRight: '1px'

                    }),
                )}
            > &gt; </span>
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