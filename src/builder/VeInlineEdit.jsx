import { createContext, useContext, useEffect, useRef } from "react";

const VeEditCtx = createContext(null);

export function VeEditScope({ isSelected, fieldKeys, onPatch, children }) {
  const value =
    isSelected && fieldKeys?.length
      ? { active: true, fieldKeys, onPatch }
      : null;
  return <VeEditCtx.Provider value={value}>{children}</VeEditCtx.Provider>;
}

export function VeEditable({ field, as: Tag = "span", className, children, multiline = false }) {
  const ctx = useContext(VeEditCtx);
  const ref = useRef(null);
  const canEdit = ctx?.active && ctx.fieldKeys?.includes(field);
  const text = children ?? "";

  useEffect(() => {
    const el = ref.current;
    if (!el || !canEdit) return;
    if (document.activeElement !== el) {
      el.textContent = text;
    }
  }, [text, canEdit]);

  if (!canEdit) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag
      ref={ref}
      className={[className, "ve-inline-edit"].filter(Boolean).join(" ")}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      spellCheck
      title="Click to edit — saves when you click away"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (!multiline && e.key === "Enter") e.preventDefault();
        if (e.key === "Escape") {
          e.preventDefault();
          if (ref.current) {
            ref.current.textContent = text;
            ref.current.blur();
          }
        }
      }}
      onInput={(e) => {
        ctx.onPatch(field, e.currentTarget.innerText, { live: true });
      }}
      onBlur={(e) => {
        const next = e.currentTarget.innerText.trim();
        ctx.onPatch(field, next, { live: false });
      }}
    />
  );
}
