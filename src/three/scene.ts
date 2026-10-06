import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createGlassesModel } from "./model";
import { componentInfo } from "./components";
import { initialProductState } from "./types";
import type { ProductScene, ProductSceneOptions, ProductState } from "./types";

export { componentInfo } from "./components";
export type { ProductScene, ProductSceneOptions, ProductState } from "./types";

interface Shot {
  direction: [number, number, number];
  target: [number, number, number];
  framing: number;
  explode: number;
  modular: number;
  pale: number;
  cover: number;
  optical?: number;
}

/** Every shot has a subject. No idle turntable or synthetic camera drift. */
const shots: Shot[] = [
  {
    direction: [0.42, 0.27, 1],
    target: [0, 0, -5.4],
    framing: 1,
    explode: 0,
    modular: 0,
    pale: 0,
    cover: 0,
  },
  {
    direction: [0.02, 0.055, 1],
    target: [0, 0, -5],
    framing: 1,
    explode: 0,
    modular: 0,
    pale: 0,
    cover: 0,
  },
  {
    direction: [0.24, 0.15, 1],
    target: [0, 0.1, -3.5],
    framing: 1,
    explode: 0,
    optical: 0.8,
    modular: 0,
    pale: 0,
    cover: 0,
  },
  {
    direction: [-0.23, 0.12, 1],
    target: [-0.7, 0.15, -0.35],
    framing: 0.57,
    explode: 0,
    modular: 0,
    pale: 0,
    cover: 0,
  },
  {
    direction: [0.17, 0.11, 1],
    target: [0, 0.98, -0.05],
    framing: 0.48,
    explode: 0,
    modular: 0,
    pale: 0,
    cover: 0,
  },
  {
    direction: [-1, 0.4, 0.58],
    target: [-6.2, 0.6, -3.9],
    framing: 0.56,
    explode: 0,
    modular: 0,
    pale: 0,
    cover: 1,
  },
  {
    direction: [0.005, 0.04, 1],
    target: [0, 0, -4.6],
    framing: 1,
    explode: 0,
    modular: 0,
    pale: 0,
    cover: 0,
  },
  {
    direction: [0.36, 0.5, 1],
    target: [0, 0.1, -4.25],
    framing: 1,
    explode: 1,
    modular: 0,
    pale: 1,
    cover: 0,
  },
  {
    direction: [0.28, 0.12, 1],
    target: [0, 0, -5],
    framing: 1,
    explode: 0,
    modular: 0,
    pale: 0,
    cover: 0,
  },
  {
    direction: [0.13, 0.12, 1],
    target: [0, 0.1, -3.8],
    framing: 1,
    explode: 0,
    modular: 1,
    pale: 0,
    cover: 0,
  },
  {
    direction: [1, 0.12, 0.28],
    target: [0, 0, -6.8],
    framing: 1,
    explode: 0,
    modular: 0,
    pale: 0,
    cover: 0,
  },
  {
    direction: [0.34, 0.22, 1],
    target: [0, 0, -5.6],
    framing: 1,
    explode: 0,
    modular: 0,
    pale: 0,
    cover: 0,
  },
];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
function smoothstep(value: number): number {
  return value * value * (3 - 2 * value);
}

function sampleShot(progress: number): Shot {
  const index = Math.min(10, Math.floor(clamp(progress, 0, 11)));
  const a = shots[index];
  const b = shots[index + 1];
  const t = smoothstep(clamp(progress - index, 0, 1));
  const lerp = (first: number, second: number) =>
    THREE.MathUtils.lerp(first, second, t);
  return {
    direction: a.direction.map((value, i) =>
      lerp(value, b.direction[i]),
    ) as Shot["direction"],
    target: a.target.map((value, i) =>
      lerp(value, b.target[i]),
    ) as Shot["target"],
    framing: lerp(a.framing, b.framing),
    explode: lerp(a.explode, b.explode),
    modular: lerp(a.modular, b.modular),
    pale: lerp(a.pale, b.pale),
    cover: lerp(a.cover, b.cover),
    optical: lerp(a.optical ?? 0, b.optical ?? 0),
  };
}

function yieldToBrowser(): Promise<void> {
  const scheduler = (
    globalThis as typeof globalThis & {
      scheduler?: { yield(): Promise<void> };
    }
  ).scheduler;
  return scheduler?.yield() ?? new Promise((resolve) => setTimeout(resolve, 0));
}

