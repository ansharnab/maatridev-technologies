import { DropZone } from "@measured/puck";
import { alignOptions, bgOptions, btnVariants, paddingOptions } from "./styles";

const linkField = { type: "text", label: "Link URL" };

export const puckConfig = {
  root: {
    fields: {
      title: { type: "text", label: "Page title (browser tab / SEO)" },
    },
    defaultProps: { title: "MaatriDev Technologies" },
    render: ({ children }) => <article className="puck-rendered-page">{children}</article>,
  },
  categories: {
    layout: {
      title: "📐 Layout",
      components: ["HeroBanner", "HeroSplit", "Section", "TwoColumns", "ThreeColumns", "Spacer", "Divider"],
    },
    content: {
      title: "✏️ Content",
      components: ["Heading", "Paragraph", "Button", "ListBlock", "Quote"],
    },
    media: {
      title: "🖼 Media",
      components: ["ImageBlock", "VideoEmbed", "LogoCloud"],
    },
    maatridev: {
      title: "⚡ MaatriDev",
      components: ["FeatureGrid", "StatsBar", "ServicesRow", "TeamCards", "Testimonial", "CTAStrip", "PricingCards"],
    },
  },
  components: {
    HeroBanner: {
      label: "Hero Banner",
      fields: {
        eyebrow: { type: "text", label: "Eyebrow" },
        title: { type: "textarea", label: "Headline" },
        subtitle: { type: "textarea", label: "Subheadline" },
        primaryLabel: { type: "text", label: "Primary button" },
        primaryLink: linkField,
        secondaryLabel: { type: "text", label: "Secondary button (optional)" },
        secondaryLink: linkField,
        align: { type: "radio", options: alignOptions, label: "Alignment" },
        overlay: {
          type: "select",
          label: "Style",
          options: [
            { label: "Dark navy", value: "dark" },
            { label: "Brand gradient", value: "brand" },
            { label: "Light", value: "light" },
          ],
        },
      },
      defaultProps: {
        eyebrow: "Eyebrow text",
        title: "Your headline here",
        subtitle: "Supporting copy for your hero section.",
        primaryLabel: "Get Started",
        primaryLink: "/contact",
        secondaryLabel: "Learn More",
        secondaryLink: "/services",
        align: "center",
        overlay: "dark",
      },
      render: ({
        eyebrow,
        title,
        subtitle,
        primaryLabel,
        primaryLink,
        secondaryLabel,
        secondaryLink,
        align,
        overlay,
      }) => {
        const themes = {
          dark: { bg: "linear-gradient(125deg, #0a1628, #003d5c)", color: "#fff" },
          brand: { bg: "linear-gradient(90deg, #007cc3, #00b8a9)", color: "#fff" },
          light: { bg: "#f4f7fb", color: "#0a1628" },
        };
        const t = themes[overlay] || themes.dark;
        return (
          <section
            style={{
              background: t.bg,
              color: t.color,
              padding: "5rem 1.5rem",
              textAlign: align,
            }}
          >
            <div style={{ maxWidth: 900, margin: align === "center" ? "0 auto" : 0 }}>
              {eyebrow && (
                <p style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "#00b8a9", fontWeight: 600 }}>
                  {eyebrow}
                </p>
              )}
              <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", margin: "0.5rem 0 1rem", lineHeight: 1.15 }}>{title}</h1>
              <p style={{ fontSize: "1.1rem", opacity: 0.92, marginBottom: "1.75rem" }}>{subtitle}</p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start" }}>
                {primaryLabel && (
                  <a href={primaryLink} style={{ ...btnVariants.primary, padding: "0.85rem 1.6rem", borderRadius: 8, fontWeight: 600, textDecoration: "none" }}>
                    {primaryLabel}
                  </a>
                )}
                {secondaryLabel && (
                  <a
                    href={secondaryLink}
                    style={{
                      ...btnVariants.outline,
                      padding: "0.85rem 1.6rem",
                      borderRadius: 8,
                      fontWeight: 600,
                      textDecoration: "none",
                      borderColor: overlay === "light" ? "#007cc3" : "rgba(255,255,255,0.6)",
                      color: overlay === "light" ? "#007cc3" : "#fff",
                    }}
                  >
                    {secondaryLabel}
                  </a>
                )}
              </div>
            </div>
          </section>
        );
      },
    },

    HeroSplit: {
      label: "Hero Split (Image + Text)",
      fields: {
        title: { type: "textarea", label: "Title" },
        text: { type: "textarea", label: "Description" },
        image: { type: "text", label: "Image URL" },
        imageRight: { type: "radio", options: [{ label: "Image right", value: true }, { label: "Image left", value: false }], label: "Layout" },
        buttonLabel: { type: "text" },
        buttonLink: linkField,
      },
      defaultProps: {
        title: "Split hero with image",
        text: "Perfect for product or service highlights with visual impact.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop",
        imageRight: true,
        buttonLabel: "Learn more",
        buttonLink: "/services",
      },
      render: ({ title, text, image, imageRight, buttonLabel, buttonLink }) => (
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", padding: "4rem 1.5rem", alignItems: "center", maxWidth: 1170, margin: "0 auto" }}>
          {!imageRight && <img src={image} alt="" style={{ width: "100%", borderRadius: 16, boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }} />}
          <div>
            <h2 style={{ fontSize: "2.25rem", margin: "0 0 1rem", color: "#0a1628" }}>{title}</h2>
            <p style={{ color: "#5a6b7d", marginBottom: "1.5rem", lineHeight: 1.7 }}>{text}</p>
            {buttonLabel && (
              <a href={buttonLink} style={{ ...btnVariants.primary, padding: "0.85rem 1.6rem", borderRadius: 8, fontWeight: 600, textDecoration: "none" }}>
                {buttonLabel}
              </a>
            )}
          </div>
          {imageRight && <img src={image} alt="" style={{ width: "100%", borderRadius: 16, boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }} />}
        </section>
      ),
    },

    Section: {
      label: "Section Container",
      fields: {
        padding: { type: "select", options: paddingOptions, label: "Padding" },
        background: { type: "select", options: bgOptions, label: "Background" },
        maxWidth: { type: "select", options: [{ label: "Full", value: "100%" }, { label: "Boxed (1170px)", value: "1170px" }], label: "Width" },
      },
      defaultProps: { padding: "4rem 1.5rem", background: "#ffffff", maxWidth: "1170px" },
      render: ({ padding, background, maxWidth }) => (
        <section style={{ background, padding }}>
          <div style={{ maxWidth, margin: "0 auto" }}>
            <DropZone zone="section-inner" />
          </div>
        </section>
      ),
    },

    TwoColumns: {
      label: "2 Columns",
      fields: {
        ratio: { type: "select", options: [{ label: "50 / 50", value: "1fr 1fr" }, { label: "60 / 40", value: "1.2fr 0.8fr" }, { label: "40 / 60", value: "0.8fr 1.2fr" }], label: "Ratio" },
        gap: { type: "text", label: "Gap" },
        padding: { type: "select", options: paddingOptions },
        background: { type: "select", options: bgOptions },
      },
      defaultProps: { ratio: "1fr 1fr", gap: "2rem", padding: "4rem 1.5rem", background: "#ffffff" },
      render: ({ ratio, gap, padding, background }) => (
        <section style={{ background, padding }}>
          <div style={{ display: "grid", gridTemplateColumns: ratio, gap, maxWidth: 1170, margin: "0 auto" }}>
            <DropZone zone="col-left" />
            <DropZone zone="col-right" />
          </div>
        </section>
      ),
    },

    ThreeColumns: {
      label: "3 Columns",
      fields: {
        padding: { type: "select", options: paddingOptions },
        background: { type: "select", options: bgOptions },
      },
      defaultProps: { padding: "4rem 1.5rem", background: "#f4f7fb" },
      render: ({ padding, background }) => (
        <section style={{ background, padding }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", maxWidth: 1170, margin: "0 auto" }}>
            <DropZone zone="col-1" />
            <DropZone zone="col-2" />
            <DropZone zone="col-3" />
          </div>
        </section>
      ),
    },

    Heading: {
      label: "Heading",
      fields: {
        text: { type: "text", label: "Text" },
        level: { type: "select", options: [{ label: "H1", value: "h1" }, { label: "H2", value: "h2" }, { label: "H3", value: "h3" }], label: "Size" },
        align: { type: "radio", options: alignOptions },
        color: { type: "text", label: "Color (hex)" },
      },
      defaultProps: { text: "Heading", level: "h2", align: "left", color: "#0a1628" },
      render: ({ text, level: Tag, align, color }) => {
        const sizes = { h1: "2.5rem", h2: "2rem", h3: "1.35rem" };
        return <Tag style={{ textAlign: align, color, margin: "0 0 0.75rem", fontSize: sizes[Tag] || "2rem" }}>{text}</Tag>;
      },
    },

    Paragraph: {
      label: "Paragraph",
      fields: {
        text: { type: "textarea", label: "Text" },
        align: { type: "radio", options: alignOptions },
        size: { type: "select", options: [{ label: "Normal", value: "1rem" }, { label: "Large", value: "1.125rem" }], label: "Size" },
      },
      defaultProps: { text: "Your paragraph text goes here.", align: "left", size: "1rem" },
      render: ({ text, align, size }) => (
        <p style={{ textAlign: align, fontSize: size, lineHeight: 1.7, color: "#5a6b7d", margin: "0 0 1rem" }}>{text}</p>
      ),
    },

    Button: {
      label: "Button",
      fields: {
        label: { type: "text", label: "Label" },
        href: linkField,
        variant: { type: "select", options: [{ label: "Primary", value: "primary" }, { label: "Outline", value: "outline" }, { label: "Light", value: "light" }], label: "Style" },
        align: { type: "radio", options: alignOptions },
        fullWidth: { type: "radio", options: [{ label: "Auto", value: false }, { label: "Full width", value: true }] },
      },
      defaultProps: { label: "Click here", href: "/contact", variant: "primary", align: "left", fullWidth: false },
      render: ({ label, href, variant, align, fullWidth }) => (
        <div style={{ textAlign: align, margin: "0.5rem 0 1rem" }}>
          <a
            href={href}
            style={{
              ...btnVariants[variant],
              display: fullWidth ? "block" : "inline-block",
              textAlign: "center",
              padding: "0.85rem 1.6rem",
              borderRadius: 8,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {label}
          </a>
        </div>
      ),
    },

    ImageBlock: {
      label: "Image",
      fields: {
        src: { type: "text", label: "Image URL (/uploads/...)" },
        alt: { type: "text", label: "Alt text" },
        rounded: { type: "radio", options: [{ label: "Rounded", value: true }, { label: "Square", value: false }] },
        shadow: { type: "radio", options: [{ label: "Shadow", value: true }, { label: "Flat", value: false }] },
        height: { type: "text", label: "Height (e.g. 400px or auto)" },
      },
      defaultProps: {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=500&fit=crop",
        alt: "Image",
        rounded: true,
        shadow: true,
        height: "auto",
      },
      render: ({ src, alt, rounded, shadow, height }) => (
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: height === "auto" ? "auto" : height,
            objectFit: "cover",
            borderRadius: rounded ? 16 : 0,
            boxShadow: shadow ? "0 16px 40px rgba(0,60,100,0.12)" : "none",
            margin: "0.5rem 0 1rem",
            display: "block",
          }}
        />
      ),
    },

    VideoEmbed: {
      label: "Video (YouTube)",
      fields: {
        url: { type: "text", label: "YouTube URL" },
        aspect: { type: "select", options: [{ label: "16:9", value: "56.25%" }, { label: "4:3", value: "75%" }], label: "Aspect" },
      },
      defaultProps: { url: "https://www.youtube.com/embed/dQw4w9WgXcQ", aspect: "56.25%" },
      render: ({ url, aspect }) => (
        <div style={{ position: "relative", paddingBottom: aspect, height: 0, margin: "1rem 0", borderRadius: 12, overflow: "hidden" }}>
          <iframe src={url} title="Video" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} allowFullScreen />
        </div>
      ),
    },

    ListBlock: {
      label: "Bullet List",
      fields: {
        items: { type: "textarea", label: "Items (one per line)" },
      },
      defaultProps: { items: "First item\nSecond item\nThird item" },
      render: ({ items }) => (
        <ul style={{ lineHeight: 1.8, color: "#5a6b7d", paddingLeft: "1.25rem" }}>
          {items.split("\n").filter(Boolean).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ),
    },

    Quote: {
      label: "Quote",
      fields: {
        quote: { type: "textarea", label: "Quote" },
        author: { type: "text", label: "Author" },
      },
      defaultProps: { quote: "MaatriDev delivered beyond our expectations.", author: "Client name" },
      render: ({ quote, author }) => (
        <blockquote style={{ borderLeft: "4px solid #007cc3", paddingLeft: "1.25rem", margin: "1.5rem 0", fontStyle: "italic", color: "#0a1628" }}>
          <p style={{ margin: "0 0 0.5rem", fontSize: "1.15rem" }}>"{quote}"</p>
          <cite style={{ color: "#5a6b7d", fontStyle: "normal" }}>— {author}</cite>
        </blockquote>
      ),
    },

    FeatureGrid: {
      label: "Feature Grid (3 cards)",
      fields: {
        title: { type: "text", label: "Section title" },
        subtitle: { type: "textarea", label: "Subtitle" },
        card1Title: { type: "text" }, card1Text: { type: "textarea" },
        card2Title: { type: "text" }, card2Text: { type: "textarea" },
        card3Title: { type: "text" }, card3Text: { type: "textarea" },
      },
      defaultProps: {
        title: "Features",
        subtitle: "Highlight your core offerings",
        card1Title: "Feature 1", card1Text: "Description",
        card2Title: "Feature 2", card2Text: "Description",
        card3Title: "Feature 3", card3Text: "Description",
      },
      render: (props) => {
        const cards = [1, 2, 3].map((n) => ({ title: props[`card${n}Title`], text: props[`card${n}Text`] }));
        return (
          <section style={{ padding: "4rem 1.5rem", background: "#fff" }}>
            <div style={{ maxWidth: 1170, margin: "0 auto", textAlign: "center", marginBottom: "2rem" }}>
              <h2 style={{ margin: "0 0 0.5rem", color: "#0a1628" }}>{props.title}</h2>
              <p style={{ color: "#5a6b7d" }}>{props.subtitle}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", maxWidth: 1170, margin: "0 auto" }}>
              {cards.map((c, i) => (
                <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.5rem", transition: "box-shadow 0.2s" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: "linear-gradient(135deg,#007cc3,#00b8a9)", marginBottom: "1rem" }} />
                  <h3 style={{ margin: "0 0 0.5rem", color: "#0a1628" }}>{c.title}</h3>
                  <p style={{ margin: 0, color: "#5a6b7d", fontSize: "0.95rem" }}>{c.text}</p>
                </div>
              ))}
            </div>
          </section>
        );
      },
    },

    StatsBar: {
      label: "Stats Bar",
      fields: {
        stat1: { type: "text" }, label1: { type: "text" },
        stat2: { type: "text" }, label2: { type: "text" },
        stat3: { type: "text" }, label3: { type: "text" },
        stat4: { type: "text" }, label4: { type: "text" },
      },
      defaultProps: { stat1: "100+", label1: "Projects", stat2: "50+", label2: "Clients", stat3: "10+", label3: "Services", stat4: "24/7", label4: "Support" },
      render: (p) => (
        <section style={{ background: "#0a1628", color: "#fff", padding: "2.5rem 1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1.5rem", maxWidth: 1170, margin: "0 auto", textAlign: "center" }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#00b8a9" }}>{p[`stat${n}`]}</div>
                <div style={{ fontSize: "0.85rem", opacity: 0.85 }}>{p[`label${n}`]}</div>
              </div>
            ))}
          </div>
        </section>
      ),
    },

    ServicesRow: {
      label: "Services (8 items)",
      render: () => (
        <section style={{ padding: "4rem 1.5rem", maxWidth: 1170, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Our Services</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            {["Software & CRM", "AI & ML", "Cloud & ITeS", "Integration", "Web & E-commerce", "Creative & Marketing", "Blockchain & Analytics", "Events & Consultancy"].map((s) => (
              <div key={s} style={{ padding: "1rem 1.25rem", border: "1px solid #e2e8f0", borderRadius: 10, fontWeight: 600, color: "#007cc3" }}>
                {s}
              </div>
            ))}
          </div>
        </section>
      ),
    },

    TeamCards: {
      label: "Team / Founders",
      fields: {
        name1: { type: "text" }, role1: { type: "text" }, img1: { type: "text" },
        name2: { type: "text" }, role2: { type: "text" }, img2: { type: "text" },
      },
      defaultProps: {
        name1: "Akshansh Arnab", role1: "Co-Founder & Technology Lead",
        img1: "https://images.unsplash.com/photo-1507003211169?w=400&h=500&fit=crop&facepad=2",
        name2: "Swetav Savarn", role2: "Co-Founder & Strategy Lead",
        img2: "https://images.unsplash.com/photo-1506794778202?w=400&h=500&fit=crop&facepad=2",
      },
      render: (p) => (
        <section style={{ padding: "4rem 1.5rem", background: "#f4f7fb" }}>
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Leadership</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", maxWidth: 800, margin: "0 auto" }}>
            {[1, 2].map((n) => (
              <article key={n} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
                <img src={p[`img${n}`]} alt={p[`name${n}`]} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover" }} />
                <div style={{ padding: "1.25rem" }}>
                  <h3 style={{ margin: "0 0 0.25rem" }}>{p[`name${n}`]}</h3>
                  <p style={{ margin: 0, color: "#007cc3", fontWeight: 600, fontSize: "0.9rem" }}>{p[`role${n}`]}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ),
    },

    Testimonial: {
      label: "Testimonial",
      fields: {
        quote: { type: "textarea" },
        name: { type: "text" },
        company: { type: "text" },
        avatar: { type: "text", label: "Avatar URL" },
      },
      defaultProps: {
        quote: "MaatriDev is our go-to partner for technology and creative services.",
        name: "Client Name",
        company: "Enterprise Client",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      },
      render: ({ quote, name, company, avatar }) => (
        <section style={{ padding: "4rem 1.5rem", maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <img src={avatar} alt="" style={{ width: 72, height: 72, borderRadius: "50%", marginBottom: "1rem" }} />
          <p style={{ fontSize: "1.25rem", fontStyle: "italic", color: "#0a1628", marginBottom: "1rem" }}>"{quote}"</p>
          <strong>{name}</strong>
          <p style={{ color: "#5a6b7d", margin: 0 }}>{company}</p>
        </section>
      ),
    },

    CTAStrip: {
      label: "Call to Action",
      fields: {
        title: { type: "text" },
        text: { type: "textarea" },
        buttonLabel: { type: "text" },
        buttonLink: linkField,
      },
      defaultProps: { title: "Ready to start?", text: "Get in touch today.", buttonLabel: "Contact Us", buttonLink: "/contact" },
      render: ({ title, text, buttonLabel, buttonLink }) => (
        <section style={{ background: "linear-gradient(90deg, #007cc3, #00b8a9)", color: "#fff", padding: "3.5rem 1.5rem", textAlign: "center", margin: "2rem 0" }}>
          <h2 style={{ margin: "0 0 0.5rem" }}>{title}</h2>
          <p style={{ opacity: 0.95, marginBottom: "1.5rem" }}>{text}</p>
          <a href={buttonLink} style={{ ...btnVariants.light, padding: "0.85rem 1.6rem", borderRadius: 8, fontWeight: 600, textDecoration: "none" }}>
            {buttonLabel}
          </a>
        </section>
      ),
    },

    PricingCards: {
      label: "Pricing / Engagement",
      render: () => (
        <section style={{ padding: "4rem 1.5rem", maxWidth: 1170, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Engagement Models</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {[
              { name: "Project Delivery", price: "Scoped", desc: "Fixed-scope engagements" },
              { name: "Managed Services", price: "Monthly", desc: "Ongoing squad & support", featured: true },
              { name: "Enterprise", price: "Custom", desc: "Dedicated partnership" },
            ].map((plan) => (
              <div key={plan.name} style={{ border: plan.featured ? "2px solid #007cc3" : "1px solid #e2e8f0", borderRadius: 12, padding: "1.5rem", textAlign: "center", background: "#fff" }}>
                <h3>{plan.name}</h3>
                <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "#007cc3" }}>{plan.price}</p>
                <p style={{ color: "#5a6b7d" }}>{plan.desc}</p>
              </div>
            ))}
          </div>
        </section>
      ),
    },

    LogoCloud: {
      label: "Logo Cloud",
      fields: { title: { type: "text", label: "Title (optional)" } },
      defaultProps: { title: "Trusted by teams worldwide" },
      render: ({ title }) => (
        <section style={{ padding: "2.5rem 1.5rem", textAlign: "center", background: "#fff" }}>
          {title && <p style={{ color: "#5a6b7d", marginBottom: "1.5rem", fontWeight: 600 }}>{title}</p>}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem", opacity: 0.5 }}>
            {["React", "Angular", "AWS", "Azure", "Node", "Python"].map((l) => (
              <span key={l} style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0a1628" }}>{l}</span>
            ))}
          </div>
        </section>
      ),
    },

    Spacer: {
      label: "Spacer",
      fields: { height: { type: "select", options: [{ label: "Small", value: 32 }, { label: "Medium", value: 64 }, { label: "Large", value: 96 }], label: "Height" } },
      defaultProps: { height: 64 },
      render: ({ height }) => <div style={{ height }} aria-hidden />,
    },

    Divider: {
      label: "Divider",
      fields: { style: { type: "select", options: [{ label: "Line", value: "line" }, { label: "Dots", value: "dots" }], label: "Style" } },
      defaultProps: { style: "line" },
      render: ({ style }) =>
        style === "dots" ? (
          <p style={{ textAlign: "center", letterSpacing: 8, color: "#cbd5e1", margin: "1.5rem 0" }}>• • •</p>
        ) : (
          <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "2rem auto", maxWidth: 1170 }} />
        ),
    },
  },
};
