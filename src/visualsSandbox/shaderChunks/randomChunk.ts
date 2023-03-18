import { randomBySpatialChunk } from "./randomBySpatialChunk";


export const randomChunk = /*glsl*/`
${randomBySpatialChunk}
float randomSeed = 0.0;
float random() { return randomSeed = _random(randomSeed); }
float randomInRange(float a, float b) {
  return mix(a, b, random());
}
vec3 randomDir3() {
  // based on https://github.com/mrdoob/three.js/blob/b4b756539e0e8c3e49d13cee062c77156a1cdd5d/src/math/Vector3.js#L686
  float u = randomInRange(-1.0, 1.0);
  float t = randomInRange(0.0, PI2);
  float f = sqrt(1.0 - u*u);
  return vec3(f * cos(t), f * sin(t), u);
}
`;