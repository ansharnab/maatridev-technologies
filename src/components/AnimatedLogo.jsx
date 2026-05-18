import { useId, useState } from "react";
import { hasCustomLogo, isVideoUrl } from "../utils/mediaType";
import "./AnimatedLogo.css";

const STYLES = {
  gradient: "animated-logo--gradient",
  pulse: "animated-logo--pulse",
  orbit: "animated-logo--orbit",
  glow: "animated-logo--glow",
  none: "animated-logo--static",
};

/**
 * MaatriDev animated mark — editable via Site Content (letter, colors, animation).
 * Uses uploaded image or video (MP4/WebM) when logoImage is set.
 */
export default function AnimatedLogo({
  letter = "M",
  animation = "gradient",
  colorPrimary = "#007cc3",
  colorAccent = "#00b8a9",
  imageUrl = "",
  alt = "MaatriDev",
  className = "",
  size = "md",
  fullBrand = false,
  scale = 1,
  clipWidth = 280,
  onMediaError,
}) {
  const gradId = useId().replace(/:/g, "");
  const styleClass = STYLES[animation] || STYLES.gradient;
  const isFullBrand = fullBrand || hasCustomLogo(imageUrl);
  const [mediaError, setMediaError] = useState(false);
  const safeScale = Math.min(2, Math.max(0.8, Number(scale) || 1));
  const safeClip = Math.min(400, Math.max(180, Number(clipWidth) || 280));

  if (imageUrl && !mediaError) {
    const isVideo = isVideoUrl(imageUrl);
    return (
      <span
        className={[
          "animated-logo",
          "animated-logo--image",
          isVideo ? "animated-logo--video" : "",
          isFullBrand ? "animated-logo--full-brand" : `animated-logo--${size}`,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          "--logo-c1": colorPrimary,
          "--logo-c2": colorAccent,
          "--logo-scale": isFullBrand ? safeScale : 1,
          "--logo-clip-width": isFullBrand ? `${safeClip}px` : undefined,
        }}
      >
        {isVideo ? (
          <video
            src={imageUrl}
            className="animated-logo__video"
            autoPlay
            muted
            loop
            playsInline
            aria-label={alt}
            onError={() => {
              setMediaError(true);
              onMediaError?.();
            }}
          />
        ) : (
          <img
            src={imageUrl}
            alt={alt}
            className="animated-logo__img"
            onError={() => {
              setMediaError(true);
              onMediaError?.();
            }}
            decoding="async"
          />
        )}
      </span>
    );
  }

  const displayLetter = (letter || "M").slice(0, 2).toUpperCase();

  return (
    <span
      className={`animated-logo ${styleClass} animated-logo--${size} ${className}`.trim()}
      style={{ "--logo-c1": colorPrimary, "--logo-c2": colorAccent }}
      aria-hidden={!alt}
    >
      <svg className="animated-logo__svg" viewBox="0 0 48 48" role="img" aria-label={alt}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--logo-c1)" />
            <stop offset="100%" stopColor="var(--logo-c2)" />
          </linearGradient>
        </defs>
        <rect className="animated-logo__bg" width="48" height="48" rx="12" fill={`url(#${gradId})`} />
        <circle className="animated-logo__orbit-ring" cx="24" cy="24" r="22" fill="none" />
        <text
          className="animated-logo__letter"
          x="24"
          y="24"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#fff"
        >
          {displayLetter}
        </text>
      </svg>
    </span>
  );
}
