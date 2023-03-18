export const zoneChunk = /*glsl*/`
vec3 randomInBoxZone(vec3 a, vec3 b) {
  return vec3(
    randomInRange(a.x, b.x),
    randomInRange(a.y, b.y),
    randomInRange(a.z, b.z)
  );
}
vec3 randomInBallZone() {
  // based on https://stackoverflow.com/a/54544972/2224730
  return randomDir3() * pow(random(), 1.0 / 3.0);
}
`;