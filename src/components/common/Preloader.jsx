import { useState, useEffect } from "react";
import { useSiteSettings } from "../../context/SiteSettingsContext";

/**
 * Generates clean 2:1 isometric 3D coordinates for a rectangular apartment tower
 * anchored at its front-bottom corner (fx, fy).
 */
function buildIsoTower(fx, fy, w, d, h, floors) {
  const b0 = [fx, fy];
  const bl = [fx - w, fy - 0.5 * w];
  const br = [fx + d, fy - 0.5 * d];
  const tb = [fx - w + d, fy - 0.5 * (w + d) - h];

  const t0 = [b0[0], b0[1] - h];
  const tl = [bl[0], bl[1] - h];
  const tr = [br[0], br[1] - h];

  const pts = (list) => list.map(([x, y]) => `${x},${y}`).join(" ");

  const floorPaths = [];
  for (let i = 1; i < floors; i++) {
    const dy = (h / floors) * i;
    floorPaths.push(`M ${bl[0]} ${bl[1] - dy} L ${b0[0]} ${b0[1] - dy} L ${br[0]} ${br[1] - dy}`);
  }

  const leftCols = [0.25, 0.5, 0.75].map((t) => {
    const x = fx - w * t;
    const y = fy - 0.5 * w * t;
    return [x, y, x, y - h];
  });

  const rightCols = [0.25, 0.5, 0.75].map((t) => {
    const x = fx + d * t;
    const y = fy - 0.5 * d * t;
    return [x, y, x, y - h];
  });

  return {
    leftFace: pts([b0, bl, tl, t0]),
    rightFace: pts([b0, br, tr, t0]),
    roofFace: pts([t0, tl, tb, tr]),
    outline: `M ${bl[0]} ${bl[1]} L ${b0[0]} ${b0[1]} L ${br[0]} ${br[1]} L ${tr[0]} ${tr[1]} L ${tb[0]} ${tb[1]} L ${tl[0]} ${tl[1]} Z`,
    frontEdge: `M ${b0[0]} ${b0[1]} L ${t0[0]} ${t0[1]}`,
    roofFrontEdges: `M ${tl[0]} ${tl[1]} L ${t0[0]} ${t0[1]} L ${tr[0]} ${tr[1]}`,
    floorPaths,
    leftCols,
    rightCols,
  };
}

const PODIUM = buildIsoTower(600, 695, 340, 340, 34, 2);
const LEFT_TOWER = buildIsoTower(425, 585, 130, 120, 225, 7);
const RIGHT_TOWER = buildIsoTower(785, 575, 120, 130, 265, 8);
const CENTER_TOWER = buildIsoTower(600, 615, 165, 165, 390, 12);
const PENTHOUSE = buildIsoTower(600, 225, 85, 85, 42, 2);