async function studioEnvironment(
  renderer: THREE.WebGLRenderer,
): Promise<THREE.WebGLRenderTarget> {
  const room = new THREE.Scene();
  room.background = new THREE.Color("#333537");
  const panelGeometry = new THREE.PlaneGeometry(1, 1);
  const surfaces: THREE.MeshBasicMaterial[] = [];
  const panel = (
    at: [number, number, number],
    size: [number, number],
    rotation: [number, number, number],
    luminance: number,
  ): void => {
    const surface = new THREE.MeshBasicMaterial({
      color: new THREE.Color(luminance, luminance * 0.99, luminance * 0.97),
      side: THREE.DoubleSide,
    });
    surfaces.push(surface);
    const light = new THREE.Mesh(panelGeometry, surface);
    light.position.set(...at);
    light.scale.set(...size, 1);
    light.rotation.set(...rotation);
    room.add(light);
  };
  // Large softboxes make the chamfers legible as long, quiet reflections.
  panel([0, 13, 3], [22, 7], [-Math.PI / 2, 0, 0], 5.8);
  panel([-13, 3, 4], [6, 19], [0, Math.PI / 2, 0], 3.7);
  panel([14, 6, -5], [4, 16], [0, -Math.PI / 2, 0], 4.9);
  panel([0, -7, 4], [17, 3], [Math.PI / 2, 0, 0], 1.8);
  panel([1, 1, 18], [8, 9], [0, Math.PI, 0], 1.2);
  // PMREM captures use linear output and no tone mapping. Prepare their basic
  // panel/background programs asynchronously before the six capture renders.
  const backgroundGeometry = new THREE.BoxGeometry();
  const backgroundMaterial = new THREE.MeshBasicMaterial({
    color: room.background as THREE.Color,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
  });
  const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
  room.add(background);
  const originalToneMapping = renderer.toneMapping;
  const linearTarget = new THREE.WebGLRenderTarget(1, 1);
  renderer.setRenderTarget(linearTarget);
  renderer.toneMapping = THREE.NoToneMapping;
  try {
    await renderer.compileAsync(
      room,
      new THREE.PerspectiveCamera(90, 1, 0.1, 80),
    );
  } finally {
    renderer.setRenderTarget(null);
    renderer.toneMapping = originalToneMapping;
    linearTarget.dispose();
    room.remove(background);
    backgroundGeometry.dispose();
    backgroundMaterial.dispose();
  }
  await yieldToBrowser();
  const generator = new THREE.PMREMGenerator(renderer);
  try {
    return generator.fromScene(room, 0.035, 0.1, 80);
  } finally {
    generator.dispose();
    panelGeometry.dispose();
    for (const surface of surfaces) surface.dispose();
  }
}

interface Label {
  id: string;
  button: HTMLButtonElement;
  line: SVGLineElement;
}

/** One renderer per dedicated region, with a shared procedural product definition. */
export function createProductScene(
  host: HTMLElement,
  options: ProductSceneOptions = {},
): ProductScene {
  const abort = new AbortController();
  let delegate: ProductScene | undefined;
  let pendingState: Partial<ProductState> = {};
  let pendingView: string | undefined;
  let pendingZoom = 0;
  let pendingReset = false;
  // A real synchronous API is available while GPU programs compile. Initial
  // user input is retained, and readiness means the first frame was drawn.
  const proxy: ProductScene = {
    setState(state) {
      if (abort.signal.aborted) return;
      if (delegate) delegate.setState(state);
      else {
        pendingState = { ...pendingState, ...state };
        if (state.progress !== undefined) pendingView = undefined;
      }
    },
    setView(view) {
      if (abort.signal.aborted) return;
      if (
        !["hero", "front", "back", "left", "right", "top", "exploded"].includes(
          view,
        )
      )
        return;
      if (delegate) delegate.setView(view);
      else {
        pendingView = view;
        pendingZoom = 0;
        pendingState = {
          ...pendingState,
          explode: view === "exploded" ? 1 : 0,
        };
      }
    },
    zoom(delta) {
      if (abort.signal.aborted || !Number.isFinite(delta)) return;
      if (delegate) delegate.zoom(delta);
      else pendingZoom = clamp(pendingZoom + delta, -6, 6);
    },
    reset() {
      if (abort.signal.aborted) return;
      if (delegate) delegate.reset();
      else {
        pendingReset = true;
        pendingState = {};
        pendingView = "hero";
        pendingZoom = 0;
      }
    },
    capture: () => delegate?.capture() ?? "",
    getStats: () => delegate?.getStats() ?? { drawCalls: 0, triangles: 0 },
    dispose() {
      abort.abort();
      delegate?.dispose();
    },
  };
  void initializeProductScene(host, options, abort.signal, (api) => {
    if (pendingReset) api.reset();
    api.setState(pendingState);
    if (pendingView) api.setView(pendingView);
    if (pendingState.explode !== undefined)
      api.setState({ explode: pendingState.explode });
    if (pendingZoom) api.zoom(pendingZoom);
  })
    .then((api) => {
      if (abort.signal.aborted) {
        api.dispose();
        return;
      }
      delegate = api;
      options.onReady?.();
    })
    .catch(() => {
      if (!abort.signal.aborted) options.onError?.();
    });
  return proxy;
}

