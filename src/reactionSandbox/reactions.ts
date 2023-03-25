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
    reagents: [particles.q, particles.g],
}, {
    title: "Elastic collision",
    reagents: [particles.q, particles.q],
}, {
    title: "Annihilation",
    reagents: [particles.q, particles.q],
}, {
    title: "Shift, Fusion",
    reagents: [particles.q, particles.q],
}, {
    title: "Shift, Fusion (back)",
    reagents: [particles.qq],
}, {
    title: "Oscillation",
    reagents: [particles.qq, particles.q],
}, {
    title: "Oscillation",
    reagents: [particles.qqq],
}, {
    title: "Fission",
    reagents: [particles.qqqq],
}, {
    title: "Fission",
    reagents: [particles.qqq, particles.q],
}, {
    title: "Fission (back)",
    reagents: [particles.qq, particles.qq],
}, {
    title: "check 1",
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
    title: "",
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
    title: "",
    reagents: [{
        content: { red: 1, green: 0, blue: 0 },
        velocity: [...hax.direction.flat60["↓"]],
    }, {
        content: { red: 1, green: 0, blue: 0 },
        velocity: [...hax.direction.flat60["↑"]],
    }],
}, {
    title: "",
    reagents: [{
        content: { red: 2, green: 0, blue: 0 },
        velocity: [...hax.direction.flat60["↓"]],
    }, {
        content: { red: 1, green: 1, blue: 0 },
        velocity: [...hax.direction.flat60["↑"]],
    }],
}, {
    title: "",
    reagents: [{
        content: { red: 1, green: 0, blue: 0 },
        velocity: [...hax.direction.flat60["↓"]],
    }, {
        content: { red: 0, green: 1, blue: 0 },
        velocity: [...hax.direction.flat60["↙"]],
    }],
}];