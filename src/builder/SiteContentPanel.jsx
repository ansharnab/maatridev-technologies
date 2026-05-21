import { useEffect, useState } from "react";
import axios from "axios";
import { fetchSiteContent, saveSiteContent } from "../admin/api";
import {
  HEADER_DARK_QUICK_IDS,
  HEADER_DESIGNS,
  HEADER_LIGHT_DESIGN_IDS,
  applyHeaderDesignPreset,
  headerQuickPresets,
} from "../utils/headerTheme";
import { LOGO_IMAGE_FILTER_PRESETS } from "../utils/logoImageFilters";
import { isBuiltInLogo, logoSettingsAfterUpload } from "../utils/logoSettings";
import { hasCustomLogo } from "../utils/mediaType";
import { services as defaultServices } from "../data/siteData";
import { getDefaultSiteContent, mergeSiteContent } from "../utils/mergeSiteData";
import { SiteHeaderBar } from "../components/layout/Header";
import ImageField from "./ImageField";
import SiteContentHeaderColors from "./SiteContentHeaderColors";
import { previewBgForHomePath } from "./homeAgencyNav";
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
  const merged = mergeSiteContent(data);
  return {
    pages: data?.pages || {},
    settings: merged.settings,
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
    fetchSiteContent()
      .then((data) => {
        const normalized = normalizeContent(data);
        if (isControlled && onSaved) onSaved(normalized);
        else setLocalContent(normalized);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!isControlled) load();
  }, [isControlled]);

  const save = async (payload) => {
    setSaving(true);
    setStatus("");
    const next = payload ?? content;
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
    } catch (err) {
      const token = localStorage.getItem("maatridev-admin-token");
      if (!token) {
        setStatus("Save failed — not signed in. Open /admin and log in again.");
      } else if (!err?.response) {
        setStatus("Save failed — API not reachable. Run: npm run dev (port 3001 + 5173).");
      } else if (err.response.status === 401) {
        setStatus("Save denied — session expired. Log out and log in again at /admin.");
      } else {
        setStatus(err.response.data?.error || `Save failed (error ${err.response.status}).`);
      }
    } finally {
      setSaving(false);
    }
  };

  const setSettings = (patch) => setContent((c) => ({ ...c, settings: { ...c.settings, ...patch } }));

  const applyLogoChange = async (url) => {
    const base = content.settings || {};
    const settingsPatch = !url
      ? { logoImage: "", logoImageOnDark: "/logo-maatridev-hero.svg", logoUpdatedAt: undefined }
      : url.startsWith("/uploads/")
        ? logoSettingsAfterUpload(url, base)
        : { logoImage: url, logoUpdatedAt: Date.now() };
    const next = {
      ...content,
      settings: { ...base, ...settingsPatch },
    };
    setContent(next);
    if (!url || url.startsWith("/uploads/")) await save(next);
  };

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
  const lightHeaderPresets = headerQuickPresets(HEADER_LIGHT_DESIGN_IDS);
  const darkHeaderPresets = headerQuickPresets(HEADER_DARK_QUICK_IDS);
  const customUploadedLogo =
    hasCustomLogo(settings.logoImage) && !isBuiltInLogo(settings.logoImage);

  return (
    <div className="scp-root">
      <header className="scp-head">
        <div>
          <h2>Site Content</h2>
          <p>Edit logo, founders, service cards, and contact details used across the whole website.</p>
        </div>
        <button type="button" className="ve-btn ve-btn--primary" onClick={() => save()} disabled={saving}>
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

              <section className="scp-logo-card">
                <div className="scp-logo-card__head">
                  <h4>Logo file</h4>
                  <p>PNG, SVG, or MP4 on transparent background. Uploads save automatically.</p>
                </div>
                <ImageField
                  allowVideo
                  variant="logo"
                  previewVersion={settings.logoUpdatedAt}
                  label=""
                  hint="Recommended: wide lockup (logo + name). On dark headers we use the same file unless you set a separate dark logo later."
                  value={settings.logoImage || ""}
                  onChange={(url) => {
                    setStatus("");
                    if (!url || url.startsWith("/uploads/")) {
                      void applyLogoChange(url);
                    } else {
                      setSettings({ logoImage: url });
                    }
                  }}
                  onError={(msg) => setStatus(msg)}
                />
                {settings.logoImage && (
                  <p className="scp-logo-card__path">
                    <span>Current:</span> <code>{settings.logoImage}</code>
                  </p>
                )}
                <button
                  type="button"
                  className="ve-btn ve-btn--small scp-logo-card__reset"
                  onClick={() => void applyLogoChange("")}
                >
                  Remove custom logo (use default M)
                </button>
                <button
                  type="button"
                  className="ve-btn ve-btn--small"
                  onClick={() => {
                    const next = {
                      ...content,
                      settings: {
                        ...settings,
                        logoImage: "/logo-maatridev.svg",
                        logoImageOnDark: "/logo-maatridev-hero.svg",
                        logoText: "MaatriDev",
                        siteName: "MaatriDev Technologies",
                        logoUpdatedAt: undefined,
                      },
                    };
                    setContent(next);
                    void save(next);
                  }}
                >
                  Restore built-in MaatriDev SVG
                </button>
              </section>

              <section className="scp-section-card">
                <h4>Brand text</h4>
                <Field label="Site name">
                  <input value={settings.siteName || ""} onChange={(e) => setSettings({ siteName: e.target.value })} />
                </Field>
                <Field label="Logo text (shown when no image)">
                  <input value={settings.logoText || ""} onChange={(e) => setSettings({ logoText: e.target.value })} />
                </Field>
                <Field label="Tagline">
                  <input value={settings.tagline || ""} onChange={(e) => setSettings({ tagline: e.target.value })} />
                </Field>
              </section>

              <section className="scp-section-card">
                <h4>Animated M icon (fallback)</h4>
                <Field label="Logo letter">
                  <input
                    maxLength={2}
                    value={settings.logoLetter || "M"}
                    onChange={(e) => setSettings({ logoLetter: e.target.value })}
                  />
                </Field>
                <Field label="Animation">
                  <select
                    value={settings.logoAnimation || "gradient"}
                    onChange={(e) => setSettings({ logoAnimation: e.target.value })}
                  >
                    <option value="gradient">Gradient shift</option>
                    <option value="pulse">Pulse</option>
                    <option value="glow">Glow</option>
                    <option value="orbit">Orbit ring</option>
                    <option value="none">Static</option>
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
              </section>

              <section className="scp-section-card scp-header-themes">
                <h4>Header bar colors</h4>
                <p className="scp-header-themes__intro">
                  Light bars use dark menu text — pair with <strong>Original</strong> or <strong>Darker</strong> logo tone.
                  Dark bars often need <strong>White</strong> or <strong>Brighter</strong> logo tone.
                </p>
                <p className="scp-sub-label">Light headers ({lightHeaderPresets.length})</p>
                <div className="scp-theme-chips">
                  {lightHeaderPresets.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`scp-theme-chip${settings.headerDesign === p.id ? " is-active" : ""}`}
                      title={p.label}
                      onClick={() => setSettings(applyHeaderDesignPreset(p.id))}
                    >
                      <span className="scp-theme-chip__swatch" style={{ background: p.swatch }} />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
                <p className="scp-sub-label">Dark headers</p>
                <div className="scp-theme-chips">
                  {darkHeaderPresets.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`scp-theme-chip${settings.headerDesign === p.id ? " is-active" : ""}`}
                      title={p.label}
                      onClick={() => setSettings(applyHeaderDesignPreset(p.id))}
                    >
                      <span className="scp-theme-chip__swatch" style={{ background: p.swatch }} />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <SiteContentHeaderColors settings={settings} onPatch={(p) => setSettings(p)} />

              {customUploadedLogo && (
                <section className="scp-section-card">
                  <h4>Uploaded logo tone</h4>
                  <p className="scp-header-themes__intro">
                    Adjust how your PNG/SVG looks on the header (does not edit the file). Animated M icon colors are below.
                  </p>
                  <div className="scp-logo-filter-chips">
                    {LOGO_IMAGE_FILTER_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className={`scp-logo-filter-chip${(settings.logoImageFilter || "none") === p.id ? " is-active" : ""}`}
                        onClick={() => setSettings({ logoImageFilter: p.id })}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {customUploadedLogo && (
                <>
                  <Field label={`Logo size (${settings.logoScale ?? 1}×)`}>
                    <input
                      type="range"
                      min={0.8}
                      max={2}
                      step={0.1}
                      value={Number(settings.logoScale) || 1}
                      onChange={(e) => setSettings({ logoScale: Number(e.target.value) })}
                    />
                  </Field>
                  <Field label={`Logo max width (${settings.logoClipWidth ?? 280}px)`}>
                    <input
                      type="range"
                      min={180}
                      max={400}
                      step={10}
                      value={Number(settings.logoClipWidth) || 280}
                      onChange={(e) => setSettings({ logoClipWidth: Number(e.target.value) })}
                    />
                  </Field>
                  <p className="scp-alert">
                    Seeing cut-off text or “TECHNOLOGIES” floating on the right? That is inside your SVG file — narrow the
                    crop width or re-export a tight transparent PNG/SVG.
                  </p>
                </>
              )}
              <p className="scp-note">
                Pasted a custom URL? Click <strong>Save site content</strong> at the top.
              </p>
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
              <div className="scp-brand-preview scp-brand-preview--live">
                <p className="scp-brand-preview__label">Live header preview</p>
                <div
                  className="scp-header-live-stage"
                  style={{ background: previewBgForHomePath("/", settings) }}
                >
                  <SiteHeaderBar
                    settings={settings}
                    pathname="/"
                    editorPreview
                    previewPageId="home"
                    previewDevice="desktop"
                  />
                </div>
                <p className="scp-brand-preview__tagline">{settings.tagline}</p>
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
