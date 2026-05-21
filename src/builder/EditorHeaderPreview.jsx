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
  pageHeaderCustom = false,
  isSelected = false,
  chromeFocus = null,
  onSelect,
  onLogoPatch,
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

  const closeOpenMenu = (root) => {
    const header = root?.querySelector(".site-header--menu-open");
    if (!header) return;
    header.querySelector(".site-header__toggle.is-active")?.click();
  };

  const isHeaderInteractive = (target) =>
    Boolean(
      target?.closest?.(
        [
          ".site-header__brand",
          ".site-header__link",
          ".site-header__link-label",
          ".site-header__link-chevron",
          ".site-header__home-block",
          ".site-header__home-toggle",
          ".site-header__home-links",
          ".site-header__toggle",
          ".site-header__cta",
          ".site-header__menu",
          ".site-header__overlay",
          ".ve-logo-editor",
        ].join(", "),
      ),
    );

  return (
    <div
      className={`ve-chrome-block ve-chrome-block--ctx-${ctx}${isSelected ? " is-selected" : ""}`}
      onClick={(e) => {
        if (isHeaderInteractive(e.target)) return;
        closeOpenMenu(e.currentTarget);
        onSelect?.();
      }}
    >
      <div
        className="ve-chrome-block__bar"
        onClick={(e) => {
          e.stopPropagation();
          closeOpenMenu(e.currentTarget.closest(".ve-chrome-block"));
          onSelect?.();
        }}
      >
        <span className="ve-block__label">
          {pageHeaderCustom ? "Page header (custom)" : "Site header"}
          {" · click header or logo to edit · scroll nav ← → · ▼ for submenu"}
        </span>
      </div>
      <div
        className={`ve-header-preview-stage ve-header-preview-stage--${ctx}`}
        style={{ background: stageBg }}
        onClick={(e) => {
          if (e.target.closest(".site-header")) return;
          e.stopPropagation();
          closeOpenMenu(e.currentTarget.closest(".ve-chrome-block"));
          onSelect?.();
        }}
      >
        <SiteHeaderBar
          settings={settings}
          pathname={pathname}
          editorPreview
          previewPageId={currentPageId}
          previewDevice={device}
          isSelected={isSelected}
          editorFocus={chromeFocus}
          onEditorSelect={onSelect}
          onLogoPatch={onLogoPatch}
          onEditorNavigate={onNavigatePage}
        />
      </div>
    </div>
  );
}
