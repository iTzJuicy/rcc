import { useEffect, useRef, useState } from "react";

/**
 * Model3DViewer
 * - If modelUrl is set  → renders uploaded GLB via <model-viewer> web component (CDN)
 * - If template is set  → renders a procedural Three.js building shape
 * - If neither           → renders nothing
 *
 * Three.js is loaded via CDN in index.html (window.THREE).
 * model-viewer is loaded via CDN in index.html as an ES module.
 */

// ─── Procedural Three.js building shapes ───────────────────────────────────

function buildVilla(THREE) {
  const group = new THREE.Group();
  // Base (ground floor)
  const baseGeo = new THREE.BoxGeometry(4, 1.5, 3);
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xe8d5b0 });
  const base = new THREE.Mesh(baseGeo, wallMat);
  base.position.y = 0.75;
  group.add(base);
  // Roof (prism)
  const roofGeo = new THREE.CylinderGeometry(0, 2.9, 1.5, 4, 1);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = 2.25;
  roof.rotation.y = Math.PI / 4;
  group.add(roof);
  // Door
  const doorGeo = new THREE.BoxGeometry(0.6, 1.0, 0.1);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x5c3d1a });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0, 0.5, 1.56);
  group.add(door);
  // Windows x2
  const winGeo = new THREE.BoxGeometry(0.7, 0.6, 0.1);
  const winMat = new THREE.MeshStandardMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.7 });
  [-1.2, 1.2].forEach((x) => {
    const win = new THREE.Mesh(winGeo, winMat);
    win.position.set(x, 1.0, 1.56);
    group.add(win);
  });
  return group;
}

function buildApartment(THREE) {
  const group = new THREE.Group();
  const floors = 5;
  const floorH = 1.0;
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xd0d8e8 });
  const winMat = new THREE.MeshStandardMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.75 });
  const balMat = new THREE.MeshStandardMaterial({ color: 0xb0b8c8 });

  for (let f = 0; f < floors; f++) {
    const floorGeo = new THREE.BoxGeometry(4, floorH, 2.5);
    const floorMesh = new THREE.Mesh(floorGeo, wallMat);
    floorMesh.position.y = f * floorH + floorH / 2;
    group.add(floorMesh);
    // Windows on front face
    [-1.1, 0, 1.1].forEach((x) => {
      const wg = new THREE.BoxGeometry(0.6, 0.55, 0.05);
      const w = new THREE.Mesh(wg, winMat);
      w.position.set(x, f * floorH + floorH / 2, 1.28);
      group.add(w);
    });
    // Balcony slab
    const balGeo = new THREE.BoxGeometry(4.4, 0.08, 0.5);
    const bal = new THREE.Mesh(balGeo, balMat);
    bal.position.set(0, f * floorH, 1.5);
    group.add(bal);
  }
  // Roof
  const roofGeo = new THREE.BoxGeometry(4.2, 0.2, 2.7);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x8899aa });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = floors * floorH + 0.1;
  group.add(roof);
  return group;
}

function buildTower(THREE) {
  const group = new THREE.Group();
  const floors = 10;
  const floorH = 0.7;
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x5ec8b8, transparent: true, opacity: 0.8, metalness: 0.4 });
  const concreteMat = new THREE.MeshStandardMaterial({ color: 0xaab0ba });

  for (let f = 0; f < floors; f++) {
    const fGeo = new THREE.BoxGeometry(2.5, floorH * 0.9, 2.5);
    const fMesh = new THREE.Mesh(fGeo, glassMat);
    fMesh.position.y = f * floorH + floorH / 2;
    group.add(fMesh);
    // Structural bands
    const bGeo = new THREE.BoxGeometry(2.6, 0.08, 2.6);
    const band = new THREE.Mesh(bGeo, concreteMat);
    band.position.y = (f + 1) * floorH;
    group.add(band);
  }
  // Spire
  const spireGeo = new THREE.CylinderGeometry(0.05, 0.3, 1.5, 8);
  const spireMat = new THREE.MeshStandardMaterial({ color: 0x778899, metalness: 0.8 });
  const spire = new THREE.Mesh(spireGeo, spireMat);
  spire.position.y = floors * floorH + 0.75;
  group.add(spire);
  return group;
}

