const dir = [
    [0, 1, -1], // ↓
    [-1, 1, 0], // ↙
    [-1, 0, 1], // ↖
    [0, -1, 1], // ↑
    [1, -1, 0], // ↗
    [1, 0, -1], // ↘
] as const;

const solution = (a: number, b: number, c: number, d: number, e: number, f: number) => [
    ...Array(a).fill(dir[0]),
    ...Array(b).fill(dir[1]),
    ...Array(c).fill(dir[2]),
    ...Array(d).fill(dir[3]),
    ...Array(e).fill(dir[4]),
    ...Array(f).fill(dir[5]),
];

export function* solveConservation({
    extraMomentum, extraEnergy,
}: {
    extraMomentum: [number, number] | [number, number, number];
    extraEnergy: number;
}) {
    const [px, py] = extraMomentum;
    const E = extraEnergy;

    // Each unique integer non-negative solution to a following system
    // denotes an unique group of gamma-quants that dissipate the given energy
    // preserving the given momentum:
    // (1) a*↓ + b*↙ + c*↖ + d*↑ + e*↗ + f*↘ = p
    // (2) a + b + c + d + e + f = E

    // This system is of 3 linear equations with 6 variables
    // which results in 3 free variables

    // The following script bruteforce searches 
    // the space of those 3 free variables for solutions
    for (let b = 0; b <= E; b++) {
        for (let c = 0; c <= (E - b); c++) {
            for (let d = 0; d <= (E - b - c); d++) {
                const e = E - (px + py + d + d + c + c + b);
                if (e < 0) { continue; }
                const f = px + b + c - e;
                if (f < 0) { continue; }
                const a = py - b + d + e;
                if (a < 0) { continue; }
                yield solution(a, b, c, d, e, f);
            }
        }
    }
}
