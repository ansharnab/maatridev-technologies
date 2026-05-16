import { useEffect, useState } from "react";
import axios from "axios";

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("maatridev-admin-token")}` };
}

export default function MediaManager() {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);

  const load = () => axios.get("/api/media").then((r) => setMedia(r.data));

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    const fd = new FormData();
    [...files].forEach((f) => fd.append("files", f));
    setUploading(true);
    try {
      await axios.post("/api/media/upload", fd, { headers: { ...authHeaders(), "Content-Type": "multipart/form-data" } });
      load();
    } finally {
      setUploading(false);
      e.target.value = "";
    }
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
      <p className="admin-hint">Upload, edit usage via page builder, or delete logos, banners, and videos.</p>
      <div className="media-grid">
        {media.map((m) => (
          <article key={m.id} className="media-item">
            {m.type === "video" ? (
              <video src={m.url} controls />
            ) : (
              <img src={m.url} alt={m.name} />
            )}
            <div className="media-item__meta">
              <span title={m.name}>{m.name}</span>
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
