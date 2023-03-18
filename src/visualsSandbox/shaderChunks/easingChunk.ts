export const easingChunk = /*glsl*/`
float easeInQuad(float t) { return t * t; }
float easeOutQuad(float t) { return t * (2.0 - t); }
`;