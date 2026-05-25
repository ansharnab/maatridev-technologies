import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MediaManager from "./MediaManager";
import VisualEditor from "../builder/VisualEditor";
import SettingsPanel from "./SettingsPanel";
import SeoPanel from "./SeoPanel";
import BlogPanel from "./BlogPanel";
import AdminErrorBoundary from "./AdminErrorBoundary";
import "./admin.css";

const TABS = [
  { id: "builder", label: "Page Builder", icon: "fa-wand-magic-sparkles" },
  { id: "media", label: "Media", icon: "fa-images" },
  { id: "blog", label: "Blog", icon: "fa-newspaper" },
  { id: "seo", label: "SEO", icon: "fa-magnifying-glass-chart" },
  { id: "settings", label: "Settings", icon: "fa-gear" },
  { id: "contacts", label: "Messages", icon: "fa-envelope" },
];

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("maatridev-admin-token")}` };
}

export default function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState("builder");
  const [content, setContent] = useState({ pages: {}, settings: {} });
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/content").then((r) => setContent(r.data));
  }, []);

  useEffect(() => {
    if (tab === "contacts") {
      axios.get("/api/contact", { headers: authHeaders() }).then((r) => setContacts(r.data));
    }
  }, [tab]);

  const logout = () => {
    localStorage.removeItem("maatridev-admin-token");
    onLogout();
    navigate("/admin");
  };

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          {content?.settings?.logoImage ? (
            <img
              src={content.settings.logoImage}
              alt={content.settings.logoText || "MaatriDev"}
              className="admin-sidebar__logo-img"
            />
          ) : (
            <span>M</span>
          )}
          <div>
            <strong>MaatriDev</strong>
            <small>Website Builder</small>
          </div>
        </div>
        <nav>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? "active" : ""}
              onClick={() => setTab(t.id)}
            >
              <i className={`fa-solid ${t.icon}`} /> {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <Link to="/" target="_blank"><i className="fa-solid fa-external-link" /> View Site</Link>
          <button type="button" onClick={logout}>Logout</button>
        </div>
      </aside>
      <main className={`admin-main ${tab === "builder" ? "admin-main--editor" : ""}`}>
        {tab === "builder" && (
          <AdminErrorBoundary>
            <VisualEditor />
          </AdminErrorBoundary>
        )}
        {tab === "media" && <MediaManager />}
        {tab === "blog" && <BlogPanel />}
        {tab === "seo" && <SeoPanel content={content} onUpdate={setContent} />}
        {tab === "settings" && <SettingsPanel content={content} onUpdate={setContent} />}
        {tab === "contacts" && (
          <div className="admin-panel">
            <h2>Contact Submissions</h2>
            {contacts.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              <div className="contacts-list">
                {contacts.map((c) => (
                  <article key={c.id} className="contact-card">
                    <strong>{c.name}</strong> · {c.email}
                    <p>{c.subject}</p>
                    <p>{c.message}</p>
                    <small>{new Date(c.createdAt).toLocaleString()}</small>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
