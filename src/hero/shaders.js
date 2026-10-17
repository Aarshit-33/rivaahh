// Shared GLSL. Every layer reads the same scroll progress (uP) and the same
// spine curve (uA → uC1 → uC2 → uB), so the card, ink, petals and light move as one.
// The card and its particles share thr()/relOf(): a pixel disappears from the card
// at exactly the moment its particle is released.
const COMMON = /* glsl */ `
  #define PI 3.14159265
  uniform float uP;
  uniform float uTime;
  uniform float uPx;
  uniform float uScale;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC1;
  uniform vec3 uC2;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  // 0 = dissolves first (right edge), 1 = dissolves last (left edge).
  float thr(vec2 uv) {
    float n = vnoise(uv * 5.0) * 0.6 + vnoise(uv * 13.0 + 7.0) * 0.4;
    return clamp((1.0 - uv.x) * 0.78 + (n - 0.5) * 0.42 + 0.11, 0.0, 1.0);
  }
  float relOf(float th) { return mix(0.22, 0.40, th); }
  vec3 bez(vec3 a, vec3 b, vec3 c, vec3 d, float t) {
    float it = 1.0 - t;
    return it * it * it * a + 3.0 * it * it * t * b + 3.0 * it * t * t * c + t * t * t * d;
  }
  vec3 rotAxis(vec3 v, vec3 k, float a) {
    float c = cos(a);
    float s = sin(a);
    return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c);
  }
  float easeIO(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }
`

export const CARD_VS = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const CARD_FS = /* glsl */ `
  ${COMMON}
  uniform sampler2D uMap;
  varying vec2 vUv;
  void main() {
    vec4 tx = texture2D(uMap, vUv);
    if (tx.a < 0.5) discard;
    float rel = relOf(thr(vUv));
    if (uP > rel) discard;
    // Burning edge: paper chars to maroon, then glows gold just before it lets go.
    float edge = 1.0 - smoothstep(0.0, 0.014, rel - uP);
    vec3 col = tx.rgb * (0.93 + 0.09 * vUv.y);
    col = mix(col, vec3(0.42, 0.08, 0.14), smoothstep(0.25, 0.7, edge));
    col = mix(col, vec3(1.0, 0.80, 0.46), smoothstep(0.78, 1.0, edge));
    gl_FragColor = vec4(col, 1.0);
  }
`

export const PART_VS = /* glsl */ `
  ${COMMON}
  uniform float uSize;
  uniform sampler2D uMap;
  attribute vec3 aCard;
  attribute vec3 aPhone;
  attribute vec2 aUv;
  attribute vec4 aRnd;
  varying vec3 vCol;
  varying float vA;
  varying float vGold;
  void main() {
    vec4 paper = texture2D(uMap, aUv);
    float rel = relOf(thr(aUv));
    float arr = rel + 0.40 + aRnd.x * 0.08;
    float t = clamp((uP - rel) / (arr - rel), 0.0, 1.0);
    float e = easeIO(t);
    float sq = sin(PI * e);

    vec3 spine = bez(uA, uC1, uC2, uB, e);
    vec3 off = mix(aCard, aPhone, smoothstep(0.6, 1.0, e));
    off *= 1.0 - 0.84 * sq;
    off = rotAxis(off, normalize(uB - uA), sq * (PI * 1.2 + aRnd.y * 0.8));

    vec3 rnd = aRnd.yzw - 0.5;
    vec3 spray = rnd * sq * (0.18 + pow(aRnd.x, 4.0) * 1.8);
    spray += vec3(
      sin(uTime * 1.3 + aRnd.x * 40.0 + e * 9.0),
      cos(uTime * 1.1 + aRnd.z * 40.0 + e * 7.0),
      sin(uTime * 0.8 + aRnd.w * 40.0)
    ) * 0.045 * sq;

    vec4 mv = modelViewMatrix * vec4(spine + off + spray, 1.0);
    gl_Position = projectionMatrix * mv;

    vec3 maroon = vec3(0.45, 0.10, 0.17) * (0.75 + aRnd.w * 0.5);
    vec3 gold = mix(vec3(1.0, 0.82, 0.50), vec3(1.0, 0.94, 0.78), aRnd.y);
    float toInk = smoothstep(0.0, 0.16, e);
    float toLight = smoothstep(0.40, 0.70, e) * step(0.32, aRnd.z);
    vCol = mix(mix(paper.rgb, maroon, toInk), gold, toLight);
    vGold = toLight;
    vA = step(rel, uP) * step(0.5, paper.a) * (1.0 - smoothstep(0.88, 1.0, t));

    float sz = uSize * (1.0 + sq * (0.6 + toLight * (1.5 + pow(aRnd.x, 3.0) * 5.0)));
    gl_PointSize = sz * uPx * (uScale / -mv.z);
  }
`

