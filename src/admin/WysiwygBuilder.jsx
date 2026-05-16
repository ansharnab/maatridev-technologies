import { useCallback, useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import axios from "axios";
import { authHeaders } from "./api";
import { PAGE_OPTIONS, getStarterHtml } from "./wysiwyg-templates";

export default function WysiwygBuilder() {
  const hostRef = useRef(null);
  const editorRef = useRef(null);
  const contentRef = useRef({ pages: {}, settings: {} });
  const [pageId, setPageId] = useState("home");
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const [publish, setPublish] = useState(true);

  const loadContent = useCallback(async () => {
    const { data } = await axios.get("/api/content");
    contentRef.current = data;
    return data;
  }, []);

  const loadMediaAssets = useCallback(async (editor) => {
    try {
      const { data } = await axios.get("/api/media");
      data.forEach((item) => {
        if (item.type === "image") {
          editor.AssetManager.add({ src: item.url, name: item.name, type: "image" });
        }
      });
    } catch {
      /* media optional */
    }
  }, []);

  const loadPageIntoEditor = useCallback((editor, id, content) => {
    const page = content?.pages?.[id]?.wysiwyg;
    if (page?.project) {
      editor.loadProjectData(page.project);
      setPublish(page.enabled !== false);
      return;
    }
    if (page?.html) {
      editor.setComponents(page.html);
      if (page.css) editor.setStyle(page.css);
      setPublish(page.enabled !== false);
      return;
    }
    editor.setComponents(getStarterHtml(id));
    setPublish(true);
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    if (!hostRef.current) return;

    let destroyed = false;

    const editor = grapesjs.init({
      container: hostRef.current,
      height: "100%",
      width: "auto",
      fromElement: false,
      storageManager: false,
      noticeOnUnload: false,
      plugins: [gjsPresetWebpage],
      pluginsOpts: {
        "gjs-preset-webpage": {
          modalImportTitle: "Import HTML",
          modalImportButton: "Load",
        },
      },
      deviceManager: {
        devices: [
          { id: "desktop", name: "Desktop", width: "" },
          { id: "tablet", name: "Tablet", width: "768px", widthMedia: "992px" },
          { id: "mobile", name: "Mobile", width: "375px", widthMedia: "480px" },
        ],
      },
      canvas: {
        styles: ["/wysiwyg-canvas.css"],
      },
      assetManager: {
        upload: false,
        autoAdd: true,
      },
      selectorManager: { componentFirst: true },
    });

    editorRef.current = editor;

    editor.Panels.addButton("options", {
      id: "open-media",
      className: "fa fa-images",
      command: "open-media-hint",
      attributes: { title: "Tip: upload images in Media tab, then pick from Assets" },
    });

    editor.Commands.add("open-media-hint", {
      run() {
        alert(
          "Upload images in the Media tab (left sidebar), then click the Assets icon in the builder toolbar to insert them."
        );
      },
    });

    loadContent().then((content) => {
      if (destroyed) return;
      loadPageIntoEditor(editor, pageId, content);
      loadMediaAssets(editor);
      setReady(true);
    });

    return () => {
      destroyed = true;
      editor.destroy();
      editorRef.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !ready) return;
    loadContent().then((content) => loadPageIntoEditor(editor, pageId, content));
  }, [pageId, ready, loadContent, loadPageIntoEditor]);

  const save = async () => {
    const editor = editorRef.current;
    if (!editor) return;

    const wysiwyg = {
      enabled: publish,
      html: editor.getHtml(),
      css: editor.getCss(),
      project: editor.getProjectData(),
      updatedAt: new Date().toISOString(),
    };

    const next = {
      ...contentRef.current,
      pages: {
        ...contentRef.current.pages,
        [pageId]: {
          ...contentRef.current.pages?.[pageId],
          wysiwyg,
        },
      },
    };

    await axios.put("/api/content", next, { headers: authHeaders() });
    contentRef.current = next;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const resetTemplate = () => {
    if (!window.confirm("Replace canvas with the starter template for this page? Unsaved changes will be lost.")) return;
    const editor = editorRef.current;
    if (editor) editor.setComponents(getStarterHtml(pageId));
  };

  return (
    <div className="wysiwyg-builder">
      <div className="wysiwyg-builder__toolbar">
        <div>
          <h2>Visual Website Editor</h2>
          <p className="admin-hint" style={{ margin: 0 }}>
            WYSIWYG — click text to edit, drag blocks from the left panel, style with the right panel. No code
            required.
          </p>
        </div>
        <div className="wysiwyg-builder__actions">
          <label className="wysiwyg-builder__publish">
            <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
            Publish on live site
          </label>
          <select value={pageId} onChange={(e) => setPageId(e.target.value)} aria-label="Select page">
            {PAGE_OPTIONS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <button type="button" className="btn btn--outline" onClick={resetTemplate}>
            Reset template
          </button>
          <button type="button" className="btn btn--primary" onClick={save}>
            {saved ? "Published!" : "Save & publish"}
          </button>
        </div>
      </div>

      <div className="wysiwyg-builder__tips">
        <span><i className="fa-solid fa-hand-pointer" /> Click any text to edit</span>
        <span><i className="fa-solid fa-grip" /> Drag sections to reorder</span>
        <span><i className="fa-solid fa-mobile-screen" /> Test Desktop / Tablet / Mobile</span>
        <span><i className="fa-solid fa-images" /> Assets = images from Media library</span>
      </div>

      <div ref={hostRef} className="wysiwyg-builder__editor" />
    </div>
  );
}
