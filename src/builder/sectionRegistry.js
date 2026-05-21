import {
  HomeHeroBlock,
  PageHeroBlock,
  StatsBlock,
  ServicesGridBlock,
  FeatureStripBlock,
  FoundersBlock,
  CTABlock,
  TextContentBlock,
  ContactInfoBlock,
  ContactFormBlock,
} from "./sections/SectionParts";
import { defaultStyleForType } from "./editorTheme";

export const PAGE_OPTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Us" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

export const SECTION_TYPES = {
  homeHero: {
    label: "Home Hero",
    icon: "fa-image",
    component: HomeHeroBlock,
    defaultProps: {
      eyebrow: "Pure-Service Technology Partner",
      title: "Technology, creative & digital services — end to end",
      subtitle:
        "Software, web, CRM, cloud, creative, marketing, ITeS, events, and emerging tech — one accountable partnership.",
      primaryLabel: "Explore Our Services",
      primaryLink: "/services",
      secondaryLabel: "View Services",
      secondaryLink: "/services",
      heroTheme: "it",
    },
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Headline", type: "textarea" },
      { key: "subtitle", label: "Subheadline", type: "textarea" },
      { key: "primaryLabel", label: "Primary button", type: "text" },
      { key: "primaryLink", label: "Primary link", type: "text" },
      { key: "secondaryLabel", label: "Secondary button", type: "text" },
      { key: "secondaryLink", label: "Secondary link", type: "text" },
      { key: "image", label: "Hero image URL", type: "text" },
      {
        key: "heroTheme",
        label: "Agency style",
        type: "select",
        options: [
          { value: "it", label: "IT Solutions (default)" },
          { value: "web", label: "Web Agency" },
          { value: "startup", label: "Startup Agency" },
          { value: "digital", label: "Digital Agency" },
        ],
      },
    ],
  },
  pageHero: {
    label: "Page Header (blue banner)",
    icon: "fa-heading",
    component: PageHeroBlock,
    defaultProps: {
      title: "Page Title",
      description: "Short description under the title.",
      breadcrumbLabel: "Page",
    },
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "breadcrumbLabel", label: "Breadcrumb name", type: "text" },
    ],
  },
  stats: {
    label: "Stats Row",
    icon: "fa-chart-simple",
    component: StatsBlock,
    defaultProps: {
      stat1: "120+", label1: "Projects Delivered",
      stat2: "40+", label2: "Enterprise Clients",
      stat3: "8", label3: "Core Service Lines",
      stat4: "24/7", label4: "Support Available",
    },
    fields: [
      { key: "stat1", label: "Stat 1 value", type: "text" },
      { key: "label1", label: "Stat 1 label", type: "text" },
      { key: "stat2", label: "Stat 2 value", type: "text" },
      { key: "label2", label: "Stat 2 label", type: "text" },
      { key: "stat3", label: "Stat 3 value", type: "text" },
      { key: "label3", label: "Stat 3 label", type: "text" },
      { key: "stat4", label: "Stat 4 value", type: "text" },
      { key: "label4", label: "Stat 4 label", type: "text" },
    ],
  },
  servicesGrid: {
    label: "Services Cards (like Services page)",
    icon: "fa-grid-2",
    component: ServicesGridBlock,
    defaultProps: { showAll: true, title: "", subtitle: "" },
    fields: [
      { key: "title", label: "Section title (optional)", type: "text" },
      { key: "subtitle", label: "Section subtitle (optional)", type: "textarea" },
      {
        key: "showAll",
        label: "Show all 8 services",
        type: "select",
        options: [
          { label: "Yes — full grid", value: true },
          { label: "No — first 3 only", value: false },
        ],
      },
    ],
  },
  featureStrip: {
    label: "About / Feature Strip",
    icon: "fa-align-left",
    component: FeatureStripBlock,
    defaultProps: {
      eyebrow: "About MaatriDev",
      title: "Pure-service technology partnership",
      body: "Led by founders Akshansh Arnab and Swetav Savarn. We deliver software, web, CRM, cloud, creative, marketing, and ITeS.",
      buttonLabel: "Our Story",
      buttonLink: "/about",
    },
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "buttonLabel", label: "Button", type: "text" },
      { key: "buttonLink", label: "Button link", type: "text" },
    ],
  },
  founders: {
    label: "Founders",
    icon: "fa-user-tie",
    component: FoundersBlock,
    defaultProps: {},
    fields: [],
  },
  cta: {
    label: "Call to Action (blue bar)",
    icon: "fa-bullhorn",
    component: CTABlock,
    defaultProps: {
      title: "Ready to navigate your next?",
      text: "Book an appointment or send us a message — we respond within 24 hours.",
      buttonLabel: "Contact Us",
      buttonLink: "/contact",
    },
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "text", label: "Text", type: "textarea" },
      { key: "buttonLabel", label: "Button label", type: "text" },
      { key: "buttonLink", label: "Button link", type: "text" },
    ],
  },
  textContent: {
    label: "Text Section",
    icon: "fa-paragraph",
    component: TextContentBlock,
    defaultProps: {
      title: "Section heading",
      body: "Add your content here.",
      align: "left",
    },
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
      {
        key: "align",
        label: "Alignment",
        type: "select",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
        ],
      },
    ],
  },
  contactInfo: {
    label: "Contact Info",
    icon: "fa-envelope",
    component: ContactInfoBlock,
    defaultProps: {
      title: "Get in touch",
      email: "hello@maatridev.com",
      phone: "+91 98765 43210",
      note: "We respond within one business day.",
    },
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "note", label: "Note", type: "textarea" },
    ],
  },
  contactForm: {
    label: "Contact Form",
    icon: "fa-paper-plane",
    component: ContactFormBlock,
    defaultProps: {},
    fields: [],
  },
};

