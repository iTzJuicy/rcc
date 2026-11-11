import { useState } from "react";
import HowToUse from "../components/HowToUse";
import api from "../../services/api";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ type: "", message: "" });

    if (newPassword.length < 8) {
      setToast({ type: "error", message: "New password must be at least 8 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({ type: "error", message: "New passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const res = await api.adminChangePassword(currentPassword, newPassword);

      if (res?.success) {
        setToast({ type: "success", message: "Password updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setToast({ type: "error", message: res?.message || "Failed to update password." });
      }
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to update password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container" style={{ maxWidth: "600px" }}>
      <HowToUse
        title="Password Security Advice"
        tips={[
          "Choose a strong password with at least 8 characters.",
          "Use a combination of upper and lowercase letters, numbers, and symbols.",
          "Keep your administrator credentials confidential and do not share your login.",
        ]}
      />

      {toast.message && (
        <div className={`admin-toast-banner ${toast.type}`}>
          <i className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
          <span>{toast.message}</span>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3>Update Administrator Password</h3>
            <p className="admin-card-subtitle">
              Change the password used to sign in to this admin panel.
            </p>
          </div>
        </div>

        <div className="admin-card-body">
          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label htmlFor="currentPassword">
                Current Password <span className="admin-required">*</span>
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="newPassword">
                New Password (minimum 8 characters) <span className="admin-required">*</span>
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                minLength={8}
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="confirmPassword">
                Confirm New Password <span className="admin-required">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                minLength={8}
                required
              />
            </div>

            <div style={{ marginTop: "24px" }}>
              <button
                type="submit"
                className="admin-btn-primary"
                disabled={loading}
              >
                <i className="fa-solid fa-key" />
                <span>{loading ? "Updating Password..." : "Update Password"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
