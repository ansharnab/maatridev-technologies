/** Alternate home demos — noindex + canonical to main home */
export const HOME_VARIANT_PATHS = [
  "/home/web-agency",
  "/home/startup-agency",
  "/home/digital-agency",
  "/home/it-solution",
];

export const DEFAULT_SITE_SEO = {
  title: "MaatriDev Technologies | IT, AI, Cloud & Digital Services",
  description:
    "MaatriDev Technologies — pure-service technology, creative, and digital solutions: software, web, CRM, cloud, design, marketing, and ITeS in India and globally.",
  ogImage: "/logo-maatridev.svg",
  twitterCard: "summary_large_image",
};

/** Static route defaults (overridden by CMS pages[].seo and settings.seo). */
export const ROUTE_SEO = {
  "/": {
    title: "MaatriDev Technologies | IT Solutions & Digital Agency",
    description: DEFAULT_SITE_SEO.description,
  },
  "/about": {
    title: "About Us | MaatriDev Technologies",
    description:
      "Learn about MaatriDev Technologies — founders, mission, and end-to-end technology, creative, and digital delivery in India and globally.",
  },
  "/services": {
    title: "Services | Software, AI, Cloud & Creative | MaatriDev",
    description:
      "Explore MaatriDev services: custom software, CRM, AI/ML, cloud, web development, creative, and digital marketing.",
  },
  "/contact": {
    title: "Contact | MaatriDev Technologies",
    description: "Get in touch with MaatriDev for projects, partnerships, and consultations.",
  },
  "/projects": {
    title: "Projects & Case Studies | MaatriDev Technologies",
    description: "Enterprise software, AI, cloud, and digital delivery projects by MaatriDev.",
  },
  "/team": {
    title: "Our Team | MaatriDev Technologies",
    description: "Meet the MaatriDev team — engineering, AI, and delivery specialists.",
  },
  "/blog": {
    title: "Blog | AI, Cloud & Digital Transformation | MaatriDev",
    description: "Insights on AI, LLMs, CRM, cloud, and digital transformation from MaatriDev.",
  },
  "/blog/list": {
    title: "Blog (List) | MaatriDev Technologies",
    description: DEFAULT_SITE_SEO.description,
    canonicalPath: "/blog",
  },
  "/pricing": {
    title: "Engagement & Pricing | MaatriDev Technologies",
    description: "Flexible engagement models for technology and digital services.",
  },
  "/faq": {
    title: "FAQ | MaatriDev Technologies",
    description: "Frequently asked questions about MaatriDev services and delivery.",
  },
  "/appointment": {
    title: "Book Appointment | MaatriDev Technologies",
    description: "Schedule a consultation with MaatriDev Technologies.",
  },
};
