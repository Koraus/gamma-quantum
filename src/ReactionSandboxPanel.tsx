import { css } from "@emotion/css";
import { useState } from "react";
import { ReactionSandbox } from "./reactionSandbox/ReactionSandbox";
import { useEffect } from "react";


export function ReactionSandboxPanel({
    ...props
}: JSX.IntrinsicElements["div"]) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const close = (e: KeyboardEvent) => {
                if (e.key === "Escape") { setIsOpen(false); }
            };
            window.addEventListener("keydown", close);
            return () => {
                window.removeEventListener("keydown", close);
            };
        }
    }, [isOpen]);

    return <div
        {...props}
    >
        <button onClick={() => setIsOpen(!isOpen)}>*⇔*</button>
        {isOpen && <div className={css({
            position: "fixed",
            inset: "5vmin",
            background: "#000000b0",
            border: "1px solid #ffffffb0",
            padding: "2vmin",
            zIndex: 100,
        })}>
            <ReactionSandbox />
            <button
                className={css({
                    position: "absolute",
                    padding: "0px 3px 0px 3px",
                    top: "0",
                    right: "0",
                })}
                onClick={() => {
                    setIsOpen(false);
                }}> X </button>
        </div>}
    </div>;
}
