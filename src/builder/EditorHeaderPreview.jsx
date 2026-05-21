import { SiteHeaderBar } from "../components/layout/Header";
import { previewBgForHomePath } from "./homeAgencyNav";
import { previewPathForPage } from "./previewNav";
import { previewContextFromPath } from "../utils/headerTheme";

/**
 * Live site header inside the page builder — no nested Router (RR v7 blocks MemoryRouter).
 */
export default function EditorHeaderPreview({
  device = "desktop",
  settings = {},
  currentPageId = "home",
  previewPathname,
  isSelected = false,
  onSelect,
  onNavigatePage,
}) {
  const pathname = previewPathname || previewPathForPage(currentPageId);
  const ctx = previewContextFromPath(pathname);
  const stageBg =
    ctx === "home"
      ? previewBgForHomePath(pathname, settings)
      : ctx === "pageHero"
        ? settings.headerPreviewPageBg ||
          "linear-gradient(135deg, #007cc3 0%, #003d5c 100%)"
        : settings.headerPreviewPageBg || "#e8eef4";

  return (
    <div
      className={`ve-chrome-block ve-chrome-block--ctx-${ctx}${isSelected ? " is-selected" : ""}`}
      onClick={(e) => {
        if (e.target.closest(".ve-chrome-block__bar")) onSelect?.();
      }}
    >
      <div className="ve-chrome-block__bar">
        <span className="ve-block__label">
          Site header · scroll nav ← → · click label to jump page · click ▼ for submenu
        </span>
      </div>
      <div
        className={`ve-header-preview-stage ve-header-preview-stage--${ctx}`}
        style={{ background: stageBg }}
      >
        <SiteHeaderBar
          settings={settings}
          pathname={pathname}
          editorPreview
          previewPageId={currentPageId}
          previewDevice={device}
          isSelected={isSelected}
          onEditorSelect={onSelect}
          onEditorNavigate={onNavigatePage}
        />
      </div>
    </div>
  );
}
