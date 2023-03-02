import { Plane } from "@react-three/drei";

export function HexGrid({
    ...props
}: Parameters<typeof Plane>[0]) {
    return <Plane
        scale={[100, 100, 1]}
        rotation={[-Math.PI / 2, 0, 0]}
        {...props   }
    >
        <shaderMaterial
            transparent
            vertexShader={/*glsl*/`
varying vec2 vUv;

void main()	{
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
        `}
            fragmentShader={/*glsl*/`
varying vec2 vUv;

vec2 flatCartToAxial(vec2 v) {
    const mat2x2 flatCartToAxialMatrix = mat2x2(
        2.0/3.0, -1.0/3.0,
        0.0, sqrt(3.0)/3.0);

    return flatCartToAxialMatrix * v;
}

vec3 cubeRound(vec2 v) {
    float s1 = -v.x-v.y;
    float q = round(v.x);
    float r = round(v.y);
    float s = round(s1);

    float q_diff = abs(q - v.x);
    float r_diff = abs(r - v.y);
    float s_diff = abs(s - s1);

    if (q_diff > r_diff && q_diff > s_diff) {
        q = -r-s;
    } else if (r_diff > s_diff) {
        r = -q-s;
    } else {
        s = -q-r;
    }

    return vec3(q, r, s);
}

float max3(vec3 v) { return max(max(v.x, v.y), v.z); }

void main() {
    vec2 xy = (vUv - 0.5) * 2.0 * 50.0 * sqrt(3.0);
    vec2 _h = flatCartToAxial(xy);
    vec3 h = vec3(_h, -_h.x-_h.y);
    vec3 hr = cubeRound(_h);
    vec3 t = h - hr;
    vec3 at = abs(t);
    gl_FragColor = vec4(
        1.0,
        1.0,
        1.0,
        0.1 * float((max3(at + vec3(at.y, at.z, at.x)) > 0.98)));
}
        `} />
    </Plane>;
}
