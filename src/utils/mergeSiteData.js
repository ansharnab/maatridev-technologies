import {
  founders as defaultFounders,
  services as defaultServices,
  projects as defaultProjects,
  team as defaultTeam,
} from "../data/siteData";

const DEFAULT_SETTINGS = {
  siteName: "MaatriDev Technologies",
  logoText: "MaatriDev",
  logoLetter: "M",
  logoImage: "",
  logoScale: 1,
  logoClipWidth: 220,
  logoAnimation: "gradient",
  logoColorPrimary: "#007cc3",
  logoColorAccent: "#00b8a9",
  tagline: "Technology, creative & digital services — delivered end to end",
  email: "hello@maatridev.com",
  phone: "+91 98765 43210",
  address: "India · Global Delivery",
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

export function mergeSiteContent(content) {
  const settings = { ...DEFAULT_SETTINGS, ...(content?.settings || {}) };
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
