import { useState, useEffect } from "react";
import api from "../services/api";

const CONTENT_FALLBACKS = {
  home: {
    heroHeading: "Building Spaces. Creating Legacies.",
    heroDescription:
      "Delivering exceptional residential, commercial, and infrastructure solutions across Mangaluru with a relentless commitment to quality and architectural integrity.",
    heroButtonText: "Explore Projects",
    aboutTitle: "Constructing Trust, Crafting Value",
    aboutDescription:
      "With over 15 years of excellence in the construction landscape of Mangaluru, RCC Infrastructure brings together skilled engineering, sustainable construction practices, and reliable project management.",
  },
  about: {
    title: "Building Spaces That Stand the Test of Time",
    description:
      "Founded with a vision to redefine civil construction in coastal Karnataka, RCC Infrastructure has evolved from a boutique contractor into a trusted multi-disciplinary engineering and construction firm.",
    vision:
      "To be the premier construction partner recognized for engineering excellence, timely delivery, and transformative architectural quality that enriches communities.",
    mission:
      "To deliver superior residential, commercial, and industrial infrastructure with uncompromising safety, environmental sustainability, and authentic client trust.",
    values: [
      {
        id: "v1",
        icon: "fa-award",
        title: "Quality Assurance",
        description: "Rigorous ISO-certified quality benchmarks applied across all construction stages.",
      },
      {
        id: "v2",
        icon: "fa-clock",
        title: "On-Time Delivery",
        description: "Disciplined project scheduling and transparent milestone tracking on every build.",
      },
      {
        id: "v3",
        icon: "fa-city",
        title: "Modern Infrastructure",
        description: "Advanced engineering methods and contemporary architectural aesthetics.",
      },
      {
        id: "v4",
        icon: "fa-leaf",
        title: "Sustainable Development",
        description: "Eco-friendly materials, energy conservation, and responsible resource stewardship.",
      },
    ],
  },
  expertise: [
    {
      id: "exp-1",
      number: "01",
      title: "Residential Construction",
      description: "Custom premium villas, luxury apartments, and sustainable private residences.",
    },
    {
      id: "exp-2",
      number: "02",
      title: "Commercial Construction",
      description: "Modern retail hubs, corporate headquarters, and multi-tenant office complexes.",
    },
    {
      id: "exp-3",
      number: "03",
      title: "Planning & Coordination",
      description: "Comprehensive blueprint development, municipal sanctions, and structural audits.",
    },
    {
      id: "exp-4",
      number: "04",
      title: "Renovation & Remodelling",
      description: "Heritage restoration, structural retrofits, and high-end modern interior makeovers.",
    },
    {
      id: "exp-5",
      number: "05",
      title: "Interior Works",
      description: "Precision turnkey interior execution, acoustic ceilings, and bespoke cabinetry.",
    },
    {
      id: "exp-6",
      number: "06",
      title: "Project Management",
      description: "End-to-end site supervision, supply chain optimization, and cost governance.",
    },
  ],
  faqs: [
    {
      id: "faq-1",
      question: "What types of construction projects does RCC Infrastructure handle?",
      answer: "We specialize in residential villas, apartments, commercial complexes, interior turnkey renovations, and civil infrastructure projects across Mangaluru and coastal Karnataka.",
    },
    {
      id: "faq-2",
      question: "How do you ensure projects are completed on schedule?",
      answer: "We establish detailed Gantt milestone schedules, dedicated on-site project managers, and digital daily logs to identify and resolve dependencies ahead of critical path bottlenecks.",
    },
    {
      id: "faq-3",
      question: "Can I customize the architectural plans during the construction process?",
      answer: "Yes, our engineering team works directly with clients through controlled revision phases before structural milestones are finalized.",
    },
    {
      id: "faq-4",
      question: "What quality control standards and certifications do you follow?",
      answer: "All materials undergo rigorous lab batch testing (IS standard cubes, steel tensile verification, certified waterproofing compounds) with third-party QA validation.",
    },
    {
      id: "faq-5",
      question: "How do you handle project budgets and cost overruns?",
      answer: "We provide itemized, transparent Bill of Quantities (BOQ) with fixed-price contractual bounds so there are zero surprise escalations during construction.",
    },
    {
      id: "faq-6",
      question: "Do you assist with municipal sanctions and utility approvals?",
      answer: "Yes, our liaison desk coordinates with local town planning authorities, MUDA/MESCOM/water boards to secure building sanctions and completion certificates.",
    },
    {
      id: "faq-7",
      question: "What warranties and post-handover support do you provide?",
      answer: "We offer comprehensive structural warranties and a 12-month defect liability period with scheduled post-occupancy inspections.",
    },
    {
      id: "faq-8",
      question: "How do we get started with a site consultation or quotation?",
      answer: "You can submit an enquiry via our Contact or Quote form, call us directly, or visit our Mangaluru office to arrange a free feasibility assessment.",
    },
  ],
  pageBanners: {
    default: "/images/banner.webp",
    about: "/images/about.webp",
    services: "/images/card2.webp",
    projects: "/images/card1.webp",
    expertise: "/images/card3.webp",
    process: "/images/card4.webp",
    contact: "/images/contact.webp",
    privacy: "/images/banner.webp",
    terms: "/images/banner.webp",
  },
};

let cachedSiteContent = null;
let contentPromise = null;

export function useSiteContent() {
  const [content, setContent] = useState(cachedSiteContent || CONTENT_FALLBACKS);
  const [loading, setLoading] = useState(!cachedSiteContent);

  useEffect(() => {
    let isMounted = true;

    if (cachedSiteContent) {
      setContent(cachedSiteContent);
      setLoading(false);
      return;
    }

    if (!contentPromise) {
      contentPromise = api
        .get("/public/content")
        .then((res) => {
          if (res?.data) {
            cachedSiteContent = { ...CONTENT_FALLBACKS, ...res.data };
          } else {
            cachedSiteContent = CONTENT_FALLBACKS;
          }
          return cachedSiteContent;
        })
        .catch(() => {
          cachedSiteContent = CONTENT_FALLBACKS;
          return cachedSiteContent;
        })
        .finally(() => {
          contentPromise = null;
        });
    }

    contentPromise.then((data) => {
      if (isMounted) {
        setContent(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { content, loading };
}

export default useSiteContent;
