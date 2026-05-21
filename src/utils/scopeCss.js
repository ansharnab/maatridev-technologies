/** Scope arbitrary CMS CSS so it cannot break header/footer/layout globally */
export function scopeCssToSelector(css, scope = ".wysiwyg-page") {
  if (!css || typeof css !== "string") return "";
  const trimmed = css.trim();
  if (!trimmed) return "";

  return trimmed
    .split("}")
    .map((chunk) => {
      const part = chunk.trim();
      if (!part) return "";
      if (part.startsWith("@")) {
        const brace = part.indexOf("{");
        if (brace === -1) return `${part}}`;
        const atRule = part.slice(0, brace).trim();
        const body = part.slice(brace + 1).trim();
        const inner = scopeCssToSelector(body, scope);
        return `${atRule} { ${inner} }`;
      }
      const brace = part.indexOf("{");
      if (brace === -1) return "";
      const selector = part.slice(0, brace).trim();
      const body = part.slice(brace + 1).trim();
      if (!selector || !body) return "";
      const scoped = selector
        .split(",")
        .map((s) => {
          const sel = s.trim();
          if (!sel) return "";
          if (sel === "html" || sel === "body" || sel === ":root" || sel === "#root") {
            return scope;
          }
          if (sel.startsWith(scope)) return sel;
          return `${scope} ${sel}`;
        })
        .filter(Boolean)
        .join(", ");
      return `${scoped} { ${body} }`;
    })
    .filter(Boolean)
    .join("\n");
}
