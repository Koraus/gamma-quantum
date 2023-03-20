import { CameraControls, GizmoHelper, GizmoViewport, Grid, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import { AddEquation, AdditiveBlending, BackSide, BufferGeometryUtils, Color, CustomBlending, CylinderGeometry, DstAlphaFactor, Group, InstancedMesh, Material, Mesh, MeshBasicMaterial, OneMinusSrcAlphaFactor, PlaneGeometry, ShaderChunk, ShaderMaterial, SphereGeometry, SrcAlphaFactor, WebGLRenderTarget, WebGLRenderer } from "three";
// import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";
import { randomChunk } from "./shaderChunks/randomChunk";
import { easingChunk } from "./shaderChunks/easingChunk";
import { zoneChunk } from "./shaderChunks/zoneChunk";
import { transformChunk } from "./shaderChunks/transformChunk";
import { useEffect, useRef } from "react";
import { noise2DChunk } from "./shaderChunks/noise2DChunk";
import { noise3DChunk } from "./shaderChunks/noise3DChunk";

// based on https://github.com/mrdoob/three.js/blob/b9bc47ab1978022ab0947a9bce1b1209769b8d91/src/renderers/webgl/WebGLProgram.js#L204
export const resolveShaderIncludes = (string: string): string =>
    string.replace(
        /^[ \t]*#include +<([\w\d./]+)>/gm,
        (_, include) => resolveShaderIncludes(ShaderChunk[include]));

export const toGlslFloatLiteral = (x: number) =>
    (x % 1 ? x.toString() : x.toFixed(1));

export const toGlslVecLiteral = (
    ...vec: [number, number]
        | [number, number, number]
        | [number, number, number, number]
) => `vec${vec.length}(${vec.map(toGlslFloatLiteral).join(", ")})`;

export function BeamImpl({
    timeSec,
    run,
}: {
    timeSec: number,
    run: boolean,
}) {
    const ref = useRef<Group>(null);
    useEffect(() => {
        const g = ref.current;
        if (!g) { return; }

        const g1 = new Group();
        g.add(g1);

        const material = new ShaderMaterial({
            // side: BackSide,
            depthWrite: false,
            transparent: true,
            uniforms: {
                timeSec: { value: timeSec },
            },
            vertexShader: /*glsl*/`
#include <common>
${noise3DChunk}
uniform float timeSec;
varying vec2 vUv;
varying vec3 transformedNormal;
varying float radiusFactor;
varying vec3 vPosition;

void main() {
    vec3 tPosition = position;
    tPosition += timeSec;
    radiusFactor = 1.0
        + 2.0 * abs(cos((position.y / 200.0)))
        + 0.3 * (snoise(tPosition * 0.1)
        + snoise(tPosition * 0.02) * 2.0);
    vec3 tPosition1 = vec3( 
        position.x * radiusFactor,
        position.y,
        position.z * radiusFactor);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( 
        tPosition1,
        1.0);

    vPosition = tPosition1;

    vUv = uv.xy;
    transformedNormal = normalize(vec3(position.x, 0.0, position.z));
    transformedNormal = normalMatrix * transformedNormal;
    transformedNormal = -transformedNormal;
}
`,
            fragmentShader: /*glsl*/`
#include <common>
${noise3DChunk}
uniform float timeSec;
varying vec2 vUv;
varying vec3 transformedNormal;
varying float radiusFactor;
varying vec3 vPosition;

void main() {
    if (transformedNormal.z < 0.0) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, abs(transformedNormal.z));
        return;
    }
    float a = pow(abs(transformedNormal.z - 0.1) * 0.8, 1.0);
    vec3 color = vec3(
        snoise(vPosition * 0.001)
        + snoise(vPosition * 0.02) * 2.0 * transformedNormal.x,
    a + snoise(vPosition * 0.1)
        + snoise(vPosition * 0.02) * 2.0 * transformedNormal.y,
    snoise(vPosition * 10.0)
        + snoise(vPosition * 1.2) * 2.0 * transformedNormal.z);
    color = (1.0 - color) * (1.0 - color);
    gl_FragColor = vec4(
        1.0, 1.0, 1.0,
        a *         
            (snoise(vPosition * 13.0)
            + snoise(vPosition * 0.21) * 2.0));
}
`,
        });
        const geometry = new CylinderGeometry(20, 20, 2500, 128, 1000, true);

        const obj = new Mesh(geometry, material);
        const objG = new Group();
        objG.add(obj);
        objG.position.y = 40;
        objG.rotation.x = Math.PI / 2;
        g1.add(objG);

        const star = new Mesh(
            new SphereGeometry(10),
            new MeshBasicMaterial(),
        );
        obj.add(star);


        const update = () => {
            if (run) {
                material.uniforms.timeSec.value = performance.now() * 0.001;
            }
            h = requestAnimationFrame(update);
        }
        let h = requestAnimationFrame(update);

        return () => {
            g.remove(g1);
            cancelAnimationFrame(h);
        };
    }, [ref.current, timeSec, run]);

    return <group position={[0, 10, 0]} ref={ref}></group>;
}

export function Beam2() {
    const { timeSec, run } = useControls({
        timeSec: { min: -1, value: 0, max: 1, step: 0.001 },
        run: false,
    });
    return <div css={{
        position: "fixed",
        inset: 0,
    }}>
        <Canvas>
            <PerspectiveCamera
                makeDefault
                fov={40}
                near={0.1}
                far={10000}
                position={[200, 200, 200]} />
            <CameraControls />
            <Grid renderOrder={-1}
                position={[0, -0.01, 0]}
                args={[100, 100]}
                infiniteGrid
                cellSize={10}
                cellThickness={1}
                cellColor={"#303030"}
                sectionSize={100}
                sectionThickness={1}
                sectionColor={"#410d5f"}
                fadeDistance={700}
            />

            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport />
            </GizmoHelper>

            <BeamImpl timeSec={timeSec} run={run} />
        </Canvas>
    </div>;
}