async function initializeProductScene(
  host: HTMLElement,
  options: ProductSceneOptions,
  signal: AbortSignal,
  applyPending: (api: ProductScene) => void,
): Promise<ProductScene> {
  await yieldToBrowser();
  if (signal.aborted)
    throw new DOMException("Scene disposed during startup", "AbortError");
  const interactive = options.interactive ?? false;
  let disposed = false;
  let failed = false;
  let ready = false;
  let visible = true;
  let animationFrame = 0;
  let width = Math.max(1, host.clientWidth);
  let height = Math.max(1, host.clientHeight);
  let lastTime = 0;
  let view: string | null = null;
  let userControlled = false;
  let dragging = false;
  let manualZoom = 1;
  let qualityFrameCount = 0;
  let qualityElapsed = 0;
  let pixelRatio = Math.min(
    window.devicePixelRatio || 1,
    width < 700 ? 1.5 : 1.75,
  );
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = reducedQuery.matches;
  const startupCleanup: (() => void)[] = [];
  const checkpoint = (): void => {
    if (signal.aborted || failed)
      throw new DOMException("Scene startup interrupted", "AbortError");
  };
  try {
    const targetState: ProductState = { ...initialProductState };
    const currentState: ProductState = { ...initialProductState };
    const scene = new THREE.Scene();
    const dark = new THREE.Color("#08090a");
    const pale = new THREE.Color("#eef0ed");
    scene.background = dark.clone();
    const perspective = new THREE.PerspectiveCamera(
      31,
      width / height,
      0.1,
      220,
    );
    const orthographic = new THREE.OrthographicCamera(
      -10,
      10,
      10,
      -10,
      0.1,
      220,
    );
    let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera =
      perspective;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
    startupCleanup.push(() => renderer.dispose());
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.13;
    const canvas = renderer.domElement;
    canvas.className = "product-canvas";
    canvas.style.cssText =
      "display:block;width:100%;height:100%;outline-offset:-4px;";
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "Modelo tridimensional conceitual dos óculos FoveaRx One",
    );
    // Canvas manipulation is optional; equivalent controls and component text live in HTML.
    if (interactive) {
      canvas.tabIndex = 0;
      canvas.setAttribute(
        "aria-label",
        "Óculos FoveaRx One em 3D. Setas giram, mais e menos ampliam, Home reinicia, Tab acessa componentes.",
      );
    }
    host.appendChild(canvas);
    startupCleanup.push(() => canvas.remove());
    await yieldToBrowser();
    checkpoint();
    const model = createGlassesModel();
    startupCleanup.push(() => model.dispose());
    scene.add(model.root);
    await yieldToBrowser();
    checkpoint();
    const environment = await studioEnvironment(renderer);
    startupCleanup.push(() => environment.dispose());
    checkpoint();
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.85;
    const cameraSamples: { object: THREE.Mesh; points: THREE.Vector3[] }[] = [];
    model.root.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const positions = object.geometry.getAttribute("position");
      const points: THREE.Vector3[] = [];
      // Extruded surfaces repeat vertices heavily. Sampling their real outline
      // avoids fitting imaginary rear corners of the rectangular bounding cube.
      for (let i = 0; i < positions.count; i += 6)
        points.push(new THREE.Vector3().fromBufferAttribute(positions, i));
      cameraSamples.push({ object, points });
    });
    const key = new THREE.DirectionalLight("#fffaf2", 3.0);
    key.position.set(-9, 15, 14);
    scene.add(key);
    const fill = new THREE.DirectionalLight("#e1e6e7", 1.0);
    fill.position.set(13, 2, 6);
    scene.add(fill);
    const rim = new THREE.DirectionalLight("#ffffff", 3.8);
    rim.position.set(1, 8, -18);
    scene.add(rim);
    scene.add(new THREE.HemisphereLight("#eceff0", "#454440", 1.15));

    const controls = new OrbitControls(camera, canvas);
    startupCleanup.push(() => controls.dispose());
    controls.enabled = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.12;
    controls.rotateSpeed = 0.62;
    controls.zoomSpeed = 0.75;
    controls.minPolarAngle = 0.12;
    controls.maxPolarAngle = Math.PI - 0.12;
    controls.minZoom = 0.65;
    controls.maxZoom = 2.5;
    controls.target.set(0, 0, -5.4);
    controls.touches.ONE = THREE.TOUCH.ROTATE;
    controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
    // A vertical one-finger gesture keeps page scrolling. Horizontal gestures
    // rotate; two fingers zoom. Set after OrbitControls' constructor default.
    canvas.style.touchAction = interactive ? "pan-y" : "auto";

    const selectedOutlineMaterial = new THREE.MeshBasicMaterial({
      color: "#a8d0cf",
      transparent: true,
      opacity: 0.11,
      depthWrite: false,
      side: THREE.BackSide,
    });
    startupCleanup.push(() => selectedOutlineMaterial.dispose());
    const selection = new THREE.Group();
    selection.name = "Sélection de composant";
    scene.add(selection);
    let selectedId: string | null = null;
    const labelLayer = document.createElement("div");
    labelLayer.className = "product-component-labels";
    labelLayer.style.cssText =
      "position:absolute;inset:0;overflow:hidden;pointer-events:none;";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;";
    labelLayer.appendChild(svg);
    const labels: Label[] = [];
    // A readable subset; all 20 components remain available through selection/API.
    for (const info of componentInfo) {
      const id = info.id;
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = info.name;
      button.setAttribute("aria-label", `Examinar ${info.name}`);
      button.dataset.componentId = id;
      button.style.cssText =
        "position:absolute;pointer-events:auto;background:rgba(14,16,18,.88);border:1px solid rgba(200,212,212,.35);border-radius:4px;color:#eef1ef;padding:7px 10px;font:500 11px/1.25 inherit;white-space:nowrap;min-height:36px;max-width:155px;cursor:pointer;outline-offset:3px;";
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line.setAttribute("stroke", "#9ba8a6");
      line.setAttribute("stroke-width", "0.7");
      line.setAttribute("opacity", "0.65");
      svg.appendChild(line);
      labelLayer.appendChild(button);
      button.addEventListener("click", () => selectComponent(id));
      labels.push({ id, button, line });
    }
    labelLayer.hidden = true;
    host.appendChild(labelLayer);
    startupCleanup.push(() => labelLayer.remove());

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const pointerStart = new THREE.Vector2();
    const bounds = new THREE.Box3();
    const desiredPosition = new THREE.Vector3();
    const desiredTarget = new THREE.Vector3();
    const cameraTarget = new THREE.Vector3(0, 0, -5.4);
    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();
    const up = new THREE.Vector3();
    const corner = new THREE.Vector3();
    const relative = new THREE.Vector3();
    const projected = new THREE.Vector3();
    const worldAnchor = new THREE.Vector3();
    const white = new THREE.Color("#eef3ef");
    const opticalTint = new THREE.Color("#b3cecb");
    const negativeTint = new THREE.Color("#ded6c4");
    let desiredOrthoSize = 10;
    let orthoSize = 10;
    let isFirstFrame = true;
    let revealStart = 0;

    function requestFrame(): void {
      if (
        ready &&
        !disposed &&
        !failed &&
        visible &&
        !document.hidden &&
        !animationFrame
      )
        animationFrame = requestAnimationFrame(render);
    }

    function selectComponent(id: string): void {
      if (!componentInfo.some((item) => item.id === id)) return;
      targetState.selected = id;
      options.onSelect?.(id);
      requestFrame();
    }

    function refreshSelection(): void {
      if (selectedId === targetState.selected) return;
      selection.clear();
      selectedId = targetState.selected;
      if (!selectedId) return;
      const part = model.parts.find((item) => item.id === selectedId);
      if (!part) return;
      part.group.traverse((object) => {
        if (!(object instanceof THREE.Mesh) || !object.visible) return;
        const outline = new THREE.Mesh(
          object.geometry,
          selectedOutlineMaterial,
        );
        outline.position.copy(object.position);
        outline.rotation.copy(object.rotation);
        outline.scale.copy(object.scale).multiplyScalar(1.012);
        selection.add(outline);
      });
    }

    function updateGeometry(shot: Shot): void {
      const explosion = Math.max(currentState.explode, shot.explode);
      const opticalExplosion = Math.max(explosion, shot.optical ?? 0);
      const modular = Math.max(currentState.modular, shot.modular);
      for (const part of model.parts) {
        const separation = part.separation;
        const isOptical =
          part.id.startsWith("lens-") ||
          part.id.startsWith("lc-") ||
          part.id === "electrodes";
        part.group.position
          .copy(part.origin)
          .addScaledVector(
            separation,
            isOptical ? opticalExplosion : explosion,
          );
        if (part.id === "covers") part.group.position.y += shot.cover * 2.2;
        if (part.id.startsWith("lens-")) part.group.position.z += modular * 2.3;
        if (part.id === "lc-left" || part.id === "lc-right")
          part.group.position.z += modular * 0.7;
        if (part.id === selectedId)
          selection.position.copy(part.group.position);
      }
      // Removal precedes insertion. Replacement lenses share optical geometry
      // but travel from an offset service position into the empty frame seats.
      for (const replacement of model.replacements) {
        const insertion = smoothstep(clamp((modular - 0.42) / 0.58, 0, 1));
        replacement.mesh.visible = modular > 0.42;
        replacement.mesh.position.set(
          replacement.sign * 3.56,
          (1 - insertion) * 3.6,
          0.11 - modular * 2.3 + (1 - insertion) * 2.7,
        );
      }
      for (const layer of model.opticalLayers) {
        const strength = Math.abs(currentState.focus) / 1.5;
        const tint = currentState.power ? 0.06 + strength * 0.2 : 0;
        layer.color
          .copy(white)
          .lerp(
            currentState.focus < 0 ? negativeTint : opticalTint,
            tint + opticalExplosion * 0.3,
          );
        layer.opacity =
          0.024 +
          opticalExplosion * 0.36 +
          (currentState.power ? strength * 0.025 : 0);
      }
      // Sensor response is an explicit state change; there is no animated glow loop.
      for (const surface of model.statusMaterials)
        surface.emissiveIntensity = currentState.power
          ? 0.18 +
            Math.abs(currentState.gazeX) * 0.12 +
            Math.abs(currentState.gazeY) * 0.12
          : 0;
      model.root.updateMatrixWorld(true);
    }

    function updateCamera(shot: Shot, alpha: number): boolean {
      const isTechnical = view !== null && view !== "hero";
      const requiredCamera = isTechnical ? orthographic : perspective;
      if (requiredCamera !== camera) {
        requiredCamera.position.copy(camera.position);
        requiredCamera.up.copy(camera.up);
        if (requiredCamera instanceof THREE.OrthographicCamera) {
          orthoSize =
            camera.position.distanceTo(cameraTarget) *
            Math.tan(THREE.MathUtils.degToRad(perspective.fov / 2));
        } else {
          const offset = camera.position.clone().sub(cameraTarget).normalize();
          requiredCamera.position
            .copy(cameraTarget)
            .addScaledVector(
              offset,
              orthoSize /
                Math.tan(THREE.MathUtils.degToRad(perspective.fov / 2)),
            );
        }
        camera = requiredCamera;
        controls.object = camera;
      }
      direction.set(...shot.direction).normalize();
      desiredTarget.set(...shot.target);
      if (view && view !== "hero") {
        desiredTarget.set(0, 0, -6.8);
        if (view === "front") direction.set(0, 0, 1);
        if (view === "back") direction.set(0, 0, -1);
        if (view === "left") direction.set(-1, 0, 0);
        if (view === "right") direction.set(1, 0, 0);
        if (view === "top") direction.set(0, 1, 0.00001).normalize();
        if (view === "exploded") direction.set(0.42, 0.45, 1).normalize();
      }
      // The target is centered on the projected bounding box, rather than an
      // arbitrary orbit radius. Portrait canvases receive the same full-product fit.
      bounds.setFromObject(model.root);
      const centre = bounds.getCenter(corner);
      const framing = view
        ? 1
        : Math.max(width < 650 ? 0.68 : 0.45, shot.framing);
      if (framing >= 0.99) desiredTarget.copy(centre);
      const referenceUp =
        view === "top"
          ? new THREE.Vector3(0, 0, -1)
          : new THREE.Vector3(0, 1, 0);
      right.crossVectors(referenceUp, direction).normalize();
      up.crossVectors(direction, right).normalize();
      let distance = 0;
      let halfHeight = 0;
      const tangent = Math.tan(THREE.MathUtils.degToRad(perspective.fov / 2));
      const aspect = width / height;
      // Reserve the top label strip and bottom controls only in the compact
      // interactive viewer. The narrative hero retains its existing framing.
      const verticalFill =
        interactive && width < 600 && targetState.labels
          ? Math.max(0.5, (height - 112) / height)
          : 1;
      const eachPoint = (visit: (point: THREE.Vector3) => void): void => {
        for (const sample of cameraSamples) {
          if (!sample.object.visible) continue;
          for (const point of sample.points)
            visit(
              relative
                .copy(point)
                .applyMatrix4(sample.object.matrixWorld)
                .sub(desiredTarget),
            );
        }
      };
      if (framing >= 0.99) {
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        eachPoint((point) => {
          const x = point.dot(right);
          const y = point.dot(up);
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        });
        desiredTarget
          .addScaledVector(right, (minX + maxX) / 2)
          .addScaledVector(up, (minY + maxY) / 2);
      }
      const fit = (): void => {
        distance = 0;
        halfHeight = 0;
        eachPoint((point) => {
          const horizontal = Math.abs(point.dot(right));
          const vertical = Math.abs(point.dot(up));
          distance = Math.max(
            distance,
            point.dot(direction) + horizontal / (tangent * aspect * 0.91),
            point.dot(direction) + vertical / (tangent * 0.91 * verticalFill),
          );
          halfHeight = Math.max(
            halfHeight,
            vertical / (0.89 * verticalFill),
            horizontal / (aspect * 0.89),
          );
        });
      };
      fit();
      if (framing >= 0.99 && camera instanceof THREE.PerspectiveCamera) {
        // Perspective depths are unequal. Center the projected silhouette, too,
        // so the front lenses don't hang below the centre of a wide hero stage.
        for (let pass = 0; pass < 2; pass++) {
          let minY = Infinity;
          let maxY = -Infinity;
          let near = Infinity;
          let far = 0;
          eachPoint((point) => {
            const depth = Math.max(0.1, distance - point.dot(direction));
            const y = point.dot(up) / depth;
            if (y < minY) {
              minY = y;
              near = depth;
            }
            if (y > maxY) {
              maxY = y;
              far = depth;
            }
          });
          const correction = (minY + maxY) / (1 / near + 1 / far);
          desiredTarget.addScaledVector(up, correction);
          fit();
        }
      }
      distance = Math.max(8, (distance * framing) / manualZoom);
      desiredPosition
        .copy(desiredTarget)
        .addScaledVector(
          direction,
          camera instanceof THREE.OrthographicCamera ? 58 : distance,
        );
      desiredOrthoSize = Math.max(2.5, halfHeight / manualZoom);
      controls.minDistance = Math.max(7, distance * 0.45);
      controls.maxDistance = Math.max(55, distance * 2.6);
      if (userControlled || dragging) return false;
      const snap = reducedMotion || isFirstFrame;
      camera.position.lerp(desiredPosition, snap ? 1 : alpha);
      cameraTarget.lerp(desiredTarget, snap ? 1 : alpha);
      camera.up.lerp(referenceUp, snap ? 1 : alpha).normalize();
      orthoSize = THREE.MathUtils.lerp(
        orthoSize,
        desiredOrthoSize,
        snap ? 1 : alpha,
      );
      if (camera instanceof THREE.OrthographicCamera) {
        camera.left = -orthoSize * aspect;
        camera.right = orthoSize * aspect;
        camera.top = orthoSize;
        camera.bottom = -orthoSize;
      }
      camera.updateProjectionMatrix();
      camera.lookAt(cameraTarget);
      controls.target.copy(cameraTarget);
      return (
        camera.position.distanceToSquared(desiredPosition) > 0.00001 ||
        cameraTarget.distanceToSquared(desiredTarget) > 0.00001 ||
        Math.abs(orthoSize - desiredOrthoSize) > 0.001
      );
    }

    function updateLabels(): void {
      const opticalLabels =
        !interactive && Math.abs(currentState.progress - 2) < 0.35;
      const engineeringLabels =
        !interactive && Math.abs(currentState.progress - 7) < 0.35;
      const enabled = targetState.labels || opticalLabels || engineeringLabels;
      labelLayer.hidden = !enabled;
      if (!enabled) return;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      if (width < 600) {
        for (const label of labels) {
          label.button.hidden = true;
          label.line.style.display = "none";
        }
        const labelWidth = Math.min(220, width - 32);
        const showCompactLabel = (id: string, atBottom: boolean): void => {
          const label = labels.find((item) => item.id === id);
          const part = model.parts.find((item) => item.id === id);
          if (!label || !part) return;
          worldAnchor.copy(part.anchor).add(part.group.position);
          projected.copy(worldAnchor).project(camera);
          if (projected.z <= -1 || projected.z >= 1) return;
          const x = clamp(((projected.x + 1) / 2) * width, 8, width - 8);
          const y = clamp(((1 - projected.y) / 2) * height, 8, height - 8);
          const labelY = atBottom ? height - 52 : 16;
          label.button.hidden = false;
          label.button.style.left = `${(width - labelWidth) / 2}px`;
          label.button.style.top = `${labelY}px`;
          label.button.style.width = `${labelWidth}px`;
          label.button.style.maxWidth = `${labelWidth}px`;
          label.button.style.fontSize = "11px";
          label.button.setAttribute("aria-pressed", String(selectedId === id));
          label.line.style.display = "";
          label.line.setAttribute("x1", String(x));
          label.line.setAttribute("y1", String(y));
          label.line.setAttribute("x2", String(width / 2));
          label.line.setAttribute(
            "y2",
            String(atBottom ? labelY : labelY + 36),
          );
        };
        if (interactive) {
          showCompactLabel(selectedId ?? "frame", false);
          return;
        }
        // Automatic narrative labels use empty edge strips only. Product points
        // determine availability without DOM measurement or a camera resize.
        let productTop = height;
        let productBottom = 0;
        for (const sample of cameraSamples) {
          if (!sample.object.visible) continue;
          for (const point of sample.points) {
            projected
              .copy(point)
              .applyMatrix4(sample.object.matrixWorld)
              .project(camera);
            if (projected.z <= -1 || projected.z >= 1) continue;
            const y = ((1 - projected.y) / 2) * height;
            productTop = Math.min(productTop, y);
            productBottom = Math.max(productBottom, y);
          }
        }
        const topAvailable = productTop >= 64;
        const bottomAvailable = productBottom <= height - 64;
        const ids = opticalLabels
          ? ["lens-left", "lc-right"]
          : engineeringLabels
            ? ["frame", "processor"]
            : [selectedId ?? "frame"];
        if (topAvailable) showCompactLabel(ids[0], false);
        if (bottomAvailable && (ids.length > 1 || !topAvailable))
          showCompactLabel(ids[topAvailable ? 1 : 0], true);
        return;
      }
      const slots = labels.map((label) => {
        label.button.style.maxWidth = "155px";
        const part = model.parts.find((item) => item.id === label.id)!;
        worldAnchor.copy(part.anchor).add(part.group.position);
        projected.copy(worldAnchor).project(camera);
        const relevant = opticalLabels
          ? ["lens-left", "lc-right", "electrodes"].includes(label.id)
          : engineeringLabels
            ? ["frame", "processor", "battery", "tof"].includes(label.id)
            : ["frame", "lens-left", "processor", "battery"].includes(label.id);
        return {
          label,
          x: ((projected.x + 1) / 2) * width,
          y: ((1 - projected.y) / 2) * height,
          shown:
            relevant &&
            projected.z > -1 &&
            projected.z < 1 &&
            Math.abs(projected.x) < 1.2 &&
            Math.abs(projected.y) < 1.2,
        };
      });
      // Fixed outside columns eliminate overlap without measuring layout per frame.
      for (const slot of slots)
        if (!slot.shown) {
          slot.label.button.hidden = true;
          slot.label.line.style.display = "none";
        }
      const leftSlots = slots
        .filter((slot) => slot.shown && slot.x < width / 2)
        .sort((a, b) => a.y - b.y);
      const rightSlots = slots
        .filter((slot) => slot.shown && slot.x >= width / 2)
        .sort((a, b) => a.y - b.y);
      for (const side of [leftSlots, rightSlots]) {
        for (let i = 0; i < side.length; i++) {
          const { label, x, y, shown } = side[i];
          const leftSide = side === leftSlots;
          const compact = width < 600;
          const labelWidth = compact ? 125 : 155;
          const labelX = leftSide ? 10 : width - labelWidth - 10;
          const available = Math.max(44, height - 64);
          const labelY = clamp(
            30 + ((i + 0.5) * available) / Math.max(1, side.length) - 18,
            14,
            height - 46,
          );
          const mobileHidden = compact && i > 2;
          label.button.hidden = !shown || mobileHidden;
          label.line.style.display = shown && !mobileHidden ? "" : "none";
          label.button.style.left = `${labelX}px`;
          label.button.style.top = `${labelY}px`;
          label.button.style.width = `${labelWidth}px`;
          label.button.style.fontSize = compact ? "10px" : "11px";
          label.button.setAttribute(
            "aria-pressed",
            String(selectedId === label.id),
          );
          label.line.setAttribute("x1", String(x));
          label.line.setAttribute("y1", String(y));
          label.line.setAttribute(
            "x2",
            String(leftSide ? labelX + labelWidth : labelX),
          );
          label.line.setAttribute("y2", String(labelY + 18));
        }
      }
    }

    function render(time: number): void {
      animationFrame = 0;
      if (disposed || failed || !visible || document.hidden) return;
      const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;
      // Critical settling is monotonic, quick to begin, and reversible at any frame.
      const alpha = reducedMotion ? 1 : 1 - Math.exp(-dt * 10);
      let stateMoving = false;
      for (const key of [
        "progress",
        "explode",
        "focus",
        "gazeX",
        "gazeY",
        "modular",
      ] as const) {
        const difference = targetState[key] - currentState[key];
        currentState[key] =
          Math.abs(difference) < 0.0005
            ? targetState[key]
            : currentState[key] + difference * alpha;
        if (Math.abs(difference) >= 0.0005) stateMoving = true;
      }
      currentState.power = targetState.power;
      currentState.labels = targetState.labels;
      currentState.selected = targetState.selected;
      const shot = view ? shots[0] : sampleShot(currentState.progress);
      refreshSelection();
      updateGeometry(shot);
      const cameraMoving = updateCamera(shot, alpha);
      const controlsMoving = userControlled && controls.update();
      const paleValue = view && view !== "hero" ? 1 : shot.pale;
      (scene.background as THREE.Color).copy(dark).lerp(pale, paleValue);
      scene.environmentIntensity = 0.85 + paleValue * 0.25;
      key.intensity = 3.0 + paleValue * 0.9 + (width < 600 ? 0.4 : 0);
      rim.intensity = width < 600 ? 4.3 : 3.8;
      const reveal = reducedMotion
        ? 1
        : clamp((time - revealStart) / 900, 0, 1);
      renderer.toneMappingExposure = 0.2 + smoothstep(reveal) * 0.93;
      renderer.render(scene, camera);
      updateLabels();
      isFirstFrame = false;
      if (
        stateMoving ||
        cameraMoving ||
        controlsMoving ||
        dragging ||
        reveal < 1
      ) {
        qualityFrameCount++;
        qualityElapsed += dt;
        // Sample only active transitions; idle time must not cause a false downgrade.
        if (qualityFrameCount >= 90) {
          if (qualityElapsed / qualityFrameCount > 0.027 && pixelRatio > 1) {
            pixelRatio = Math.max(1, pixelRatio - 0.25);
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(width, height, false);
          }
          qualityFrameCount = 0;
          qualityElapsed = 0;
        }
        requestFrame();
      }
    }

    const resize = new ResizeObserver(() => {
      width = Math.max(1, host.clientWidth);
      height = Math.max(1, host.clientHeight);
      perspective.aspect = width / height;
      perspective.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      requestFrame();
    });
    resize.observe(host);
    startupCleanup.push(() => resize.disconnect());
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          lastTime = 0;
          requestFrame();
        } else if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
      },
      { rootMargin: "120px" },
    );
    intersection.observe(host);
    startupCleanup.push(() => intersection.disconnect());
    const onVisibility = (): void => {
      lastTime = 0;
      requestFrame();
    };
    const onReducedMotion = (): void => {
      reducedMotion = reducedQuery.matches;
      requestFrame();
    };
    const onContextLost = (event: Event): void => {
      event.preventDefault();
      failed = true;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      options.onError?.();
    };
    const onContextRestored = (): void => {
      failed = false;
      isFirstFrame = true;
      requestFrame();
      if (ready) options.onReady?.();
    };
    const onControlStart = (): void => {
      userControlled = true;
      dragging = true;
      requestFrame();
    };
    const onControlEnd = (): void => {
      dragging = false;
      requestFrame();
    };
    const onControlChange = (): void => {
      if (interactive) requestFrame();
    };
    const onPointerDown = (event: PointerEvent): void => {
      pointerStart.set(event.clientX, event.clientY);
    };
    const onPointerUp = (event: PointerEvent): void => {
      if (
        !interactive ||
        Math.hypot(
          event.clientX - pointerStart.x,
          event.clientY - pointerStart.y,
        ) > 6
      )
        return;
      const rect = canvas.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(model.root.children, true);
      const id = hits.find((hit) => hit.object.userData.componentId)?.object
        .userData.componentId as string | undefined;
      if (id) selectComponent(id);
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (!interactive) return;
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        api.zoom(-0.2);
      }
      if (event.key === "-") {
        event.preventDefault();
        api.zoom(0.2);
      }
      if (event.key === "Home") {
        event.preventDefault();
        api.reset();
      }
      if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      ) {
        event.preventDefault();
        userControlled = true;
        const spherical = new THREE.Spherical().setFromVector3(
          camera.position.clone().sub(controls.target),
        );
        const increment = 0.095;
        if (event.key === "ArrowLeft") spherical.theta -= increment;
        if (event.key === "ArrowRight") spherical.theta += increment;
        if (event.key === "ArrowUp")
          spherical.phi = Math.max(0.15, spherical.phi - increment);
        if (event.key === "ArrowDown")
          spherical.phi = Math.min(Math.PI - 0.15, spherical.phi + increment);
        camera.position.setFromSpherical(spherical).add(controls.target);
        camera.lookAt(controls.target);
        requestFrame();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    reducedQuery.addEventListener("change", onReducedMotion);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("keydown", onKeyDown);
    controls.addEventListener("start", onControlStart);
    controls.addEventListener("end", onControlEnd);
    controls.addEventListener("change", onControlChange);
    startupCleanup.push(() => {
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", onReducedMotion);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("keydown", onKeyDown);
      controls.removeEventListener("start", onControlStart);
      controls.removeEventListener("end", onControlEnd);
      controls.removeEventListener("change", onControlChange);
    });

    const api: ProductScene = {
      setState(state) {
        if (disposed) return;
        if (
          typeof state.progress === "number" &&
          Number.isFinite(state.progress)
        ) {
          const next = clamp(state.progress, 0, 11);
          if (Math.abs(next - targetState.progress) > 0.005) {
            view = null;
            userControlled = false;
          }
          targetState.progress = next;
        }
        for (const key of ["explode", "modular"] as const)
          if (typeof state[key] === "number" && Number.isFinite(state[key]))
            targetState[key] = clamp(state[key], 0, 1);
        if (typeof state.focus === "number" && Number.isFinite(state.focus))
          targetState.focus = clamp(state.focus, -1.5, 1.5);
        for (const key of ["gazeX", "gazeY"] as const)
          if (typeof state[key] === "number" && Number.isFinite(state[key]))
            targetState[key] = clamp(state[key], -1, 1);
        if (typeof state.power === "boolean") targetState.power = state.power;
        if (typeof state.labels === "boolean")
          targetState.labels = state.labels;
        if (
          state.selected === null ||
          (typeof state.selected === "string" &&
            componentInfo.some((item) => item.id === state.selected))
        )
          targetState.selected = state.selected;
        requestFrame();
      },
      setView(next) {
        if (
          ![
            "hero",
            "front",
            "back",
            "left",
            "right",
            "top",
            "exploded",
          ].includes(next)
        )
          return;
        view = next;
        userControlled = false;
        dragging = false;
        manualZoom = 1;
        targetState.explode = next === "exploded" ? 1 : 0;
        orthographic.zoom = 1;
        perspective.zoom = 1;
        requestFrame();
      },
      zoom(delta) {
        if (!Number.isFinite(delta)) return;
        if (userControlled) {
          if (camera instanceof THREE.OrthographicCamera)
            camera.zoom = clamp(
              camera.zoom * Math.exp(-delta * 0.65),
              0.65,
              2.5,
            );
          else {
            const offset = camera.position.clone().sub(controls.target);
            const distance = clamp(
              offset.length() * Math.exp(delta * 0.65),
              controls.minDistance,
              controls.maxDistance,
            );
            camera.position
              .copy(controls.target)
              .add(offset.normalize().multiplyScalar(distance));
          }
          camera.updateProjectionMatrix();
          controls.update();
        } else {
          manualZoom = clamp(manualZoom * Math.exp(-delta * 0.65), 0.65, 2.5);
        }
        requestFrame();
      },
      reset() {
        targetState.explode = 0;
        targetState.modular = 0;
        targetState.selected = null;
        view = "hero";
        userControlled = false;
        dragging = false;
        manualZoom = 1;
        orthographic.zoom = 1;
        perspective.zoom = 1;
        requestFrame();
      },
      capture() {
        if (disposed || failed) return "";
        // Capture immediately after render avoids a permanent preserved GPU buffer.
        renderer.render(scene, camera);
        return canvas.toDataURL("image/png");
      },
      getStats() {
        return {
          drawCalls: renderer.info.render.calls,
          triangles: renderer.info.render.triangles,
        };
      },
      dispose() {
        if (disposed) return;
        disposed = true;
        if (animationFrame) cancelAnimationFrame(animationFrame);
        resize.disconnect();
        intersection.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        reducedQuery.removeEventListener("change", onReducedMotion);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        canvas.removeEventListener("webglcontextrestored", onContextRestored);
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("keydown", onKeyDown);
        controls.removeEventListener("start", onControlStart);
        controls.removeEventListener("end", onControlEnd);
        controls.removeEventListener("change", onControlChange);
        controls.dispose();
        model.dispose();
        selectedOutlineMaterial.dispose();
        environment.dispose();
        renderer.dispose();
        canvas.remove();
        labelLayer.remove();
        scene.clear();
      },
    };
    await yieldToBrowser();
    checkpoint();
    // Physical lenses render the opaque scene into a linear, untone-mapped
    // transmission target before the screen pass. Warm BOTH shader variants;
    // preparing only screen shaders still stalls on first optical rendering.
    await renderer.compileAsync(scene, camera);
    checkpoint();
    await yieldToBrowser();
    checkpoint();
    const opaque = new THREE.Group();
    model.root.traverse((object) => {
      if (
        !(object instanceof THREE.Mesh) ||
        Array.isArray(object.material) ||
        object.material.transparent
      )
        return;
      if (
        object.material instanceof THREE.MeshPhysicalMaterial &&
        object.material.transmission > 0
      )
        return;
      opaque.add(new THREE.Mesh(object.geometry, object.material));
    });
    const transmissionWarmup = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      colorSpace: THREE.LinearSRGBColorSpace,
    });
    const originalToneMapping = renderer.toneMapping;
    renderer.setRenderTarget(transmissionWarmup);
    renderer.toneMapping = THREE.NoToneMapping;
    try {
      await renderer.compileAsync(opaque, camera, scene);
    } finally {
      renderer.setRenderTarget(null);
      renderer.toneMapping = originalToneMapping;
      transmissionWarmup.dispose();
      opaque.clear();
    }
    checkpoint();
    await yieldToBrowser();
    checkpoint();
    applyPending(api);
    Object.assign(currentState, targetState);
    controls.enabled = interactive;
    ready = true;
    revealStart = performance.now();
    render(performance.now());
    return api;
  } catch (error) {
    disposed = true;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    for (const cleanup of startupCleanup.reverse()) cleanup();
    throw error;
  }
}
