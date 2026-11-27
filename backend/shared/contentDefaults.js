// Shared by the backend API and frontend offline fallback.
export const DEFAULT_CONTENT = {
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
  expertise: {
    hero: {
      eyebrow: "Our Capabilities",
      title: "Our Expertise",
      description: "Practical construction solutions, thoughtful planning, and quality execution at every stage.",
    },
    intro: {
      eyebrow: "What We Bring",
      title: "Practical Solutions. Quality Execution.",
      paragraphs: [
        "Every construction project begins with a different vision, purpose, and set of requirements. We take the time to understand what matters to each client and turn those requirements into a clear, considered plan.",
        "Through careful coordination, dependable workmanship, and attention to detail, we work to deliver spaces that are functional, well-built, and made to serve their purpose for years to come.",
      ],
      buttonText: "Explore Our Services",
    },
    areas: {
      eyebrow: "Our Expertise",
      title: "Built Around Your Requirements.",
      description: "Explore the key areas that shape our construction and project delivery approach.",
      footerText: "Have a project in mind?",
      footerLinkText: "Discuss Your Project",
    },
    items: [
      { id: "exp-1", title: "Residential Construction", description: "Custom premium villas, luxury apartments, and sustainable private residences." },
      { id: "exp-2", title: "Commercial Construction", description: "Modern retail hubs, corporate headquarters, and multi-tenant office complexes." },
      { id: "exp-3", title: "Planning & Coordination", description: "Comprehensive blueprint development, municipal sanctions, and structural audits." },
      { id: "exp-4", title: "Renovation & Remodelling", description: "Heritage restoration, structural retrofits, and high-end modern interior makeovers." },
      { id: "exp-5", title: "Interior Works", description: "Precision turnkey interior execution, acoustic ceilings, and bespoke cabinetry." },
      { id: "exp-6", title: "Project Management", description: "End-to-end site supervision, supply chain optimization, and cost governance." },
    ],
    approach: {
      eyebrow: "Our Approach",
      title: "Quality at Every Stage.",
      paragraphs: [
        "Quality is not limited to the finished structure. It is part of every decision, every detail, and every stage of the construction process.",
        "We believe in a hands-on approach built on clear communication, responsible execution, and consistent attention to detail. By working closely with our clients and project teams, we aim to make the entire experience reliable and straightforward.",
      ],
      image: "/images/about.webp",
      buttonText: "Discover Our Process",
    },
  },
  process: {
    hero: {
      eyebrow: "How We Work",
      title: "Our Process",
      description: "A clear, structured path from your first idea to the day we hand over the keys.",
    },
    overview: {
      eyebrow: "Process Overview",
      title: "From Vision to Reality.",
      description: "We follow a structured and transparent process to ensure quality construction and timely delivery in every project we undertake.",
    },
    steps: [
      { id: "step-1", title: "Consultation", summary: "Understanding your needs", description: "We begin by listening. Through a site visit and a detailed discussion, we understand your requirements, budget and expectations so the project starts on a clear footing.", provide: ["Your ideas and requirements", "Site details and location", "Budget range and timeline"], receive: ["A clear project brief", "Initial scope and estimate"], timeframe: "Typically 1 to 2 weeks", image: "/images/card1.webp" },
      { id: "step-2", title: "Planning & Design", summary: "Design and approvals", description: "We turn the brief into a workable plan with drawings, specifications, a schedule and a cost plan, and we coordinate the approvals the project needs.", provide: ["Feedback on drawings", "Approval of design and budget", "Required property documents"], receive: ["Approved drawings and specifications", "Project schedule and cost plan"], timeframe: "Typically 3 to 6 weeks", image: "/images/card2.webp" },
      { id: "step-3", title: "Execution", summary: "Quality construction", description: "Our team builds with careful supervision, stage-wise quality checks and regular progress updates, so you always know where the project stands.", provide: ["Timely decisions and approvals", "Stage-wise site visits (optional)"], receive: ["Regular progress updates", "Stage-wise quality inspections"], timeframe: "Depends on project size", image: "/images/card3.webp" },
      { id: "step-4", title: "Handover", summary: "On-time delivery", description: "We complete a final inspection, resolve any snags and hand over the finished project along with the documents you need.", provide: ["Final walkthrough and sign-off"], receive: ["Completed project and snag clearance", "Handover documents", "Post-handover support"], timeframe: "Typically 1 to 2 weeks", image: "/images/card4.webp" },
    ],
    support: {
      eyebrow: "Behind Every Step",
      title: "Support You Can Rely On.",
      items: [
        { id: "support-1", title: "Approvals & Documentation", description: "We guide you through site checks, design approvals, permits and agreements so nothing is missed.", points: ["Site checks and requirements", "Design approvals and permits", "Agreements and documentation"] },
        { id: "support-2", title: "Quality & Progress Control", description: "Site supervision, stage-wise inspections and regular updates keep quality and progress on track.", points: ["Regular site supervision", "Stage-wise quality inspections", "Progress updates"] },
        { id: "support-3", title: "Handover & After-Care", description: "A final inspection, a snag list and the documents you need, with support after completion.", points: ["Final inspection and snag list", "Project handover documents", "Post-completion support"] },
      ],
    },
    promise: {
      eyebrow: "What To Expect",
      title: "Our Promise to You.",
      items: [
        { id: "promise-1", icon: "fa-comments", title: "Transparent Communication", description: "Clear updates at every stage." },
        { id: "promise-2", icon: "fa-calendar-check", title: "Timely Milestones", description: "Planned stages and realistic timelines." },
        { id: "promise-3", icon: "fa-gem", title: "Quality Materials", description: "Reliable materials and workmanship." },
        { id: "promise-4", icon: "fa-indian-rupee-sign", title: "Clear Costs", description: "No surprises in scope or pricing." },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Common Questions.",
      description: "Can't find what you are looking for? We are happy to talk it through.",
      buttonText: "Ask Us Directly",
    },
  },
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
    services: "",
    projects: "",
    expertise: "/images/card3.webp",
    process: "/images/card4.webp",
    contact: "/images/contact.webp",
    privacy: "/images/banner.webp",
    terms: "/images/banner.webp",
  },
};
