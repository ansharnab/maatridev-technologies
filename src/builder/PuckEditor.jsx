import { useCallback, useEffect, useState } from "react";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import axios from "axios";
import { authHeaders } from "../admin/api";
import { puckConfig } from "./puck/config";
import { PAGE_OPTIONS, getStarterPuckData } from "./puck/starters";
import "./puck-editor.css";

export default function PuckEditor() {
  const [pageId, setPageId] = useState("home");
  const [data, setData] = useState(null);
  const [publish, setPublish] = useState(true);
  const [saved, setSaved] = useState(false);
  const [contentRef, setContentRef] = useState({ pages: {}, settings: {} });

  const loadContent = useCallback(async () => {
    const { data: c } = await axios.get("/api/content");
    setContentRef(c);
    return c;
  }, []);

  const loadPage = useCallback(
    (id, content) => {
      const page = content?.pages?.[id];
      if (page?.puck?.data) {
        setData(page.puck.data);
        setPublish(page.puck.enabled !== false);
        return;
      }
      setData(getStarterPuckData(id));
      setPublish(true);
    },
    []
  );

  useEffect(() => {
    loadContent().then((c) => loadPage(pageId, c));
  }, []);

  useEffect(() => {
    if (!pageId) return;
    loadContent().then((c) => loadPage(pageId, c));
  }, [pageId, loadContent, loadPage]);

  const handlePublish = async (puckData) => {
    const next = {
      ...contentRef,
      pages: {
        ...contentRef.pages,
        [pageId]: {
          ...contentRef.pages?.[pageId],
          puck: {
            enabled: publish,
            data: puckData,
            updatedAt: new Date().toISOString(),
          },
        },
      },
    };
    await axios.put("/api/content", next, { headers: authHeaders() });
    setContentRef(next);
    setData(puckData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!data) {
    return <div className="puck-editor-loading">Loading visual editor…</div>;
  }

  return (
    <div className="puck-editor-shell">
      <div className="puck-editor-topbar">
        <div>
          <strong>Visual Website Builder</strong>
          <span>Wix-style editor — drag widgets, edit live, no code</span>
        </div>
        <div className="puck-editor-topbar__actions">
          <label>
            <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
            Publish live
          </label>
          <select value={pageId} onChange={(e) => setPageId(e.target.value)}>
            {PAGE_OPTIONS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => {
              if (window.confirm("Load starter template for this page?")) {
                setData(getStarterPuckData(pageId));
              }
            }}
          >
            Templates
          </button>
          <a href={`/${pageId === "home" ? "" : pageId}`} target="_blank" rel="noreferrer" className="btn btn--outline">
            Preview
          </a>
          {saved && <span className="puck-saved">✓ Saved</span>}
        </div>
      </div>

      <div className="puck-editor-canvas-wrap">
        <Puck
          config={puckConfig}
          data={data}
          onPublish={handlePublish}
          onChange={setData}
          viewports={[
            { width: 1280, height: "auto", label: "Desktop" },
            { width: 768, height: "auto", label: "Tablet" },
            { width: 390, height: "auto", label: "Mobile" },
          ]}
        />
      </div>
    </div>
  );
}
