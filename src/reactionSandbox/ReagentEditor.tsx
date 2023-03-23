import { v2 } from "../utils/v";
import { Particle } from "../puzzle/world/Particle";
import type { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { ParticleKind } from "../puzzle/terms/ParticleKind";
import { StateProp } from "../utils/StateProp";
import update from "immutability-helper";
import * as hax from "../utils/hax";


export function ReagentEditor({
    particleState: [particle, _setParticle], ...props
}: {
    particleState: StateProp<Particle | ParticleKind>;
} & EmotionJSX.IntrinsicElements["span"]) {
    const setParticle = (p: Particle | ParticleKind) => {
        if (
            p.content !== "gamma"
            && (p.content.red + p.content.green + p.content.blue === 0)
        ) {
            _setParticle(update(p, {
                content: {
                    $set: {
                        red: 1,
                        green: 0,
                        blue: 0,
                    },
                },
            }));
            return;
        }
        _setParticle(p);
    };
    return <span {...props}>
        <select
            value={JSON.stringify(particle.content === "gamma")}
            onChange={(ev) => {
                if (JSON.parse(ev.target.value)) {
                    if ("velocity" in particle
                        && v2.eq(particle.velocity, v2.zero())) {
                        setParticle(update(particle, {
                            content: { $set: "gamma" },
                            $unset: ["velocity"],
                        }));
                    } else {
                        setParticle(update(particle, {
                            content: { $set: "gamma" },
                        }));
                    }
                } else {
                    setParticle(update(particle, {
                        content: { $set: { red: 1, green: 0, blue: 0 } },
                    }));
                }
            }}
        >
            <option
                value={JSON.stringify(true)}
            >gamma</option>
            <option
                value={JSON.stringify(false)}
            >non-gamma</option>
        </select>
        {particle.content !== "gamma"
            && <>
                <label>
                    red:
                    <input
                        css={{ width: "30px" }}
                        type="number"
                        min="0"
                        max="4"
                        value={particle.content.red}
                        onChange={(ev) => setParticle(update(particle, {
                            content: {
                                red: { $set: ev.target.valueAsNumber },
                            },
                        }))}
                    ></input>
                </label>
                <label>
                    green:
                    <input
                        css={{ width: "30px" }}
                        type="number"
                        min="0"
                        max="4"
                        value={particle.content.green}
                        onChange={(ev) => setParticle(update(particle, {
                            content: {
                                green: { $set: ev.target.valueAsNumber },
                            },
                        }))}
                    ></input>
                </label>
                <label>
                    blue:
                    <input
                        css={{ width: "30px" }}
                        type="number"
                        min="0"
                        max="4"
                        value={particle.content.blue}
                        onChange={(ev) => setParticle(update(particle, {
                            content: {
                                blue: { $set: ev.target.valueAsNumber },
                            },
                        }))}
                    ></input>
                </label>
            </>}
        <select
            value={("velocity" in particle)
                ? (() => {
                    if (v2.eq(v2.zero(), particle.velocity)) { return "∙"; }
                    const d = hax.direction.flat60;
                    if (v2.eq(d["↗"], particle.velocity)) { return "↗"; }
                    if (v2.eq(d["↘"], particle.velocity)) { return "↘"; }
                    if (v2.eq(d["↓"], particle.velocity)) { return "↓"; }
                    if (v2.eq(d["↙"], particle.velocity)) { return "↙"; }
                    if (v2.eq(d["↖"], particle.velocity)) { return "↖"; }
                    if (v2.eq(d["↑"], particle.velocity)) { return "↑"; }
                })()
                : "*"}
            onChange={(ev) => {
                const x = ev.target.value;
                if (x === "*") {
                    setParticle(update(particle, {
                        $unset: ["velocity"],
                    }));
                } else if (x === "∙") {
                    setParticle(update(particle, {
                        velocity: { $set: v2.zero() },
                    }));
                } else {
                    const d = hax.direction.flat60;
                    const xk = x as keyof typeof d;
                    setParticle(update(particle, {
                        velocity: { $set: d[xk] as v2 },
                    }));
                }
            }}
        >
            <option value="*">*</option>
            {particle.content !== "gamma"
                && <option value="∙">∙</option>}
            <option value="↗">↗</option>
            <option value="↘">↘</option>
            <option value="↓">↓</option>
            <option value="↙">↙</option>
            <option value="↖">↖</option>
            <option value="↑">↑</option>
        </select>
    </span>;
}
