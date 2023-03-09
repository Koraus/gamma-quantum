import { ParticleKind } from "../puzzle/terms/Particle";

export const particles = {
    // gamma-quantum
    g: { content: "gamma" } as ParticleKind,

    // 1 quark
    q: { content: { red: 1, green: 0, blue: 0 } } as ParticleKind,

    // 2 quarks
    qq: { content: { red: 2, green: 0, blue: 0 } } as ParticleKind,

    // 3 quarks
    qqq: { content: { red: 3, green: 0, blue: 0 } } as ParticleKind,

    // 4 quarks
    qqqq: { content: { red: 4, green: 0, blue: 0 } } as ParticleKind,
};