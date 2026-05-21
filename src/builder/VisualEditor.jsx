import { useCallback, useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { saveSiteContent } from "../admin/api";
import {
  PAGE_OPTIONS,
  SECTION_TYPES,
  getDefaultSections,
} from "./sectionRegistry";
import SiteContentPanel from "./SiteContentPanel";
import EditorHeaderPreview from "./EditorHeaderPreview";
import { homeAgencyLabel, sectionsWithHomeAgency } from "./homeAgencyNav";
import { PREVIEW_PAGE_PATH } from "./previewNav";
import EditorToast from "./EditorToast";
import SectionInspector from "./SectionInspector";
import SiteHeaderInspector from "./SiteHeaderInspector";
import StyledSectionWrap from "./StyledSectionWrap";
import { VeEditScope } from "./VeInlineEdit";
import { defaultStyleForType, normalizeSection } from "./editorTheme";
import "../pages/HomePage.css";
import "./visual-editor.css";
import "./styled-section.css";

const EDITOR_MODES = [
  { id: "pages", label: "Pages", icon: "fa-file-lines" },
  { id: "site", label: "Site Content", icon: "fa-sliders" },
];

const PREVIEW_DEVICES = [
  { id: "desktop", label: "Desktop", icon: "fa-desktop", width: 1100 },
  { id: "tablet", label: "Tablet", icon: "fa-tablet-screen-button", width: 768 },
  { id: "mobile", label: "Mobile", icon: "fa-mobile-screen-button", width: 390 },
];

function PreviewDeviceBar({ previewDevice, setPreviewDevice, activeDevice, switching }) {
  return (
    <div
      className={`ve-preview-strip${switching ? " ve-preview-strip--switching" : ""}`}
      role="toolbar"
      aria-label="Preview screen size"
    >
      <span className="ve-preview-strip__label">
        <i className="fa-solid fa-display" aria-hidden="true" />
        Screen size
      </span>
      <div className="ve-preview-strip__buttons">
        {PREVIEW_DEVICES.map((device) => (
          <button
            key={device.id}
            type="button"
            className={previewDevice === device.id ? "is-active" : ""}
            onClick={() => setPreviewDevice(device.id)}
            title={`${device.label} (${device.width}px wide)`}
          >
            <i className={`fa-solid ${device.icon}`} aria-hidden="true" />
            {device.label}
          </button>
        ))}
      </div>
      <span className="ve-preview-strip__size">{activeDevice.width}px preview</span>
    </div>
  );
}

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("maatridev-admin-token")}` };
}

function newId() {
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function scrollToFirstSection() {
  requestAnimationFrame(() => {
    const el = document.querySelector(".ve-canvas [data-ve-section]");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function pickDefaultSectionId(list) {
  if (!list?.length) return null;
  const hero = list.find((s) => s.type === "pageHero" || s.type === "homeHero");
  return hero?.id ?? list[0].id;
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
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [deviceSwitching, setDeviceSwitching] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [newSectionId, setNewSectionId] = useState(null);
  const [chromeSelected, setChromeSelected] = useState(false);
  const [chromeFocus, setChromeFocus] = useState(null);
  const [headerPreviewPath, setHeaderPreviewPath] = useState(PREVIEW_PAGE_PATH.services);
  const [isDragging, setIsDragging] = useState(false);
  const deviceSwitchTimer = useRef(null);
  const savedSnapshot = useRef("");

  const markDirty = useCallback(() => setDirty(true), []);

  const loadPage = useCallback((id, allContent, opts = {}) => {
    const { selectFirstSection = false, previewPath: agencyPath } = opts;
    const page = allContent?.pages?.[id];
    const saved = page?.sections;
    let nextSections;
    let nextEnabled;
    if (saved?.items?.length) {
      nextSections = saved.items.map((s) => normalizeSection(s));
      nextEnabled = saved.enabled !== false;
    } else {
      nextSections = getDefaultSections(id);
      nextEnabled = false;
    }
    if (id === "home" && agencyPath) {
      nextSections = sectionsWithHomeAgency(nextSections, agencyPath);
    }
    setSections(nextSections);
    setEnabled(nextEnabled);
    setChromeSelected(false);
    setChromeFocus(null);
    if (selectFirstSection) {
      setSelectedId(pickDefaultSectionId(nextSections));
    } else {
      setSelectedId(null);
    }
    setDirty(false);
    savedSnapshot.current = JSON.stringify({ sections: nextSections, enabled: nextEnabled });
  }, []);

  useEffect(() => {
    axios.get("/api/content").then((r) => {
      setContent(r.data);
      setHeaderPreviewPath(PREVIEW_PAGE_PATH[pageId] || "/services");
      loadPage(pageId, r.data, { selectFirstSection: true });
    });
  }, [loadPage]);

  const onPageChange = (id, opts = {}) => {
    const { selectFirstSection = false, previewPath: pathOverride, fromHeader = false } = opts;
    const nextPath = pathOverride || PREVIEW_PAGE_PATH[id] || "/";
    setHeaderPreviewPath(nextPath);

    if (id === pageId) {
      setChromeSelected(false);
      setChromeFocus(null);
      if (id === "home" && pathOverride) {
        const nextSections = sectionsWithHomeAgency(sections, pathOverride);
        setSections(nextSections);
        const sid = pickDefaultSectionId(nextSections);
        if (sid) setSelectedId(sid);
        markDirty();
        scrollToFirstSection();
        return;
      }
      if (selectFirstSection) {
        const sid = pickDefaultSectionId(sections);
        if (sid) setSelectedId(sid);
        scrollToFirstSection();
      }
      return;
    }
    if (
      dirty &&
      !fromHeader &&
      !window.confirm("You have unsaved changes on this page. Switch anyway?")
    ) {
      return;
    }
    setPageId(id);
    loadPage(id, content, { selectFirstSection, previewPath: pathOverride });
    if (selectFirstSection) scrollToFirstSection();
  };

  const changePreviewDevice = (id) => {
    if (id === previewDevice) return;
    setPreviewDevice(id);
    setDeviceSwitching(true);
    if (deviceSwitchTimer.current) clearTimeout(deviceSwitchTimer.current);
    deviceSwitchTimer.current = setTimeout(() => setDeviceSwitching(false), 450);
  };

  useEffect(
    () => () => {
      if (deviceSwitchTimer.current) clearTimeout(deviceSwitchTimer.current);
    },
    []
  );

  const cleanLegacyPage = (page = {}) => ({
    ...page,
    sections: { enabled: page.sections?.enabled ?? false, items: page.sections?.items ?? [] },
    puck: page.puck ? { ...page.puck, enabled: false } : undefined,
    wysiwyg: page.wysiwyg ? { ...page.wysiwyg, enabled: false } : undefined,
  });

  const persist = async (nextSections, nextEnabled) => {
    setSaving(true);
    setStatus("");
    let base = content;
    try {
      const fresh = await axios.get("/api/content");
      base = fresh.data || content;
    } catch {
      /* use in-memory content */
    }
    const next = {
      ...base,
      settings: { ...(base.settings || {}), ...(content.settings || {}) },
      pages: {
        ...(base.pages || {}),
        ...(content.pages || {}),
        [pageId]: cleanLegacyPage({
          ...(content.pages?.[pageId] || base.pages?.[pageId] || {}),
          sections: { enabled: nextEnabled, items: nextSections },
        }),
      },
    };
    try {
      await axios.put("/api/content", next, { headers: authHeaders() });
      setContent(next);
      const msg = nextEnabled ? "Published — live site updated." : "Saved as draft.";
      setStatus(msg);
      setToast({ message: msg, type: "success" });
      setDirty(false);
      savedSnapshot.current = JSON.stringify({ sections: nextSections, enabled: nextEnabled });
    } catch {
      const msg = "Save failed. Is the API running on port 3001?";
      setStatus(msg);
      setToast({ message: msg, type: "error" });
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
    markDirty();
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

  const selected = sections.find((s) => s.id === selectedId);

  const updateSection = (updated) => {
    setSections((list) => list.map((s) => (s.id === updated.id ? normalizeSection(updated) : s)));
    markDirty();
  };

  const patchSectionProp = (sectionId, key, value) => {
    setSections((list) =>
      list.map((s) =>
        s.id === sectionId ? { ...s, props: { ...s.props, [key]: value } } : s
      )
    );
    markDirty();
  };

  const updateSectionStyle = (sectionId, style) => {
    setSections((list) =>
      list.map((s) => (s.id === sectionId ? { ...s, style } : s))
    );
    markDirty();
  };

  const selectSection = (id) => {
    setChromeSelected(false);
    setSelectedId(id);
  };

  const selectChrome = (focus = null) => {
    setSelectedId(null);
    setChromeSelected(true);
    setChromeFocus(focus);
  };

  const navigateFromHeader = (id, path) => {
    onPageChange(id, {
      selectFirstSection: true,
      previewPath: path,
      fromHeader: true,
    });
    const label = PAGE_OPTIONS.find((p) => p.id === id)?.label || id;
    const agency = id === "home" && path ? homeAgencyLabel(path) : null;
    setToast({
      message: agency
        ? `Opened ${agency} homepage — hero updated below (matches live /home/… route)`
        : `Opened ${label} — edit sections below the header`,
      type: "success",
    });
  };

  const updateSettings = (settings) => {
    setContent((c) => ({ ...c, settings }));
    markDirty();
  };

  const saveSiteSettings = async (settingsOverride) => {
    setSaving(true);
    setStatus("");
    let base = content;
    try {
      const fresh = await axios.get("/api/content");
      base = fresh.data || content;
    } catch {
      /* use in-memory */
    }
    const mergedSettings = {
      ...(base.settings || {}),
      ...(content.settings || {}),
      ...(settingsOverride || {}),
    };
    const next = { ...base, settings: mergedSettings };
    try {
      const data = await saveSiteContent(next);
      const saved = data?.content ? { ...next, ...data.content, settings: data.content.settings || next.settings } : next;
      setContent(saved);
      setToast({ message: "Header, logo & colors saved. Hard-refresh the live site (Ctrl+F5).", type: "success" });
      setStatus("Site settings saved.");
    } catch (err) {
      const msg = !err?.response
        ? "Save failed — API offline. Run DEV-WEBSITE.bat or npm run dev from the website folder."
        : err.response?.status === 401
          ? "Save denied — log in again at /admin."
          : "Save failed — restart npm run dev (port 3001 must be free).";
      setToast({ message: msg, type: "error" });
      setStatus(msg);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!selectedId) return;
    const el = document.querySelector(`[data-ve-section="${selectedId}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSelectedId(null);
        setChromeSelected(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const duplicateSection = (id) => {
    const src = sections.find((s) => s.id === id);
    if (!src) return;
    const copy = { ...src, id: newId(), props: { ...src.props }, style: { ...src.style } };
    const idx = sections.findIndex((s) => s.id === id);
    const next = [...sections];
    next.splice(idx + 1, 0, copy);
    setSections(next);
    setSelectedId(copy.id);
    markDirty();
  };

  const deleteSection = (id) => {
    if (!window.confirm("Remove this section?")) return;
    setSections((list) => list.filter((s) => s.id !== id));
    if (selectedId === id) setSelectedId(null);
    markDirty();
  };

  const moveSection = (id, dir) => {
    const idx = sections.findIndex((s) => s.id === id);
    const next = idx + dir;
    if (next < 0 || next >= sections.length) return;
    const list = [...sections];
    const [item] = list.splice(idx, 1);
    list.splice(next, 0, item);
    setSections(list);
    markDirty();
  };

  const onDragStart = () => setIsDragging(true);

  const onDragEnd = (result) => {
    setIsDragging(false);
    const { source, destination } = result;
    if (!destination) return;
    const from = source.droppableId;
    const to = destination.droppableId;
    if (from !== "sidebar" && from !== "canvas") return;
    if (to !== "sidebar" && to !== "canvas") return;
    if (source.index === destination.index && from === to) return;

    const list = [...sections];
    const [item] = list.splice(source.index, 1);
    list.splice(destination.index, 0, item);
    setSections(list);
    markDirty();
  };

  const addSection = () => {
    const def = SECTION_TYPES[addType];
    if (!def) return;
    const item = {
      id: newId(),
      type: addType,
      props: { ...def.defaultProps },
      style: defaultStyleForType(addType),
    };
    setSections([...sections, item]);
    setSelectedId(item.id);
    setNewSectionId(item.id);
    markDirty();
    window.setTimeout(() => setNewSectionId(null), 600);
  };

  const previewPath = headerPreviewPath || PREVIEW_PAGE_PATH[pageId] || "/";
  const activeDevice = PREVIEW_DEVICES.find((d) => d.id === previewDevice) || PREVIEW_DEVICES[0];

  const openSiteContent = (tab = "brand") => {
    const sec = selected;
    const t =
      sec?.type === "founders"
        ? "founders"
        : sec?.type === "servicesGrid"
          ? "services"
          : tab;
    setSiteTab(t);
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
        <SiteContentPanel
          initialTab={siteTab}
          content={content}
          setContent={setContent}
          onSaved={(saved) => setContent(saved)}
        />
      </div>
    );
  }

  return (
    <div className="ve-root">
      <EditorToast
        message={toast.message}
        type={toast.type}
        onDone={() => setToast({ message: "", type: "success" })}
      />
      {modeTabs}
      <header className="ve-toolbar">
        <div>
          <h1>Page Editor</h1>
          <p>Drag sections to reorder · click to edit · publish when ready.</p>
        </div>
        <div className="ve-toolbar__actions">
          <select
            value={pageId}
            onChange={(e) => onPageChange(e.target.value, { selectFirstSection: true })}
          >
            {PAGE_OPTIONS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <label>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => {
                setEnabled(e.target.checked);
                markDirty();
              }}
            />
            Use custom page (publish)
          </label>
          <button type="button" className="ve-btn" onClick={resetTemplate}>Reset template</button>
          <button type="button" className="ve-btn" onClick={useBuiltInPages} disabled={saving}>Use built-in site</button>
          <a href={previewPath} target="_blank" rel="noreferrer" className="ve-btn">Preview live</a>
          <button type="button" className="ve-btn" onClick={save} disabled={saving}>Save draft</button>
          <button type="button" className="ve-btn ve-btn--primary" onClick={publish} disabled={saving}>
            Publish
          </button>
          {dirty && (
            <span className="ve-status ve-status--dirty" title="Click Save draft or Publish to keep your work">
              Unsaved — click Save draft
            </span>
          )}
          {status && !dirty && <span className="ve-status">{status}</span>}
        </div>
      </header>

      <PreviewDeviceBar
        previewDevice={previewDevice}
        setPreviewDevice={changePreviewDevice}
        activeDevice={activeDevice}
        switching={deviceSwitching}
      />

      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="ve-body">
        <aside className="ve-sidebar">
          <h3>Sections</h3>
          <p className="ve-sidebar__hint">
            <i className="fa-solid fa-grip-vertical" aria-hidden="true" /> Drag to reorder (sidebar or preview)
          </p>
            <Droppable droppableId="sidebar">
              {(provided, snapshot) => (
                <div
                  className={`ve-section-list${snapshot.isDraggingOver ? " ve-section-list--over" : ""}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {sections.map((s, index) => {
                    const def = SECTION_TYPES[s.type];
                    return (
                      <Draggable key={s.id} draggableId={`sidebar-${s.id}`} index={index}>
                        {(drag, dragSnapshot) => (
                          <div
                            ref={drag.innerRef}
                            {...drag.draggableProps}
                            role="button"
                            tabIndex={0}
                            className={`ve-section-item${selectedId === s.id ? " is-selected" : ""}${dragSnapshot.isDragging ? " ve-section-item--dragging" : ""}`}
                            onClick={() => selectSection(s.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                selectSection(s.id);
                              }
                            }}
                          >
                            <span
                              className="ve-section-item__handle"
                              {...drag.dragHandleProps}
                              title="Drag to reorder"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="fa-solid fa-grip-vertical" aria-hidden="true" />
                            </span>
                            <i className={`fa-solid ${def?.icon || "fa-cube"}`} />
                            {def?.label || s.type}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
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

        <div
          className={`ve-canvas-wrap${isDragging ? " ve-canvas-wrap--dragging" : ""}`}
        >
          <div
            className={`ve-canvas${previewDevice !== "desktop" ? ` ve-canvas--${previewDevice}` : ""}${deviceSwitching ? " ve-canvas--switching" : ""}${isDragging ? " ve-canvas--dragging" : ""}`}
            style={previewDevice !== "desktop" ? { maxWidth: activeDevice.width } : undefined}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedId(null);
                setChromeSelected(false);
              }
            }}
          >
            <EditorHeaderPreview
              device={previewDevice}
              settings={content.settings || {}}
              currentPageId={pageId}
              previewPathname={headerPreviewPath}
              isSelected={chromeSelected}
              onSelect={selectChrome}
              onNavigatePage={navigateFromHeader}
            />
            <p className="ve-canvas-hint">
              <i className="fa-solid fa-hand-pointer" aria-hidden="true" />
              {activeDevice.label} ({activeDevice.width}px)
              {previewDevice === "mobile" || previewDevice === "tablet"
                ? " — tap ☰ for pages · drag ⠿ to reorder sections"
                : " — drag ⠿ to reorder · click header or sections to edit"}
            </p>
            {sections.length > 1 && (
              <p className="ve-canvas-scroll-hint">
                <i className="fa-solid fa-arrows-up-down" /> Scroll to see all sections below the header
              </p>
            )}
            {sections.length === 0 ? (
              <div className="ve-empty-canvas">No sections — add one from the left panel.</div>
            ) : (
              <Droppable droppableId="canvas">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`ve-canvas-sections${snapshot.isDraggingOver ? " ve-canvas-sections--over" : ""}`}
                  >
                    {sections.map((section, index) => {
                      const def = SECTION_TYPES[section.type];
                      const Component = def?.component;
                      if (!Component) return null;
                      const isSel = selectedId === section.id;
                      return (
                        <Draggable key={section.id} draggableId={`canvas-${section.id}`} index={index}>
                          {(drag, dragSnapshot) => (
                            <div
                              ref={drag.innerRef}
                              {...drag.draggableProps}
                              data-ve-section={section.id}
                              className={`ve-block${isSel ? " is-selected" : ""}${newSectionId === section.id ? " ve-block--new" : ""}${dragSnapshot.isDragging ? " ve-block--dragging" : ""}`}
                              onClick={(e) => {
                                if (dragSnapshot.isDragging) return;
                                if (e.target.closest(".ve-block__drag-handle")) return;
                                if (e.target.closest(".ve-inline-edit")) return;
                                selectSection(section.id);
                              }}
                            >
                              <div className="ve-block__bar">
                                <span
                                  className="ve-block__drag-handle"
                                  {...drag.dragHandleProps}
                                  title="Drag to reorder"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <i className="fa-solid fa-grip-vertical" aria-hidden="true" />
                                </span>
                                <span className="ve-block__label">{def.label}</span>
                              </div>
                              <StyledSectionWrap sectionType={section.type} style={section.style}>
                                <VeEditScope
                                  isSelected={isSel}
                                  fieldKeys={(def.fields || []).map((f) => f.key)}
                                  onPatch={(key, value) => patchSectionProp(section.id, key, value)}
                                >
                                  <Component {...(section.props || {})} />
                                </VeEditScope>
                              </StyledSectionWrap>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </div>
        </div>

        {chromeSelected ? (
          <SiteHeaderInspector
            settings={content.settings || {}}
            focusField={chromeFocus}
            currentPageId={pageId}
            onNavigatePage={navigateFromHeader}
            onChange={updateSettings}
            onSaveSettings={saveSiteSettings}
            saving={saving}
            onOpenSiteContent={openSiteContent}
          />
        ) : (
          <SectionInspector
            key={selected?.id || "empty"}
            section={selected}
            pageLabel={PAGE_OPTIONS.find((p) => p.id === pageId)?.label}
            onChange={(updated) => {
              updateSection(updated);
              setSelectedId(updated.id);
            }}
            onStyleChange={(style) => selected && updateSectionStyle(selected.id, style)}
            onOpenSiteContent={openSiteContent}
            onDuplicate={duplicateSection}
            onDelete={deleteSection}
            onMove={moveSection}
          />
        )}
      </div>
      </DragDropContext>
    </div>
  );
}
