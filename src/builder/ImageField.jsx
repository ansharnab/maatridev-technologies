import { useEffect, useState } from "react";
import axios from "axios";
import { uploadMediaFile } from "../admin/api";
import { isVideoUrl } from "../utils/mediaType";

function uploadErrorMessage(err) {
  const msg = err?.message;
  if (msg && !err?.response) return msg;
  if (!err?.response) {
    return "Upload failed — API not reachable. From the website folder run: npm run dev (ports 3001 + 5173), or double-click START-LOCAL.bat.";
  }
  if (err.response.status === 401) {
    return "Upload denied — log out and sign in again at /admin.";
  }
  return err.response.data?.error || `Upload failed (error ${err.response.status}).`;
}

export default function ImageField({
  label,
  value = "",
  onChange,
  hint,
  allowVideo = false,
  variant = "default",
  previewVersion,
  onError,
}) {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [openLib, setOpenLib] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (openLib) {
      axios
        .get("/api/media")
        .then((r) =>
          setMedia(r.data.filter((m) => m.type === "image" || (allowVideo && m.type === "video")))
        )
        .catch(() => setMedia([]));
    }
  }, [openLib, allowVideo]);

  const report = (msg) => {
    setError(msg);
    onError?.(msg);
  };

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = await uploadMediaFile(file);
      const url = data?.items?.[0]?.url;
      if (url) {
        onChange(url);
        setError("");
      } else {
        report("Upload returned no file URL.");
      }
    } catch (err) {
      report(uploadErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const upload = async (e) => {
    const file = e.target.files?.[0];
    await uploadFile(file);
    e.target.value = "";
  };

  const previewSrc =
    value && value.includes("/uploads/") && previewVersion
      ? `${value}${value.includes("?") ? "&" : "?"}v=${previewVersion}`
      : value;

  return (
    <div className={`image-field${variant === "logo" ? " image-field--logo" : ""}`}>
      {label ? <label>{label}</label> : null}
      {hint && <p className="image-field__hint">{hint}</p>}
      {error && <p className="image-field__error">{error}</p>}
      {value && (
        <div
          className={`image-field__preview${variant === "logo" && value ? " image-field__preview--logo" : ""}`}
        >
          {isVideoUrl(value) ? (
            <video src={previewSrc} muted loop playsInline autoPlay />
          ) : (
            <img
              src={previewSrc}
              alt=""
              onError={() => report(`Cannot load image at ${value}. Check the path or upload again.`)}
            />
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
        onChange={(e) => {
          setError("");
          onChange(e.target.value);
        }}
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
              <input type="file" accept="image/*,.svg" hidden onChange={upload} />
            </label>
          </>
        ) : (
          <label className="ve-btn ve-btn--small">
            {uploading ? "Uploading…" : "Upload image"}
            <input type="file" accept="image/*,.svg" hidden onChange={upload} />
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
                  setError("");
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
