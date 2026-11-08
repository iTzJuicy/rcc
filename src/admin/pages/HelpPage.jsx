import HowToUse from "../components/HowToUse";

export default function HelpPage() {
  const guides = [
    {
      title: "How to Add or Edit a Project",
      icon: "fa-solid fa-building",
      steps: [
        "Go to 'Projects' in the left sidebar menu.",
        "Click the '+ Add Project' button at the top right.",
        "Enter the Project Title (max 60 chars), Category, and Location.",
        "Provide a short summary (max 160 chars) and detailed description (max 1200 chars).",
        "Upload a Main Cover Image and optional Gallery Images (up to 12 images).",
        "Toggle 'Featured on Home Page' if you want this project highlighted on the home page.",
        "Click 'Save Project' in the bottom sticky action bar.",
      ],
    },
    {
      title: "How to Add or Edit a Service",
      icon: "fa-solid fa-helmet-safety",
      steps: [
        "Go to 'Services' in the sidebar.",
        "Click '+ Add Service' or click 'Edit' next to any existing service.",
        "Fill in Title (max 60 chars), Short Description (max 160 chars), and Long Description (max 1200 chars).",
        "Toggle 'Show on Home Page' if you want it shown on the home page services preview (top 4 will be displayed).",
        "Upload a Main Service Image and gallery images (up to 10 images).",
        "Click 'Save Service' to publish.",
      ],
    },
    {
      title: "How to Change Page Hero Banners",
      icon: "fa-solid fa-image",
      steps: [
        "Go to 'Page Banners' under Media in the sidebar.",
        "Locate the page you want to update (e.g. About Us, Services, Projects).",
        "Click 'Upload New Image' to upload a 1920x600 photo.",
        "Click 'Save All Banners' at the bottom of the screen.",
      ],
    },
    {
      title: "How to Manage & Reply to Enquiries",
      icon: "fa-solid fa-envelope",
      steps: [
        "Click 'Enquiries' in the sidebar to review lead submissions and quote requests.",
        "Filter by status (New, Contacted, In Progress, Closed) or search by customer name/phone.",
        "Click on any enquiry row to review carpet area, timeline, budget, and project notes.",
        "Export enquiries anytime to CSV or Excel XML format using the Export button.",
      ],
    },
    {
      title: "Character Limits Quick Reference",
      icon: "fa-solid fa-ruler-horizontal",
      steps: [
        "Hero Heading: 55 characters",
        "Hero Description: 160 characters",
        "Hero Button Text: 22 characters",
        "Home About Title: 45 characters | Description: 300 characters",
        "About Page Title: 45 characters | Description: 600 characters",
        "Vision & Mission: 220 characters each",
        "Core Value Title: 28 characters | Description: 120 characters",
        "Expertise Card Title: 35 characters | Description: 190 characters",
        "FAQ Question: 90 characters | Answer: 280 characters (Max 8 FAQs)",
        "Service & Project Titles: 60 characters | Short Desc: 160 | Full Desc: 1200",
      ],
    },
  ];

  return (
    <div className="admin-page-container">
      <HowToUse
        title="Help & Best Practices"
        tips={[
          "All changes made in this admin panel take effect on the live website immediately upon saving.",
          "Images uploaded through the Media Library are automatically optimized for web performance.",
          "If you ever need technical assistance, contact the web administration team.",
        ]}
      />

      <div className="admin-grid-2-col">
        {guides.map((guide, idx) => (
          <div className="admin-card" key={idx}>
            <div className="admin-card-header">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="admin-guide-icon-badge">
                  <i className={guide.icon} />
                </div>
                <h3>{guide.title}</h3>
              </div>
            </div>

            <div className="admin-card-body">
              <ol className="admin-guide-steps-list">
                {guide.steps.map((step, sIdx) => (
                  <li key={sIdx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
