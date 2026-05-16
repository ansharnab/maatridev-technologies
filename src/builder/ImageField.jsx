import { useEffect, useState } from "react";
import axios from "axios";

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("maatridev-admin-token")}` };
}

export default function ImageField({ label, value = "", onChange, hint }) {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [openLib, setOpenLib] = useState(false);

  useEffect(() => {
    if (openLib) {
      axios.get("/api/media").then((r) => setMedia(r.data.filter((m) => m.type === "image")));
    }
  }, [openLib]);

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("files", file);
    setUploading(true);
    try {
      const res = await axios.post("/api/media/upload", fd, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.items?.[0]?.url;
      if (url) onChange(url);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="image-field">
      <label>{label}</label>
      {hint && <p className="image-field__hint">{hint}</p>}
      {value && (
        <div className="image-field__preview">
          <img src={value} alt="" />
          <button type="button" className="ve-btn ve-btn--small" onClick={() => onChange("")}>
            Remove
          </button>
        </div>
      )}
      <input
        type="url"
        placeholder="https://… or /uploads/your-file.jpg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="image-field__actions">
        <label className="ve-btn ve-btn--small">
          {uploading ? "Uploading…" : "Upload image"}
          <input type="file" accept="image/*" hidden onChange={upload} />
        </label>
        <button type="button" className="ve-btn ve-btn--small" onClick={() => setOpenLib(!openLib)}>
          {openLib ? "Hide library" : "Media library"}
        </button>
      </div>
      {openLib && (
        <div className="image-field__library">
          {media.length === 0 ? (
            <p>No images yet. Upload in Media tab or use Upload above.</p>
          ) : (
            media.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`image-field__thumb ${value === m.url ? "is-selected" : ""}`}
                onClick={() => {
                  onChange(m.url);
                  setOpenLib(false);
                }}
              >
                <img src={m.url} alt={m.name} />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
