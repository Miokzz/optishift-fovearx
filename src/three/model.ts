import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
export { componentInfo } from "./components";

/** World units are centimetres. These are conceptual design dimensions. */
export const productDimensions = { width: 14.2, height: 4.4, temple: 15 };

export interface ProductPart {
  id: string;
  group: THREE.Group;
  origin: THREE.Vector3;
  separation: THREE.Vector3;
  anchor: THREE.Vector3;
}

export interface GlassesModel {
  root: THREE.Group;
  parts: ProductPart[];
  lenses: THREE.MeshPhysicalMaterial[];
  opticalLayers: THREE.MeshPhysicalMaterial[];
  statusMaterials: THREE.MeshStandardMaterial[];
  replacements: { mesh: THREE.Mesh; sign: number }[];
  dispose(): void;
}

// A softly rectangular optical silhouette; a real extruded rim, never a tube.
function eyeShape(inset = 0): THREE.Shape {
  const x = 2.99 - inset;
  const top = 2.06 - inset;
  const bottom = -1.99 + inset;
  const r = Math.max(0.3, 0.79 - inset * 0.25);
  const shape = new THREE.Shape();
  shape.moveTo(-x + r, top);
  shape.bezierCurveTo(-0.9, top + 0.07, 1.2, top + 0.025, x - r, top - 0.035);
  shape.bezierCurveTo(x - 0.19, top - 0.07, x, top - 0.35, x, top - r);
  shape.lineTo(x - 0.04, bottom + r);
  shape.bezierCurveTo(
    x - 0.055,
    bottom + 0.31,
    x - 0.37,
    bottom,
    x - r - 0.06,
    bottom,
  );
  shape.bezierCurveTo(
    0.9,
    bottom - 0.04,
    -1.4,
    bottom - 0.015,
    -x + r,
    bottom + 0.015,
  );
  shape.bezierCurveTo(
    -x + 0.24,
    bottom + 0.03,
    -x,
    bottom + 0.35,
    -x,
    bottom + r,
  );
  shape.lineTo(-x, top - r);
  shape.bezierCurveTo(-x, top - 0.32, -x + 0.31, top, -x + r, top);
  shape.closePath();
  return shape;
}

function rimGeometry(
  inset: number,
  width: number,
  depth: number,
  bevel: number,
): THREE.ExtrudeGeometry {
  const shape = eyeShape(inset);
  const hole = new THREE.Path(
    eyeShape(inset + width)
      .getPoints(24)
      .reverse(),
  );
  shape.holes.push(hole);
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 16,
    steps: 1,
  });
}

/** Optical volume has curved front/back surfaces and a closed thickness edge. */
function lensGeometry(
  inset: number,
  thickness: number,
  curvature: number,
): THREE.BufferGeometry {
  const shape = eyeShape(inset);
  const face = new THREE.ShapeGeometry(shape, 24).toNonIndexed();
  const facePositions = face.getAttribute("position");
  const positions: number[] = [];
  const sag = (x: number, y: number) =>
    curvature * Math.max(0, 1 - (x / 3.1) ** 2 - (y / 2.2) ** 2);
  for (let i = 0; i < facePositions.count; i += 3) {
    for (const j of [0, 1, 2]) {
      const x = facePositions.getX(i + j);
      const y = facePositions.getY(i + j);
      positions.push(x, y, thickness / 2 + sag(x, y));
    }
    for (const j of [2, 1, 0]) {
      const x = facePositions.getX(i + j);
      const y = facePositions.getY(i + j);
      positions.push(x, y, -thickness / 2 + sag(x, y) * 0.55);
    }
  }
  const outline = shape.getPoints(96);
  for (let i = 0; i < outline.length - 1; i++) {
    const a = outline[i];
    const b = outline[i + 1];
    const az = sag(a.x, a.y);
    const bz = sag(b.x, b.y);
    positions.push(
      a.x,
      a.y,
      thickness / 2 + az,
      b.x,
      b.y,
      thickness / 2 + bz,
      a.x,
      a.y,
      -thickness / 2 + az * 0.55,
    );
    positions.push(
      b.x,
      b.y,
      thickness / 2 + bz,
      b.x,
      b.y,
      -thickness / 2 + bz * 0.55,
      a.x,
      a.y,
      -thickness / 2 + az * 0.55,
    );
  }
  face.dispose();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.computeVertexNormals();
  return geometry;
}

