/* =====================================================================
   Les Gaufres de Marie — 3D scenes (Three.js)
   Scene 1: hero waffle with endlessly pouring chocolate  (#bg)
   Scene 2: realistic animated food truck                 (#truck-canvas)
   ===================================================================== */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const CORAL = 0xE8394A;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Detect weak devices so the demo never janks on budget phones.
const LOW_END = (() => {
  try {
    if (/[?&](lite|low)=?1?/.test(location.search)) return true;  // force lightweight mode for testing/demo
    const gl = document.createElement('canvas').getContext('webgl') || document.createElement('canvas').getContext('experimental-webgl');
    if (!gl) return true;                                   // no WebGL at all
    const mem = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    const mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (mem <= 3) return true;
    if (mobile && cores <= 4) return true;
    return false;
  } catch (e) { return true; }
})();
const HERO_DPR = LOW_END ? 1 : Math.min(devicePixelRatio, 2);
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
// glossy melted dark chocolate
const choc = () => new THREE.MeshPhysicalMaterial({ color: 0x2a1206, roughness: 0.09, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.05, reflectivity: 0.6, sheen: 0.5, sheenRoughness: 0.3, sheenColor: new THREE.Color(0x8a4a22), envMapIntensity: 1.7, specularIntensity: 1.0 });
const soft = (peak) => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, `rgba(255,255,255,${peak})`); g.addColorStop(.4, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); };
// cheap deterministic hash noise for organic surface variation
const hash2 = (x, z) => { const n = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return n - Math.floor(n); };
// fine grain bump texture for the waffle crust (gives it a baked, non-plastic look)
function crumbTex() {
  const s = 256, c = document.createElement('canvas'); c.width = c.height = s; const x = c.getContext('2d');
  x.fillStyle = '#808080'; x.fillRect(0, 0, s, s);
  const img = x.getImageData(0, 0, s, s), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const v = 128 + (Math.random() - 0.5) * 110; d[i] = d[i + 1] = d[i + 2] = v; }
  x.putImageData(img, 0, 0);
  // soften into blotches for a crumb feel
  x.globalAlpha = 0.5; for (let k = 0; k < 240; k++) { const r = 2 + Math.random() * 5; x.fillStyle = Math.random() > .5 ? '#aaa' : '#5a5a5a'; x.beginPath(); x.arc(Math.random() * s, Math.random() * s, r, 0, 7); x.fill(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(7, 7); return t;
}

/* ===================== HERO WAFFLE ===================== */
(function hero() {
  const canvas = document.getElementById('bg'); if (!canvas) return;
  let renderer, scene, cam, clock, grp, pool, steam, sData = [], drips = [], pours = [];
  const pt = { value: 0 }; const tp = { x: 0, y: 0 }, pp = { x: 0, y: 0 };

  try { init(); animate(); } catch (e) { console.error('hero webgl', e); canvas.style.display = 'none'; document.body.style.background = '#E8394A'; }

  function init() {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(HERO_DPR); renderer.setSize(innerWidth, innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15; renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene = new THREE.Scene(); scene.background = new THREE.Color(CORAL);
    const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    cam = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 100); cam.position.set(0, 1.7, 11); cam.lookAt(0, -0.2, 0);
    clock = new THREE.Clock();
    backdrop(); lights();
    grp = new THREE.Group(); scene.add(grp);
    waffle(); poolMesh(); pour(); dripsBuild(); steamBuild(); shadow();
    addEventListener('resize', () => { cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(HERO_DPR); });
    if (!reduce) addEventListener('pointermove', e => { tp.x = e.clientX / innerWidth - .5; tp.y = e.clientY / innerHeight - .5; });
  }
  function backdrop() {
    const c = document.createElement('canvas'); c.width = 64; c.height = 512; const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, '#ff5e6e'); g.addColorStop(.42, '#ec3d4e'); g.addColorStop(1, '#b91f2d');
    x.fillStyle = g; x.fillRect(0, 0, 64, 512); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const p = new THREE.Mesh(new THREE.PlaneGeometry(80, 50), new THREE.MeshBasicMaterial({ map: t })); p.position.set(0, 0, -12); scene.add(p);
  }
  function lights() {
    scene.add(new THREE.AmbientLight(0xffe9d6, .28));
    const k = new THREE.DirectionalLight(0xfff3e0, 3.0); k.position.set(5, 9, 7); scene.add(k);          // warm key
    const w = new THREE.PointLight(0xffb060, 1.5, 40); w.position.set(-4, 3, 6); scene.add(w);            // warm fill
    const r = new THREE.SpotLight(0xfff0d8, 3.2, 45, Math.PI / 6, .6, 1); r.position.set(-5, 9, 5); r.target.position.set(0, 0, .5); scene.add(r); scene.add(r.target); // glossy highlight on chocolate
    const rim = new THREE.DirectionalLight(0xffd0a0, 1.4); rim.position.set(-7, 4, -6); scene.add(rim);   // rim/separation
    const f = new THREE.PointLight(0xff7a6a, .7, 30); f.position.set(4, -2, 4); scene.add(f);             // coral bounce
  }
  function pocket(x, z, cells) {
    const c = Math.SQRT1_2, rx = (x - z) * c, ry = (x + z) * c, u = rx * cells, v = ry * cells;
    const fu = u - Math.floor(u), fv = v - Math.floor(v), cx = Math.abs(fu - .5) * 2, cy = Math.abs(fv - .5) * 2;
    return smooth(.34, .92, Math.max(cx, cy));
  }
  function waffle() {
    const R = 2.7, RINGS = LOW_END ? 90 : 200, SEGS = LOW_END ? 160 : 320, RIDGE = .46, cells = .95;
    const pos = [], col = [], uv = [], idx = [];
    // realistic baked-waffle palette: deep toasted pockets -> golden ridges -> caramelised crowns -> dark rim
    const pocketDk = new THREE.Color(0x6b3c12), pocketLt = new THREE.Color(0xB9742C),
          ridge = new THREE.Color(0xE7A856), crown = new THREE.Color(0xF6CC84), edge = new THREE.Color(0x9c5a1d);
    for (let i = 0; i <= RINGS; i++) for (let j = 0; j <= SEGS; j++) {
      const rr = i / RINGS, a = j / SEGS * Math.PI * 2, sc = 1 + .018 * Math.sin(a * 18), r = rr * R * sc;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const hp = pocket(x, z, cells), t = smooth(.8, 1, rr);
      const rim = Math.sin(Math.min(t, 1) * Math.PI) * .32, ed = smooth(.94, 1, rr) * .6;
      // organic micro-relief so it isn't perfectly smooth/plastic
      const micro = (hash2(x * 9, z * 9) - .5) * .03 + (hash2(x * 28, z * 28) - .5) * .015;
      pos.push(x, hp * RIDGE * (1 - t * .6) + rim * RIDGE - ed + micro * (1 - t), z);
      // colour: pocket depth ramp + caramelised crowns on ridge tops + toasted rim, with mottling
      const c2 = pocketDk.clone().lerp(pocketLt, smooth(0, .45, hp));
      c2.lerp(ridge, smooth(.35, .8, hp));
      c2.lerp(crown, smooth(.85, 1, hp) * .8);            // shiny caramel crowns
      const ao = .72 + .28 * smooth(.1, .8, hp);          // bake ambient occlusion in the pockets
      c2.multiplyScalar(ao * (.93 + .14 * hash2(x * 6, z * 6)));
      c2.lerp(edge, t * .75);                              // browned outer rim
      col.push(c2.r, c2.g, c2.b);
      uv.push(j / SEGS, i / RINGS);
    }
    const st = SEGS + 1;
    for (let i = 0; i < RINGS; i++) for (let j = 0; j < SEGS; j++) { const a = i * st + j, b = a + 1, c = a + st, d = c + 1; idx.push(a, c, b, b, c, d); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    const bump = crumbTex();
    grp.add(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .78, metalness: .02, envMapIntensity: .35, bumpMap: bump, bumpScale: LOW_END ? .015 : .03, side: THREE.DoubleSide })));
    const T = .92;
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xB9742C, roughness: .82, metalness: .02, envMapIntensity: .3, bumpMap: bump, bumpScale: .02 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(R * .99, R * .86, T, 96, 1), bodyMat);
    body.position.y = -T / 2 + .02; grp.add(body);
    const u = new THREE.Mesh(new THREE.CircleGeometry(R * .86, 64), new THREE.MeshStandardMaterial({ color: 0x8a4f1e, roughness: .9 }));
    u.rotation.x = Math.PI / 2; u.position.y = -T + .02; grp.add(u);
    grp.userData = { R, topY: RIDGE + .3 * RIDGE };
  }
  function poolMesh() {
    const g = new THREE.CircleGeometry(1.55, 90), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), r = Math.hypot(x, y), an = Math.atan2(y, x), wob = 1 + .1 * Math.sin(an * 7) + .06 * Math.cos(an * 3); p.setX(i, x * wob); p.setY(i, y * wob); p.setZ(i, Math.cos(Math.min(r, 1.55) / 1.55 * Math.PI / 2) * .12); }
    g.computeVertexNormals(); g.rotateX(-Math.PI / 2); pool = new THREE.Mesh(g, choc()); pool.position.y = grp.userData.topY - .04; grp.add(pool);
  }
  function pour() {
    const topY = 7.8, botY = grp.userData.topY + .05;
    const path = new THREE.CatmullRomCurve3([new THREE.Vector3(.05, topY, .05), new THREE.Vector3(.05, topY * .6, .05), new THREE.Vector3(-.02, topY * .3, .04), new THREE.Vector3(0, botY + .6, .02), new THREE.Vector3(0, botY, 0)]);
    const m = choc(); m.onBeforeCompile = sh => { sh.uniforms.time = pt; sh.vertexShader = 'uniform float time;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>\ntransformed.x+=sin(position.y*5.0-time*6.0)*0.012;transformed.z+=cos(position.y*4.0-time*5.0)*0.01;`); };
    grp.add(new THREE.Mesh(new THREE.TubeGeometry(path, 140, .17, 24, false), m));
    const spoon = new THREE.Mesh(new THREE.SphereGeometry(.42, 24, 18), new THREE.MeshStandardMaterial({ color: 0xd8d8da, roughness: .25, metalness: .9, envMapIntensity: 1 })); spoon.scale.set(1.2, .5, 1); spoon.position.set(.05, 7.9, .05); grp.add(spoon);
    const sp = new THREE.Mesh(new THREE.SphereGeometry(.34, 32, 24), choc()); sp.scale.set(1.4, .55, 1.4); sp.position.y = botY; grp.add(sp);
    for (let k = 0; k < 5; k++) { const d = new THREE.Mesh(new THREE.SphereGeometry(.13, 16, 12), choc()); grp.add(d); pours.push({ mesh: d, top: topY - .5, bot: botY + .15, phase: k / 5, speed: .55 }); }
  }
  function dripsBuild() {
    const R = grp.userData.R, m = choc();
    [.9, 1.35, 1.8, 2.25, 2.7, 2.94].forEach(phi => {
      const x = Math.cos(phi) * R * .97, z = Math.sin(phi) * R * .78 + .4, len = .6 + Math.random() * .5;
      const s = new THREE.Mesh(new THREE.CapsuleGeometry(.085, len, 6, 12), m); s.position.set(x, -.1 - len * .4, z); grp.add(s);
      for (let k = 0; k < 2; k++) { const d = new THREE.Mesh(new THREE.SphereGeometry(.12, 16, 12), m); grp.add(d); drips.push({ mesh: d, x, z, yTop: -.2, yBot: -3.3 - Math.random() * .8, speed: .12 + Math.random() * .1, phase: Math.random() + k * .5, baseR: .1 + Math.random() * .05 }); }
    });
  }
  function steamBuild() {
    const N = LOW_END ? 28 : 80, t = soft(.9), g = new THREE.BufferGeometry(), a = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { const p = rs(); a[i * 3] = p.x; a[i * 3 + 1] = p.y; a[i * 3 + 2] = p.z; sData.push(p); }
    g.setAttribute('position', new THREE.BufferAttribute(a, 3));
    steam = new THREE.Points(g, new THREE.PointsMaterial({ map: t, color: 0xffffff, size: .95, transparent: true, opacity: .5, depthWrite: false })); grp.add(steam);
  }
  function rs() { return { x: (Math.random() - .5) * 3, y: grp.userData.topY + Math.random() * .5, z: (Math.random() - .5) * 3, vy: .4 + Math.random() * .5, sway: Math.random() * 6.28, sp: .6 + Math.random() * .8, life: 0, max: 3.5 + Math.random() * 2.5 }; }
  function shadow() {
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(90,10,18,.55)'); g.addColorStop(.6, 'rgba(90,10,18,.22)'); g.addColorStop(1, 'rgba(90,10,18,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    const s = new THREE.Mesh(new THREE.PlaneGeometry(8, 4.5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })); s.rotation.x = -Math.PI / 2; s.position.y = -2.7; grp.add(s);
  }
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime(), dt = Math.min(clock.getDelta(), .05); pt.value = t;
    if (!reduce) { grp.rotation.z = Math.sin(t * .5) * .04; grp.rotation.x = Math.sin(t * .4) * .025 - .02; grp.position.y = Math.sin(t * .7) * .08; }
    if (pool) { const s = 1 + Math.sin(t * .8) * .025; pool.scale.set(s, 1, s); }
    pours.forEach(d => { const c = (t * d.speed + d.phase) % 1; d.mesh.position.set(.04 * Math.sin(t * 3 + d.phase * 6), d.top - c * (d.top - d.bot), .03); const s = .8 + c * .5; d.mesh.scale.set(s, s * 1.3, s); });
    drips.forEach(d => { const c = (t * d.speed + d.phase) % 1, y = d.yTop - c * (d.yTop - d.yBot), fd = 1 - smooth(.8, 1, c), r = d.baseR * fd; d.mesh.position.set(d.x, y, d.z); d.mesh.scale.set(r * 7, r * 7 * (1 + c * 1.6), r * 7); d.mesh.visible = fd > .02; });
    if (steam) { const a = steam.geometry.attributes.position.array; for (let i = 0; i < sData.length; i++) { const p = sData[i]; p.life += dt; p.y += p.vy * dt; p.x += Math.sin(t * p.sp + p.sway) * .6 * dt; if (p.life > p.max) Object.assign(p, rs()); a[i * 3] = p.x; a[i * 3 + 1] = p.y; a[i * 3 + 2] = p.z; } steam.geometry.attributes.position.needsUpdate = true; }
    pp.x += (tp.x - pp.x) * .04; pp.y += (tp.y - pp.y) * .04; cam.position.x = pp.x * 1.2; cam.position.y = 1.7 - pp.y * .8; cam.lookAt(0, -.1, 0);
    renderer.render(scene, cam);
  }
})();

