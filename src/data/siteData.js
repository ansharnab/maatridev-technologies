export const founders = [
  {
    name: "Akshansh Arnab",
    role: "Co-Founder & Technology Lead",
    bio: "Leading software engineering, systems integration, and enterprise delivery programs for clients across industries.",
    image: "https://images.unsplash.com/photo-1507003211169?w=400&h=500&fit=crop&facepad=2",
    phone: "+91 98765 43210",
    email: "akshansh@maatridev.com",
    linkedin: "",
  },
  {
    name: "Swetav Savarn",
    role: "Co-Founder & Strategy Lead",
    bio: "Driving product vision, client partnerships, and scalable service delivery across IT and creative domains.",
    image: "https://images.unsplash.com/photo-1506794778202?w=400&h=500&fit=crop&facepad=2",
    phone: "+91 98765 43211",
    email: "swetav@maatridev.com",
    linkedin: "",
  },
];

export const services = [
  {
    id: "software",
    icon: "fa-code",
    title: "Software Development & CRM",
    summary: "Design, development, customization, and support of bespoke enterprise applications and CRM systems.",
    details: [
      "Custom enterprise applications",
      "CRM design & implementation",
      "SaaS platform engineering",
      "Maintenance & technical support",
    ],
  },
  {
    id: "ai",
    icon: "fa-brain",
    title: "AI, ML & LLM Engineering",
    summary: "Research, development, and deployment of AI solutions including prompt engineering and LLM optimization.",
    details: [
      "Machine learning pipelines",
      "LLM fine-tuning & optimization",
      "Prompt engineering frameworks",
      "AI-driven data processing",
    ],
  },
  {
    id: "cloud",
    icon: "fa-cloud",
    title: "Cloud & ITeS",
    summary: "Cloud computing, data warehousing, BPO-scale processing, and managed IT-enabled services.",
    details: ["Cloud migration & ops", "Data warehousing", "High-scale data processing", "Managed infrastructure"],
  },
  {
    id: "integration",
    icon: "fa-diagram-project",
    title: "Systems Integration",
    summary: "End-to-end integration and enterprise architecture consultancy for complex technical landscapes.",
    details: ["API & middleware integration", "Enterprise architecture", "Digital transformation roadmaps", "Legacy modernization"],
  },
  {
    id: "web",
    icon: "fa-globe",
    title: "Web & E-Commerce",
    summary: "Portal design, web development, maintenance, and full e-commerce / m-commerce solutions.",
    details: ["Corporate portals", "E-commerce platforms", "Performance optimization", "Ongoing maintenance"],
  },
  {
    id: "creative",
    icon: "fa-palette",
    title: "Creative & Digital Marketing",
    summary: "Graphic design, social media, content strategy, and digital marketing to amplify your brand.",
    details: ["Brand & visual design", "Social media management", "Content strategy", "SEO & campaigns"],
  },
  {
    id: "blockchain",
    icon: "fa-link",
    title: "Blockchain & Analytics",
    summary: "Blockchain consultancy, data analytics, and emerging technology implementation as markets evolve.",
    details: ["Smart contract advisory", "Data analytics dashboards", "Emerging tech pilots", "Compliance-ready solutions"],
  },
  {
    id: "events",
    icon: "fa-calendar-check",
    title: "Events & Consultancy",
    summary: "Corporate and technical event management plus IT consultancy for digital transformation.",
    details: ["Corporate events", "Technical conferences", "IT strategy consulting", "Workshop facilitation"],
  },
];

export const projects = [
  {
    id: 1,
    title: "Enterprise CRM Suite",
    category: "Software",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    client: "Healthcare Group",
  },
  {
    id: 2,
    title: "AI Document Intelligence",
    category: "AI / ML",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    client: "Financial Services",
  },
  {
    id: 3,
    title: "Cloud Data Platform",
    category: "Cloud",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    client: "Retail Enterprise",
  },
  {
    id: 4,
    title: "E-Commerce Portal",
    category: "Web",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    client: "D2C Brand",
  },
];

export const team = [
  ...founders,
  {
    name: "Engineering Squad",
    role: "Full-Stack & DevOps",
    bio: "Dedicated squads for React, Angular, Node, and cloud-native delivery.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=500&fit=crop",
  },
  {
    name: "AI Research Lab",
    role: "ML & Prompt Engineering",
    bio: "Specialists in LLM optimization, RAG pipelines, and production AI systems.",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=500&fit=crop",
  },
];