interface SweepSection {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
}

/** Beveled rectangular section swept through measured temple stations. */
function sweptSection(
  sections: SweepSection[],
  profile: THREE.Vector2[],
): THREE.BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  const n = profile.length;
  for (const section of sections) {
    for (const p of profile)
      positions.push(
        section.x + p.x * section.width,
        section.y + p.y * section.height,
        section.z,
      );
  }
  for (let s = 0; s < sections.length - 1; s++) {
    for (let i = 0; i < n; i++) {
      const next = (i + 1) % n;
      const a = s * n + i;
      const b = s * n + next;
      const c = (s + 1) * n + i;
      const d = (s + 1) * n + next;
      indices.push(a, c, b, b, c, d);
    }
  }
  const cap = THREE.ShapeUtils.triangulateShape(profile, []);
  for (const t of cap) {
    indices.push(t[0], t[1], t[2]);
    const offset = (sections.length - 1) * n;
    indices.push(offset + t[2], offset + t[1], offset + t[0]);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function roundedSection(): THREE.Vector2[] {
  const points: THREE.Vector2[] = [];
  const r = 0.16;
  for (const [cx, cy, start] of [
    [0.5 - r, 0.5 - r, 0],
    [-0.5 + r, 0.5 - r, Math.PI / 2],
    [-0.5 + r, -0.5 + r, Math.PI],
    [0.5 - r, -0.5 + r, Math.PI * 1.5],
  ]) {
    for (let i = 0; i <= 4; i++) {
      const angle = start + ((i / 4) * Math.PI) / 2;
      points.push(
        new THREE.Vector2(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r),
      );
    }
  }
  return points;
}

function beveledBox(
  width: number,
  height: number,
  depth: number,
  bevel = 0.04,
): THREE.ExtrudeGeometry {
  const r = Math.min(bevel, width / 4, height / 4, depth / 4);
  const shape = new THREE.Shape();
  const x = width / 2 - r;
  const y = height / 2 - r;
  shape.moveTo(-x, -y);
  shape.lineTo(x, -y);
  shape.lineTo(x, y);
  shape.lineTo(-x, y);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth - r * 2,
    bevelEnabled: true,
    bevelThickness: r,
    bevelSize: r,
    bevelSegments: 3,
    steps: 1,
  });
  geometry.translate(0, 0, -depth / 2 + r);
  return geometry;
}

