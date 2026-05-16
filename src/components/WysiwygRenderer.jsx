import { useEffect } from "react";
import "./WysiwygRenderer.css";

export default function WysiwygRenderer({ html, css }) {
  useEffect(() => {
    const id = "wysiwyg-page-style";
    let el = document.getElementById(id);
    if (!css) return;
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = css;
    return () => {
      if (el?.parentNode) el.parentNode.removeChild(el);
    };
  }, [css]);

  if (!html) return null;

  return (
    <article
      className="wysiwyg-page"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
