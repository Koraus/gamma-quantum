// This lib is mainly based on https://www.redblobgames.com/grids/hexagons/

type v2 = [number, number];
type v3 = [number, number, number];
type rv2 = Readonly<v2>;
type rv3 = Readonly<v3>;

export const SQRT3 = Math.sqrt(3);
export const axialToFlatCart = ([q, r]: rv2 | rv3) => 
    [(SQRT3 / 2) * q, (1 / 2) * q + r] as v2;
export const flatCartToAxial = ([x, y]: rv2) => 
    [2 / SQRT3 * x, - 1 / SQRT3 * x + y] as v2;
export const axialToCube = ([q, r]: rv2) => [q, r, -q - r] as v3;
export const cubeLen = ([q, r, s]: rv3) => 
    (Math.abs(q) + Math.abs(r) + Math.abs(s)) / 2;
export const cubeRotate60Cw = ([q, r, s]: rv3) => [-r, -s, -q] as v3;
export const cubeRotate60Ccw = ([q, r, s]: rv3) => [-s, -q, -r] as v3;
export const cubeRotate60CwTimes = (v: rv3, times: number) => {
    times %= 6;
    if (times < 0) times += 6;
    for (let i = 0; i < times; i++) v = cubeRotate60Cw(v);
    return v;
};
export const cubeRotate60CcwTimes = (v: rv3, times: number) => {
    times %= 6;
    if (times < 0) times += 6;
    for (let i = 0; i < times; i++) v = cubeRotate60Ccw(v);
    return v;
};
export const cubeRound = (v: rv3): v3 => {
    const { round, abs } = Math;
    const [q, r, s] = v.map(round);

    const q_diff = abs(q - v[0]);
    const r_diff = abs(r - v[1]);
    const s_diff = abs(s - v[2]);

    if (q_diff > r_diff && q_diff > s_diff) return [-r - s, r, s];
    if (r_diff > s_diff) return [q, -q - s, s];
    return [q, r, -q - r];
};

const _dir60 = {
    qnr: [1, -1, 0],
    qns: [1, 0, -1],
    rns: [0, 1, -1],
    rnq: [-1, 1, 0], // -qnr
    snq: [-1, 0, 1], // -qns
    snr: [0, -1, 1], // -rns
} as const;
const _dirFlat60 = {
    northEast: _dir60.qnr,
    southEast: _dir60.qns,
    south: _dir60.rns,
    southWest: _dir60.rnq,
    northWest: _dir60.snq,
    north: _dir60.snr,
};
const _dirPointy60 = {
    northEast: _dir60.qnr,
    east: _dir60.qns,
    southEast: _dir60.rns,
    southWest: _dir60.rnq,
    west: _dir60.snq,
    northWest: _dir60.snr,
};
export const direction = {
    ..._dir60,
    flat60: {
        ..._dirFlat60,
        ["↗"]: _dirFlat60.northEast,
        ne: _dirFlat60.northEast,
        ["↘"]: _dirFlat60.southEast,
        se: _dirFlat60.southEast,
        ["↓"]: _dirFlat60.south,
        s: _dirFlat60.south,
        ["↙"]: _dirFlat60.southWest,
        sw: _dirFlat60.southWest,
        ["↖"]: _dirFlat60.northWest,
        nw: _dirFlat60.northWest,
        ["↑"]: _dirFlat60.north,
        n: _dirFlat60.north,

        itCw: [
            _dirFlat60.northEast,
            _dirFlat60.southEast,
            _dirFlat60.south,
            _dirFlat60.southWest,
            _dirFlat60.northWest,
            _dirFlat60.north,
        ],

        /**
         * @deprecated Better use itCw without expliicitly known start direction
         */
        itCwFromSouth: [
            _dirFlat60.south,
            _dirFlat60.southWest,
            _dirFlat60.northWest,
            _dirFlat60.north,
            _dirFlat60.northEast,
            _dirFlat60.southEast,
        ],
    },
    pointy: {
        ..._dirPointy60,
        ["↗"]: _dirPointy60.northEast,
        ne: _dirPointy60.northEast,
        ["→"]: _dirPointy60.east,
        e: _dirPointy60.east,
        ["↘"]: _dirPointy60.southEast,
        se: _dirPointy60.southEast,
        ["↙"]: _dirPointy60.southWest,
        sw: _dirPointy60.southWest,
        ["←"]: _dirPointy60.west,
        w: _dirPointy60.west,
        ["↖"]: _dirPointy60.northWest,
        nw: _dirPointy60.northWest,
    },
    itCw60: [
        _dir60.qnr, _dir60.qns, _dir60.rns, 
        _dir60.rnq, _dir60.snq, _dir60.snr,
    ],
} as const;