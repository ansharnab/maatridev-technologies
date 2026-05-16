import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import PageSectionsView from "../../builder/PageSectionsView";
import PuckPageView from "../../builder/PuckPageView";
import WysiwygRenderer from "../WysiwygRenderer";
import { useSiteContent } from "../../hooks/useSiteContent";

const ROUTE_PAGE_MAP = {
  "/": "home",
  "/about": "about",
  "/services": "services",
  "/contact": "contact",
};

export default function MainLayout() {
  const { settings, loading, getPageSections, getPuckPage, getWysiwygPage } = useSiteContent();
  const { pathname } = useLocation();
  const pageId = ROUTE_PAGE_MAP[pathname];
  const customSections = pageId ? getPageSections(pageId) : null;
  const puckData = !customSections && pageId ? getPuckPage(pageId) : null;
  const wysiwyg = !customSections && !puckData && pageId ? getWysiwygPage(pageId) : null;

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
