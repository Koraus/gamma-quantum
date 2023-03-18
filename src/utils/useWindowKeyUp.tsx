import { useEffect, DependencyList } from "react";

export function useWindowKeyUp(handler: (e: KeyboardEvent) => void,
    deps?: DependencyList) {
    useEffect(() => {
        window.addEventListener("keyup", handler);
        return () => window.removeEventListener("keyup", handler);
    }, deps);
}