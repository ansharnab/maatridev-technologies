import { useState } from "react";
import axios from "axios";
import { blogPosts as builtInBlog } from "../data/siteData";

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("maatridev-admin-token")}` };
}

const PAGE_SEO_IDS = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

const emptyPageSeo = () => ({
  title: "",
  description: "",
  ogImage: "",
  keywords: "",
  noindex: false,
  canonical: "",
});

export default function SeoPanel({ content, onUpdate }) {
  const [settings, setSettings] = useState({
    ...content.settings,
    seo: { title: "", description: "", ogImage: "", keywords: "", ...(content.settings?.seo || {}) },
  });
  const [pages, setPages] = useState(() => {
    const p = { ...content.pages };
    for (const { id } of PAGE_SEO_IDS) {
      if (!p[id]) p[id] = {};
      if (!p[id].seo) p[id].seo = emptyPageSeo();
    }
    return p;
  });
  const [blog, setBlog] = useState(content.site?.blog || []);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    const next = {
      ...content,
      settings,
      pages,
      site: { ...content.site, blog },
    };
    await axios.put("/api/content", next, { headers: authHeaders() });
    onUpdate(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const patchPageSeo = (pageId, patch) => {
    setPages((prev) => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        seo: { ...prev[pageId]?.seo, ...patch },
      },
    }));
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h2>SEO</h2>
        <button type="button" className="btn btn--primary" onClick={save}>
          {saved ? "Saved!" : "Save SEO"}
        </button>
      </div>
      <p className="admin-hint">
        Site-wide defaults, per-page overrides, and blog meta. Home variants (/home/*) are noindex with canonical to /.
        Dynamic title/meta update on every page navigation (SPA).
      </p>

      <h3 className="admin-subhead">Site-wide</h3>
      <div className="settings-grid">
        <div className="form-group">
          <label>Default title</label>
          <input
            value={settings.seo?.title || ""}
            onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, title: e.target.value } })}
            placeholder="MaatriDev Technologies | …"
          />
        </div>
        <div className="form-group">
          <label>Default meta description</label>
          <textarea
            rows={3}
            value={settings.seo?.description || ""}
            onChange={(e) =>
              setSettings({ ...settings, seo: { ...settings.seo, description: e.target.value } })
            }
          />
        </div>
        <div className="form-group">
          <label>Default OG image URL</label>
          <input
            value={settings.seo?.ogImage || ""}
            onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, ogImage: e.target.value } })}
            placeholder="/uploads/… or https://…"
          />
        </div>
        <div className="form-group">
          <label>Keywords (comma-separated)</label>
          <input
            value={settings.seo?.keywords || ""}
            onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, keywords: e.target.value } })}
          />
        </div>
      </div>

      <h3 className="admin-subhead">Per-page overrides</h3>
      {PAGE_SEO_IDS.map(({ id, label }) => (
        <details key={id} className="seo-page-block" open={id === "about"}>
          <summary>{label}</summary>
          <div className="settings-grid">
            <div className="form-group">
              <label>Title</label>
              <input
                value={pages[id]?.seo?.title || ""}
                onChange={(e) => patchPageSeo(id, { title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={2}
                value={pages[id]?.seo?.description || ""}
                onChange={(e) => patchPageSeo(id, { description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>OG image</label>
              <input
                value={pages[id]?.seo?.ogImage || ""}
                onChange={(e) => patchPageSeo(id, { ogImage: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(pages[id]?.seo?.noindex)}
                  onChange={(e) => patchPageSeo(id, { noindex: e.target.checked })}
                />{" "}
                Noindex
              </label>
            </div>
          </div>
        </details>
      ))}

      <h3 className="admin-subhead">Blog posts</h3>
      {blog.length === 0 && (
        <p>
          No blog in CMS — built-in posts from code are live.{" "}
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => setBlog(builtInBlog.map((p) => ({ ...p })))}
          >
            Import built-in blog to CMS
          </button>
        </p>
      )}
      {blog.map((post, i) => (
        <details key={post.id || i} className="seo-page-block">
          <summary>{post.title || `Post ${i + 1}`}</summary>
          <div className="settings-grid">
            <div className="form-group">
              <label>Slug (URL)</label>
              <input
                value={post.slug || ""}
                onChange={(e) => {
                  const next = [...blog];
                  next[i] = { ...post, slug: e.target.value };
                  setBlog(next);
                }}
              />
            </div>
            <div className="form-group">
              <label>Meta title</label>
              <input
                value={post.metaTitle || ""}
                onChange={(e) => {
                  const next = [...blog];
                  next[i] = { ...post, metaTitle: e.target.value };
                  setBlog(next);
                }}
              />
            </div>
            <div className="form-group">
              <label>Meta description</label>
              <textarea
                rows={2}
                value={post.metaDescription || ""}
                onChange={(e) => {
                  const next = [...blog];
                  next[i] = { ...post, metaDescription: e.target.value };
                  setBlog(next);
                }}
              />
            </div>
          </div>
        </details>
      ))}
      <p className="admin-hint">
        To add blog rows here, save an array at <code>site.blog</code> in content (or extend this panel later). Built-in
        posts in <code>siteData.js</code> always work with slugs.
      </p>
    </div>
  );
}
