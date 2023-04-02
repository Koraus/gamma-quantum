import { v2 } from "../../utils/v";
import { GroupProps } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { CanvasTexture, DataTexture, MeshPhysicalMaterial, Plane, RepeatWrapping, ShaderChunk, Texture, Vector2, Vector3 } from "three";
import * as hax from "../../utils/hax";
import { _throw } from "../../utils/_throw";
import { GroupSync } from "../../utils/GroupSync";


const y0Plane = new Plane(new Vector3(0, 1, 0), 0);

const createCanvas = (draw: (ctx: CanvasRenderingContext2D) => void) => {
    const resolution = 64;
    const c = document.createElement("canvas");
    c.height = resolution;
    c.width = c.height * Math.sqrt(3);
    const ctx = c.getContext("2d");
    if (!ctx) { _throw("No 2d context"); }

    draw(ctx);

    return c;
};

function strokeHexGridTile(
    ctx: CanvasRenderingContext2D,
    d = ctx.canvas.height,
) {
    const halfOfHexagon = (cx: number, cy: number, r: number) => {
        const { cos, sin, PI } = Math;
        ctx.moveTo(
            cx + r * sin((-0.5) / 3 * PI),
            cy - r * cos((-0.5) / 3 * PI));
        for (let i = 0; i < 3; i++) {
            ctx.lineTo(
                cx + r * sin((i + 0.5) / 3 * PI),
                cy - r * cos((i + 0.5) / 3 * PI));
        }
    };

    for (const h of [[0, 0], [1, 0], [0, 1], [2, 0], [1, -1]] as const) {
        const [cx, cy] = hax.toFlatCart(h);
        ctx.beginPath();
        halfOfHexagon(cx * d, (cy + 0.25) * d, d / Math.sqrt(3));
        ctx.stroke();
    }
}

const haxShaderChunk = /*glsl*/`/* start haxShaderChunk */
const mat2x2 flatCartToAxialMatrix = mat2x2(
    2.0 / sqrt(3.0), -1.0 / sqrt(3.0), 0.0, 1.0);
const mat2x2 axialToFlatCartMatrix = inverse(flatCartToAxialMatrix);
vec2 cubeRound(vec2 v) {
    vec3 h = vec3(v, -v.x - v.y);
    vec3 rh = round(h);
    vec3 diff = abs(rh - h);

    if (diff.x > diff.y && diff.x > diff.z) {
        return vec2(-rh.y - rh.z, rh.y);
    } else if (diff.y > diff.z) {
        return vec2(rh.x, -rh.x - rh.z);
    } else {
        return rh.xy;
    }
}
/* end haxShaderChunk */`;

function procSampler_normal_fragment_maps(
    fragmentShader: string,
    sampler: (varName: string) => string,
) {
    const chunk = ShaderChunk["normal_fragment_maps"]
        .replaceAll(
            "vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;",
            sampler("mapN"));
    return fragmentShader
        .replaceAll("#include <normal_fragment_maps>", chunk);
}

