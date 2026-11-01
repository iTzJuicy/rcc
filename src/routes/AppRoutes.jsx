
import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Services from "../pages/Services/Services";
import ServiceDetails from "../pages/Services/ServiceDetails";
import Projects from "../pages/Projects/Projects";
import ProjectDetails from "../pages/Projects/ProjectDetails";
import Expertise from "../pages/Expertise/Expertise";
import Process from "../pages/Process/Process";
import Contact from "../pages/Contact/Contact";
import NotFound from "../pages/NotFound/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/services" element={<Services />} />
        <Route
          path="/services/:slug"
          element={<ServiceDetails />}
        />

        <Route path="/projects" element={<Projects />} />
        <Route
          path="/projects/:slug"
          element={<ProjectDetails />}
        />

        <Route path="/expertise" element={<Expertise />} />
        <Route path="/process" element={<Process />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