function buildWarehouse(THREE) {
  const group = new THREE.Group();
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xd0c090 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x778899 });
  // Main body
  const bodyGeo = new THREE.BoxGeometry(7, 2.2, 3.5);
  const body = new THREE.Mesh(bodyGeo, wallMat);
  body.position.y = 1.1;
  group.add(body);
  // Arched roof (approximated with cylinder half)
  const roofGeo = new THREE.CylinderGeometry(2.0, 2.0, 7, 32, 1, false, 0, Math.PI);
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 2.2;
  group.add(roof);
  // Loading bay doors x2
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x5c3d1a });
  [-2, 2].forEach((x) => {
    const dg = new THREE.BoxGeometry(1.4, 1.8, 0.1);
    const d = new THREE.Mesh(dg, doorMat);
    d.position.set(x, 0.9, 1.78);
    group.add(d);
  });
  return group;
}

function buildComplex(THREE) {
  const group = new THREE.Group();
  const wallMat1 = new THREE.MeshStandardMaterial({ color: 0xe8d5b0 });
  const wallMat2 = new THREE.MeshStandardMaterial({ color: 0xd0d8e8 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const winMat = new THREE.MeshStandardMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.7 });

  // Block A (3 floors)
  for (let f = 0; f < 3; f++) {
    const bg = new THREE.BoxGeometry(2.5, 1.0, 2);
    const b = new THREE.Mesh(bg, wallMat1);
    b.position.set(-2.5, f + 0.5, 0);
    group.add(b);
  }
  // Block A roof
  const ra = new THREE.CylinderGeometry(0, 1.9, 1.0, 4);
  const raMesh = new THREE.Mesh(ra, roofMat);
  raMesh.position.set(-2.5, 3.5, 0);
  raMesh.rotation.y = Math.PI / 4;
  group.add(raMesh);

  // Block B (5 floors, taller)
  for (let f = 0; f < 5; f++) {
    const bg = new THREE.BoxGeometry(2.5, 0.9, 2);
    const b = new THREE.Mesh(bg, wallMat2);
    b.position.set(1.8, f * 0.9 + 0.45, 0);
    group.add(b);
    // Windows
    const wg = new THREE.BoxGeometry(0.6, 0.5, 0.05);
    [-0.5, 0.5].forEach((x) => {
      const w = new THREE.Mesh(wg, winMat);
      w.position.set(1.8 + x, f * 0.9 + 0.45, 1.03);
      group.add(w);
    });
  }
  // Connecting walkway
  const walkGeo = new THREE.BoxGeometry(1.4, 0.1, 0.8);
  const walkMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const walk = new THREE.Mesh(walkGeo, walkMat);
  walk.position.set(-0.55, 2.0, 0);
  group.add(walk);

  return group;
}

const BUILDERS = { villa: buildVilla, apartment: buildApartment, tower: buildTower, warehouse: buildWarehouse, complex: buildComplex };

/**
 * Extracts architectural attributes (dominant facade color, trim color, roof color,
 * estimated floor count, and width/depth proportions) from the central building region
 * of a photo, ignoring sky/background, then constructs a full 360-degree 3D building.
 */
