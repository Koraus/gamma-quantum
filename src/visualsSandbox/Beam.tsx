import { CameraControls, GizmoHelper, GizmoViewport, Grid, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import { AddEquation, AdditiveBlending, Color, CustomBlending, DstAlphaFactor, Group, InstancedMesh, Material, MeshBasicMaterial, OneMinusSrcAlphaFactor, PlaneGeometry, ShaderChunk, ShaderMaterial, SphereGeometry, SrcAlphaFactor, WebGLRenderTarget, WebGLRenderer } from "three";
// import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";
import { randomChunk } from "./shaderChunks/randomChunk";
import { easingChunk } from "./shaderChunks/easingChunk";
import { zoneChunk } from "./shaderChunks/zoneChunk";
import { transformChunk } from "./shaderChunks/transformChunk";
import { useEffect, useRef } from "react";


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

// const fsQuad = new FullScreenQuad();
// export const renderFsQuad = (
//     renderer: WebGLRenderer,
//     material: Material,
//     buffer: WebGLRenderTarget,
// ) => {
//     fsQuad.material = material;
//     const originalRenderTarget = renderer.getRenderTarget();
//     if (buffer) { renderer.setRenderTarget(buffer); }
//     fsQuad.render(renderer);
//     renderer.setRenderTarget(originalRenderTarget);
// };

const particleSystemChunk = /*glsl*/`
${randomChunk}
${easingChunk}
${zoneChunk}
${transformChunk}

mat4 emitterTransform(float timeSec) {
  return translate(vec3(-250.0 + 500.0 * fract(timeSec * 0.2), 0.0, 0.0));
}

// Calculates a transform of a single particle at a given time of its lifespan 
// given the myRand is procedurally seeded per particle
// @ particleTimeSec - time in [0, lifeSec) 
// @ t - phase in [0, 1),
// @ iteration - an integer iteration of particle instance (each iteration seeds another particle)
mat4 particleTransform(in float particleTimeSec, in float t, in float iteration) {
  return identity
    * translate(vec3(abs(sin((t - 0.5) * PI * 5.0) * sin((t - 0.5) * PI * 5.0)) * 15.0, 0.0, 0.0))
    * rotate(vec3(1.0, 0.0, 0.0), t * PI * 2.0 * randomInRange(-1.0, 15.0))
    * scale(mix(
        vec3(1.5), 
        vec3(randomInRange(1.0, 7.0)),
        abs(sin(t * PI * 5.0))))
    // * translate(randomInBoxZone(vec3(0.0, -2.0, -2.0), vec3(0.0, 2.0, 2.0))) // initial position in a (flat) box
    * translate(vec3(0.0, randomInBallZone().yz) * 2.0) // initial position in a ball
    * scale(mix(vec3(0.5), vec3(randomInRange(0.5, 3.0)), abs(sin(t * PI * 5.0))))
    * scale(vec3(0.2))
    * identity;
}

// Prepares particle iteration variables, seeds the random, returns particle transform
mat4 particleMain(in float timeSec, in float seed, bool debug) {
  // if (debug) { return emitterTransform(timeSec); }
  randomSeed = seed;
  float lifeSec = randomInRange(5.0, 5.0);
  float initialLifeOffsetSec = randomInRange(-lifeSec, 0.0);
  float iterationWithPhase = (timeSec + initialLifeOffsetSec) / lifeSec;
  float iteration = floor(iterationWithPhase);
  float t = fract(iterationWithPhase);
  float particleTimeSec = t * lifeSec;
  float emissionTimeSec = timeSec - particleTimeSec;
  float iterationSeed = fract(iteration * 1e-10);
  if (gl_InstanceID < 5) {
      return identity
      * rotate(vec3(1.0, 0.0, 0.0), timeSec * PI * sin(float(gl_InstanceID) / 4.0) * PI)
      * translate(vec3(-250.0 + 500.0 * fract((timeSec + float(gl_InstanceID) + 0.5) * 0.2), 1.0, 0.0))
      * scale(vec3(55.0))
      * identity;
  }
  randomSeed = fract(randomSeed + iterationSeed); // reseed rand for every iteration
  return emitterTransform(emissionTimeSec) * particleTransform(particleTimeSec, t, iteration);
}
`;

const count = 2 ** 15;

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

        const material = new ShaderMaterial({
            transparent: true,
            depthWrite: false,
            // blending: AdditiveBlending,
            // blending: CustomBlending,
            // blendEquation: AddEquation,
            // blendSrc: SrcAlphaFactor,
            // blendDst: DstAlphaFactor,
            uniforms: {
                timeSec: { value: timeSec },
            },
            vertexShader: /*glsl*/`
#include <common>
uniform float timeSec;
${particleSystemChunk} 
varying vec2 vUv;

void main() {
    mat4 instanceMatrix2 = particleMain(
        timeSec, 
        (1.0 + float(gl_InstanceID)) / ${toGlslFloatLiteral(count)},
        gl_InstanceID == 0);
    mat4 instanceModelMatrix = instanceMatrix2 * modelMatrix;
    
	vec4 mvPosition = 
        modelViewMatrix
        * instanceMatrix2
        * vec4(0.0, 0.0, 0.0, 1.0);
	vec2 scale = vec2(
        length((instanceMatrix2 * modelMatrix)[0].xyz), 
        length((instanceMatrix2 * modelMatrix)[1].xyz));
    mvPosition.xy += position.xy * scale;
	gl_Position = projectionMatrix * mvPosition;

    vUv = uv.xy;
}
`,
            fragmentShader: /*glsl*/`
varying vec2 vUv;

void main() {
    float r = length(vUv * 2.0 - 1.0);

    if (r < 0.33) {
        float t = r * r + 0.5;
        gl_FragColor = vec4( 
            5.0 * t * vec3(1.0, 0.2, 0.8), 
            1.0);
    } else {
        // discard;
        gl_FragColor = vec4( 
            vec3(1.0, 0.2, 0.8), 
            1.0 - r * r * 3.0);
    }
}
`,
        });
        const x = particleSystemChunk;
        material.onBeforeCompile = (shader) => {
            return;
            material.userData.shader = shader;
            shader.uniforms.timeSec = { value: 0 };
            shader.vertexShader = resolveShaderIncludes(shader.vertexShader)
                .replaceAll("instanceMatrix", "instanceMatrix2")
                .replace(
                    /*glsl*/"void main() {",
                    /*glsl*/`
uniform float timeSec;
${x} 
void main() { 
mat4 instanceMatrix2 = particleMain(
    timeSec, 
    (1.0 + float(gl_InstanceID)) / ${toGlslFloatLiteral(count)},
    gl_InstanceID == 0);
          `,
                );
        };

        const geometry = new PlaneGeometry();

        const obj = new InstancedMesh(geometry, material, count);
        obj.position.x = 250;
        const objG = new Group();
        objG.add(obj);
        objG.position.z = 1.5;
        objG.rotation.x = Math.PI * 0.66;
        objG.rotation.y = -Math.PI;
        g.add(objG);


        const obj1 = new InstancedMesh(geometry, material, count);
        obj1.position.x = -250;
        const objG1 = new Group();
        objG1.add(obj1);
        objG1.rotation.y = Math.PI * 0.66;
        g.add(objG1);


        const obj2 = new InstancedMesh(geometry, material, count);
        obj2.position.x = -250;
        const objG2 = new Group();
        objG2.add(obj2);
        objG2.rotation.y = -Math.PI * 0.66;
        g.add(objG2);


        const obj3 = new InstancedMesh(geometry, material, count);
        obj3.position.x = 250;
        const objG3 = new Group();
        objG3.add(obj3);
        objG3.position.z = -1.5;
        objG3.rotation.y = -Math.PI;
        g.add(objG3);

        const update = () => {
            if (run) {
                material.uniforms.timeSec.value = performance.now() * 0.001;
            }
            h = requestAnimationFrame(update);
        }
        let h = requestAnimationFrame(update);

        return () => {
            material.dispose();
            g.remove(objG);
            obj.dispose();
            g.remove(objG1);
            obj1.dispose();
            g.remove(objG2);
            obj2.dispose();
            g.remove(objG3);
            obj3.dispose();
            cancelAnimationFrame(h);
        };
    }, [ref.current, timeSec, run]);

    return <group position={[0, 10, 0]} ref={ref}></group>;
}

export function Beam() {
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