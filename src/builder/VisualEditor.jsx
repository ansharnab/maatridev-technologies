import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import {
  PAGE_OPTIONS,
  SECTION_TYPES,
  getDefaultSections,
} from "./sectionRegistry";
import SiteContentPanel from "./SiteContentPanel";
import "../pages/HomePage.css";
import "./visual-editor.css";

const EDITOR_MODES = [
  { id: "pages", label: "Pages", icon: "fa-file-lines" },
  { id: "site", label: "Site Content", icon: "fa-sliders" },
];

function SiteChrome() {
  return (
    <div className="ve-site-chrome" aria-hidden="true">
      <div className="ve-site-chrome__bar">
        <span className="ve-site-chrome__logo">M</span>
        <span>MaatriDev TECHNOLOGIES</span>
        <span className="ve-site-chrome__nav">Home · About · Services · Contact</span>
        <span className="ve-site-chrome__cta">Book Appointment</span>
      </div>
    </div>
  );
}

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("maatridev-admin-token")}` };
}

function newId() {
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const PAGE_PATH = { home: "/", about: "/about", services: "/services", contact: "/contact" };

function PropertiesPanel({ section, onChange, onOpenSiteContent }) {
  const def = section ? SECTION_TYPES[section.type] : null;
  if (!section || !def) {
    return (
      <div className="ve-props">
        <p className="ve-empty-props">Click a section on the page to edit its text, links, and images.</p>
      </div>
    );
  }

  if (!def.fields?.length) {
    return (
      <div className="ve-props">
        <h3>{def.label}</h3>
        <p className="ve-empty-props">
          Content comes from <strong>Site Content</strong> (logo, founders, service cards, phones, images).
        </p>
        <button
          type="button"
          className="ve-btn ve-btn--primary"
          style={{ width: "100%", marginTop: "0.75rem" }}
          onClick={() => onOpenSiteContent?.(section.type === "founders" ? "founders" : section.type === "servicesGrid" ? "services" : "brand")}
        >
          Edit in Site Content
        </button>
      </div>
    );
  }

  const update = (key, value) => {
    onChange({ ...section, props: { ...section.props, [key]: value } });
  };

  return (
    <div className="ve-props">
      <h3>{def.label}</h3>
      {def.fields.map((field) => (
        <div key={field.key} className="field">
          <label htmlFor={`f-${field.key}`}>{field.label}</label>
          {field.type === "textarea" ? (
            <textarea
              id={`f-${field.key}`}
              value={section.props[field.key] ?? ""}
              onChange={(e) => update(field.key, e.target.value)}
            />
          ) : field.type === "select" ? (
            <select
              id={`f-${field.key}`}
              value={String(section.props[field.key] ?? field.options[0]?.value)}
              onChange={(e) => {
                const raw = e.target.value;
                const opt = field.options.find((o) => String(o.value) === raw);
                update(field.key, opt?.value);
              }}
            >
              {field.options.map((o) => (
                <option key={String(o.value)} value={String(o.value)}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`f-${field.key}`}
              type="text"
              value={section.props[field.key] ?? ""}
              onChange={(e) => update(field.key, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function VisualEditor() {
  const [editorMode, setEditorMode] = useState("pages");
  const [siteTab, setSiteTab] = useState("brand");
  const [pageId, setPageId] = useState("services");
  const [sections, setSections] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [content, setContent] = useState({ pages: {}, settings: {} });
  const [status, setStatus] = useState("");
  const [addType, setAddType] = useState("pageHero");
  const [saving, setSaving] = useState(false);

  const loadPage = useCallback(
    (id, allContent) => {
      const page = allContent?.pages?.[id];
      const saved = page?.sections;
      if (saved?.items?.length) {
        setSections(saved.items);
        setEnabled(saved.enabled !== false);
      } else {
        setSections(getDefaultSections(id));
        setEnabled(false);
      }
      setSelectedId(null);
    },
    []
  );

  useEffect(() => {
    axios.get("/api/content").then((r) => {
      setContent(r.data);
      loadPage(pageId, r.data);
    });
  }, [loadPage, pageId]);

  const onPageChange = (id) => {
    setPageId(id);
    loadPage(id, content);
  };

  const cleanLegacyPage = (page = {}) => ({
    ...page,
    sections: { enabled: page.sections?.enabled ?? false, items: page.sections?.items ?? [] },
    puck: page.puck ? { ...page.puck, enabled: false } : undefined,
    wysiwyg: page.wysiwyg ? { ...page.wysiwyg, enabled: false } : undefined,
  });

  const persist = async (nextSections, nextEnabled) => {
    setSaving(true);
    setStatus("");
    const next = {
      ...content,
      pages: {
        ...content.pages,
        [pageId]: cleanLegacyPage({
          ...(content.pages[pageId] || {}),
          sections: { enabled: nextEnabled, items: nextSections },
        }),
      },
    };
    try {
      await axios.put("/api/content", next, { headers: authHeaders() });
      setContent(next);
      setStatus(nextEnabled ? "Published — live site updated." : "Saved as draft.");
    } catch {
      setStatus("Save failed. Is the API running on port 3001?");
    } finally {
      setSaving(false);
    }
  };

  const save = () => persist(sections, enabled);
  const publish = () => {
    setEnabled(true);
    persist(sections, true);
  };

  const resetTemplate = () => {
    if (!window.confirm("Reset this page to the default template? Unsaved edits will be lost.")) return;
    const defaults = getDefaultSections(pageId);
    setSections(defaults);
    setSelectedId(null);
  };

  const useBuiltInPages = async () => {
    if (!window.confirm("Turn off custom pages and use the built-in site design everywhere?")) return;
    const pages = { ...content.pages };
    for (const id of PAGE_OPTIONS.map((p) => p.id)) {
      pages[id] = cleanLegacyPage({
        ...(pages[id] || {}),
        sections: { enabled: false, items: pages[id]?.sections?.items || getDefaultSections(id) },
      });
    }
    const next = { ...content, pages };
    setSaving(true);
    try {
      await axios.put("/api/content", next, { headers: authHeaders() });
      setContent(next);
      setEnabled(false);
      loadPage(pageId, next);
      setStatus("Using built-in pages. Open Preview live to see the default site.");
    } catch {
      setStatus("Could not save. Start the API (npm run dev).");
    } finally {
      setSaving(false);
    }
  };

  const handleCanvasClick = (e) => {
    const link = e.target.closest("a");
    if (link) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const selected = sections.find((s) => s.id === selectedId);

  const updateSection = (updated) => {
    setSections((list) => list.map((s) => (s.id === updated.id ? updated : s)));
  };

  const duplicateSection = (id) => {
    const src = sections.find((s) => s.id === id);
    if (!src) return;
    const copy = { ...src, id: newId(), props: { ...src.props } };
    const idx = sections.findIndex((s) => s.id === id);
    const next = [...sections];
    next.splice(idx + 1, 0, copy);
    setSections(next);
    setSelectedId(copy.id);
  };

  const deleteSection = (id) => {
    if (!window.confirm("Remove this section?")) return;
    setSections((list) => list.filter((s) => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const moveSection = (id, dir) => {
    const idx = sections.findIndex((s) => s.id === id);
    const next = idx + dir;
    if (next < 0 || next >= sections.length) return;
    const list = [...sections];
    const [item] = list.splice(idx, 1);
    list.splice(next, 0, item);
    setSections(list);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const list = [...sections];
    const [item] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, item);
    setSections(list);
  };

  const addSection = () => {
    const def = SECTION_TYPES[addType];
    if (!def) return;
    const item = { id: newId(), type: addType, props: { ...def.defaultProps } };
    setSections([...sections, item]);
    setSelectedId(item.id);
  };

  const previewPath = PAGE_PATH[pageId] || "/";

  const openSiteContent = (tab = "brand") => {
    setSiteTab(tab);
    setEditorMode("site");
  };

  const modeTabs = (
    <div className="ve-mode-tabs">
      {EDITOR_MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          className={editorMode === m.id ? "is-active" : ""}
          onClick={() => setEditorMode(m.id)}
        >
          <i className={`fa-solid ${m.icon}`} /> {m.label}
        </button>
      ))}
    </div>
  );

  if (editorMode === "site") {
    return (
      <div className="ve-root">
        {modeTabs}
        <SiteContentPanel initialTab={siteTab} />
      </div>
    );
  }

  return (
    <div className="ve-root">
      {modeTabs}
      <header className="ve-toolbar">
        <div>
          <h1>Page Editor</h1>
          <p>Same layout as the live site — blue header, service cards, buttons. Pick a section, edit on the right, then Publish.</p>
        </div>
        <div className="ve-toolbar__actions">
          <select value={pageId} onChange={(e) => onPageChange(e.target.value)}>
            {PAGE_OPTIONS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <label>
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            Use custom page (publish)
          </label>
          <button type="button" className="ve-btn" onClick={resetTemplate}>Reset template</button>
          <button type="button" className="ve-btn" onClick={useBuiltInPages} disabled={saving}>Use built-in site</button>
          <a href={previewPath} target="_blank" rel="noreferrer" className="ve-btn">Preview live</a>
          <button type="button" className="ve-btn" onClick={save} disabled={saving}>Save draft</button>
          <button type="button" className="ve-btn ve-btn--primary" onClick={publish} disabled={saving}>
            Publish
          </button>
          {status && <span className="ve-status">{status}</span>}
        </div>
      </header>

      <div className="ve-body">
        <aside className="ve-sidebar">
          <h3>Sections</h3>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div className="ve-section-list" ref={provided.innerRef} {...provided.droppableProps}>
                  {sections.map((s, index) => {
                    const def = SECTION_TYPES[s.type];
                    return (
                      <Draggable key={s.id} draggableId={s.id} index={index}>
                        {(drag) => (
                          <button
                            type="button"
                            ref={drag.innerRef}
                            {...drag.draggableProps}
                            className={`ve-section-item ${selectedId === s.id ? "is-selected" : ""}`}
                            onClick={() => setSelectedId(s.id)}
                          >
                            <span {...drag.dragHandleProps}><i className="fa-solid fa-grip-vertical fa-grip" /></span>
                            <i className={`fa-solid ${def?.icon || "fa-cube"}`} />
                            {def?.label || s.type}
                          </button>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className="ve-add-section">
            <select value={addType} onChange={(e) => setAddType(e.target.value)}>
              {Object.entries(SECTION_TYPES).map(([key, def]) => (
                <option key={key} value={key}>{def.label}</option>
              ))}
            </select>
            <button type="button" className="ve-btn ve-btn--primary" style={{ width: "100%" }} onClick={addSection}>
              + Add section
            </button>
          </div>
        </aside>

        <div className="ve-canvas-wrap">
          <div
            className="ve-canvas"
            onClick={handleCanvasClick}
            onKeyDown={() => {}}
            role="presentation"
          >
            <p className="ve-canvas-hint">
              Preview matches your live site · Click a section · Edit on the right · Publish when ready
            </p>
            <SiteChrome />
            {sections.length === 0 ? (
              <div className="ve-empty-canvas">No sections — add one from the left panel.</div>
            ) : (
              sections.map((section) => {
                const def = SECTION_TYPES[section.type];
                const Component = def?.component;
                if (!Component) return null;
                const isSel = selectedId === section.id;
                return (
                  <div
                    key={section.id}
                    className={`ve-block ${isSel ? "is-selected" : ""}`}
                    onClick={() => setSelectedId(section.id)}
                    onKeyDown={() => {}}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="ve-block__bar">
                      <span className="ve-block__label">{def.label}</span>
                      <button
                        type="button"
                        title="Move up"
                        onClick={(e) => { e.stopPropagation(); moveSection(section.id, -1); }}
                      >
                        <i className="fa-solid fa-arrow-up" />
                      </button>
                      <button
                        type="button"
                        title="Move down"
                        onClick={(e) => { e.stopPropagation(); moveSection(section.id, 1); }}
                      >
                        <i className="fa-solid fa-arrow-down" />
                      </button>
                      <button
                        type="button"
                        title="Duplicate"
                        onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }}
                      >
                        <i className="fa-solid fa-copy" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                      >
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>
                    <Component {...(section.props || {})} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        <PropertiesPanel
          section={selected}
          onOpenSiteContent={openSiteContent}
          onChange={(updated) => {
            updateSection(updated);
            setSelectedId(updated.id);
          }}
        />
      </div>
    </div>
  );
}