function analyzeBuildingImage(img) {
  const size = 96;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;

  const x0 = Math.floor(size * 0.22);
  const x1 = Math.floor(size * 0.78);
  const y0 = Math.floor(size * 0.22);
  const y1 = Math.floor(size * 0.82);

  let rSum = 0, gSum = 0, bSum = 0, count = 0;
  let darkR = 0, darkG = 0, darkB = 0, darkCount = 0;
  let roofR = 0, roofG = 0, roofB = 0, roofCount = 0;
  const rowLums = [];

  for (let y = y0; y < y1; y++) {
    let rowLum = 0;
    let rowPixels = 0;
    for (let x = x0; x < x1; x++) {
      const i = (y * size + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      rowLum += lum;
      rowPixels++;

      // Skip obvious sky-blue or blown-out white sky pixels in upper half
      const isSky = y < size * 0.45 && b > r + 22 && b > g + 5 && lum > 130;
      if (isSky) continue;

      if (y < size * 0.34) {
        roofR += r; roofG += g; roofB += b; roofCount++;
      } else if (lum < 75) {
        darkR += r; darkG += g; darkB += b; darkCount++;
      } else if (lum < 240) {
        rSum += r; gSum += g; bSum += b; count++;
      }
    }
    rowLums.push(rowLum / Math.max(1, rowPixels));
  }

  // Count significant horizontal luminance peaks/troughs (window bands -> floors)
  let transitions = 0;
  for (let i = 2; i < rowLums.length - 2; i++) {
    const prev = (rowLums[i - 2] + rowLums[i - 1]) / 2;
    const curr = rowLums[i];
    const next = (rowLums[i + 1] + rowLums[i + 2]) / 2;
    if ((curr < prev - 6 && curr < next - 6) || (curr > prev + 6 && curr > next + 6)) {
      transitions++;
      i += 2; // debounce adjacent rows
    }
  }

  const aspect = img.width / Math.max(1, img.height);
  const floors = Math.max(2, Math.min(10, Math.round(transitions * 0.75) || (aspect < 0.9 ? 6 : 3)));

  const wallHex = count > 20
    ? ((Math.round(rSum / count) << 16) | (Math.round(gSum / count) << 8) | Math.round(bSum / count))
    : 0xd8cfc2;

  const trimHex = darkCount > 15
    ? ((Math.round(darkR / darkCount) << 16) | (Math.round(darkG / darkCount) << 8) | Math.round(darkB / darkCount))
    : 0x3b4758;

  const roofHex = roofCount > 15
    ? ((Math.round(roofR / roofCount) << 16) | (Math.round(roofG / roofCount) << 8) | Math.round(roofB / roofCount))
    : 0x525d6d;

  return {
    floors,
    aspect,
    wallColor: wallHex,
    trimColor: trimHex,
    roofColor: roofHex,
    isGlassHeavy: (bSum / Math.max(1, count)) > (rSum / Math.max(1, count)) + 14,
  };
}

function buildExtractedBuilding(THREE, attrs) {
  const group = new THREE.Group();
  const { floors, aspect, wallColor, trimColor, roofColor, isGlassHeavy } = attrs;

  const isLowRise = floors <= 2;
  const isTower = floors >= 7;

  const width = isTower ? 3.2 : Math.min(5.6, Math.max(3.4, 3.8 * Math.min(1.4, aspect)));
  const depth = isTower ? 3.2 : Math.max(2.4, width * 0.68);
  const floorH = isTower ? 0.72 : isLowRise ? 1.35 : 0.95;
  const totalH = floors * floorH;

  const wallMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.65, metalness: 0.08 });
  const trimMat = new THREE.MeshStandardMaterial({ color: trimColor, roughness: 0.5, metalness: 0.25 });
  const roofMat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.6, metalness: 0.15 });
  const glassMat = new THREE.MeshStandardMaterial({
    color: isGlassHeavy ? 0x64b5d6 : 0x87ceeb,
    roughness: 0.15,
    metalness: 0.55,
    transparent: true,
    opacity: 0.82,
  });

  // Base plinth
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(width + 1.1, 0.28, depth + 1.1),
    new THREE.MeshStandardMaterial({ color: 0x222b38, roughness: 0.85 })
  );
  plinth.position.y = 0.14;
  group.add(plinth);

  const baseY = 0.28;
  const winCols = Math.max(2, Math.round(width / 1.05));
  const sideCols = Math.max(2, Math.round(depth / 1.15));

  for (let f = 0; f < floors; f++) {
    const yCenter = baseY + f * floorH + floorH / 2;

    // Main floor volume
    const floorBox = new THREE.Mesh(new THREE.BoxGeometry(width, floorH * 0.92, depth), wallMat);
    floorBox.position.y = yCenter;
    group.add(floorBox);

    // Floor slab / balcony ledge
    const slabOverhang = isLowRise || isTower ? 0.14 : 0.28;
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(width + slabOverhang, 0.09, depth + slabOverhang),
      trimMat
    );
    slab.position.y = baseY + (f + 1) * floorH;
    group.add(slab);

    // Front & back windows
    for (let c = 0; c < winCols; c++) {
      const wx = -width / 2 + ((c + 0.5) * width) / winCols;
      // Leave center ground-floor slot for entrance
      if (f === 0 && c === Math.floor(winCols / 2)) continue;
      const winW = (width / winCols) * 0.55;
      const winH = floorH * 0.52;
      const wFront = new THREE.Mesh(new THREE.BoxGeometry(winW, winH, 0.06), glassMat);
      wFront.position.set(wx, yCenter, depth / 2 + 0.02);
      group.add(wFront);

      const wBack = new THREE.Mesh(new THREE.BoxGeometry(winW, winH, 0.06), glassMat);
      wBack.position.set(wx, yCenter, -depth / 2 - 0.02);
      group.add(wBack);
    }

    // Left & right side windows
    for (let s = 0; s < sideCols; s++) {
      const wz = -depth / 2 + ((s + 0.5) * depth) / sideCols;
      const winD = (depth / sideCols) * 0.52;
      const winH = floorH * 0.5;
      const wLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, winH, winD), glassMat);
      wLeft.position.set(-width / 2 - 0.02, yCenter, wz);
      group.add(wLeft);

      const wRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, winH, winD), glassMat);
      wRight.position.set(width / 2 + 0.02, yCenter, wz);
      group.add(wRight);
    }
  }

  // Ground floor entrance & canopy
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.95, floorH * 0.72, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x3a2a1d, roughness: 0.5 })
  );
  door.position.set(0, baseY + floorH * 0.36, depth / 2 + 0.04);
  group.add(door);

  const canopy = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.7), trimMat);
  canopy.position.set(0, baseY + floorH * 0.85, depth / 2 + 0.35);
  group.add(canopy);

  // Corner architectural pillars
  const pillarGeo = new THREE.BoxGeometry(0.18, totalH, 0.18);
  [
    [-width / 2, -depth / 2],
    [width / 2, -depth / 2],
    [-width / 2, depth / 2],
    [width / 2, depth / 2],
  ].forEach(([px, pz]) => {
    const pillar = new THREE.Mesh(pillarGeo, trimMat);
    pillar.position.set(px, baseY + totalH / 2, pz);
    group.add(pillar);
  });

  // Roof (pitched for low-rise, parapet + penthouse crown for mid/high-rise)
  if (isLowRise) {
    const roofRadius = Math.max(width, depth) * 0.76;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(roofRadius, 1.35, 4), roofMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = baseY + totalH + 0.68;
    group.add(roof);
  } else {
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(width + 0.2, 0.28, depth + 0.2), roofMat);
    parapet.position.y = baseY + totalH + 0.14;
    group.add(parapet);

    const crown = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.45, 0.55, depth * 0.45),
      trimMat
    );
    crown.position.y = baseY + totalH + 0.52;
    group.add(crown);
  }

  return group;
}

