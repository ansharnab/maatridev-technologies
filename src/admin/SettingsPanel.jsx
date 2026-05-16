import { useState } from "react";
import axios from "axios";

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("maatridev-admin-token")}` };
}

export default function SettingsPanel({ content, onUpdate }) {
  const [settings, setSettings] = useState(content.settings || {});
  const [saved, setSaved] = useState(false);

  const save = async () => {
    const next = { ...content, settings };
    await axios.put("/api/content", next, { headers: authHeaders() });
    onUpdate(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields = [
    { key: "siteName", label: "Site Name" },
    { key: "logoText", label: "Logo Text" },
    { key: "tagline", label: "Tagline" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
  ];

  const hint = "For logo image, founder photos, service images, and founder phone numbers, use Page Builder → Site Content.";

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h2>Site Settings</h2>
        <button type="button" className="btn btn--primary" onClick={save}>
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
      <p className="admin-hint">{hint}</p>
      <div className="settings-grid">
        {fields.map((f) => (
          <div key={f.key} className="form-group">
            <label>{f.label}</label>
            <input
              value={settings[f.key] || ""}
              onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
