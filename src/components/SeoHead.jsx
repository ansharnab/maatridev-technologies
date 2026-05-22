import { Helmet } from "react-helmet-async";

/**
 * SPA head tags — updates on every route change (critical for Google/social crawlers that execute JS).
 */
export default function SeoHead({
  title,
  description = "",
  canonical = "",
  ogImage = "",
  noindex = false,
  keywords = "",
  twitterCard = "summary_large_image",
  jsonLd = null,
}) {
  const robots = noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large";

  return (
    <Helmet>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta name="robots" content={robots} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      {description ? <meta property="og:description" content={description} /> : null}
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      <meta property="og:site_name" content="MaatriDev Technologies" />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}

      {jsonLd?.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
