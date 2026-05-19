import { useEffect } from "react";

export default function EditorToast({ message, type = "success", onDone }) {
  useEffect(() => {
    if (!message) return undefined;
    const t = window.setTimeout(() => onDone?.(), 4000);
    return () => window.clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div className={`ve-toast ve-toast--${type}`} role="status" aria-live="polite">
      <i
        className={`fa-solid ${type === "error" ? "fa-circle-exclamation" : "fa-circle-check"}`}
        aria-hidden="true"
      />
      {message}
    </div>
  );
}