const createMaterial = ({
    size,
    positions,
    positionsMode,
}: {
    size: number,
    positions: v2[],
    positionsMode: "ban" | "allow",
}) => {

    const setSampler = <T extends Texture>(txt: T) => {
        txt.wrapS = RepeatWrapping;
        txt.wrapT = RepeatWrapping;
        txt.repeat.set(size / Math.sqrt(3), size);
        txt.offset
            .set(0, -0.25)
            .addScaledVector(txt.repeat, -0.5);

        return txt;
    };

    const m = new MeshPhysicalMaterial({
        color: "#030d20",
        roughness: 1,
        metalness: 1,
        metalnessMap: setSampler(new CanvasTexture(createCanvas((ctx) => {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.lineWidth = 1;
            ctx.strokeStyle = "#fafafa";
            strokeHexGridTile(ctx);
        }))),
        roughnessMap: setSampler(new CanvasTexture(createCanvas((ctx) => {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.lineWidth = 1;
            ctx.strokeStyle = "#fafafa";
            strokeHexGridTile(ctx);
        }))),
        emissiveIntensity: 0.005,
        emissive: "white",
        emissiveMap: setSampler(new CanvasTexture(createCanvas((ctx) => {
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.lineWidth = 1;
            ctx.strokeStyle = "#ffffff";
            strokeHexGridTile(ctx);
        }))),

        // fake texture to trgigger procedural normalMap usage
        normalMap: new DataTexture(),
    });
    m.onBeforeCompile = shader => {
        shader.vertexShader = shader.vertexShader
            .replaceAll(
                "void main() {",
                /*glsl*/`
varying vec3 vWorldPosition;
void main() {`)
            .replaceAll(
                "}",
                `vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
}`);
        // console.log(shader.vertexShader);

        shader.fragmentShader = shader.fragmentShader
            .replaceAll(
                "void main() {",
                /*glsl*/`
${haxShaderChunk}
varying vec3 vWorldPosition;

void main() {
    // vec2 hexPosFrac = 
        // flatCartToAxialMatrix * vec2(-vUv.x * sqrt(3.0), vUv.y + 0.25);
    vec2 hexPosFrac = flatCartToAxialMatrix * vWorldPosition.xz;
    vec2 hexPos = cubeRound(hexPosFrac);
    vec2 hexFrac = hexPosFrac - hexPos;
    vec3 at3 = abs(vec3(hexFrac, -hexFrac.x - hexFrac.y));
    at3 += vec3(at3.y, at3.z, at3.x);
    float hexFracDist = max(at3.x, max(at3.y, at3.z));
    
    bool canBuild = ${positionsMode === "allow" ? "false" : "true"};
    if (false${positions
                    .map(([x, y]) => ` || (hexPos == vec2(${x}.0, ${y}.0))`)
                    .join("")
                }) {
        canBuild = !canBuild;
    }
`,
            )
            .replaceAll(
                "vec4 diffuseColor = vec4( diffuse, opacity );",
                /*glsl*/`
    vec4 diffuseColor = vec4( diffuse, opacity );

    if (!canBuild) {
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.05), 0.08);
    } else {
        if (hexFracDist > 0.7) {
            diffuseColor.rgb *= (0.9 + hexFracDist * 0.3);
        }
    }
`,
            );

        shader.fragmentShader = procSampler_normal_fragment_maps(
            shader.fragmentShader,
            varName => /*glsl*/`
    vec2 cartFrac = axialToFlatCartMatrix * hexFrac;
    vec3 ${varName} = (hexFracDist > (canBuild ? 0.7 : 0.97))
        ? vec3(0.0, 0.0, 1.0)
        : vec3(cartFrac.x, -cartFrac.y, 2.5 / hexFracDist / hexFracDist);
 `);

        // console.log(shader.fragmentShader);
    };

    return m;
};

const roundCartXzAsHexInPlace = (p: Vector3) => {
    const p1 = hax.toFlatCart(hax.round(hax.fromFlatCart([p.x, p.z])));
    p.set(p1[0], 0, p1[1]);
};

export function HexGrid({
    positions,
    positionsMode,
    ...props
}: {
    positions: v2[],
    positionsMode: "ban" | "allow",
} & GroupProps) {
    const size = 3000;
    const gridMatrial = useMemo(
        () => createMaterial({ size, positions, positionsMode }),
        [size, positions, positionsMode]);
    useEffect(() => () => gridMatrial.dispose(), [gridMatrial]);

    return <group {...props} >
        <GroupSync onFrame={(g, { camera, raycaster }) => {
            if (!g.parent) { return; }

            raycaster.setFromCamera(new Vector2(0, 0), camera);
            raycaster.ray.intersectPlane(y0Plane, g.position);
            roundCartXzAsHexInPlace(g.position);
            g.parent.worldToLocal(g.position);
        }}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[size / 2, 16]} />
                <primitive
                    attach="material"
                    object={gridMatrial}
                />
            </mesh>
        </GroupSync>
        <GroupSync onFrame={(g, { raycaster, pointer, camera }) => {
            if (!g.parent) { return; }

            raycaster.setFromCamera(pointer, camera);
            raycaster.ray.intersectPlane(y0Plane, g.position);
            g.parent.worldToLocal(g.position);
        }}>
            <pointLight
                position={[0, 2, 0]}
                intensity={1}
                power={1000}
                color={"#ffffff"}
            >
                {/* <Box /> */}
            </pointLight>
        </GroupSync>
    </group>;
}
