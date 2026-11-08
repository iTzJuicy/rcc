
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initFrontendMonitoring } from "./services/sentry";

initFrontendMonitoring();

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
