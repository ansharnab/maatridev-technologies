export const PAGE_OPTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Us" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

export function getStarterPuckData(pageId) {
  const starters = {
    home: {
      root: { props: { title: "MaatriDev Technologies — Home" } },
      content: [
        {
          type: "HeroBanner",
          props: {
            eyebrow: "Pure-Service Technology Partner",
            title: "Technology, creative & digital services — end to end",
            subtitle:
              "Software, web, CRM, cloud, creative, marketing, ITeS, events, and emerging tech — one accountable partnership.",
            primaryLabel: "Explore Services",
            primaryLink: "/services",
            secondaryLabel: "Book Appointment",
            secondaryLink: "/appointment",
            align: "center",
            overlay: "dark",
          },
        },
        {
          type: "StatsBar",
          props: {
            stat1: "120+", label1: "Projects",
            stat2: "40+", label2: "Clients",
            stat3: "8", label3: "Service Lines",
            stat4: "24/7", label4: "Support",
          },
        },
        {
          type: "FeatureGrid",
          props: {
            title: "What we deliver",
            subtitle: "Eight service lines under one roof — not just AI or cloud.",
            card1Title: "Software & CRM",
            card1Text: "Enterprise apps, SaaS, and tailored CRM systems.",
            card2Title: "Web & Creative",
            card2Text: "Portals, e-commerce, design, and digital marketing.",
            card3Title: "Cloud & ITeS",
            card3Text: "Integration, data platforms, and managed services.",
          },
        },
        {
          type: "CTAStrip",
          props: {
            title: "Ready to navigate your next?",
            text: "Talk to founders Akshansh Arnab & Swetav Savarn.",
            buttonLabel: "Contact Us",
            buttonLink: "/contact",
          },
        },
      ],
      zones: {},
    },
    about: {
      root: { props: { title: "About MaatriDev" } },
      content: [
        {
          type: "HeroBanner",
          props: {
            eyebrow: "About Us",
            title: "MaatriDev Technologies",
            subtitle: "Founded by Akshansh Arnab & Swetav Savarn — pure-service technology, creative, and digital partnership.",
            primaryLabel: "Our Services",
            primaryLink: "/services",
            secondaryLabel: "",
            secondaryLink: "#",
            align: "left",
            overlay: "dark",
          },
        },
        {
          type: "HeroSplit",
          props: {
            title: "Our mission",
            text: "We deliver comprehensive technology and digital services in India and worldwide — software, creative, cloud, marketing, and consultancy.",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
            imageRight: true,
            buttonLabel: "Meet the team",
            buttonLink: "/team",
          },
        },
        { type: "TeamCards", props: {} },
      ],
      zones: {},
    },
    services: {
      root: { props: { title: "Services" } },
      content: [
        {
          type: "HeroBanner",
          props: {
            eyebrow: "Services",
            title: "Everything your business needs to grow digitally",
            subtitle: "From code to creative — pick a service line or engage us end-to-end.",
            primaryLabel: "Get a Proposal",
            primaryLink: "/contact",
            secondaryLabel: "",
            secondaryLink: "#",
            align: "center",
            overlay: "brand",
          },
        },
        { type: "ServicesRow", props: {} },
      ],
      zones: {},
    },
    contact: {
      root: { props: { title: "Contact" } },
      content: [
        {
          type: "HeroBanner",
          props: {
            eyebrow: "Contact",
            title: "Let's build something great",
            subtitle: "hello@maatridev.com — we respond within 24 hours.",
            primaryLabel: "Book Appointment",
            primaryLink: "/appointment",
            secondaryLabel: "",
            secondaryLink: "#",
            align: "center",
            overlay: "dark",
          },
        },
        {
          type: "CTAStrip",
          props: {
            title: "Prefer the contact form?",
            text: "Uncheck “Publish” in the builder to show the built-in form on this page.",
            buttonLabel: "Appointment",
            buttonLink: "/appointment",
          },
        },
      ],
      zones: {},
    },
  };

  return JSON.parse(JSON.stringify(starters[pageId] || starters.home));
}
