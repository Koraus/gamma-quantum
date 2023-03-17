import { useEffect, DependencyList } from "react";

export function useWindowKeyDown(
    handler: (e: KeyboardEvent) => void, depends?: DependencyList) {
    useEffect(() => {
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, depends);
}