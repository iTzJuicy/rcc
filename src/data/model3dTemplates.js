/**
 * Pre-built 3D architectural template definitions.
 * Each template is rendered procedurally via Three.js in the Model3DViewer component.
 * The `type` key maps to a renderer function in the viewer.
 */

export const MODEL_3D_TEMPLATES = [
  {
    id: "villa",
    label: "Villa / Bungalow",
    description: "Single-storey residential villa with sloped roof and garden profile.",
    type: "villa",
    color: "#c8a26e",
    icon: (
      /* SVG inline – house silhouette */
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
        <path d="M4 22L24 6l20 16v20H4V22z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" fill="none"/>
        <rect x="17" y="30" width="14" height="12" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M12 22l12-9 12 9" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
      </svg>`
    ),
  },
  {
    id: "apartment",
    label: "Apartment Block",
    description: "Multi-storey residential apartment complex with balconies.",
    type: "apartment",
    color: "#6e8fc8",
    icon: (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="6" width="32" height="38" rx="2" stroke="currentColor" stroke-width="2.5" fill="none"/>
        <rect x="13" y="11" width="6" height="6" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
        <rect x="29" y="11" width="6" height="6" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
        <rect x="13" y="22" width="6" height="6" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
        <rect x="29" y="22" width="6" height="6" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
        <rect x="13" y="33" width="6" height="6" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
        <rect x="29" y="33" width="6" height="6" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>`
    ),
  },
  {
    id: "tower",
    label: "Commercial Tower",
    description: "Tall glass-and-concrete commercial office tower.",
    type: "tower",
    color: "#5ec8b8",
    icon: (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
        <rect x="14" y="4" width="20" height="40" rx="2" stroke="currentColor" stroke-width="2.5" fill="none"/>
        <line x1="14" y1="12" x2="34" y2="12" stroke="currentColor" stroke-width="1.5"/>
        <line x1="14" y1="20" x2="34" y2="20" stroke="currentColor" stroke-width="1.5"/>
        <line x1="14" y1="28" x2="34" y2="28" stroke="currentColor" stroke-width="1.5"/>
        <line x1="14" y1="36" x2="34" y2="36" stroke="currentColor" stroke-width="1.5"/>
        <line x1="24" y1="4" x2="24" y2="44" stroke="currentColor" stroke-width="1.5"/>
      </svg>`
    ),
  },
  {
    id: "warehouse",
    label: "Industrial / Warehouse",
    description: "Wide-span industrial warehouse or factory building.",
    type: "warehouse",
    color: "#c8c06e",
    icon: (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="20" width="40" height="22" rx="2" stroke="currentColor" stroke-width="2.5" fill="none"/>
        <path d="M4 20L24 8l20 12" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" fill="none"/>
        <rect x="18" y="30" width="12" height="12" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>`
    ),
  },
  {
    id: "complex",
    label: "Residential Complex",
    description: "Gated residential community with multiple connected blocks.",
    type: "complex",
    color: "#c86e9a",
    icon: (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="18" width="18" height="24" rx="1" stroke="currentColor" stroke-width="2.5" fill="none"/>
        <rect x="26" y="12" width="18" height="30" rx="1" stroke="currentColor" stroke-width="2.5" fill="none"/>
        <path d="M4 18l9-10 9 10" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
        <path d="M26 12l9-8 9 8" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/>
        <rect x="8" y="26" width="5" height="6" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <rect x="30" y="22" width="5" height="6" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
      </svg>`
    ),
  },
];

export default MODEL_3D_TEMPLATES;
