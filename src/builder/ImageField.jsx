import { useEffect, useState } from "react";
import axios from "axios";
import { isVideoUrl } from "../utils/mediaType";

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("maatridev-admin-token")}` };
}

export default function ImageField({ label, value = "", onChange, hint, allowVideo = false }) {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [openLib, setOpenLib] = useState(false);

  useEffect(() => {
    if (openLib) {
      axios.get("/api/media").then((r) =>
        setMedia(r.data.filter((m) => m.type === "image" || (allowVideo && m.type === "video")))
      );
    }
  }, [openLib, allowVideo]);

  const uploadFile = async (file) => {
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
    }
  };

  const upload = async (e) => {
    const file = e.target.files?.[0];
    await uploadFile(file);
    e.target.value = "";
  };

  return (
    <div className="image-field">
      <label>{label}</label>
      {hint && <p className="image-field__hint">{hint}</p>}
      {value && (
        <div className={`image-field__preview${allowVideo && value ? " image-field__preview--logo" : ""}`}>
          {isVideoUrl(value) ? (
            <video src={value} muted loop playsInline autoPlay />
          ) : (
            <img src={value} alt="" />
          )}
          <button type="button" className="ve-btn ve-btn--small" onClick={() => onChange("")}>
            Remove
          </button>
        </div>
      )}
      <input
        type="url"
        placeholder={allowVideo ? "https://… or /uploads/logo.mp4" : "https://… or /uploads/your-file.jpg"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="image-field__actions">
        {allowVideo ? (
          <>
            <label className="ve-btn ve-btn--small ve-btn--primary">
              {uploading ? "Uploading…" : "Upload video logo"}
              <input type="file" accept="video/mp4,video/webm,.mp4,.webm" hidden onChange={upload} />
            </label>
            <label className="ve-btn ve-btn--small">
              Upload image
              <input type="file" accept="image/*" hidden onChange={upload} />
            </label>
          </>
        ) : (
          <label className="ve-btn ve-btn--small">
            {uploading ? "Uploading…" : "Upload image"}
            <input type="file" accept="image/*" hidden onChange={upload} />
          </label>
        )}
        <button type="button" className="ve-btn ve-btn--small" onClick={() => setOpenLib(!openLib)}>
          {openLib ? "Hide library" : "Media library"}
        </button>
      </div>
      {openLib && (
        <div className="image-field__library">
          {media.length === 0 ? (
            <p>
              {allowVideo
                ? "No images or videos yet. Upload here or in Admin → Media."
                : "No images yet. Upload in Media tab or use Upload above."}
            </p>
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
                {m.type === "video" ? (
                  <video src={m.url} muted playsInline />
                ) : (
                  <img src={m.url} alt={m.name} />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
