import { useEffect, useState } from "react";
import axios from "axios";
import { services as defaultServices } from "../data/siteData";
import { getDefaultSiteContent } from "../utils/mergeSiteData";
import AnimatedLogo from "../components/AnimatedLogo";
import ImageField from "./ImageField";
import { FoundersBlock, ServicesGridBlock } from "./sections/SectionParts";
import "./site-content-panel.css";

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("maatridev-admin-token")}` };
}

const TABS = [
  { id: "brand", label: "Brand & Logo", icon: "fa-building" },
  { id: "founders", label: "Founders", icon: "fa-user-tie" },
  { id: "services", label: "Services", icon: "fa-grid-2" },
  { id: "contact", label: "Company Contact", icon: "fa-phone" },
];

function Field({ label, children }) {
  return (
    <div className="scp-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function normalizeContent(data) {
  const defaults = getDefaultSiteContent();
  return {
    pages: data?.pages || {},
    settings: { ...defaults.settings, ...(data?.settings || {}) },
    site: {
      founders: data?.site?.founders?.length ? data.site.founders : defaults.site.founders,
      services: defaultServices.map((s) => {
        const saved = data?.site?.services?.find((x) => x.id === s.id);
        return {
          id: s.id,
          title: saved?.title ?? s.title,
          summary: saved?.summary ?? s.summary,
          icon: saved?.icon ?? s.icon,
          image: saved?.image ?? "",
          hidden: saved?.hidden === true,
        };
      }),
    },
  };
}

export default function SiteContentPanel({
  initialTab = "brand",
  content: controlledContent,
  setContent: setControlledContent,
  onSaved,
}) {
  const [tab, setTab] = useState(initialTab);
  const [localContent, setLocalContent] = useState({ pages: {}, settings: {}, site: {} });
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const isControlled = Boolean(setControlledContent);
  const content = isControlled ? controlledContent : localContent;
  const setContent = isControlled ? setControlledContent : setLocalContent;

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const load = () => {
    axios.get("/api/content").then((r) => {
      const normalized = normalizeContent(r.data);
      if (isControlled && onSaved) onSaved(normalized);
      else setLocalContent(normalized);
    });
  };

  useEffect(() => {
    if (!isControlled) load();
  }, [isControlled]);

  const save = async () => {
    setSaving(true);
    setStatus("");
    const next = { ...content };
    try {
      const res = await axios.put("/api/content", next, { headers: authHeaders() });
      const saved = res.data?.content ? normalizeContent(res.data.content) : next;
      setContent(saved);
      onSaved?.(saved);
      const logo = saved.settings?.logoImage;
      if (logo && /\.(mp4|webm)/i.test(logo)) {
        setStatus(`Saved. Logo video: ${logo} — open that URL in a new tab to confirm it plays, then hard-refresh the homepage.`);
      } else if (logo) {
        setStatus(`Saved. Logo: ${logo} — hard-refresh the live site (Ctrl+F5).`);
      } else {
        setStatus("Saved — refresh the live site to see updates.");
      }
    } catch {
      setStatus("Save failed. On localhost run START-LOCAL.bat. On live server ensure the API (port 3001) is running.");
    } finally {
      setSaving(false);
    }
  };

  const setSettings = (patch) => setContent((c) => ({ ...c, settings: { ...c.settings, ...patch } }));
  const setFounders = (founders) => setContent((c) => ({ ...c, site: { ...c.site, founders } }));
  const setServices = (services) => setContent((c) => ({ ...c, site: { ...c.site, services } }));

  const updateFounder = (index, patch) => {
    const next = [...(content.site?.founders || [])];
    next[index] = { ...next[index], ...patch };
    setFounders(next);
  };

  const updateService = (index, patch) => {
    const next = [...(content.site?.services || [])];
    next[index] = { ...next[index], ...patch };
    setServices(next);
  };

  const founders = content.site?.founders || [];
  const services = content.site?.services || [];
  const settings = content.settings || {};

  return (
    <div className="scp-root">
      <header className="scp-head">
        <div>
          <h2>Site Content</h2>
          <p>Edit logo, founders, service cards, and contact details used across the whole website.</p>
        </div>
        <button type="button" className="ve-btn ve-btn--primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save site content"}
        </button>
        {status && <span className="ve-status">{status}</span>}
      </header>

      <div className="scp-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? "is-active" : ""}
            onClick={() => setTab(t.id)}
          >
            <i className={`fa-solid ${t.icon}`} /> {t.label}
          </button>
        ))}
      </div>

      <div className="scp-layout">
        <div className="scp-form">
          {tab === "brand" && (
            <>
              <h3>Brand & Logo</h3>
              <Field label="Site name">
                <input value={settings.siteName || ""} onChange={(e) => setSettings({ siteName: e.target.value })} />
              </Field>
              <Field label="Logo text (next to icon)">
                <input value={settings.logoText || ""} onChange={(e) => setSettings({ logoText: e.target.value })} />
              </Field>
              <Field label="Logo letter (if no image)">
                <input
                  maxLength={2}
                  value={settings.logoLetter || "M"}
                  onChange={(e) => setSettings({ logoLetter: e.target.value })}
                />
              </Field>
              <Field label="Logo animation">
                <select
                  value={settings.logoAnimation || "gradient"}
                  onChange={(e) => setSettings({ logoAnimation: e.target.value })}
                >
                  <option value="gradient">Gradient shift</option>
                  <option value="pulse">Pulse</option>
                  <option value="glow">Glow</option>
                  <option value="orbit">Orbit ring</option>
                  <option value="none">Static (no motion)</option>
                </select>
              </Field>
              <div className="scp-row-2">
                <Field label="Primary color">
                  <input
                    type="color"
                    value={settings.logoColorPrimary || "#007cc3"}
                    onChange={(e) => setSettings({ logoColorPrimary: e.target.value })}
                  />
                </Field>
                <Field label="Accent color">
                  <input
                    type="color"
                    value={settings.logoColorAccent || "#00b8a9"}
                    onChange={(e) => setSettings({ logoColorAccent: e.target.value })}
                  />
                </Field>
              </div>
              <ImageField
                allowVideo
                label="Logo image or video (optional)"
                hint="Use your full SVG/PNG lockup (icon + MaatriDev Technologies). If the file has extra padding, raise Logo zoom below."
                value={settings.logoImage || ""}
                onChange={(url) => setSettings({ logoImage: url })}
              />
              {settings.logoImage && (
                <>
                  <Field label={`Logo zoom (${settings.logoScale ?? 1}×)`}>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={Number(settings.logoScale) || 1}
                      onChange={(e) => setSettings({ logoScale: Number(e.target.value) })}
                    />
                  </Field>
                  <Field label={`Logo width crop (${settings.logoClipWidth ?? 220}px)`}>
                    <input
                      type="range"
                      min={140}
                      max={320}
                      step={5}
                      value={Number(settings.logoClipWidth) || 220}
                      onChange={(e) => setSettings({ logoClipWidth: Number(e.target.value) })}
                    />
                  </Field>
                  <p className="scp-alert">
                    Seeing cut-off text or “TECHNOLOGIES” floating on the right? That is inside your SVG file — narrow the
                    crop width or re-export a tight transparent PNG/SVG.
                  </p>
                </>
              )}
              <Field label="Tagline">
                <input value={settings.tagline || ""} onChange={(e) => setSettings({ tagline: e.target.value })} />
              </Field>
            </>
          )}

          {tab === "founders" && (
            <>
              <h3>Founders</h3>
              <p className="scp-note">Shown on Home, About, Team, and the Founders section in the page builder.</p>
              {founders.map((f, i) => (
                <article key={i} className="scp-card">
                  <h4>Founder {i + 1}</h4>
                  <Field label="Full name">
                    <input value={f.name || ""} onChange={(e) => updateFounder(i, { name: e.target.value })} />
                  </Field>
                  <Field label="Role / title">
                    <input value={f.role || ""} onChange={(e) => updateFounder(i, { role: e.target.value })} />
                  </Field>
                  <Field label="Bio">
                    <textarea value={f.bio || ""} onChange={(e) => updateFounder(i, { bio: e.target.value })} rows={3} />
                  </Field>
                  <Field label="Phone">
                    <input value={f.phone || ""} onChange={(e) => updateFounder(i, { phone: e.target.value })} placeholder="+91 …" />
                  </Field>
                  <Field label="Email">
                    <input type="email" value={f.email || ""} onChange={(e) => updateFounder(i, { email: e.target.value })} />
                  </Field>
                  <Field label="LinkedIn URL">
                    <input value={f.linkedin || ""} onChange={(e) => updateFounder(i, { linkedin: e.target.value })} placeholder="https://linkedin.com/in/…" />
                  </Field>
                  <ImageField
                    label="Photo"
                    value={f.image || ""}
                    onChange={(url) => updateFounder(i, { image: url })}
                  />
                </article>
              ))}
            </>
          )}

          {tab === "services" && (
            <>
              <h3>Services</h3>
              <p className="scp-note">Edit titles, descriptions, icons, and card images. Hide a service to remove it from grids.</p>
              {services.map((s, i) => (
                <article key={s.id} className="scp-card">
                  <div className="scp-card__head">
                    <h4>{s.title || s.id}</h4>
                    <label className="scp-check">
                      <input
                        type="checkbox"
                        checked={!s.hidden}
                        onChange={(e) => updateService(i, { hidden: !e.target.checked })}
                      />
                      Show on site
                    </label>
                  </div>
                  <Field label="Title">
                    <input value={s.title || ""} onChange={(e) => updateService(i, { title: e.target.value })} />
                  </Field>
                  <Field label="Short description">
                    <textarea value={s.summary || ""} onChange={(e) => updateService(i, { summary: e.target.value })} rows={2} />
                  </Field>
                  <Field label="Icon (Font Awesome class)">
                    <input value={s.icon || "fa-cube"} onChange={(e) => updateService(i, { icon: e.target.value })} placeholder="fa-code" />
                  </Field>
                  <ImageField
                    label="Card image (optional)"
                    hint="If set, can be used on detail pages; icon still shows on service cards."
                    value={s.image || ""}
                    onChange={(url) => updateService(i, { image: url })}
                  />
                </article>
              ))}
            </>
          )}

          {tab === "contact" && (
            <>
              <h3>Company contact</h3>
              <Field label="Main email">
                <input type="email" value={settings.email || ""} onChange={(e) => setSettings({ email: e.target.value })} />
              </Field>
              <Field label="Main phone">
                <input value={settings.phone || ""} onChange={(e) => setSettings({ phone: e.target.value })} />
              </Field>
              <Field label="Address">
                <input value={settings.address || ""} onChange={(e) => setSettings({ address: e.target.value })} />
              </Field>
            </>
          )}
        </div>

        <div className="scp-preview">
          <p className="scp-preview__label">Live preview</p>
          <div className="scp-preview__frame">
            {tab === "founders" && <FoundersBlock founders={founders} />}
            {tab === "services" && (
              <ServicesGridBlock
                showAll
                title="Our Services"
                subtitle=""
                services={services.filter((s) => !s.hidden)}
              />
            )}
            {tab === "brand" && (
              <div className="scp-brand-preview">
                <p className="scp-brand-preview__label">Header preview</p>
                <div className="scp-brand-preview__header">
                  <AnimatedLogo
                  letter={settings.logoLetter}
                  animation={settings.logoAnimation}
                  colorPrimary={settings.logoColorPrimary}
                  colorAccent={settings.logoColorAccent}
                  imageUrl={settings.logoImage}
                  alt={settings.logoText}
                  fullBrand={Boolean(settings.logoImage)}
                  scale={settings.logoScale}
                  clipWidth={settings.logoClipWidth}
                  size="lg"
                />
                </div>
                <div className="scp-brand-preview__meta">
                  {!settings.logoImage && (
                    <>
                      <strong>{settings.logoText}</strong>
                      <small>TECHNOLOGIES</small>
                    </>
                  )}
                  <p>{settings.tagline}</p>
                </div>
              </div>
            )}
            {tab === "contact" && (
              <div className="scp-contact-preview card">
                <div className="card__body">
                  <p><i className="fa-solid fa-envelope" /> {settings.email}</p>
                  <p><i className="fa-solid fa-phone" /> {settings.phone}</p>
                  <p><i className="fa-solid fa-location-dot" /> {settings.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