export const blogPosts = [
  {
    id: 1,
    title: "Scaling LLMs for Enterprise Data Pipelines",
    excerpt: "How MaatriDev optimizes large language models for secure, high-volume business data.",
    date: "May 10, 2026",
    author: "Akshansh Arnab",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=500&fit=crop",
    category: "AI",
  },
  {
    id: 2,
    title: "Digital Transformation in 2026",
    excerpt: "A practical roadmap for CIOs balancing cloud, AI, and legacy modernization.",
    date: "Apr 28, 2026",
    author: "Swetav Savarn",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
    category: "Consulting",
  },
  {
    id: 3,
    title: "Building CRM That Teams Actually Use",
    excerpt: "UX-first CRM design principles from our enterprise delivery playbook.",
    date: "Apr 15, 2026",
    author: "MaatriDev Team",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop",
    category: "Software",
  },
];

export const pricingPlans = [
  {
    name: "Project Delivery",
    price: "Scoped",
    period: " per engagement",
    features: [
      "Fixed-scope software, web, or creative deliverables",
      "Milestones with clear acceptance criteria",
      "Ideal for one-off builds and launches",
      "Transparent timelines & documentation",
    ],
    featured: false,
  },
  {
    name: "Managed Services",
    price: "₹1,49,999",
    period: "/month",
    features: [
      "Ongoing development, maintenance & support",
      "Multi-discipline squad (dev, design, ops)",
      "Monthly roadmap & service reviews",
      "Priority SLAs and dedicated point of contact",
    ],
    featured: true,
  },
  {
    name: "Enterprise Partnership",
    price: "Custom",
    period: "",
    features: [
      "Dedicated teams across IT, creative & digital",
      "CRM, cloud, integration & transformation programs",
      "Co-founders-led strategy and governance",
      "Flexible scale across India & global delivery",
    ],
    featured: false,
  },
];

export const faqs = [
  {
    q: "What technologies does MaatriDev specialize in?",
    a: "We deliver solutions in HTML, Angular, React, JavaScript, Node, cloud platforms, AI/ML, LLMs, blockchain, and enterprise integration — tailored to your stack.",
  },
  {
    q: "Do you work with clients outside India?",
    a: "Yes. Our partnership deed authorizes delivery in India and internationally, with remote-first collaboration and global time-zone coverage.",
  },
  {
    q: "Can you manage our entire digital presence?",
    a: "Absolutely — from web and e-commerce to graphic design, social media, content strategy, and digital marketing under one accountable partner.",
  },
  {
    q: "How do we start a project?",
    a: "Book an appointment via our site, or submit the contact form. We respond within 24 hours with a discovery call and proposal outline.",
  },
];

export const shopProducts = [
  {
    id: 1,
    name: "AI Starter Toolkit License",
    price: 4999,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=600&fit=crop",
    category: "Digital Products",
  },
  {
    id: 2,
    name: "CRM Template Pack",
    price: 2999,
    image: "https://images.unsplash.com/photo-1556761175-5973dc0a32e7?w=600&h=600&fit=crop",
    category: "Templates",
  },
  {
    id: 3,
    name: "Brand Identity Kit",
    price: 7999,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=600&fit=crop",
    category: "Design",
  },
];

export const homeVariants = {
  1: {
    label: "Web Agency",
    eyebrow: "Creative Web Experiences",
    title: "We craft digital experiences that convert",
    subtitle: "Portals, e-commerce, and brand-forward web development with pixel-perfect delivery.",
    cta: "Start Your Project",
    theme: "web",
  },
  2: {
    label: "Startup Agency",
    eyebrow: "Launch Faster · Scale Smarter",
    title: "Your technology co-founder for ambitious startups",
    subtitle: "MVP development, SaaS platforms, and growth-ready architecture from day one.",
    cta: "Book Discovery Call",
    theme: "startup",
  },
  3: {
    label: "Digital Agency",
    eyebrow: "Full-Spectrum Digital",
    title: "Design, content, and campaigns that amplify your brand",
    subtitle: "Social media, graphic design, SEO, and integrated digital marketing under one roof.",
    cta: "Grow Your Brand",
    theme: "digital",
  },
  4: {
    label: "IT Solutions",
    eyebrow: "Pure-Service Technology Partner",
    title: "Technology, creative & digital services — end to end",
    subtitle:
      "Software, web, CRM, cloud, creative, marketing, ITeS, events, and emerging tech — one accountable partnership for organizations in India and worldwide.",
    cta: "Explore Our Services",
    theme: "it",
  },
};

export const stats = [
  { value: "120+", label: "Projects Delivered" },
  { value: "40+", label: "Enterprise Clients" },
  { value: "8", label: "Core Service Lines" },
  { value: "24/7", label: "Support Available" },
];

export const techStack = ["React", "Angular", "Node.js", "Python", "AWS", "Azure", "TensorFlow", "OpenAI", "Salesforce", "Shopify"];
