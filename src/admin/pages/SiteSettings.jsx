import { useState, useEffect } from "react";
import api from "../../services/api";
import Icon from "../../components/common/Icon";
import HowToUse from "../components/HowToUse";

export default function SiteSettings() {
  const [settings, setSettings] = useState({
    siteName: "RCC Infrastructure",
    tagline: "Quality Construction & Development",
    logo: "/images/logo.webp",
    favicon: "/images/logo.webp",
    phone: "+91 98765 43210",
    email: "info@rccinfrastructure.com",
    address: "Mangalore, Karnataka, India",
    mapEmbedUrl: "",
    socialLinks: {
      facebook: "https://www.facebook.com/",
      instagram: "https://www.instagram.com/",
      linkedin: "https://www.linkedin.com/",
      whatsapp: "https://wa.me/919876543210",
    },
    defaultSeo: {
      metaTitle: "RCC Infrastructure | Quality Construction & Development",
      metaDescription: "RCC Infrastructure delivers dependable construction and development solutions in Mangalore, Karnataka.",
      ogImage: "/images/impact.webp",
    },
  });

  const [savingSettings, setSavingSettings] = useState(false);
  const [alert, setAlert] = useState({ type: "", text: "" });

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPass, setChangingPass] = useState(false);
  const [passAlert, setPassAlert] = useState({ type: "", text: "" });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.adminGetSettings();
        if (res?.data) {
          setSettings(res.data);
        }
      } catch (err) {
        console.warn("Using default settings:", err.message);
      }
    }
    load();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setAlert({ type: "", text: "" });

    try {
      await api.adminUpdateSettings(settings);
      setAlert({ type: "success", text: "Site settings saved successfully." });
    } catch (err) {
      setAlert({ type: "error", text: err.message || "Failed to save settings." });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassAlert({ type: "", text: "" });

    if (newPassword !== confirmPassword) {
      setPassAlert({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    if (newPassword.length < 6) {
      setPassAlert({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    setChangingPass(true);

    try {
      await api.adminChangePassword(currentPassword, newPassword);
      setPassAlert({ type: "success", text: "Password changed successfully! Keep it safe." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPassAlert({ type: "error", text: err.message || "Password update failed." });
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="admin-page-container">
      <HowToUse title="How to use Site Settings" tips={["Update contact details and social links used across the public website.", "Use the branding fields to control the site identity and default SEO values.", "Save changes after editing; settings take effect immediately."]} />
      {alert.text && (
        <div className={`admin-login-alert ${alert.type === "error" ? "error" : ""}`} style={{ marginBottom: "20px" }}>
          {alert.text}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        {/* Main Settings Form */}
        <form onSubmit={handleSaveSettings}>
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3>General Site Information</h3>
                <p>Company branding, phone, address, and Google Maps embed</p>
              </div>
            </div>

            <div className="admin-card-body">
              <div className="admin-grid-2-col">
                <div className="admin-form-group">
                  <label>Company / Brand Name</label>
                  <input
                    type="text"
                    value={settings.siteName || ""}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline || ""}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-grid-2-col">
                <div className="admin-form-group">
                  <label>Logo Path / URL</label>
                  <input
                    type="text"
                    value={settings.logo || ""}
                    onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Favicon Path / URL</label>
                  <input
                    type="text"
                    value={settings.favicon || ""}
                    onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-grid-2-col">
                <div className="admin-form-group">
                  <label>Official Phone Number</label>
                  <input
                    type="text"
                    value={settings.phone || ""}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Official Email Address</label>
                  <input
                    type="email"
                    value={settings.email || ""}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Office Physical Address</label>
                <input
                  type="text"
                  value={settings.address || ""}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label>Google Maps Embed URL (Iframe Src)</label>
                <textarea
                  rows="2"
                  value={settings.mapEmbedUrl || ""}
                  onChange={(e) => setSettings({ ...settings, mapEmbedUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?..."
                />
              </div>
            </div>
          </div>

          {/* Social Links Card */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3>Social & Communication Links</h3>
                <p>Social profiles shown in footer and contact page</p>
              </div>
            </div>

            <div className="admin-card-body">
              <div className="admin-grid-2-col">
                <div className="admin-form-group">
                  <label>WhatsApp Number / Link</label>
                  <input
                    type="text"
                    value={settings.socialLinks?.whatsapp || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, whatsapp: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>LinkedIn URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.linkedin || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-grid-2-col">
                <div className="admin-form-group">
                  <label>Facebook Page URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.facebook || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <label>Instagram URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.instagram || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="admin-btn-primary"
                style={{ width: "auto", marginTop: "12px" }}
                disabled={savingSettings}
              >
                {savingSettings ? "Saving Settings..." : "Save All Site Settings"}
              </button>
            </div>
          </div>
        </form>

        {/* Security & Admin Password Section */}
        <div>
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3>Security & Password</h3>
                <p>Update administrator credentials</p>
              </div>
            </div>

            <div className="admin-card-body">
              {passAlert.text && (
                <div
                  className={`admin-login-alert ${passAlert.type === "error" ? "error" : ""}`}
                  style={{
                    background: passAlert.type === "error" ? "#fde8e8" : "#def7ec",
                    color: passAlert.type === "error" ? "#9b1c1c" : "#03543f",
                    marginBottom: "16px",
                  }}
                >
                  {passAlert.text}
                </div>
              )}

              <form onSubmit={handleChangePassword}>
                <div className="admin-form-group">
                  <label>Current Password *</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label>New Password (min 6 chars) *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="admin-btn-primary"
                  style={{ width: "100%" }}
                  disabled={changingPass}
                >
                  {changingPass ? "Updating Password..." : "Change Password"}
                </button>
              </form>
            </div>
          </div>

          {/* Quick Legal Pages Links */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3>Legal Pages</h3>
                <p>Public policy documents</p>
              </div>
            </div>
            <div className="admin-card-body" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noreferrer"
                className="admin-action-btn"
                style={{ padding: "8px 12px", display: "flex", justifyContent: "space-between" }}
              >
                <span>Privacy Policy Page</span>
                <Icon name="arrowUpRight" size={14} />
              </a>

              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noreferrer"
                className="admin-action-btn"
                style={{ padding: "8px 12px", display: "flex", justifyContent: "space-between" }}
              >
                <span>Terms & Conditions Page</span>
                <Icon name="arrowUpRight" size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
