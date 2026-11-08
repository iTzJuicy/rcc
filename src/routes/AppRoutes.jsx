import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/layout/Layout";

// Public pages
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Services from "../pages/Services/Services";
import ServiceDetails from "../pages/Services/ServiceDetails";
import Projects from "../pages/Projects/Projects";
import ProjectDetails from "../pages/Projects/ProjectDetails";
import Expertise from "../pages/Expertise/Expertise";
import Process from "../pages/Process/Process";
import Contact from "../pages/Contact/Contact";
import PrivacyPolicy from "../pages/Legal/PrivacyPolicy";
import TermsConditions from "../pages/Legal/TermsConditions";
import ThankYou from "../pages/ThankYou/ThankYou";
import NotFound from "../pages/NotFound/NotFound";

// Admin pages
import Login from "../admin/pages/Login";
import ProtectedRoute from "../admin/components/ProtectedRoute";
import AdminLayout from "../admin/components/AdminLayout";
import Dashboard from "../admin/pages/Dashboard";
import HomeContentManager from "../admin/pages/HomeContentManager";
import AboutContentManager from "../admin/pages/AboutContentManager";
import ServicesList from "../admin/pages/ServicesList";
import ServiceEdit from "../admin/pages/ServiceEdit";
import ProjectsList from "../admin/pages/ProjectsList";
import ProjectEdit from "../admin/pages/ProjectEdit";
import CategoriesManager from "../admin/pages/CategoriesManager";
import TestimonialsManager from "../admin/pages/TestimonialsManager";
import StatsManager from "../admin/pages/StatsManager";
import ExpertiseManager from "../admin/pages/ExpertiseManager";
import ProcessFaqManager from "../admin/pages/ProcessFaqManager";
import PageBannersManager from "../admin/pages/PageBannersManager";
import EnquiriesManager from "../admin/pages/EnquiriesManager";
import MediaLibrary from "../admin/pages/MediaLibrary";
import SiteSettings from "../admin/pages/SiteSettings";
import UsersManager from "../admin/pages/UsersManager";
import ChangePasswordPage from "../admin/pages/ChangePasswordPage";
import HelpPage from "../admin/pages/HelpPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages with main site Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetails />} />

        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetails />} />

        <Route path="/expertise" element={<Expertise />} />
        <Route path="/process" element={<Process />} />
        <Route path="/contact" element={<Contact />} />

        {/* Legal & Feedback Pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />
        <Route path="/t&c" element={<Navigate to="/terms-and-conditions" replace />} />
        <Route path="/thank-you" element={<ThankYou />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Navigate to="/admin" replace />} />

          {/* Content Group */}
          <Route path="home-content" element={<HomeContentManager />} />
          <Route path="about-content" element={<AboutContentManager />} />
          <Route path="services" element={<ServicesList />} />
          <Route path="services/new" element={<ServiceEdit />} />
          <Route path="services/edit/:id" element={<ServiceEdit />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/new" element={<ProjectEdit />} />
          <Route path="projects/edit/:id" element={<ProjectEdit />} />
          <Route path="categories" element={<CategoriesManager />} />
          <Route path="testimonials" element={<TestimonialsManager />} />
          <Route path="stats" element={<StatsManager />} />
          <Route path="expertise" element={<ExpertiseManager />} />
          <Route path="process-faq" element={<ProcessFaqManager />} />

          {/* Media Group */}
          <Route path="page-banners" element={<PageBannersManager />} />
          <Route path="media" element={<MediaLibrary />} />

          {/* Messages Group */}
          <Route path="enquiries" element={<EnquiriesManager />} />

          {/* Settings Group */}
          <Route path="settings" element={<SiteSettings />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route path="help" element={<HelpPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
