import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";

const PAGE_OPTIONS = [
  { id: "home", label: "Home (IT Solutions)" },
  { id: "about", label: "About Us" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

const BLOCK_TYPES = [
  { type: "hero", label: "Hero Banner", default: { title: "Headline", subtitle: "Subtext", cta: "Contact Us" } },
  { type: "text", label: "Text Block", default: { body: "Your content here…" } },
  { type: "image", label: "Image", default: { src: "", alt: "Image" } },
  { type: "cta", label: "Call to Action", default: { title: "Ready to start?", button: "Get in touch" } },
];

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("maatridev-admin-token")}` };
}

export default function PageBuilder() {
  const [content, setContent] = useState({ pages: {}, settings: {} });
  const [pageId, setPageId] = useState("home");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get("/api/content").then((r) => setContent(r.data));
  }, []);

  const blocks = content.pages?.[pageId]?.blocks || [];

  const setBlocks = (next) => {
    setContent((c) => ({
      ...c,
      pages: { ...c.pages, [pageId]: { blocks: next } },
    }));
  };

  const addBlock = (type) => {
    const def = BLOCK_TYPES.find((b) => b.type === type);
    setBlocks([
      ...blocks,
      { id: `block-${Date.now()}`, type, ...def.default },
    ]);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = [...blocks];
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);
    setBlocks(items);
  };

  const updateBlock = (id, field, value) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const removeBlock = (id) => setBlocks(blocks.filter((b) => b.id !== id));

  const save = async () => {
    await axios.put("/api/content", content, { headers: authHeaders() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h2>Drag & Drop Page Builder</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <select value={pageId} onChange={(e) => setPageId(e.target.value)}>
            {PAGE_OPTIONS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <button type="button" className="btn btn--primary" onClick={save}>
            {saved ? "Saved!" : "Save Page"}
          </button>
        </div>
      </div>
      <p className="admin-hint">Drag blocks to reorder. Edit text and image URLs inline — no code required.</p>

      <div className="builder-toolbar">
        {BLOCK_TYPES.map((b) => (
          <button key={b.type} type="button" className="btn btn--outline" onClick={() => addBlock(b.type)}>
            + {b.label}
          </button>
        ))}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="builder-canvas">
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(prov, snapshot) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      className={`builder-block ${snapshot.isDragging ? "is-dragging" : ""}`}
                    >
                      <div className="builder-block__handle" {...prov.dragHandleProps}>
                        <i className="fa-solid fa-grip-vertical" /> {block.type}
                      </div>
                      {block.type === "hero" && (
                        <>
                          <input value={block.title} onChange={(e) => updateBlock(block.id, "title", e.target.value)} placeholder="Title" />
                          <input value={block.subtitle} onChange={(e) => updateBlock(block.id, "subtitle", e.target.value)} placeholder="Subtitle" />
                          <input value={block.cta} onChange={(e) => updateBlock(block.id, "cta", e.target.value)} placeholder="CTA" />
                        </>
                      )}
                      {block.type === "text" && (
                        <textarea value={block.body} onChange={(e) => updateBlock(block.id, "body", e.target.value)} rows={4} />
                      )}
                      {block.type === "image" && (
                        <>
                          <input value={block.src} onChange={(e) => updateBlock(block.id, "src", e.target.value)} placeholder="Image URL (/uploads/...)" />
                          <input value={block.alt} onChange={(e) => updateBlock(block.id, "alt", e.target.value)} placeholder="Alt text" />
                          {block.src && <img src={block.src} alt={block.alt} className="builder-preview-img" />}
                        </>
                      )}
                      {block.type === "cta" && (
                        <>
                          <input value={block.title} onChange={(e) => updateBlock(block.id, "title", e.target.value)} placeholder="CTA title" />
                          <input value={block.button} onChange={(e) => updateBlock(block.id, "button", e.target.value)} placeholder="Button label" />
                        </>
                      )}
                      <button type="button" className="btn btn--ghost builder-block__delete" onClick={() => removeBlock(block.id)}>
                        Remove
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {blocks.length === 0 && <p className="builder-empty">Drop blocks here or add from toolbar above.</p>}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
