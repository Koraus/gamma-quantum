import { ParticleKind } from "../puzzle/terms";

export const particles = {
    g: { content: "gamma" } as ParticleKind, // gamma-quantum
    q: { content: "red" } as ParticleKind, // 1 quark
    qq: { content: ["red", "red"] } as ParticleKind, // 2 quarks
    qqq: { content: ["red", "red", "red"] } as ParticleKind, // 3 quarks
    qqqq: { content: ["red", "red", "red", "red"] } as ParticleKind, // 4 quarks
};