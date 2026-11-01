
import Hero from "../../components/sections/home/Hero";
import Impact from "../../components/sections/home/Impact";
import ServicesPreview from "../../components/sections/home/ServicesPreview";
import FeaturedProjects from "../../components/sections/home/FeaturedProjects";
import AboutPreview from "../../components/sections/home/AboutPreview";
import ProcessPreview from "../../components/sections/home/ProcessPreview";
import Testimonials from "../../components/sections/home/Testimonials";
import WhyChooseUs from "../../components/sections/home/WhyChooseUs";
import ContactCTA from "../../components/sections/home/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Impact />
      <ServicesPreview />
      <FeaturedProjects />
      <AboutPreview />
      <ProcessPreview />
      <Testimonials />
      <WhyChooseUs />
      <ContactCTA />
    </>
  );
}
