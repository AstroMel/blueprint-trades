import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { coverBack, coverFront, insidePage } from "./images";

// The printed journal as a lit 3D object, textured only with the owner's own pictures: the front and back covers,
// and her photo of a real inside page (Trade Analysis). Tap to open or close it; drag to turn it; 360 spins it half open.

type View = "front" | "back" | "open" | "spin";

const W = 1.48, H = 2.1, CT = 0.022, BT = 0.17;
const VIEW: Record<View, [number, number, number]> = {
  // [rotY, rotX, hinge]
  front: [-0.42, 0.12, 0],
  back: [Math.PI + 0.42, 0.12, 0],
  open: [-0.04, 0.4, -2.95],
  // 360: half open so both covers and the Trade Analysis page come round as it turns
  spin: [0, 0.22, -2.1],
};

// Centre (x, z) of the half-open book's footprint, which the 360 view turns about.
const SPIN_PIVOT = [-0.37, 0.65] as const;

function webglOK() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Book3D({ initial = "front", compact = false, shape = "tall" }: { initial?: View; compact?: boolean; shape?: "tall" | "wide" }) {
  const host = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>(initial);
  const viewRef = useRef<View>(initial);
  const [ok] = useState(webglOK);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    const el = host.current;
    if (!el || !ok) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    // The canvas fills the box absolutely, so its pixel size can never push the box (and the page) taller.
    Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block", touchAction: "pan-y" });
    el.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    scene.add(new THREE.HemisphereLight(0xf3f1ff, 0x1a1d3a, 0.65));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(1.6, 7, 3.2);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 15 });
    key.shadow.radius = 18;
    key.shadow.bias = -0.0004;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9fb4ff, 0.35);
    fill.position.set(-4, 1, 3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xff8a3d, 0.55);
    rim.position.set(-3, 3, -4);
    scene.add(rim);

    const aniso = renderer.capabilities.getMaxAnisotropy();
    const loader = new THREE.TextureLoader();
    const disposables: { dispose(): void }[] = [];
    const tex = (src: string) => {
      const t = loader.load(src, () => setReady(true));
      t.encoding = THREE.sRGBEncoding; t.anisotropy = aniso; disposables.push(t);
      return t;
    };
    const canvasTex = (c: HTMLCanvasElement) => {
      const t = new THREE.CanvasTexture(c);
      t.encoding = THREE.sRGBEncoding; t.anisotropy = aniso; disposables.push(t);
      return t;
    };
    const edge = (vertical: boolean) => {
      const c = document.createElement("canvas"); c.width = c.height = 512;
      const g = c.getContext("2d")!;
      g.fillStyle = "#f2f1ec"; g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 140; i++) {
        const p = i * (512 / 140);
        g.fillStyle = i % 2 ? "rgba(82,90,125,.14)" : "rgba(255,255,255,.4)";
        vertical ? g.fillRect(p, 0, 1.2, 512) : g.fillRect(0, p, 512, 1.2);
      }
      return canvasTex(c);
    };


    const M = (o: THREE.MeshStandardMaterialParameters) => { const m = new THREE.MeshStandardMaterial(o); disposables.push(m); return m; };
    const board = M({ color: 0x141836, roughness: 0.7 });
    const frontMat = M({ map: tex(coverFront), roughness: 0.38, metalness: 0.02 });
    const backMat = M({ map: tex(coverBack), roughness: 0.38, metalness: 0.02 });
    // inside of the front cover: plain board paper, lifted a little so it doesn't fall into shadow when open
    const leftMat = M({ color: 0xf4f3ee, emissive: 0x2c2d33, roughness: 0.95 });
    // Her photo of the page, set in from the left edge so the wire-o loops don't cover the field labels.
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = 1120; pageCanvas.height = 1428;
    const pageTex = canvasTex(pageCanvas);
    const pageImg = new Image();
    pageImg.onload = () => {
      const g = pageCanvas.getContext("2d")!;
      g.fillStyle = "#f6f5f1"; g.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      g.drawImage(pageImg, 96, 0, 1024, 1428);
      pageTex.needsUpdate = true;
      setReady(true);
    };
    pageImg.src = insidePage;
    const rightMat = M({ map: pageTex, roughness: 0.85 });
    const edgeV = M({ map: edge(true), roughness: 1 }), edgeH = M({ map: edge(false), roughness: 1 });
    const paper = M({ color: 0xf2f1ec, roughness: 0.95 });
    const gold = M({ color: 0xd4a640, metalness: 0.9, roughness: 0.25 });

    const book = new THREE.Group();
    scene.add(book);
    const mesh = (geo: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[]) => {
      disposables.push(geo);
      const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true; return m;
    };
    // box face order: +x, -x, +y, -y, +z, -z
    const back = mesh(new THREE.BoxGeometry(W, H, CT), [board, board, board, board, paper, backMat]);
    back.position.z = -(BT / 2 + CT / 2);
    book.add(back);
    const block = mesh(new THREE.BoxGeometry(W - 0.05, H - 0.05, BT), [edgeV, edgeV, edgeH, edgeH, rightMat, paper]);
    block.position.x = 0.01;
    book.add(block);
    const hinge = new THREE.Group();
    hinge.position.set(-W / 2, 0, BT / 2 + CT / 2);
    book.add(hinge);
    const front = mesh(new THREE.BoxGeometry(W, H, CT), [board, board, board, board, frontMat, leftMat]);
    front.position.x = W / 2;
    hinge.add(front);
    // gold wire-o binding
    const wireR = BT / 2 + CT + 0.012, loops = 34;
    const torus = new THREE.TorusGeometry(wireR, 0.0048, 8, 32);
    disposables.push(torus);
    for (let i = 0; i < loops; i++) {
      const y = -H / 2 + 0.07 + (i * (H - 0.14)) / (loops - 1);
      for (const dy of [-0.009, 0.009]) {
        const t = new THREE.Mesh(torus, gold);
        t.rotation.x = Math.PI / 2; t.position.set(-W / 2 + 0.035, y + dy, 0); t.castShadow = true;
        book.add(t);
      }
    }
    const floorGeo = new THREE.PlaneGeometry(10, 10), floorMat = new THREE.ShadowMaterial({ opacity: 0.28 });
    disposables.push(floorGeo, floorMat);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2; floor.position.y = -1.32; floor.receiveShadow = true;
    scene.add(floor);

    // interaction: drag to turn, gentle drift when idle
    let [rotY, rotX, hingeA] = VIEW[viewRef.current];
    let drag = false, lastX = 0, lastY = 0, vY = 0, idle = 0, userY = 0, userX = 0, startX = 0, startY = 0, startT = 0;
    const canvas = renderer.domElement;
    const down = (e: PointerEvent) => { drag = true; lastX = startX = e.clientX; lastY = startY = e.clientY; startT = performance.now(); idle = 0; canvas.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY;
      vY = dx * 0.008; userY += vY; userX = Math.max(-0.5, Math.min(0.6, userX + dy * 0.005)); idle = 0;
    };
    // A tap (no real drag) opens or closes the journal.
    const up = (e: PointerEvent) => {
      if (drag && Math.hypot(e.clientX - startX, e.clientY - startY) < 6 && performance.now() - startT < 450) {
        vY = 0; userY = 0; userX = 0;
        setView((v) => (v === "open" ? "front" : "open"));
      }
      drag = false;
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", () => { drag = false; });

    let lastW = 0, lastH = 0;
    const resize = () => {
      const r = el.getBoundingClientRect();
      const w = Math.round(r.width), h = Math.round(r.height);
      if (!w || !h || (w === lastW && h === lastH)) return;
      lastW = w; lastH = h;
      renderer.setSize(w, h, false);
      camera.aspect = r.width / Math.max(1, r.height);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let visible = true, raf = 0, prev = performance.now(), t = 0, spun = false, shift = 0, spinK = 0;
    const TAU = Math.PI * 2;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); });
    io.observe(el);
    function frame(now: number) {
      raf = 0;
      const dt = Math.min((now - prev) / 1000, 0.05); prev = now; idle += dt; t += dt;
      const target = VIEW[viewRef.current];
      const k = 1 - Math.pow(0.004, dt);
      if (!drag) { vY *= 0.92; userY += vY; if (idle > 3) { userY *= 1 - k * 0.5; userX *= 1 - k * 0.5; } }
      if (viewRef.current === "spin") {
        rotY += dt * (reduce ? 0.35 : 0.7);
        spun = true;
      } else {
        // Coming out of a spin, take the short way back to the chosen side.
        if (spun) { rotY = target[0] + ((((rotY - target[0]) % TAU) + TAU + Math.PI) % TAU) - Math.PI; spun = false; }
        rotY += (target[0] - rotY) * k;
      }
      rotX += (target[1] - rotX) * k; hingeA += (target[2] - hingeA) * k;
      const sway = reduce || drag || viewRef.current !== "front" && viewRef.current !== "back" ? 0 : Math.sin(t * 0.6) * 0.12;
      const th = rotY + userY + sway;
      book.rotation.set(rotX + userX, th, 0);
      hinge.rotation.y = hingeA;
      const open = -hingeA / 2.95;
      const spin = viewRef.current === "spin";
      spinK += ((spin ? 1 : 0) - spinK) * k;
      // Spinning, the book turns about the middle of its half-open silhouette (not its spine) so it stays in frame and large.
      const fitSpin = Math.max(1.7 / (Math.tan(THREE.MathUtils.degToRad(14)) * camera.aspect), 5.6);
      const d0 = (camera.aspect < 0.85 ? 6.6 : 5.6) + open * 2.6;
      const d = d0 * (1 - spinK) + fitSpin * spinK;
      // Keep a spinning book centred on its spine; an open book shifts so both pages sit in frame.
      shift += ((spin ? 0 : open * (W / 2)) - shift) * k;
      book.position.x = shift - spinK * (SPIN_PIVOT[0] * Math.cos(th) + SPIN_PIVOT[1] * Math.sin(th));
      book.position.z = -spinK * (-SPIN_PIVOT[0] * Math.sin(th) + SPIN_PIVOT[1] * Math.cos(th));
      camera.position.set(0, 0.45 + open * 1.2 * (1 - 0.55 * spinK), d);
      camera.lookAt(0, -0.08, 0);
      renderer.render(scene, camera);
      if (visible) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose(); canvas.remove();
    };
  }, [ok]);

  if (!ok) {
    return <img src={coverFront} alt="Front cover of the printed Bull and Bear trading journal" className="mx-auto aspect-[4/5] w-full max-w-md object-contain" />;
  }
  return (
    <div className="flex flex-col gap-3">
      <div
        ref={host}
        className={`relative ${shape === "wide" ? "aspect-[5/4]" : "aspect-[4/5]"} w-full overflow-hidden cursor-grab select-none active:cursor-grabbing transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        role="img"
        aria-label={
          view === "open"
            ? "3D view of the journal open to its Trade Analysis page"
            : view === "spin"
              ? "3D view of the journal half open, turning a full 360 degrees to show both covers and the inside page"
              : view === "back"
              ? "3D view of the journal's back cover with the Blueprint letter"
              : "3D view of the printed Bull and Bear trading journal with its gold wire-o binding"
        }
      >
        <div className="pointer-events-none absolute inset-x-[12%] bottom-[6%] h-[10%] rounded-[50%] bg-db-sun/10 blur-2xl" aria-hidden />
        {(view === "front" || view === "back") && (
          <span className="label pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 border border-db-line bg-db-mid/70 px-3 py-1.5 text-[10px] text-db-ink backdrop-blur">tap to open</span>
        )}
      </div>
      <div className="flex items-center justify-center gap-3">
        <div className="flex rounded-sm border border-db-line bg-db-raised/60 p-1 backdrop-blur-md" role="group" aria-label="Turn the journal">
          {(["front", "back", "open", "spin"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`label min-h-[40px] rounded-sm px-3 text-[11px] sm:px-4 transition ${view === v ? "bg-db-sun text-db-onsun" : "text-db-ink hover:text-db-sun"}`}
            >
              {v === "open" ? "Inside" : v === "spin" ? "360" : v}
            </button>
          ))}
        </div>
        {!compact && <span className="label hidden text-[11px] text-db-muted sm:inline">drag to turn</span>}
      </div>
    </div>
  );
}