export const PART_FS = /* glsl */ `
  varying vec3 vCol;
  varying float vA;
  varying float vGold;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.2, d);
    float glow = pow(smoothstep(0.5, 0.0, d), 2.0) * 0.9 + smoothstep(0.12, 0.0, d) * 0.6;
    float a = mix(core, glow, vGold) * vA;
    if (a < 0.004) discard;
    vec3 col = vCol + vec3(0.25, 0.18, 0.08) * vGold * smoothstep(0.15, 0.0, d);
    gl_FragColor = vec4(col * a, a);
  }
`

export const PETAL_VS = /* glsl */ `
  ${COMMON}
  attribute vec3 aStart;
  attribute vec4 aRnd;
  varying float vA;
  varying float vRot;
  varying float vShade;
  void main() {
    float rel = 0.23 + aRnd.x * 0.24;
    float arr = rel + 0.30 + aRnd.y * 0.14;
    float t = clamp((uP - rel) / (arr - rel), 0.0, 1.0);
    float e = easeIO(t);
    float sq = sin(PI * e);

    // Petals ride the stream most of the way, then scatter instead of entering the phone.
    vec3 spine = bez(uA, uC1, uC2, uB, e * 0.74);
    vec3 rnd = aRnd.yzw - 0.5;
    vec3 spray = vec3(rnd.x * 1.6, rnd.y * 1.5, rnd.z * 1.4) * sq * (0.5 + aRnd.x * 0.8);
    spray += vec3(sin(uTime * 0.7 + aRnd.y * 30.0), cos(uTime * 0.6 + aRnd.z * 30.0), 0.0) * 0.08 * sq;
    spray.y -= t * t * 0.6 * aRnd.w;

    vec4 mv = modelViewMatrix * vec4(spine + aStart * (1.0 - e) + spray, 1.0);
    gl_Position = projectionMatrix * mv;

    vRot = aRnd.x * 6.2831 + uTime * (0.3 + aRnd.y * 0.9) * sign(aRnd.z - 0.5) + e * 5.0;
    vShade = aRnd.w;
    vA = step(rel, uP) * smoothstep(0.0, 0.06, t) * (1.0 - smoothstep(0.5, 0.82, t));
    float sz = mix(5.0, 10.0 + aRnd.y * 16.0, smoothstep(0.0, 0.2, t));
    gl_PointSize = sz * uPx * (uScale / -mv.z);
  }
`

export const PETAL_FS = /* glsl */ `
  uniform sampler2D uPetal;
  varying float vA;
  varying float vRot;
  varying float vShade;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float cs = cos(vRot);
    float sn = sin(vRot);
    c = mat2(cs, -sn, sn, cs) * c + 0.5;
    if (c.x < 0.0 || c.x > 1.0 || c.y < 0.0 || c.y > 1.0) discard;
    vec4 tx = texture2D(uPetal, c);
    float a = tx.a * vA;
    if (a < 0.01) discard;
    gl_FragColor = vec4(tx.rgb * (0.8 + vShade * 0.4) * a, a);
  }
`

