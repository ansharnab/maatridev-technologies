import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PageSectionsView from "../../builder/PageSectionsView";
import PuckPageView from "../../builder/PuckPageView";
import WysiwygRenderer from "../WysiwygRenderer";
import { useSiteContent } from "../../hooks/useSiteContent";
import "./layout.css";

function hasRenderableSections(sections) {
  return Array.isArray(sections) && sections.length > 0;
}

function hasRenderablePuck(data) {
  return Boolean(data?.content?.length);
}

function hasRenderableWysiwyg(w) {
  if (!w?.html) return false;
  const text = w.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 24;
}

/** Only these routes can be replaced by CMS builder output. Home always uses React pages. */
const CMS_PAGE_ROUTES = {
  "/about": "about",
  "/services": "services",
  "/contact": "contact",
};

export default function MainLayout() {
  const { settings, loading, getPageSections, getPuckPage, getWysiwygPage } = useSiteContent();
  const { pathname } = useLocation();
  const pageId = CMS_PAGE_ROUTES[pathname];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const rawSections = pageId ? getPageSections(pageId) : null;
  const customSections = hasRenderableSections(rawSections) ? rawSections : null;
  const rawPuck = !customSections && pageId ? getPuckPage(pageId) : null;
  const puckData = hasRenderablePuck(rawPuck) ? rawPuck : null;
  const rawWysiwyg = !customSections && !puckData && pageId ? getWysiwygPage(pageId) : null;
  const wysiwyg = hasRenderableWysiwyg(rawWysiwyg) ? rawWysiwyg : null;

  return (
    <>
      {loading && (
        <div className="preloader preloader--bar" aria-hidden="true">
          <div className="preloader__spinner" />
        </div>
      )}
      <Header settings={settings} />
      <main className="site-main">
        {customSections ? (
          <PageSectionsView sections={customSections} />
        ) : puckData ? (
          <PuckPageView data={puckData} />
        ) : wysiwyg ? (
          <WysiwygRenderer html={wysiwyg.html} css={wysiwyg.css} />
        ) : (
          <Outlet context={{ settings }} />
        )}
      </main>
      <Footer settings={settings} />
    </>
  );
}
