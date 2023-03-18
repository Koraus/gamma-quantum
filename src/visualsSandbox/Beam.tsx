import { CameraControls, GizmoHelper, GizmoViewport, Grid, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import { Group, InstancedMesh, Material, MeshBasicMaterial, ShaderChunk, SphereGeometry, WebGLRenderTarget, WebGLRenderer } from "three";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";
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

const fsQuad = new FullScreenQuad();
export const renderFsQuad = (
    renderer: WebGLRenderer,
    material: Material,
    buffer: WebGLRenderTarget,
) => {
    fsQuad.material = material;
    const originalRenderTarget = renderer.getRenderTarget();
    if (buffer) { renderer.setRenderTarget(buffer); }
    fsQuad.render(renderer);
    renderer.setRenderTarget(originalRenderTarget);
};

const particleSystemChunk = /*glsl*/`
${randomChunk}
${easingChunk}
${zoneChunk}
${transformChunk}

mat4 emitterTransform(float timeSec) {
  return translate(vec3(-250.0 + 500.0 * fract(timeSec * 0.2), 10.0, 0.0));
}

// Calculates a transform of a single particle at a given time of its lifespan 
// given the myRand is procedurally seeded per particle
// @ particleTimeSec - time in [0, lifeSec) 
// @ t - phase in [0, 1),
// @ iteration - an integer iteration of particle instance (each iteration seeds another particle)
mat4 particleTransform(in float particleTimeSec, in float t, in float iteration) {
  return identity
    // * translate(vec3(t * 30.0, 0.0, 0.0))
    * scale(mix(vec3(1.0), vec3(randomInRange(0.0, 3.0)), abs(sin(t * PI * 5.0))))
    // * translate(randomInBoxZone(vec3(0.0, -2.0, -2.0), vec3(0.0, 2.0, 2.0))) // initial position in a (flat) box
    * translate(vec3(0.0, randomInBallZone().yz) * 2.0) // initial position in a ball
    * scale(mix(vec3(0.0), vec3(randomInRange(0.05, 0.1)), abs(sin(t * PI * 5.0))))
    * identity;
}

// Prepares particle iteration variables, seeds the random, returns particle transform
mat4 particleMain(in float timeSec, in float seed, bool debug) {
  // if (debug) { return emitterTransform(timeSec); }
  if (gl_InstanceID < 10) {
    return identity
      * translate(vec3(-250.0 + 500.0 * fract((timeSec + float(gl_InstanceID) + 0.5) * 0.2), 10.0, 0.0))
      * scale(vec3(1.0))
      * identity;
  }
  randomSeed = seed;
  float lifeSec = randomInRange(5.0, 5.0);
  float initialLifeOffsetSec = randomInRange(-lifeSec, 0.0);
  float iterationWithPhase = (timeSec + initialLifeOffsetSec) / lifeSec;
  float iteration = floor(iterationWithPhase);
  float t = fract(iterationWithPhase);
  float particleTimeSec = t * lifeSec;
  float emissionTimeSec = timeSec - particleTimeSec;
  float iterationSeed = fract(iteration * 1e-10);
  randomSeed = fract(randomSeed + iterationSeed); // reseed rand for every iteration
  return emitterTransform(emissionTimeSec) * particleTransform(particleTimeSec, t, iteration);
}
`;

const count = 2 ** 10;

export function BeamImpl() {
    const ref = useRef<Group>(null);
    useEffect(() => {
        const g = ref.current;
        if (!g) { return; }

        const material = new MeshBasicMaterial({
            color: "#c17dff",
        });
        const x = particleSystemChunk;
        material.onBeforeCompile = (shader) => {
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

        const geometry = new SphereGeometry();

        const obj = new InstancedMesh(geometry, material, count);
        obj.position.x = 250;
        obj.position.z = -1;
        const objG = new Group();
        objG.add(obj);
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
        obj3.position.z = 1;
        const objG3 = new Group();
        objG3.add(obj3);
        objG3.rotation.y = -Math.PI;
        g.add(objG3);

        const update = () => {
            material.userData.shader.uniforms.timeSec.value =
                performance.now() * 0.001;
            h = requestAnimationFrame(update);
        }
        let h = requestAnimationFrame(update);

        () => {
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
    }, [ref.current]);

    return <group ref={ref}></group>;
}

export function Beam() {
    const { x } = useControls({
        x: { min: 0, value: 35, max: 100, step: 1 },
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
            <Grid
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

            <BeamImpl />
        </Canvas>
    </div>;
}