export function getDefaultSections(pageId) {
  const defaults = {
    home: [
      { id: "s1", type: "homeHero", props: { ...SECTION_TYPES.homeHero.defaultProps } },
      { id: "s2", type: "stats", props: { ...SECTION_TYPES.stats.defaultProps } },
      { id: "s3", type: "servicesGrid", props: { showAll: false, title: "What we deliver", subtitle: "Eight service lines under one accountable partner." } },
      { id: "s4", type: "featureStrip", props: { ...SECTION_TYPES.featureStrip.defaultProps } },
      { id: "s5", type: "founders", props: {} },
      { id: "s6", type: "cta", props: { ...SECTION_TYPES.cta.defaultProps } },
    ],
    about: [
      { id: "s1", type: "pageHero", props: { title: "About MaatriDev Technologies", description: "Pure-service technology, creative, and digital partnership.", breadcrumbLabel: "About" } },
      { id: "s2", type: "textContent", props: { title: "Our mission", body: "We deliver comprehensive technology and digital services in India and worldwide.", align: "left" } },
      { id: "s3", type: "founders", props: {} },
    ],
    services: [
      { id: "s1", type: "pageHero", props: { title: "Our Services", description: "IT, AI, cloud, web, creative, blockchain, analytics, and enterprise consultancy.", breadcrumbLabel: "Services" } },
      { id: "s2", type: "servicesGrid", props: { showAll: true, title: "", subtitle: "" } },
      { id: "s3", type: "cta", props: { title: "Need a custom proposal?", text: "Tell us about your project.", buttonLabel: "Contact Us", buttonLink: "/contact" } },
    ],
    contact: [
      { id: "s1", type: "pageHero", props: { title: "Contact Us", description: "We respond within 24 hours.", breadcrumbLabel: "Contact" } },
      { id: "s2", type: "contactInfo", props: { ...SECTION_TYPES.contactInfo.defaultProps } },
      { id: "s3", type: "contactForm", props: {} },
    ],
  };
  const items = JSON.parse(JSON.stringify(defaults[pageId] || defaults.home));
  return items.map((s) => ({
    ...s,
    style: { ...defaultStyleForType(s.type), ...(s.style || {}) },
  }));
}