export const SMOKE_VS = /* glsl */ `
  ${COMMON}
  attribute vec4 aRnd;
  varying float vA;
  varying vec3 vCol;
  varying float vRot;
  void main() {
    float rel = 0.24 + aRnd.x * 0.20;
    float arr = rel + 0.42;
    float t = clamp((uP - rel) / (arr - rel), 0.0, 1.0);
    float e = easeIO(t);
    float sq = sin(PI * e);

    vec3 rnd = aRnd.yzw - 0.5;
    vec3 off = rotAxis(vec3(0.0, rnd.y * 0.5, rnd.z * 0.5), normalize(uB - uA), e * 6.0 + aRnd.x * 6.0);
    off += rnd * vec3(0.25, 0.15, 0.2);
    off += vec3(sin(uTime * 0.5 + aRnd.y * 20.0), cos(uTime * 0.4 + aRnd.z * 20.0), 0.0) * 0.05;

    vec4 mv = modelViewMatrix * vec4(bez(uA, uC1, uC2, uB, e) + off * sq * 1.2, 1.0);
    gl_Position = projectionMatrix * mv;

    float light = smoothstep(0.45, 0.8, e);
    vCol = mix(vec3(0.40, 0.07, 0.13) * (0.8 + aRnd.w * 0.4), vec3(0.85, 0.45, 0.35), light * 0.5);
    vA = step(rel, uP) * pow(sq, 1.5) * (0.07 + aRnd.y * 0.07) * (1.0 - light * 0.6);
    vRot = aRnd.z * 6.28 + uTime * 0.1;
    gl_PointSize = (40.0 + aRnd.z * 90.0) * (0.5 + sq * 0.7) * uPx * (uScale / -mv.z);
  }
`

export const SMOKE_FS = /* glsl */ `
  uniform sampler2D uBlob;
  varying float vA;
  varying vec3 vCol;
  varying float vRot;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float cs = cos(vRot);
    float sn = sin(vRot);
    c = mat2(cs, -sn, sn, cs) * c + 0.5;
    float a = texture2D(uBlob, c).a * vA;
    if (a < 0.003) discard;
    gl_FragColor = vec4(vCol * a, a);
  }
`

export const SPARK_VS = /* glsl */ `
  ${COMMON}
  attribute vec4 aRnd;
  attribute float aS;
  varying float vA;
  void main() {
    vec3 base = bez(uA, uC1, uC2, uB, clamp(aS, 0.0, 1.0));
    vec3 rnd = aRnd.yzw - 0.5;
    vec3 pos = base + rnd * vec3(1.4, 1.1, 1.0) * (0.3 + aRnd.x * 0.9);
    pos += vec3(sin(uTime * 0.3 + aRnd.x * 10.0), cos(uTime * 0.25 + aRnd.y * 10.0), 0.0) * 0.06;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float appear = smoothstep(0.44 + aS * 0.18, 0.54 + aS * 0.18, uP);
    float settle = 1.0 - 0.6 * smoothstep(0.9, 1.0, uP);
    float twinkle = 0.55 + 0.45 * sin(uTime * (1.2 + aRnd.y * 2.5) + aRnd.z * 40.0);
    vA = appear * settle * twinkle;
    gl_PointSize = (3.0 + pow(aRnd.w, 3.0) * 30.0) * uPx * (uScale / -mv.z);
  }
`

export const SPARK_FS = /* glsl */ `
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = (pow(smoothstep(0.5, 0.0, d), 2.0) * 0.7 + smoothstep(0.1, 0.0, d)) * vA;
    a = min(a, 1.0);
    if (a < 0.004) discard;
    gl_FragColor = vec4(vec3(1.0, 0.84, 0.55) * a, a);
  }
`

// Gold dust released when the rotary telephone dissolves (frame 05 → 06).
export const BURST_VS = /* glsl */ `
  ${COMMON}
  uniform vec3 uOld;
  uniform vec2 uOldSize;
  attribute vec4 aRnd;
  varying float vA;
  void main() {
    float t = clamp((uP - 0.525 - aRnd.x * 0.02) / 0.1, 0.0, 1.0);
    vec3 start = uOld + vec3((aRnd.y - 0.5) * uOldSize.x, (aRnd.z - 0.5) * uOldSize.y, 0.0);
    vec3 dir = normalize(vec3(aRnd.y - 0.5, aRnd.z - 0.3, aRnd.w - 0.5) + 1e-4);
    vec3 pos = start + dir * t * (0.35 + aRnd.w * 0.6) + vec3(0.0, t * t * 0.4, 0.0);
    pos += vec3(sin(uTime * 2.0 + aRnd.x * 30.0), cos(uTime * 1.7 + aRnd.y * 30.0), 0.0) * 0.02 * t;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    vA = step(0.001, t) * sin(PI * t);
    gl_PointSize = (2.5 + pow(aRnd.w, 2.0) * 9.0) * uPx * (uScale / -mv.z);
  }
`