export function createGlassesModel(): GlassesModel {
  const root = new THREE.Group();
  root.name = "FoveaRx One · protótipo digital conceitual";
  const parts: ProductPart[] = [];
  const materials = new Set<THREE.Material>();
  const geometries = new Set<THREE.BufferGeometry>();
  const material = <T extends THREE.Material>(value: T): T => {
    materials.add(value);
    return value;
  };
  const titanium = material(
    new THREE.MeshPhysicalMaterial({
      color: "#41454a",
      metalness: 1,
      roughness: 0.28,
      clearcoat: 0.22,
      clearcoatRoughness: 0.25,
      envMapIntensity: 1.2,
    }),
  );
  const edge = material(
    new THREE.MeshStandardMaterial({
      color: "#95999d",
      metalness: 1,
      roughness: 0.21,
      envMapIntensity: 1.1,
    }),
  );
  const shell = material(
    new THREE.MeshPhysicalMaterial({
      color: "#303439",
      metalness: 0.88,
      roughness: 0.31,
      clearcoat: 0.2,
    }),
  );
  const black = material(
    new THREE.MeshStandardMaterial({
      color: "#0b0d10",
      metalness: 0.45,
      roughness: 0.27,
    }),
  );
  const rubber = material(
    new THREE.MeshStandardMaterial({
      color: "#202328",
      metalness: 0.03,
      roughness: 0.62,
    }),
  );
  const silicon = material(
    new THREE.MeshStandardMaterial({
      color: "#191d22",
      metalness: 0.28,
      roughness: 0.38,
    }),
  );
  const gold = material(
    new THREE.MeshStandardMaterial({
      color: "#b59a60",
      metalness: 0.94,
      roughness: 0.36,
    }),
  );
  const pcb = material(
    new THREE.MeshStandardMaterial({
      color: "#243d36",
      metalness: 0.25,
      roughness: 0.56,
    }),
  );
  const batteryFoil = material(
    new THREE.MeshStandardMaterial({
      color: "#a3a5a6",
      metalness: 0.82,
      roughness: 0.43,
    }),
  );
  const silicone = material(
    new THREE.MeshPhysicalMaterial({
      color: "#dadcd8",
      roughness: 0.32,
      transmission: 0.45,
      thickness: 0.12,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    }),
  );
  const sensorGlass = material(
    new THREE.MeshPhysicalMaterial({
      color: "#171a20",
      metalness: 0.28,
      roughness: 0.075,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
    }),
  );
  const status = material(
    new THREE.MeshStandardMaterial({
      color: "#9dadad",
      emissive: "#82bbc0",
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.4,
    }),
  );
  const lenses: THREE.MeshPhysicalMaterial[] = [];
  const opticalLayers: THREE.MeshPhysicalMaterial[] = [];
  const replacements: { mesh: THREE.Mesh; sign: number }[] = [];

  function part(
    id: string,
    separation: THREE.Vector3,
    anchor: THREE.Vector3,
  ): THREE.Group {
    const group = new THREE.Group();
    group.name = id;
    group.userData.componentId = id;
    root.add(group);
    parts.push({
      id,
      group,
      origin: group.position.clone(),
      separation,
      anchor,
    });
    return group;
  }
  function mesh(
    group: THREE.Group,
    geometry: THREE.BufferGeometry,
    surface: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ): THREE.Mesh {
    geometries.add(geometry);
    const value = new THREE.Mesh(geometry, surface);
    value.position.set(x, y, z);
    value.userData.componentId = group.userData.componentId;
    group.add(value);
    return value;
  }
  function box(
    group: THREE.Group,
    surface: THREE.Material,
    dimensions: [number, number, number],
    at: [number, number, number],
    bevel = 0.025,
  ): THREE.Mesh {
    return mesh(group, beveledBox(...dimensions, bevel), surface, ...at);
  }
  function batchBoxes(
    group: THREE.Group,
    surface: THREE.Material,
    items: { size: [number, number, number]; at: [number, number, number] }[],
  ): void {
    const buffers = items.map(({ size, at }) =>
      new THREE.BoxGeometry(...size).translate(...at),
    );
    const merged = mergeGeometries(buffers);
    for (const geometry of buffers) geometry.dispose();
    if (merged) mesh(group, merged, surface);
  }
  function wire(
    group: THREE.Group,
    points: THREE.Vector3[],
    radius: number,
    surface: THREE.Material,
  ): void {
    mesh(
      group,
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),
        28,
        radius,
        6,
        false,
      ),
      surface,
    );
  }

  const frame = part(
    "frame",
    new THREE.Vector3(0, 0.25, 0),
    new THREE.Vector3(-4.5, 1.8, 0.12),
  );
  const rim = rimGeometry(0, 0.15, 0.17, 0.026);
  const trim = rimGeometry(0.019, 0.024, 0.012, 0.008);
  for (const sign of [-1, 1]) {
    mesh(frame, rim, titanium, sign * 3.56, 0, 0);
    mesh(frame, trim, edge, sign * 3.56, 0, 0.213);
    const end = box(
      frame,
      titanium,
      [0.57, 0.35, 0.23],
      [sign * 6.82, 0.88, -0.035],
      0.05,
    );
    end.rotation.z = sign * -0.035;
  }
  const bridge = part(
    "bridge",
    new THREE.Vector3(0, 1.7, 0.45),
    new THREE.Vector3(0, 0.9, 0.15),
  );
  const bridgeShape = new THREE.Shape();
  bridgeShape.moveTo(-0.63, 0.89);
  bridgeShape.bezierCurveTo(-0.27, 1.18, 0.27, 1.18, 0.63, 0.89);
  bridgeShape.lineTo(0.63, 0.74);
  bridgeShape.bezierCurveTo(0.25, 1.03, -0.25, 1.03, -0.63, 0.74);
  bridgeShape.closePath();
  mesh(
    bridge,
    new THREE.ExtrudeGeometry(bridgeShape, {
      depth: 0.19,
      bevelEnabled: true,
      bevelSize: 0.022,
      bevelThickness: 0.022,
      bevelSegments: 3,
      curveSegments: 24,
    }),
    titanium,
  );

  const nose = part(
    "nosepads",
    new THREE.Vector3(0, -1.8, -0.8),
    new THREE.Vector3(0.78, -0.32, -0.52),
  );
  for (const sign of [-1, 1]) {
    wire(
      nose,
      [
        new THREE.Vector3(sign * 0.71, 0.35, -0.04),
        new THREE.Vector3(sign * 0.64, -0.05, -0.38),
        new THREE.Vector3(sign * 0.75, -0.32, -0.61),
      ],
      0.035,
      edge,
    );
    const pad = mesh(
      nose,
      new THREE.SphereGeometry(1, 16, 12),
      silicone,
      sign * 0.77,
      -0.43,
      -0.62,
    );
    pad.scale.set(0.135, 0.39, 0.095);
    pad.rotation.z = sign * -0.22;
    pad.rotation.y = sign * 0.28;
  }

  const electrodeGroup = part(
    "electrodes",
    new THREE.Vector3(0, 0, 5.8),
    new THREE.Vector3(3.6, 0, 0.24),
  );
  for (const sign of [-1, 1]) {
    const suffix = sign === -1 ? "left" : "right";
    const base = part(
      `lens-${suffix}`,
      new THREE.Vector3(sign * 0.7, 0.05, 2.65),
      new THREE.Vector3(sign * 3.56, 0, 0.1),
    );
    const lensMaterial = material(
      new THREE.MeshPhysicalMaterial({
        color: "#f5f7f5",
        transmission: 0.97,
        thickness: 0.13,
        ior: 1.46,
        roughness: 0.035,
        metalness: 0,
        attenuationColor: new THREE.Color("#dae4de"),
        attenuationDistance: 20,
        envMapIntensity: 0.26,
        clearcoat: 0.08,
        clearcoatRoughness: 0.04,
        transparent: true,
        opacity: 0.56,
        depthWrite: false,
      }),
    );
    lenses.push(lensMaterial);
    const lensVolume = lensGeometry(0.155, 0.105, 0.07);
    mesh(base, lensVolume, lensMaterial, sign * 3.56, 0, 0.11);
    const replacement = mesh(
      base,
      lensVolume,
      lensMaterial,
      sign * 3.56,
      0,
      0.11,
    );
    replacement.name = "Lente-base de substituição conceitual";
    replacement.visible = false;
    replacements.push({ mesh: replacement, sign });
    const adaptive = part(
      `lc-${suffix}`,
      new THREE.Vector3(sign * 1.15, 0.12, 4.15),
      new THREE.Vector3(sign * 3.56, 0, -0.016),
    );
    const lcMaterial = material(
      new THREE.MeshPhysicalMaterial({
        color: "#c6d7d3",
        transmission: 0.98,
        thickness: 0.018,
        ior: 1.46,
        roughness: 0.04,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
        envMapIntensity: 0.6,
      }),
    );
    opticalLayers.push(lcMaterial);
    mesh(
      adaptive,
      lensGeometry(0.175, 0.018, 0.044),
      lcMaterial,
      sign * 3.56,
      0,
      0.027,
    ).renderOrder = 2;
    const electrodeMaterial = material(
      new THREE.MeshPhysicalMaterial({
        color: "#d7e3df",
        transmission: 0.97,
        thickness: 0.006,
        transparent: true,
        opacity: 0.045,
        depthWrite: false,
        roughness: 0.055,
      }),
    );
    mesh(
      electrodeGroup,
      lensGeometry(0.192, 0.006, 0.02),
      electrodeMaterial,
      sign * 3.56,
      0,
      -0.002,
    ).renderOrder = 1;
    mesh(
      electrodeGroup,
      rimGeometry(0.185, 0.011, 0.004, 0),
      gold,
      sign * 3.56,
      0,
      -0.002,
    );
    box(
      adaptive,
      gold,
      [0.075, 0.22, 0.018],
      [sign * 6.32, 0.77, 0.015],
      0.002,
    );
  }

  const housingProfile = [
    [0.5, -0.43],
    [0.4, -0.5],
    [-0.35, -0.5],
    [-0.5, -0.36],
    [-0.5, 0.36],
    [-0.35, 0.5],
    [0.4, 0.5],
    [0.5, 0.43],
    [0.5, 0.31],
    [-0.19, 0.31],
    [-0.29, 0.22],
    [-0.29, -0.22],
    [-0.19, -0.31],
    [0.5, -0.31],
  ]
    .map(([x, y]) => new THREE.Vector2(x, y))
    .reverse();
  for (const sign of [-1, 1]) {
    const temple = part(
      sign < 0 ? "temple-left" : "temple-right",
      new THREE.Vector3(sign * 2.4, 0, -0.8),
      new THREE.Vector3(sign * 6.88, 0.8, -6.7),
    );
    const cross = housingProfile.map((p) => new THREE.Vector2(p.x * sign, p.y));
    if (sign < 0) cross.reverse();
    const stations = [
      { x: sign * 6.87, y: 0.85, z: -0.12, width: 0.43, height: 0.68 },
      { x: sign * 6.93, y: 0.88, z: -0.6, width: 0.44, height: 0.72 },
      { x: sign * 6.98, y: 0.86, z: -3.3, width: 0.42, height: 0.66 },
      { x: sign * 6.99, y: 0.71, z: -6.4, width: 0.37, height: 0.57 },
      { x: sign * 6.92, y: 0.6, z: -7.9, width: 0.31, height: 0.46 },
    ];
    mesh(temple, sweptSection(stations, cross), shell);
    const tip = [
      { x: sign * 6.92, y: 0.6, z: -7.85, width: 0.31, height: 0.46 },
      { x: sign * 6.85, y: 0.58, z: -9.7, width: 0.3, height: 0.42 },
      { x: sign * 6.69, y: 0.34, z: -11.65, width: 0.28, height: 0.4 },
      { x: sign * 6.5, y: -0.3, z: -13.05, width: 0.27, height: 0.38 },
      { x: sign * 6.39, y: -1.12, z: -14.13, width: 0.25, height: 0.32 },
      { x: sign * 6.36, y: -1.4, z: -14.78, width: 0.22, height: 0.28 },
      { x: sign * 6.35, y: -1.4, z: -14.91, width: 0.08, height: 0.14 },
    ];
    mesh(temple, sweptSection(tip, roundedSection()), rubber);
    const seam = box(
      temple,
      edge,
      [0.32, 0.045, 0.075],
      [sign * 6.92, 0.8, -7.88],
      0.01,
    );
    seam.rotation.x = -0.08;
  }

  const hinges = part(
    "hinges",
    new THREE.Vector3(0, 1.3, -0.25),
    new THREE.Vector3(6.87, 0.9, -0.18),
  );
  for (const sign of [-1, 1]) {
    for (const y of [0.67, 0.91, 1.15])
      mesh(
        hinges,
        new THREE.CylinderGeometry(0.112, 0.112, 0.18, 16),
        titanium,
        sign * 6.86,
        y,
        -0.13,
      );
    mesh(
      hinges,
      new THREE.CylinderGeometry(0.065, 0.065, 0.71, 12),
      edge,
      sign * 6.86,
      0.9,
      -0.13,
    );
    mesh(
      hinges,
      new THREE.CylinderGeometry(0.1, 0.1, 0.023, 16),
      edge,
      sign * 6.86,
      1.27,
      -0.13,
    );
    box(hinges, black, [0.11, 0.009, 0.02], [sign * 6.86, 1.287, -0.13], 0.002);
  }

  const covers = part(
    "covers",
    new THREE.Vector3(0, 2.7, -0.35),
    new THREE.Vector3(-7.21, 0.83, -3.6),
  );
  for (const sign of [-1, 1]) {
    const stations = [
      { x: sign * 7.105, y: 0.88, z: -0.66, width: 0.055, height: 0.5 },
      { x: sign * 7.18, y: 0.86, z: -3.3, width: 0.055, height: 0.46 },
      { x: sign * 7.175, y: 0.73, z: -6.35, width: 0.055, height: 0.42 },
      { x: sign * 7.085, y: 0.62, z: -7.63, width: 0.055, height: 0.32 },
    ];
    mesh(covers, sweptSection(stations, roundedSection()), titanium);
    for (const z of [-0.95, -7.3]) {
      const screw = mesh(
        covers,
        new THREE.CylinderGeometry(0.044, 0.044, 0.013, 12),
        edge,
        sign * (z > -2 ? 7.142 : 7.13),
        z > -2 ? 0.88 : 0.65,
        z,
      );
      screw.rotation.z = Math.PI / 2;
    }
  }

  const circuits = part(
    "circuits",
    new THREE.Vector3(-1.15, -1.85, -0.5),
    new THREE.Vector3(-6.87, 0.83, -3.65),
  );
  box(circuits, pcb, [0.045, 0.42, 6.35], [-6.875, 0.84, -3.95], 0.012);
  box(circuits, pcb, [0.04, 0.35, 1.8], [6.89, 0.87, -1.8], 0.01);
  const chips: {
    size: [number, number, number];
    at: [number, number, number];
  }[] = [];
  const contacts: {
    size: [number, number, number];
    at: [number, number, number];
  }[] = [];
  for (let i = 0; i < 13; i++) {
    chips.push({
      size: [0.095, i % 3 === 0 ? 0.22 : 0.11, i % 3 === 0 ? 0.38 : 0.18],
      at: [-6.945, 0.84 + (i % 2 ? 0.09 : -0.08), -1.2 - i * 0.4],
    });
    contacts.push({
      size: [0.1, 0.037, 0.075],
      at: [-6.955, 1.0, -1.15 - i * 0.4],
    });
  }
  batchBoxes(circuits, silicon, chips);
  batchBoxes(circuits, gold, contacts);
  const traces: THREE.BufferGeometry[] = [];
  for (const y of [0.72, 0.84, 0.95])
    traces.push(
      new THREE.BoxGeometry(0.003, 0.009, 5.7).translate(-6.901, y, -3.95),
    );
  const tracesMerged = mergeGeometries(traces);
  for (const item of traces) item.dispose();
  if (tracesMerged) mesh(circuits, tracesMerged, gold);

  const processor = part(
    "processor",
    new THREE.Vector3(-2.25, -0.7, -0.3),
    new THREE.Vector3(-7.02, 0.85, -2.9),
  );
  box(processor, silicon, [0.12, 0.34, 0.59], [-6.974, 0.85, -2.95], 0.025);
  box(processor, edge, [0.009, 0.27, 0.48], [-7.038, 0.85, -2.95], 0.008);
  batchBoxes(
    processor,
    gold,
    Array.from({ length: 8 }, (_, i) => ({
      size: [0.043, 0.016, 0.035] as [number, number, number],
      at: [-6.968, i < 4 ? 1.03 : 0.67, -2.75 - (i % 4) * 0.12] as [
        number,
        number,
        number,
      ],
    })),
  );

  const battery = part(
    "battery",
    new THREE.Vector3(2.05, -1.75, -0.2),
    new THREE.Vector3(6.96, 0.79, -5),
  );
  box(battery, batteryFoil, [0.21, 0.37, 3.75], [6.975, 0.79, -5.0], 0.045);
  box(battery, black, [0.014, 0.27, 2.88], [7.084, 0.79, -5.0], 0.018);
  box(battery, gold, [0.11, 0.06, 0.26], [6.96, 0.87, -2.99], 0.009);

  const ir = part(
    "ir",
    new THREE.Vector3(0, -1.8, 1.3),
    new THREE.Vector3(-0.78, 0.15, -0.1),
  );
  for (const sign of [-1, 1]) {
    box(ir, titanium, [0.25, 0.32, 0.22], [sign * 0.72, 0.16, -0.105], 0.05);
    const bezel = mesh(
      ir,
      new THREE.CylinderGeometry(0.094, 0.094, 0.04, 24),
      edge,
      sign * 0.72,
      0.16,
      0.019,
    );
    bezel.rotation.x = Math.PI / 2;
    const window = mesh(
      ir,
      new THREE.CylinderGeometry(0.073, 0.073, 0.019, 24),
      sensorGlass,
      sign * 0.72,
      0.16,
      0.045,
    );
    window.rotation.x = Math.PI / 2;
    const emitter = mesh(
      ir,
      new THREE.CircleGeometry(0.018, 12),
      status,
      sign * 0.72 + sign * 0.03,
      0.17,
      0.056,
    );
    emitter.name = "Émetteur IR conceptuel";
  }
  const tof = part(
    "tof",
    new THREE.Vector3(0, 2.55, 1.8),
    new THREE.Vector3(0, 1.05, 0.22),
  );
  box(tof, titanium, [0.48, 0.22, 0.22], [0, 1.02, 0.16], 0.042);
  box(tof, sensorGlass, [0.375, 0.133, 0.024], [0, 1.02, 0.283], 0.032);
  const tofOptic = mesh(
    tof,
    new THREE.CircleGeometry(0.039, 20),
    black,
    -0.075,
    1.02,
    0.298,
  );
  tofOptic.name = "Optique de réception";
  mesh(tof, new THREE.CircleGeometry(0.027, 16), status, 0.08, 1.02, 0.299);

  const buttons = part(
    "buttons",
    new THREE.Vector3(0, 1.6, -0.15),
    new THREE.Vector3(6.94, 1.25, -1.7),
  );
  for (const sign of [-1, 1]) {
    box(buttons, black, [0.3, 0.025, 0.71], [sign * 6.947, 1.224, -1.63], 0.02);
    box(
      buttons,
      edge,
      [0.25, 0.045, 0.56],
      [sign * 6.947, 1.256, -1.63],
      0.023,
    );
  }
  const usb = part(
    "usb",
    new THREE.Vector3(1.75, -1.4, -0.25),
    new THREE.Vector3(7.13, 0.6, -7.1),
  );
  box(usb, edge, [0.037, 0.2, 0.77], [7.12, 0.67, -7.03], 0.025);
  box(usb, black, [0.018, 0.15, 0.65], [7.145, 0.67, -7.03], 0.035);
  box(usb, silicon, [0.021, 0.037, 0.45], [7.158, 0.67, -7.03], 0.006);

  const connections = part(
    "connections",
    new THREE.Vector3(0, -2.9, -0.55),
    new THREE.Vector3(-6.89, 0.9, -0.8),
  );
  for (const sign of [-1, 1]) {
    wire(
      connections,
      [
        new THREE.Vector3(sign * 6.89, 0.92, -1.3),
        new THREE.Vector3(sign * 6.86, 1.05, -0.39),
        new THREE.Vector3(sign * 6.42, 1.02, -0.035),
      ],
      0.019,
      gold,
    );
    box(
      connections,
      gold,
      [0.07, 0.11, 0.48],
      [sign * 6.91, 0.88, -2.7],
      0.009,
    );
  }

  // Batch each mechanical component by material. Components stay independently
  // selectable/explodable while every screw does not cost its own draw call.
  for (const entry of parts) {
    const byMaterial = new Map<THREE.Material, THREE.Mesh[]>();
    for (const child of [...entry.group.children]) {
      if (
        !(child instanceof THREE.Mesh) ||
        Array.isArray(child.material) ||
        child.material.transparent
      )
        continue;
      if (
        child.material instanceof THREE.MeshPhysicalMaterial &&
        child.material.transmission > 0
      )
        continue;
      const existing = byMaterial.get(child.material) ?? [];
      existing.push(child);
      byMaterial.set(child.material, existing);
    }
    for (const [surface, nodes] of byMaterial) {
      if (nodes.length < 2) continue;
      const buffers = nodes.map((node) => {
        node.updateMatrix();
        const buffer = node.geometry.index
          ? node.geometry.toNonIndexed()
          : node.geometry.clone();
        return buffer.applyMatrix4(node.matrix);
      });
      const merged = mergeGeometries(buffers);
      for (const buffer of buffers) buffer.dispose();
      if (!merged) continue;
      for (const node of nodes) entry.group.remove(node);
      mesh(entry.group, merged, surface);
    }
  }
  const used = new Set<THREE.BufferGeometry>();
  root.traverse((node) => {
    if (node instanceof THREE.Mesh) used.add(node.geometry);
  });
  for (const geometry of geometries)
    if (!used.has(geometry)) {
      geometry.dispose();
      geometries.delete(geometry);
    }
  root.updateMatrixWorld(true);
  return {
    root,
    parts,
    lenses,
    opticalLayers,
    statusMaterials: [status],
    replacements,
    dispose() {
      for (const item of geometries) item.dispose();
      for (const item of materials) item.dispose();
    },
  };
}
