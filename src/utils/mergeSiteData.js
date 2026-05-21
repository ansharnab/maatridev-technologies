import {
  founders as defaultFounders,
  services as defaultServices,
  projects as defaultProjects,
  team as defaultTeam,
} from "../data/siteData";
import { getHeaderColorDefaults } from "./headerColorFields";

const DEFAULT_SETTINGS = {
  ...getHeaderColorDefaults(),
  siteName: "MaatriDev Technologies",
  logoText: "MaatriDev",
  logoLetter: "M",
  logoImage: "/logo-maatridev.svg",
  logoImageOnDark: "/logo-maatridev-hero.svg",
  logoScale: 1,
  logoClipWidth: 300,
  logoAnimation: "gradient",
  logoColorPrimary: "#007cc3",
  logoColorAccent: "#00b8a9",
  tagline: "Technology, creative & digital services — delivered end to end",
  email: "hello@maatridev.com",
  phone: "+91 98765 43210",
  address: "India · Global Delivery",
  headerDesign: "glass",
  headerSize: "default",
  headerBarBackground: "rgba(10, 22, 40, 0.55)",
  headerBarOverHero: "rgba(10, 22, 40, 0.55)",
  headerBarScrolled: "rgba(255, 255, 255, 0.92)",
  headerNavOnDark: "#ffffff",
  headerNavOnLight: "#1a2b3c",
  headerNavActiveColor: "#ffffff",
  headerNavActiveBg: "rgba(0, 184, 169, 0.35)",
  headerNavHoverBg: "rgba(255, 255, 255, 0.12)",
  headerBrandTextOnDark: "#ffffff",
  headerCtaBg: "#007cc3",
  headerCtaColor: "#ffffff",
  headerCtaLabel: "Book Appointment",
  headerCtaLink: "/appointment",
  homeHeroTheme: "it",
  homeHeroGradient: "",
};

const DEFAULT_FOUNDERS = defaultFounders.map((f) => ({
  ...f,
  phone: f.phone || "",
  email: f.email || "",
  linkedin: f.linkedin || "",
}));

function mergeFounders(overrides) {
  if (!overrides?.length) return DEFAULT_FOUNDERS;
  return overrides.map((f, i) => ({
    ...DEFAULT_FOUNDERS[i],
    ...f,
    name: f.name || DEFAULT_FOUNDERS[i]?.name || `Founder ${i + 1}`,
  }));
}

export function getDefaultSiteContent() {
  return {
    settings: { ...DEFAULT_SETTINGS },
    site: {
      founders: DEFAULT_FOUNDERS.map((f) => ({ ...f })),
      services: defaultServices.map((s) => ({
        id: s.id,
        title: s.title,
        summary: s.summary,
        icon: s.icon,
        image: s.image || "",
        hidden: false,
      })),
    },
  };
}

function normalizeBrandSettings(settings) {
  const s = { ...DEFAULT_SETTINGS, ...(settings || {}) };
  const name = `${s.logoText || ""} ${s.siteName || ""}`.toLowerCase();
  if (name.includes("saumya")) {
    return {
      ...s,
      siteName: DEFAULT_SETTINGS.siteName,
      logoText: DEFAULT_SETTINGS.logoText,
      logoImage: DEFAULT_SETTINGS.logoImage,
      logoImageOnDark: DEFAULT_SETTINGS.logoImageOnDark,
      logoLetter: "M",
    };
  }
  if (!s.logoImage?.trim()) {
    s.logoImage = DEFAULT_SETTINGS.logoImage;
    s.logoImageOnDark = DEFAULT_SETTINGS.logoImageOnDark;
  }
  const custom = s.logoImage?.trim() && !s.logoImage.includes("logo-maatridev");
  if (custom && (!s.logoImageOnDark?.trim() || s.logoImageOnDark.includes("logo-maatridev-hero"))) {
    s.logoImageOnDark = s.logoImage;
  }
  return s;
}

export function mergeSiteContent(content) {
  const settings = normalizeBrandSettings(content?.settings);
  const site = content?.site || {};
  const founders = mergeFounders(site.founders);
  const services = defaultServices
    .map((item) => {
      const patch = site.services?.find((o) => o.id === item.id);
      if (patch?.hidden === true) return null;
      return patch ? { ...item, ...patch, id: item.id } : item;
    })
    .filter(Boolean);

  const founderNames = new Set(founders.map((f) => f.name));
  const team = [
    ...founders,
    ...defaultTeam.filter((m) => !founderNames.has(m.name)),
  ];

  return {
    settings,
    founders,
    services,
    projects: defaultProjects,
    team,
  };
}
