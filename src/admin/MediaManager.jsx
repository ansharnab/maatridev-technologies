import { useEffect, useState } from "react";
import axios from "axios";

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("maatridev-admin-token")}` };
}

export default function MediaManager() {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadAlt, setUploadAlt] = useState("");

  const load = () => axios.get("/api/media").then((r) => setMedia(r.data));

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    const fd = new FormData();
    [...files].forEach((f) => fd.append("files", f));
    if (uploadAlt.trim()) fd.append("defaultAlt", uploadAlt.trim());
    setUploading(true);
    try {
      await axios.post("/api/media/upload", fd, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });
      load();
      setUploadAlt("");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const saveAlt = async (id, alt) => {
    await axios.patch(`/api/media/${encodeURIComponent(id)}/alt`, { alt }, { headers: authHeaders() });
    setMedia((list) => list.map((m) => (m.id === id ? { ...m, alt } : m)));
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this file?")) return;
    await axios.delete(`/api/media/${id}`, { headers: authHeaders() });
    load();
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h2>Media Library</h2>
        <label className="btn btn--primary">
          {uploading ? "Uploading…" : "Upload Images / Videos"}
          <input type="file" multiple accept="image/*,video/*" hidden onChange={handleUpload} />
        </label>
      </div>
      <p className="admin-hint">
        Add alt text for accessibility and image SEO. Alt is saved per file and used when you pick images in the
        builder.
      </p>
      <div className="form-group" style={{ maxWidth: 420, marginBottom: "1rem" }}>
        <label>Default alt for next upload (optional)</label>
        <input
          value={uploadAlt}
          onChange={(e) => setUploadAlt(e.target.value)}
          placeholder="e.g. MaatriDev team at work"
        />
      </div>
      <div className="media-grid">
        {media.map((m) => (
          <article key={m.id} className="media-item">
            {m.type === "video" ? (
              <video src={m.url} controls />
            ) : (
              <img src={m.url} alt={m.alt || m.name} />
            )}
            <div className="media-item__meta">
              <span title={m.name}>{m.name}</span>
              <label className="media-item__alt">
                Alt text
                <input
                  type="text"
                  defaultValue={m.alt || ""}
                  placeholder="Describe image for SEO & accessibility"
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (v !== (m.alt || "")) saveAlt(m.id, v);
                  }}
                />
              </label>
              <button type="button" className="btn btn--ghost" onClick={() => navigator.clipboard.writeText(m.url)}>
                Copy URL
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => handleDelete(m.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
        {media.length === 0 && <p>No media yet. Upload your first asset.</p>}
      </div>
    </div>
  );
}