/* ===================== FOOD TRUCK ===================== */
(function truck() {
  const canvas = document.getElementById('truck-canvas'); if (!canvas) return;
  let renderer, scene, cam, clock, grp, wheels = [], st, stData = [], vis = false, ready = false, sign;

  // On weak devices, skip the 2nd WebGL context entirely and show a static fallback.
  function showFallback() { canvas.style.display = 'none'; const fb = document.getElementById('truck-fallback'); if (fb) fb.style.display = 'block'; }
  if (LOW_END) { showFallback(); return; }
  if ('fonts' in document) document.fonts.ready.then(start); else start();
  function start() { try { init(); animate(); } catch (e) { console.error('truck webgl', e); showFallback(); } }

  function init() {
    const w = canvas.clientWidth || 900, h = canvas.clientHeight || 560;
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(w, h, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1; renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    cam = new THREE.PerspectiveCamera(34, w / h, .1, 100); cam.position.set(7, 3.1, 8.4); cam.lookAt(0, 1.2, 0);
    clock = new THREE.Clock();
    scene.add(new THREE.AmbientLight(0xfff2e0, .55));
    const key = new THREE.DirectionalLight(0xfff3df, 2.1); key.position.set(6, 10, 6); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -10; key.shadow.camera.right = 10; key.shadow.camera.top = 10; key.shadow.camera.bottom = -10; scene.add(key);
    const warm = new THREE.PointLight(0xffc488, .9, 40); warm.position.set(-5, 4, 5); scene.add(warm);
    const rim = new THREE.DirectionalLight(0xffd9c0, .9); rim.position.set(-6, 5, -6); scene.add(rim);
    grp = new THREE.Group(); scene.add(grp);
    build(); steamBuild(); ground();
    ready = true;
    addEventListener('resize', () => { const w = canvas.clientWidth, h = canvas.clientHeight; cam.aspect = w / h; cam.updateProjectionMatrix(); renderer.setSize(w, h, false); });
    new IntersectionObserver(es => { vis = es[0].isIntersecting; }, { threshold: .04 }).observe(document.getElementById('truck'));
  }

  function build() {
    const cream = new THREE.MeshStandardMaterial({ color: 0xF4E2C2, roughness: .55, metalness: .12, envMapIntensity: .6 });
    const creamD = new THREE.MeshStandardMaterial({ color: 0xE9D2A6, roughness: .6, metalness: .1 });
    const orange = new THREE.MeshStandardMaterial({ color: 0xE89A5C, roughness: .5, metalness: .05 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x20313a, roughness: .08, metalness: .1, clearcoat: 1, transmission: .25, transparent: true, opacity: .85, envMapIntensity: 1.4 });
    const tire = new THREE.MeshStandardMaterial({ color: 0x1a1512, roughness: .9 });
    const hub = new THREE.MeshStandardMaterial({ color: 0xd8d8db, roughness: .25, metalness: .9, envMapIntensity: 1 });
    const dot = new THREE.MeshStandardMaterial({ color: 0xE8546A, roughness: .5 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xcfcfd3, roughness: .18, metalness: .95, envMapIntensity: 1.2 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x2a1c12, roughness: .6 });

    const shell = new THREE.Group(); grp.add(shell);

    // ---- main cargo box (rounded, slightly curved roof) ----
    const body = new THREE.Mesh(new RoundedBoxGeometry(4.8, 2.4, 2.4, 6, 0.34), cream);
    body.position.set(0.1, 1.95, 0); body.castShadow = body.receiveShadow = true; shell.add(body);
    // belt line trim
    const belt = new THREE.Mesh(new RoundedBoxGeometry(4.86, 0.16, 2.46, 3, 0.06), creamD); belt.position.set(0.1, 1.5, 0); shell.add(belt);
    // curved roof cap
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(2.45, 2.45, 4.7, 40, 1, false, 0, Math.PI), creamD);
    roof.rotation.z = Math.PI / 2; roof.scale.set(1, 1, 0.5); roof.position.set(0.1, 3.16, 0); roof.castShadow = true; shell.add(roof);

    // ---- cab / hood (front +x), classic snub nose ----
    const cab = new THREE.Mesh(new RoundedBoxGeometry(1.5, 1.7, 2.42, 6, 0.34), cream); cab.position.set(2.95, 1.35, 0); cab.castShadow = true; shell.add(cab);
    // windshield (slanted, two-pane look)
    const wsGlass = new THREE.Mesh(new RoundedBoxGeometry(0.16, 1.0, 2.05, 4, 0.06), glass); wsGlass.position.set(2.5, 2.5, 0); wsGlass.rotation.z = -0.42; shell.add(wsGlass);
    const wsFrame = new THREE.Mesh(new RoundedBoxGeometry(0.1, 1.16, 0.12, 3, 0.04), creamD); wsFrame.position.set(2.5, 2.5, 0); wsFrame.rotation.z = -0.42; shell.add(wsFrame);
    // door window on cab side (+z)
    const doorWin = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.8, 0.08, 4, 0.05), glass); doorWin.position.set(2.95, 1.85, 1.22); shell.add(doorWin);
    const doorLine = new THREE.Mesh(new RoundedBoxGeometry(1.45, 1.65, 0.04, 4, 0.05), creamD); doorLine.position.set(2.95, 1.35, 1.205); shell.add(doorLine);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.06), chrome); handle.position.set(2.62, 1.4, 1.25); shell.add(handle);
    // mirror
    const mArm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4), chrome); mArm.rotation.z = Math.PI / 2.4; mArm.position.set(3.5, 2.2, 1.2); shell.add(mArm);
    const mGlass = new THREE.Mesh(new RoundedBoxGeometry(0.12, 0.3, 0.18, 3, 0.05), glass); mGlass.position.set(3.72, 2.32, 1.28); shell.add(mGlass);
    // bumper + grille + lights
    const bumper = new THREE.Mesh(new RoundedBoxGeometry(0.35, 0.32, 2.45, 4, 0.12), chrome); bumper.position.set(3.78, 0.82, 0); shell.add(bumper);
    const grille = new THREE.Mesh(new RoundedBoxGeometry(0.12, 0.55, 1.6, 3, 0.06), chrome); grille.position.set(3.74, 1.35, 0); shell.add(grille);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfff4d6, emissive: 0xffe19a, emissiveIntensity: .7, roughness: .2 });
    [0.82, -0.82].forEach(z => { const hd = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 20), headMat); hd.rotation.z = Math.PI / 2; hd.position.set(3.74, 1.2, z); shell.add(hd); const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 10, 20), chrome); ring.rotation.y = Math.PI / 2; ring.position.set(3.79, 1.2, z); shell.add(ring); });

    // ---- fenders over wheels ----
    function fender(x) { const f = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.16, 12, 24, Math.PI), creamD); f.rotation.y = Math.PI / 2; f.position.set(x, 0.62, 1.22); shell.add(f); const f2 = f.clone(); f2.position.z = -1.22; shell.add(f2); }
    fender(2.6); fender(-1.7);

    // ---- serving hatch (open upward) + awning + counter on +z ----
    const hatchHole = new THREE.Mesh(new RoundedBoxGeometry(2.3, 1.15, 0.12, 4, 0.08), dark); hatchHole.position.set(-0.4, 2.05, 1.18); shell.add(hatchHole);
    const interior = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.0), new THREE.MeshStandardMaterial({ color: 0xffe6b8, emissive: 0xffcaa0, emissiveIntensity: .35, roughness: .9 })); interior.position.set(-0.4, 2.05, 1.13); shell.add(interior);
    // propped-open glass flap
    const flap = new THREE.Mesh(new RoundedBoxGeometry(2.4, 1.15, 0.07, 4, 0.06), glass); flap.geometry.translate(0, 0.55, 0); flap.position.set(-0.4, 2.63, 1.2); flap.rotation.x = -1.05; shell.add(flap);
    const flapBar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5), chrome); flapBar.rotation.x = 0.5; flapBar.position.set(0.85, 3.0, 1.7); shell.add(flapBar);
    // counter shelf
    const shelf = new THREE.Mesh(new RoundedBoxGeometry(2.5, 0.14, 0.55, 3, 0.05), creamD); shelf.position.set(-0.4, 1.42, 1.42); shelf.castShadow = true; shell.add(shelf);
    // striped awning
    const awnGrp = new THREE.Group(); awnGrp.position.set(-0.4, 2.95, 1.55); awnGrp.rotation.x = 0.32;
    for (let i = 0; i < 7; i++) { const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 1.0), i % 2 ? orange : new THREE.MeshStandardMaterial({ color: 0xFBF1DC, roughness: .6 })); stripe.position.x = -1.05 + i * 0.35; awnGrp.add(stripe); }
    const valance = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.18, 0.04), orange); valance.position.set(0, -0.02, 0.5); awnGrp.add(valance); shell.add(awnGrp);

    // ---- melting orange drips along the top edge (+z) ----
    for (let i = 0; i < 10; i++) { const dx = -2.1 + i * 0.47, len = .22 + Math.random() * .42; const dr = new THREE.Mesh(new THREE.CapsuleGeometry(.12, len, 5, 10), orange); dr.position.set(dx, 3.08 - len * .4, 1.2); shell.add(dr); const ball = new THREE.Mesh(new THREE.SphereGeometry(.13, 12, 10), orange); ball.position.set(dx, 3.08 - len - .04, 1.2); shell.add(ball); }

    // ---- coral polka dots ----
    [[-1.8, 2.5], [1.3, 2.55], [-1.5, 1.05], [0.7, 1.05], [1.7, 1.7], [-0.1, 1.0], [-2.0, 1.75]].forEach(([dx, dy]) => { const d = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, .03, 20), dot); d.rotation.x = Math.PI / 2; d.position.set(dx, dy, 1.205); shell.add(d); });

    // ---- wheels (with visible spokes) ----
    const wg = new THREE.CylinderGeometry(.62, .62, .42, 28); wg.rotateX(Math.PI / 2);
    const tg = new THREE.CylinderGeometry(.64, .64, .3, 28); tg.rotateX(Math.PI / 2);
    [2.6, -1.7].forEach(wx => [1.18, -1.18].forEach(wz => {
      const g2 = new THREE.Group();
      g2.add(Object.assign(new THREE.Mesh(tg, tire), { castShadow: true }));
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(.26, .26, .44, 20), hub); cap.rotateX(Math.PI / 2); g2.add(cap);
      for (let s = 0; s < 5; s++) { const spoke = new THREE.Mesh(new THREE.BoxGeometry(.08, .5, .1), hub); spoke.rotation.z = s * Math.PI / 2.5; g2.add(spoke); }
      g2.position.set(wx, .62, wz); shell.add(g2); wheels.push(g2);
    }));

    // ---- livery decals (logo + red wordmark) ----
    const logoTex = new THREE.CanvasTexture(logoCanvas(512)); logoTex.colorSpace = THREE.SRGBColorSpace; logoTex.anisotropy = 4;
    const logo = new THREE.Mesh(new THREE.CircleGeometry(.6, 48), new THREE.MeshBasicMaterial({ map: logoTex, transparent: true })); logo.position.set(1.55, 2.0, 1.215); shell.add(logo);
    const wmTex = new THREE.CanvasTexture(wordCanvas(1024, 256)); wmTex.colorSpace = THREE.SRGBColorSpace; wmTex.anisotropy = 4;
    const wm = new THREE.Mesh(new THREE.PlaneGeometry(3.6, .9), new THREE.MeshBasicMaterial({ map: wmTex, transparent: true })); wm.position.set(-0.35, 0.95, 1.215); shell.add(wm);
    // logo also on the far side of cab
    const logo2 = logo.clone(); logo2.position.set(2.95, 1.85, -1.215); logo2.rotation.y = Math.PI; shell.add(logo2);

    // ---- swinging hanging sign "OUVERT / OPEN" ----
    sign = new THREE.Group(); sign.position.set(-0.4, 1.34, 1.7);
    const sArm = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, .25), chrome); sArm.position.y = .12; sign.add(sArm);
    const board = new THREE.Mesh(new RoundedBoxGeometry(.85, .34, .05, 3, .05), new THREE.MeshStandardMaterial({ color: 0xE8394A, roughness: .5 })); board.position.y = -.1; sign.add(board);
    const sTex = new THREE.CanvasTexture(openCanvas(256, 110)); sTex.colorSpace = THREE.SRGBColorSpace;
    const sFace = new THREE.Mesh(new THREE.PlaneGeometry(.8, .3), new THREE.MeshBasicMaterial({ map: sTex, transparent: true })); sFace.position.set(0, -.1, .03); sign.add(sFace);
    shell.add(sign);

    grp.userData.shell = shell;
  }

  // ---- canvas livery helpers ----
  function logoCanvas(s) {
    const c = document.createElement('canvas'); c.width = c.height = s; const x = c.getContext('2d');
    x.fillStyle = '#E8394A'; x.beginPath(); x.arc(s / 2, s / 2, s / 2 - 2, 0, 7); x.fill();
    x.fillStyle = '#FFF8F0'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `${s * .135}px 'Permanent Marker', cursive`;
    x.fillText('LES GAUFRES', s * .5, s * .40); x.fillText('DE MARIE', s * .5, s * .55);
    heart(x, s * .5, s * .72, s * .08);
    return c;
  }
  function wordCanvas(w, h) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `${h * .55}px 'Permanent Marker', cursive`;
    x.lineWidth = h * .06; x.strokeStyle = 'rgba(120,12,20,.55)'; x.fillStyle = '#E8394A';
    x.strokeText('LES GAUFRES DE MARIE', w / 2, h / 2); x.fillText('LES GAUFRES DE MARIE', w / 2, h / 2);
    return c;
  }
  function openCanvas(w, h) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
    x.fillStyle = '#FFF8F0'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `${h * .42}px 'Permanent Marker', cursive`;
    x.fillText('OUVERT • OPEN', w / 2, h / 2); return c;
  }
  function heart(x, cx, cy, r) {
    const hp = () => { x.beginPath(); x.moveTo(cx, cy + r * .95); x.bezierCurveTo(cx - r * 1.5, cy - r * .25, cx - r * .75, cy - r * 1.15, cx, cy - r * .4); x.bezierCurveTo(cx + r * .75, cy - r * 1.15, cx + r * 1.5, cy - r * .25, cx, cy + r * .95); x.closePath(); };
    x.strokeStyle = '#FFF8F0'; x.lineWidth = Math.max(2, r * .16); hp(); x.stroke();
    x.save(); hp(); x.clip(); x.lineWidth = r * .13;
    for (let i = -3; i <= 3; i++) { x.beginPath(); x.moveTo(cx + i * r * .5, cy - r * 1.3); x.lineTo(cx + i * r * .5, cy + r * 1.3); x.stroke(); x.beginPath(); x.moveTo(cx - r * 1.6, cy + i * r * .42); x.lineTo(cx + r * 1.6, cy + i * r * .42); x.stroke(); }
    x.restore();
  }

  function steamBuild() {
    const N = 24, t = soft(.7), g = new THREE.BufferGeometry(), a = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { const p = rts(); a[i * 3] = p.x; a[i * 3 + 1] = p.y; a[i * 3 + 2] = p.z; stData.push(p); }
    g.setAttribute('position', new THREE.BufferAttribute(a, 3));
    st = new THREE.Points(g, new THREE.PointsMaterial({ map: t, color: 0xffffff, size: .7, transparent: true, opacity: .4, depthWrite: false })); grp.add(st);
  }
  function rts() { return { x: -.4 + (Math.random() - .5) * 1.6, y: 3.3 + Math.random() * .4, z: 1 + (Math.random() - .5) * .6, vy: .5 + Math.random() * .5, sway: Math.random() * 6.28, sp: .6 + Math.random() * .8, life: 0, max: 2.6 + Math.random() * 1.8 }; }
  function ground() {
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(110,60,20,.42)'); g.addColorStop(.6, 'rgba(110,60,20,.16)'); g.addColorStop(1, 'rgba(110,60,20,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    const s = new THREE.Mesh(new THREE.PlaneGeometry(9, 4.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })); s.rotation.x = -Math.PI / 2; s.position.y = .02; grp.add(s);
  }
  function animate() {
    requestAnimationFrame(animate);
    if (!ready || !vis) return;
    const t = clock.getElapsedTime(), dt = Math.min(clock.getDelta(), .05);
    if (!reduce) {
      grp.userData.shell.position.y = Math.sin(t * 2.2) * .05;
      grp.userData.shell.rotation.z = Math.sin(t * 2.2) * .006;
      grp.rotation.y = -0.12 + Math.sin(t * .4) * .16;
      wheels.forEach(w => w.rotation.z -= .05);
      if (sign) sign.rotation.x = Math.sin(t * 2.5) * .12;
    }
    if (st) { const a = st.geometry.attributes.position.array; for (let i = 0; i < stData.length; i++) { const p = stData[i]; p.life += dt; p.y += p.vy * dt; p.x += Math.sin(t * p.sp + p.sway) * .5 * dt; if (p.life > p.max) Object.assign(p, rts()); a[i * 3] = p.x; a[i * 3 + 1] = p.y; a[i * 3 + 2] = p.z; } st.geometry.attributes.position.needsUpdate = true; }
    renderer.render(scene, cam);
  }
})();