function buildFromImage(THREE, imageUrl, onBuilt, onError) {
  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = () => {
    try {
      const attrs = analyzeBuildingImage(img);
      const model = buildExtractedBuilding(THREE, attrs);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      onBuilt(model);
    } catch (err) {
      if (onError) onError(err);
    }
  };

  img.onerror = (err) => {
    if (onError) onError(err);
  };

  img.src = imageUrl;
}

// ─── Three.js Canvas Renderer ───────────────────────────────────────────────

function ThreeViewer({ template, imageUrl, onError }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE || !mountRef.current) return;

    const mount = mountRef.current;
    const W = mount.clientWidth;
    const H = mount.clientHeight;

    // Scene (transparent background so only the 3D model is shown)
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera (closer & tighter framing so the model is large and prominent)
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(5.4, 3.8, 6.6);
    camera.lookAt(0, 1.8, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xfff8e7, 1.35);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0x8899cc, 0.55);
    fillLight.position.set(-8, 5, -5);
    scene.add(fillLight);

    // Build model (either from uploaded image or procedural template)
    let cancelled = false;
    if (imageUrl) {
      buildFromImage(
        THREE,
        imageUrl,
        (model) => {
          if (cancelled) return;
          scene.add(model);
        },
        () => {
          if (!cancelled && onError) onError();
        }
      );
    } else {
      const builder = BUILDERS[template];
      if (builder) {
        const model = builder(THREE);
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        // Centre model
        const box = new THREE.Box3().setFromObject(model);
        const centre = new THREE.Vector3();
        box.getCenter(centre);
        model.position.sub(centre);
        model.position.y += box.getSize(new THREE.Vector3()).y / 2;
        scene.add(model);
      }
    }

    // Auto-rotate (respect prefers-reduced-motion)
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let autoRotateAngle = 0;

    // OrbitControls (from CDN)
    let controls = null;
    if (window.THREE?.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 3;
      controls.maxDistance = 18;
      controls.maxPolarAngle = Math.PI / 2.05;
      controls.target.set(0, 1.8, 0);
      controls.autoRotate = !prefersReducedMotion;
      controls.autoRotateSpeed = 1.8;
    }

    // Animation loop
    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      if (controls) {
        controls.update();
      } else if (!prefersReducedMotion) {
        autoRotateAngle += 0.008;
        camera.position.x = Math.sin(autoRotateAngle) * 8.2;
        camera.position.z = Math.cos(autoRotateAngle) * 8.2;
        camera.lookAt(0, 1.8, 0);
      }
      renderer.render(scene, camera);
    }
    animate();

    // Resize
    function onResize() {
      const nW = mount.clientWidth;
      const nH = mount.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      if (controls) controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [template, imageUrl, onError]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

// ─── Main exported component ────────────────────────────────────────────────

export default function Model3DViewer({ modelUrl, imageUrl, template, fallbackImageUrl }) {
  const [mvReady, setMvReady] = useState(
    // model-viewer registers itself as a custom element
    typeof customElements !== "undefined" && customElements.get("model-viewer") !== undefined
  );
  const [threeReady, setThreeReady] = useState(typeof window !== "undefined" && Boolean(window.THREE));
  const [error, setError] = useState(null);
  const [modelLoadFailed, setModelLoadFailed] = useState(false);
  const [modelAvailability, setModelAvailability] = useState({ url: "", available: null });
  const fallbackUrl = imageUrl || fallbackImageUrl;
  const isLocalUpload = modelUrl?.startsWith("/uploads/");
  const isCheckingModel =
    isLocalUpload &&
    (modelAvailability.url !== modelUrl || modelAvailability.available === null);

  useEffect(() => {
    setError(null);
    setModelLoadFailed(false);
  }, [modelUrl, imageUrl, template, fallbackImageUrl]);

  useEffect(() => {
    if (!modelUrl?.startsWith("/uploads/")) return undefined;

    const apiBaseUrl =
      import.meta.env.VITE_API_BASE_URL ||
      (import.meta.env.PROD ? `${window.location.origin}/api` : "http://localhost:5000/api");
    const apiOrigin = new URL(apiBaseUrl, window.location.origin).origin;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);
    let cancelled = false;

    setModelAvailability({ url: modelUrl, available: null });
    fetch(`${apiOrigin}${modelUrl}`, { method: "HEAD", signal: controller.signal })
      .then((response) => {
        if (!cancelled) {
          setModelAvailability({ url: modelUrl, available: response.ok });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setModelAvailability({ url: modelUrl, available: false });
        }
      })
      .finally(() => window.clearTimeout(timeoutId));

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [modelUrl]);

  // Poll for CDN libraries if not yet ready (they load async)
  useEffect(() => {
    if (modelUrl && !mvReady) {
      const id = setInterval(() => {
        if (typeof customElements !== "undefined" && customElements.get("model-viewer") !== undefined) {
          setMvReady(true);
          clearInterval(id);
        }
      }, 300);
      return () => clearInterval(id);
    }
  }, [modelUrl, mvReady]);

  useEffect(() => {
    if ((template || fallbackUrl) && !threeReady) {
      const onReady = () => setThreeReady(true);
      window.addEventListener("three-ready", onReady);
      const id = setInterval(() => {
        if (window.THREE) {
          setThreeReady(true);
          clearInterval(id);
        }
      }, 200);
      return () => {
        window.removeEventListener("three-ready", onReady);
        clearInterval(id);
      };
    }
  }, [template, fallbackUrl, threeReady]);

  if (!modelUrl && !fallbackUrl && !template) return null;

  if (isCheckingModel) {
    return (
      <div className="model3d-loading">
        <div className="model3d-spinner" />
        <span>Checking 3D model…</span>
      </div>
    );
  }

  if (error) {
    if (fallbackImageUrl) {
      return (
        <img
          src={fallbackImageUrl}
          alt="Project visualization"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      );
    }

    return (
      <div className="model3d-error">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 9v4m0 4h.01M5.07 19h13.86a2 2 0 001.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16a2 2 0 001.73 3z"/>
        </svg>
        <p>3D viewer failed to load.</p>
      </div>
    );
  }

  /* ── Uploaded GLB via <model-viewer> ── */
  if (modelUrl && !modelLoadFailed && (!isLocalUpload || modelAvailability.available)) {
    const apiBaseUrl =
      import.meta.env.VITE_API_BASE_URL ||
      (import.meta.env.PROD ? `${window.location.origin}/api` : "http://localhost:5000/api");
    const apiOrigin = new URL(apiBaseUrl, window.location.origin).origin;
    const resolvedModelUrl = modelUrl.startsWith("/uploads/")
      ? `${apiOrigin}${modelUrl}`
      : modelUrl;

    if (!mvReady) {
      return (
        <div className="model3d-loading">
          <div className="model3d-spinner" />
          <span>Loading 3D viewer…</span>
        </div>
      );
    }
    return (
      // eslint-disable-next-line react/no-unknown-property
      <model-viewer
        src={resolvedModelUrl}
        alt="3D building model"
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="20deg"
        camera-controls
        bounds="tight"
        field-of-view="30deg"
        shadow-intensity="1"
        environment-image="neutral"
        style={{ width: "100%", height: "100%", background: "transparent" }}
        onError={() => setModelLoadFailed(true)}
      />
    );
  }

  /* ── Template via Three.js ── */
  if (!threeReady) {
    return (
      <div className="model3d-loading">
        <div className="model3d-spinner" />
        <span>Building 3D model…</span>
      </div>
    );
  }

  if (!fallbackUrl && !template) return null;

  return (
    <ThreeViewer
      template={template}
      imageUrl={fallbackUrl}
      onError={() => setError(true)}
    />
  );
}
