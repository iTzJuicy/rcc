
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initFrontendMonitoring } from "./services/sentry";

initFrontendMonitoring();

import "@fontsource/inter/latin-300.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-800.css";
import "@fontsource/playfair-display/latin-400.css";
import "@fontsource/playfair-display/latin-500.css";
import "@fontsource/playfair-display/latin-600.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/typography.css";
import "./styles/utilities.css";
import "./styles/common.css";

import "./styles/navbar.css";
import "./styles/footer.css";

import "./styles/home.css";
import "./styles/about.css";
import "./styles/services.css";
import "./styles/projects.css";
import "./styles/expertise.css";
import "./styles/process.css";
import "./styles/contact.css";
import "./styles/not-found.css";
import "./styles/admin.css";
import "./styles/responsive.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
