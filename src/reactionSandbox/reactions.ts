import { ParticleKind } from "../puzzle/terms/ParticleKind";
import * as hax from "../utils/hax";

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
    title: "Elastic collision with gamma",
    reagents: [particles.q],
}, {
    title: "Elastic collision",
    reagents: [particles.q, particles.q],
}, {
    title: "Annihilation (q-m1 + q-m1 => g-m0)",
    reagents: [particles.q, particles.q],
}, {
    title: "Shift (q-m1 + q-m1 => q-m1), Fusion (... => qq-m1)",
    reagents: [particles.q, particles.q],
}, {
    title: "Shift (q-m1 => q-m1 + q-m1), Fusion (qq-m1 => ...)",
    reagents: [particles.qq],
}, {
    title: "Oscillation (qq-m1 + q-m1 => qqq-m2)",
    reagents: [particles.qq, particles.q],
}, {
    title: "Oscillation (qqq-m2 => qq-m1 + q-m1)",
    reagents: [particles.qqq],
}, {
    title: "Fission-31 (qqq-m2 + q-m1 => qqqq-m4)",
    reagents: [particles.qqq, particles.q],
}, {
    title: "Fission-31 (qqqq-m4 => qqq-m2 + q-m1)",
    reagents: [particles.qqqq],
}, {
    title: "Fission-22 (qq-m1 + qq-m1 => qqqq-m4)",
    reagents: [particles.qq, particles.qq],
}, {
    title: "Fission-22 (qqqq-m4 => qq-m1 + qq-m1)",
    reagents: [particles.qqqq],
}, {
    title: "check 1: gg ↓ m1 + r ↖ m1 + r ↙ m1",
    reagents: [{
        content: { red: 0, green: 2, blue: 0 },
        velocity: [...hax.direction.flat60["↓"]],
    }, {
        content: { red: 1, green: 0, blue: 0 },
        velocity: [...hax.direction.flat60["↖"]],
    }, {
        content: { red: 1, green: 0, blue: 0 },
        velocity: [...hax.direction.flat60["↙"]],
    }],
}, {
    title: "check 2: gg ↓ m1 + r ↖ m1 + r ↙ m1 + rgb ↙ m2",
    reagents: [{
        content: { red: 0, green: 2, blue: 0 },
        velocity: [...hax.direction.flat60["↓"]],
    }, {
        content: { red: 1, green: 0, blue: 0 },
        velocity: [...hax.direction.flat60["↖"]],
    }, {
        content: { red: 1, green: 0, blue: 0 },
        velocity: [...hax.direction.flat60["↙"]],
    }, {
        content: { red: 1, green: 1, blue: 1 },
        velocity: [...hax.direction.flat60["↙"]],
    }],
}, {
    title: "check 3: r ↓ m1 + r ↑ m1",
    reagents: [{
        content: { red: 1, green: 0, blue: 0 },
        velocity: [...hax.direction.flat60["↓"]],
    }, {
        content: { red: 1, green: 0, blue: 0 },
        velocity: [...hax.direction.flat60["↑"]],
    }],
}, {
    title: "check 4: rr ↓ m1 + rg ↑ m1",
    reagents: [{
        content: { red: 2, green: 0, blue: 0 },
        velocity: [...hax.direction.flat60["↓"]],
    }, {
        content: { red: 1, green: 1, blue: 0 },
        velocity: [...hax.direction.flat60["↑"]],
    }],
}];