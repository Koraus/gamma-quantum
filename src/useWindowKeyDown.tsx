import { useEffect } from "react";

export default function useWindowKeyDown(keyCode: string, handler) {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === keyCode) handler();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    });

}
