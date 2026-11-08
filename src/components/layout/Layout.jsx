import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import Preloader from "../common/Preloader";
import CookieConsent from "../common/CookieConsent";

export default function Layout() {
  return (
    <>
      <Preloader />
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
