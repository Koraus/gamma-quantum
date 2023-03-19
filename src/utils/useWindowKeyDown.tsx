import { useEffect, DependencyList } from "react";

export function useWindowKeyDown(handler: (e: KeyboardEvent) => void,
    deps?: DependencyList) {
    useEffect(() => {
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, deps);
}