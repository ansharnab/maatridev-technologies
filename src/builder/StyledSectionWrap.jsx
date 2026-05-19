import { styleToCssVars } from "./editorTheme";

export default function StyledSectionWrap({ sectionType, style, children, className = "" }) {
  const cssVars = styleToCssVars(style, sectionType);
  const clean = Object.fromEntries(
    Object.entries(cssVars).filter(([, v]) => v !== undefined && v !== "")
  );

  return (
    <div
      className={`ve-styled-section ve-styled-section--${sectionType} ${className}`.trim()}
      style={clean}
      data-section-type={sectionType}
    >
      {children}
    </div>
  );
}
