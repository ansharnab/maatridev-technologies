/** Page builder nav chips — matches live site header labels */
export const PREVIEW_NAV = [
  { pageId: "home", label: "Home" },
  { pageId: "about", label: "About" },
  { pageId: "services", label: "Services" },
  { pageId: "services", label: "Projects", path: "/projects" },
  { pageId: "about", label: "Team", path: "/team" },
  { pageId: "about", label: "Blog", path: "/blog" },
  { pageId: "contact", label: "Engagement", path: "/pricing" },
  { pageId: "contact", label: "Contact" },
];

export const PREVIEW_PAGE_PATH = {
  home: "/",
  about: "/about",
  services: "/services",
  contact: "/contact",
};

export function previewPathForPage(pageId) {
  return PREVIEW_PAGE_PATH[pageId] || "/";
}