export default function Preloader() {
  const settings = useSiteSettings();
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  const logoSrc = settings?.logoUrl || "/images/logo.webp";

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const holdDuration = prefersReducedMotion ? 250 : 2750;
    const fadeDuration = prefersReducedMotion ? 200 : 550;

    let closeTimer;
    const fadeTimer = window.setTimeout(() => {
      setFading(true);
      closeTimer = window.setTimeout(() => setLoading(false), fadeDuration);
    }, holdDuration);

    return () => {
      window.clearTimeout(fadeTimer);
      if (closeTimer) window.clearTimeout(closeTimer);
    };
  }, []);

  if (!loading) return null;

  const towers = [LEFT_TOWER, RIGHT_TOWER, CENTER_TOWER, PENTHOUSE];

  return (
    <div
      className={`preloader-overlay ${fading ? "preloader-fade-out" : ""}`}
      aria-hidden={!loading}
      role="status"
      aria-label="Loading RCC Infrastructure"
    >
      {/* Animated 3D Isometric Architectural Blueprint Background */}
      <div className="preloader-blueprint-bg" aria-hidden="true">
        <svg className="preloader-blueprint-grid" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="bpSubGrid" width="12" height="12" patternUnits="userSpaceOnUse">
              <line x1="12" y1="0" x2="12" y2="12" stroke="#184c82" strokeOpacity="0.06" strokeWidth="0.5" />
              <line x1="0" y1="12" x2="12" y2="12" stroke="#184c82" strokeOpacity="0.06" strokeWidth="0.5" />
            </pattern>
            <pattern id="bpMedGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="url(#bpSubGrid)" />
              <line x1="60" y1="0" x2="60" y2="60" stroke="#184c82" strokeOpacity="0.12" strokeWidth="0.75" />
              <line x1="0" y1="60" x2="60" y2="60" stroke="#184c82" strokeOpacity="0.12" strokeWidth="0.75" />
            </pattern>
            <pattern id="bpMasterGrid" width="240" height="240" patternUnits="userSpaceOnUse">
              <rect width="240" height="240" fill="url(#bpMedGrid)" />
              <line x1="240" y1="0" x2="240" y2="240" stroke="#184c82" strokeOpacity="0.2" strokeWidth="1.1" />
              <line x1="0" y1="240" x2="240" y2="240" stroke="#184c82" strokeOpacity="0.2" strokeWidth="1.1" />
              <path d="M 0 6 L 0 -6 M -6 0 L 6 0" stroke="#184c82" strokeOpacity="0.34" strokeWidth="1" />
              <path d="M 120 5 L 120 -5 M 115 0 L 125 0" stroke="#E5242B" strokeOpacity="0.28" strokeWidth="0.9" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bpMasterGrid)" />
        </svg>

        {/* 3D Isometric Multi-Tower Apartment Complex Blueprint */}
        <svg
          className="preloader-blueprint-sketch"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Phase 1: 3D Isometric Axes & Podium Foundation */}
          <g className="bp-draw bp-phase-1" stroke="#184c82">
            <line pathLength="100" x1="120" y1="455" x2="600" y2="695" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="5 5" />
            <line pathLength="100" x1="1080" y1="455" x2="600" y2="695" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="5 5" />
            <line pathLength="100" x1="600" y1="60" x2="600" y2="755" strokeOpacity="0.14" strokeWidth="0.9" strokeDasharray="4 6" />
            <path pathLength="100" d={PODIUM.outline} strokeOpacity="0.36" strokeWidth="1.6" />
            <path pathLength="100" d={PODIUM.roofFrontEdges} strokeOpacity="0.28" strokeWidth="1.2" />
            <path pathLength="100" d={PODIUM.frontEdge} strokeOpacity="0.36" strokeWidth="1.6" />
          </g>

          {/* Subtle 3D Plane Shading (fades in gently as wireframe completes) */}
          <g className="bp-3d-planes">
            {[PODIUM, ...towers].map((t, idx) => (
              <g key={`shade-${idx}`}>
                <polygon points={t.leftFace} fill="#184c82" fillOpacity="0.035" />
                <polygon points={t.rightFace} fill="#184c82" fillOpacity="0.075" />
                <polygon points={t.roofFace} fill="#184c82" fillOpacity="0.02" />
              </g>
            ))}
          </g>

          {/* Phase 2: 3D Isometric Tower Shells & Wrap-Around Floor Slabs */}
          <g className="bp-draw bp-phase-2" stroke="#184c82">
            {towers.map((t, idx) => (
              <g key={`tower-${idx}`}>
                <path pathLength="100" d={t.outline} strokeOpacity="0.44" strokeWidth="1.8" />
                <path pathLength="100" d={t.frontEdge} strokeOpacity="0.48" strokeWidth="1.8" />
                <path pathLength="100" d={t.roofFrontEdges} strokeOpacity="0.38" strokeWidth="1.4" />
                {t.floorPaths.map((d, fIdx) => (
                  <path key={`fl-${idx}-${fIdx}`} pathLength="100" d={d} strokeOpacity="0.24" strokeWidth="1.05" />
                ))}
              </g>
            ))}
          </g>

          {/* Phase 3: 3D Facade Mullions, Red Elevation Rays & Drafting Marks */}
          <g className="bp-draw bp-phase-3">
            {towers.map((t, idx) => (
              <g key={`cols-${idx}`} stroke="#184c82">
                {t.leftCols.map(([x1, y1, x2, y2], cIdx) => (
                  <line key={`lc-${idx}-${cIdx}`} pathLength="100" x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity="0.16" strokeWidth="0.9" />
                ))}
                {t.rightCols.map(([x1, y1, x2, y2], cIdx) => (
                  <line key={`rc-${idx}-${cIdx}`} pathLength="100" x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity="0.18" strokeWidth="0.9" />
                ))}
              </g>
            ))}

            {/* Accent red architectural dimension lines & corner crop marks */}
            <line pathLength="100" x1="395" y1="183" x2="395" y2="615" stroke="#E5242B" strokeOpacity="0.28" strokeWidth="1.1" strokeDasharray="4 4" />
            <line pathLength="100" x1="435" y1="225" x2="600" y2="143" stroke="#E5242B" strokeOpacity="0.32" strokeWidth="1.2" />
            <line pathLength="100" x1="600" y1="143" x2="765" y2="225" stroke="#E5242B" strokeOpacity="0.32" strokeWidth="1.2" />
            <path pathLength="100" d="M 48 84 L 48 48 L 84 48" stroke="#184c82" strokeOpacity="0.38" strokeWidth="1.5" />
            <path pathLength="100" d="M 1152 84 L 1152 48 L 1116 48" stroke="#184c82" strokeOpacity="0.38" strokeWidth="1.5" />
            <path pathLength="100" d="M 48 716 L 48 752 L 84 752" stroke="#184c82" strokeOpacity="0.38" strokeWidth="1.5" />
            <path pathLength="100" d="M 1152 716 L 1152 752 L 1116 752" stroke="#184c82" strokeOpacity="0.38" strokeWidth="1.5" />
          </g>
        </svg>

        <div className="preloader-blueprint-vignette" />
      </div>

      {/* Centered Logo Pops Out After 3D Blueprint Builds */}
      <div className="preloader-content">
        <div className="preloader-logo-wrapper">
          <div className="preloader-logo-ring" aria-hidden="true" />
          <img
            src={logoSrc}
            alt={settings?.siteName || "RCC Infrastructure"}
            className="preloader-logo-img"
          />
        </div>
      </div>
    </div>
  );
}
