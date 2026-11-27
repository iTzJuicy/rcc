
import Hero from "../../components/sections/home/Hero";
import Impact from "../../components/sections/home/Impact";
import ServicesPreview from "../../components/sections/home/ServicesPreview";
import FeaturedProjects from "../../components/sections/home/FeaturedProjects";
import AboutPreview from "../../components/sections/home/AboutPreview";
import ProcessPreview from "../../components/sections/home/ProcessPreview";
import Testimonials from "../../components/sections/home/Testimonials";
import WhyChooseUs from "../../components/sections/home/WhyChooseUs";
import ContactCTA from "../../components/sections/home/ContactCTA";
import SEO from "../../components/common/SEO";

export default function Home() {
  return (
    <div className="home-page-wrapper">
      <SEO title="Home" description="RCC Infrastructure delivers construction and development solutions across Mangaluru." />
      <Hero />
      <Impact />
      <FeaturedProjects />
      <ServicesPreview />
      <AboutPreview />
      <ProcessPreview />
      <Testimonials />
      <WhyChooseUs />
      <ContactCTA />
    </div>
  );
}
