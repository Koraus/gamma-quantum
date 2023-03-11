import { ParticleKind } from "../puzzle/terms/ParticleKind";

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

export const reactions = [{
    title: "Annihilation (q-m1 + q-m1 => g-m0)",
    reaction: {
        reagents: [particles.q, particles.q],
        products: [particles.g],
    },
}, {
    title: "Shift (q-m1 + q-m1 => q-m1), Fusion (... => qq-m1)",
    reaction: {
        reagents: [particles.q, particles.q],
        products: [particles.qq],
    },
}, {
    title: "Shift (q-m1 => q-m1 + q-m1), Fusion (qq-m1 => ...)",
    reaction: {
        reagents: [particles.qq],
        products: [particles.q, particles.q],
    },
}, {
    title: "Oscillation (qq-m1 + q-m1 => qqq-m2)",
    reaction: {
        reagents: [particles.qq, particles.q],
        products: [particles.qqq],
    },
}, {
    title: "Oscillation (qqq-m2 => qq-m1 + q-m1)",
    reaction: {
        reagents: [particles.qqq],
        products: [particles.qq, particles.q],
    },
}, {
    title: "Fission-31 (qqq-m2 + q-m1 => qqqq-m4)",
    reaction: {
        reagents: [particles.qqq, particles.q],
        products: [particles.qqqq],
    },
}, {
    title: "Fission-31 (qqqq-m4 => qqq-m2 + q-m1)",
    reaction: {
        reagents: [particles.qqqq],
        products: [particles.qqq, particles.q],
    },
}, {
    title: "Fission-22 (qq-m1 + qq-m1 => qqqq-m4)",
    reaction: {
        reagents: [particles.qq, particles.qq],
        products: [particles.qqqq],
    },
}, {
    title: "Fission-22 (qqqq-m4 => qq-m1 + qq-m1)",
    reaction: {
        reagents: [particles.qqqq],
        products: [particles.qq, particles.qq],
    },
}];