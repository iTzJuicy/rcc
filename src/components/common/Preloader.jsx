import { useState, useEffect } from "react";
import { useSiteSettings } from "../../context/SiteSettingsContext";

export default function Preloader() {
  const settings = useSiteSettings();
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  const logoSrc = settings?.logoUrl || "/images/logo.webp";

  useEffect(() => {
    // Reveal page smoothly
    const timer = setTimeout(() => {
      setFading(true);
      const closeTimer = setTimeout(() => setLoading(false), 450);
      return () => clearTimeout(closeTimer);
    }, 1250);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`preloader-overlay ${fading ? "preloader-fade-out" : ""}`}
      aria-hidden={!loading}
      role="status"
      aria-label="Loading RCC Infrastructure"
    >
      {/* Blueprint Drafting Grid Background on Cream */}
      <div className="preloader-blueprint-bg" aria-hidden="true">
        {/* Authentic Architectural Drafting Blueprint Grid (Graph Paper with sub-grid & master modules) */}
        <svg className="preloader-blueprint-grid" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Fine 10px blueprint graph sub-units */}
            <pattern
              id="bpSubGrid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <line x1="10" y1="0" x2="10" y2="10" stroke="#184c82" strokeOpacity="0.07" strokeWidth="0.5" />
              <line x1="0" y1="10" x2="10" y2="10" stroke="#184c82" strokeOpacity="0.07" strokeWidth="0.5" />
            </pattern>

            {/* Medium 50px blueprint structural grid */}
            <pattern
              id="bpMedGrid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <rect width="50" height="50" fill="url(#bpSubGrid)" />
              <line x1="50" y1="0" x2="50" y2="50" stroke="#184c82" strokeOpacity="0.13" strokeWidth="0.75" />
              <line x1="0" y1="50" x2="50" y2="50" stroke="#184c82" strokeOpacity="0.13" strokeWidth="0.75" />
            </pattern>

            {/* Major 200px Blueprint Sheet Modules with drafting crosses */}
            <pattern
              id="bpMasterGrid"
              width="200"
              height="200"
              patternUnits="userSpaceOnUse"
            >
              <rect width="200" height="200" fill="url(#bpMedGrid)" />
              {/* Heavy architectural module line */}
              <line x1="200" y1="0" x2="200" y2="200" stroke="#184c82" strokeOpacity="0.22" strokeWidth="1.2" />
              <line x1="0" y1="200" x2="200" y2="200" stroke="#184c82" strokeOpacity="0.22" strokeWidth="1.2" />
              {/* Technical drafting intersection crosses */}
              <path
                d="M 0 6 L 0 -6 M -6 0 L 6 0"
                stroke="#184c82"
                strokeOpacity="0.38"
                strokeWidth="1.1"
              />
              <path
                d="M 100 6 L 100 -6 M 94 0 L 106 0"
                stroke="#E5242B"
                strokeOpacity="0.32"
                strokeWidth="0.9"
              />
              <path
                d="M 0 106 L 0 94 M -6 100 L 6 100"
                stroke="#E5242B"
                strokeOpacity="0.32"
                strokeWidth="0.9"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bpMasterGrid)" />
        </svg>

        {/* Architectural Perspective Sketch / Blueprint Lines in Vector SVG */}
        <svg
          className="preloader-blueprint-sketch"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Compass concentric guide circles in drafting blue */}
          <circle cx="980" cy="220" r="140" stroke="#184c82" strokeOpacity="0.11" strokeWidth="0.9" strokeDasharray="3 5" />
          <circle cx="980" cy="220" r="230" stroke="#184c82" strokeOpacity="0.08" strokeWidth="0.8" />
          <circle cx="980" cy="220" r="340" stroke="#184c82" strokeOpacity="0.05" strokeWidth="0.7" strokeDasharray="6 8" />

          {/* Vanishing projection / datum reference lines */}
          <line x1="120" y1="220" x2="1400" y2="220" stroke="#184c82" strokeOpacity="0.1" strokeWidth="0.8" strokeDasharray="4 6" />
          <line x1="980" y1="20" x2="980" y2="860" stroke="#184c82" strokeOpacity="0.1" strokeWidth="0.8" strokeDasharray="4 6" />
          <line x1="80" y1="780" x2="1380" y2="780" stroke="#184c82" strokeOpacity="0.18" strokeWidth="1" />
          <line x1="80" y1="830" x2="1380" y2="830" stroke="#184c82" strokeOpacity="0.12" strokeWidth="0.8" />

          {/* Perspective 3D Architectural Blueprint Wireframe (Right/Hero Placement) */}
          <g className="blueprint-wireframe-lines" stroke="#184c82">
            {/* Shaded glass / floor planes (architectural wash) */}
            <polygon
              points="820,380 1150,230 1320,310 990,460"
              fill="#184c82"
              fillOpacity="0.04"
            />
            <polygon
              points="990,460 1320,310 1320,530 990,680"
              fill="#184c82"
              fillOpacity="0.06"
            />
            <polygon
              points="680,660 990,460 990,680 680,880"
              fill="#184c82"
              fillOpacity="0.03"
            />
            <polygon
              points="820,570 1150,420 1280,480 950,630"
              fill="#184c82"
              fillOpacity="0.035"
            />

            {/* Cantilever roof lines & perspective rays extending to boundaries */}
            <line x1="420" y1="560" x2="1360" y2="140" strokeOpacity="0.22" strokeWidth="1.1" />
            <line x1="280" y1="680" x2="1380" y2="180" strokeOpacity="0.18" strokeWidth="0.9" />
            <line x1="180" y1="780" x2="1420" y2="220" strokeOpacity="0.16" strokeWidth="0.8" />
            <line x1="820" y1="160" x2="1440" y2="440" strokeOpacity="0.16" strokeWidth="0.9" />
            <line x1="680" y1="420" x2="1440" y2="760" strokeOpacity="0.18" strokeWidth="0.9" />

            {/* Overhanging modern terrace cantilever frame */}
            <polygon
              points="820,380 1150,230 1320,310 990,460"
              strokeOpacity="0.38"
              strokeWidth="1.6"
            />
            <line x1="820" y1="380" x2="820" y2="410" strokeOpacity="0.32" strokeWidth="1.4" />
            <line x1="1150" y1="230" x2="1150" y2="260" strokeOpacity="0.32" strokeWidth="1.4" />
            <line x1="1320" y1="310" x2="1320" y2="340" strokeOpacity="0.32" strokeWidth="1.4" />
            <line x1="990" y1="460" x2="990" y2="490" strokeOpacity="0.32" strokeWidth="1.4" />
            <polygon
              points="820,410 1150,260 1320,340 990,490"
              strokeOpacity="0.28"
              strokeWidth="1.2"
            />

            {/* Mid-level architectural volume & structural columns */}
            <polygon
              points="680,560 990,420 1200,510 890,650"
              strokeOpacity="0.35"
              strokeWidth="1.5"
            />
            <polygon
              points="680,660 990,520 1200,610 890,750"
              strokeOpacity="0.3"
              strokeWidth="1.3"
            />

            {/* Main vertical structural columns (blueprint lines with extensions) */}
            <line x1="680" y1="360" x2="680" y2="820" strokeOpacity="0.34" strokeWidth="1.4" />
            <line x1="780" y1="440" x2="780" y2="820" strokeOpacity="0.25" strokeWidth="1" />
            <line x1="880" y1="460" x2="880" y2="820" strokeOpacity="0.25" strokeWidth="1" />
            <line x1="990" y1="200" x2="990" y2="820" strokeOpacity="0.4" strokeWidth="1.6" />
            <line x1="1100" y1="310" x2="1100" y2="820" strokeOpacity="0.26" strokeWidth="1" />
            <line x1="1200" y1="360" x2="1200" y2="820" strokeOpacity="0.32" strokeWidth="1.4" />
            <line x1="1320" y1="260" x2="1320" y2="780" strokeOpacity="0.3" strokeWidth="1.2" />

            {/* Secondary architectural glass mullions & framing */}
            <line x1="730" y1="630" x2="730" y2="790" strokeOpacity="0.18" strokeWidth="0.8" />
            <line x1="830" y1="590" x2="830" y2="780" strokeOpacity="0.18" strokeWidth="0.8" />
            <line x1="935" y1="550" x2="935" y2="780" strokeOpacity="0.18" strokeWidth="0.8" />
            <line x1="1045" y1="510" x2="1045" y2="740" strokeOpacity="0.18" strokeWidth="0.8" />
            <line x1="1150" y1="460" x2="1150" y2="720" strokeOpacity="0.18" strokeWidth="0.8" />

            {/* Left wing cantilever roof canopy */}
            <line x1="380" y1="710" x2="680" y2="560" strokeOpacity="0.3" strokeWidth="1.3" />
            <line x1="320" y1="740" x2="680" y2="560" strokeOpacity="0.2" strokeWidth="0.9" />
            <line x1="380" y1="710" x2="380" y2="800" strokeOpacity="0.25" strokeWidth="1.1" />
            <line x1="480" y1="660" x2="480" y2="800" strokeOpacity="0.22" strokeWidth="1" />
            <line x1="580" y1="610" x2="580" y2="800" strokeOpacity="0.22" strokeWidth="1" />
          </g>

          {/* Blueprint sheet perimeter framing and corner crop marks */}
          <path d="M 40 70 L 40 40 L 70 40" stroke="#184c82" strokeOpacity="0.35" strokeWidth="1.5" />
          <path d="M 1400 70 L 1400 40 L 1370 40" stroke="#184c82" strokeOpacity="0.35" strokeWidth="1.5" />
          <path d="M 40 830 L 40 860 L 70 860" stroke="#184c82" strokeOpacity="0.35" strokeWidth="1.5" />
          <path d="M 1400 830 L 1400 860 L 1370 860" stroke="#184c82" strokeOpacity="0.35" strokeWidth="1.5" />
        </svg>

        {/* Soft Center Vignette */}
        <div className="preloader-blueprint-vignette" />
      </div>

      <div className="preloader-content">
        {/* Company Logo on Cream */}
        <div className="preloader-logo-wrapper">
          <img
            src={logoSrc}
            alt={settings?.siteName || "RCC Infrastructure"}
            className="preloader-logo-img"
          />
        </div>

        {/* Builder Building Skyline Line Animation */}
        <div className="preloader-skyline-wrapper">
          <svg
            className="preloader-skyline-svg"
            viewBox="0 0 280 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="rccSkylineGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#E5242B" stopOpacity="0" />
                <stop offset="10%" stopColor="#E5242B" stopOpacity="0.95" />
                <stop offset="24%" stopColor="#0B1626" />
                <stop offset="76%" stopColor="#0B1626" />
                <stop offset="90%" stopColor="#E5242B" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#E5242B" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Faint blueprint guide track */}
            <path
              d="M 10 72 H 72 V 52 L 94 45 V 72 H 108 V 22 L 148 10 V 72 H 156 V 32 L 185 40 V 65 H 198 V 72 H 270"
              stroke="rgba(11, 22, 38, 0.12)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Animated drawing builder skyline */}
            <path
              className="preloader-skyline-draw"
              pathLength="100"
              d="M 10 72 H 72 V 52 L 94 45 V 72 H 108 V 22 L 148 10 V 72 H 156 V 32 L 185 40 V 65 H 198 V 72 H 270"
              stroke="url(#rccSkylineGrad)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
