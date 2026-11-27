import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import Layout from "../components/layout/Layout";
import Preloader from "../components/common/Preloader";

const Home = lazy(() => import("../pages/Home/Home"));
const About = lazy(() => import("../pages/About/About"));
const Services = lazy(() => import("../pages/Services/Services"));
const ServiceDetails = lazy(() => import("../pages/Services/ServiceDetails"));
const Projects = lazy(() => import("../pages/Projects/Projects"));
const ProjectDetails = lazy(() => import("../pages/Projects/ProjectDetails"));
const Expertise = lazy(() => import("../pages/Expertise/Expertise"));
const Process = lazy(() => import("../pages/Process/Process"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const PrivacyPolicy = lazy(() => import("../pages/Legal/PrivacyPolicy"));
const TermsConditions = lazy(() => import("../pages/Legal/TermsConditions"));
const ThankYou = lazy(() => import("../pages/ThankYou/ThankYou"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

const Login = lazy(() => import("../admin/pages/Login"));
const ProtectedRoute = lazy(() => import("../admin/components/ProtectedRoute"));
const AdminLayout = lazy(() => import("../admin/components/AdminLayout"));
const Dashboard = lazy(() => import("../admin/pages/Dashboard"));
const HomeContentManager = lazy(() => import("../admin/pages/HomeContentManager"));
const AboutContentManager = lazy(() => import("../admin/pages/AboutContentManager"));
const ServicesList = lazy(() => import("../admin/pages/ServicesList"));
const ServiceEdit = lazy(() => import("../admin/pages/ServiceEdit"));
const ProjectsList = lazy(() => import("../admin/pages/ProjectsList"));
const ProjectEdit = lazy(() => import("../admin/pages/ProjectEdit"));
const CategoriesManager = lazy(() => import("../admin/pages/CategoriesManager"));
const TestimonialsManager = lazy(() => import("../admin/pages/TestimonialsManager"));
const StatsManager = lazy(() => import("../admin/pages/StatsManager"));
const ExpertiseManager = lazy(() => import("../admin/pages/ExpertiseManager"));
const ProcessFaqManager = lazy(() => import("../admin/pages/ProcessFaqManager"));
const PageBannersManager = lazy(() => import("../admin/pages/PageBannersManager"));
const EnquiriesManager = lazy(() => import("../admin/pages/EnquiriesManager"));
const MediaLibrary = lazy(() => import("../admin/pages/MediaLibrary"));
const SiteSettings = lazy(() => import("../admin/pages/SiteSettings"));
const UsersManager = lazy(() => import("../admin/pages/UsersManager"));
const ChangePasswordPage = lazy(() => import("../admin/pages/ChangePasswordPage"));
const HelpPage = lazy(() => import("../admin/pages/HelpPage"));

export default function AppRoutes() {
  return (
    <>
      <Preloader />
      <Suspense fallback={null}>
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
      </Suspense>
    </>
  );
}
