import { ParticleKind } from "../puzzle/Particle";

export const particles = {
    g: { content: "gamma" } as ParticleKind, // gamma-quantum
    q: { content: { red: 1, green: 0, blue: 0 } } as ParticleKind, // 1 quark
    qq: { content: { red: 2, green: 0, blue: 0 } } as ParticleKind, // 2 quarks
    qqq: { content: { red: 3, green: 0, blue: 0 } } as ParticleKind, // 3 quarks
    qqqq: { content: { red: 4, green: 0, blue: 0 } } as ParticleKind, // 4 quarks
};