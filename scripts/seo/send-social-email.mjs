import nodemailer from "nodemailer";
import { initSeoEnv, getSiteUrl } from "./config.mjs";
import { seoLog } from "./logger.mjs";
import { buildSocialDraftContent } from "./social-draft.mjs";

function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Fetch hero image for inline email attachment (LinkedIn upload reference). */
async function fetchHeroAttachment(imageUrl) {
  const url = String(imageUrl || "").trim();
  if (!url.startsWith("http")) return null;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 500 || buffer.length > 8 * 1024 * 1024) return null;

    return {
      filename: `linkedin-hero.${ext}`,
      content: buffer,
      contentType,
      cid: "blog-hero-image",
    };
  } catch {
    return null;
  }
}

function buildImageHtml(content, attachment) {
  const url = content.imageUrl;
  if (!url) {
    return `<p style="color:#888;font-size:13px;">No hero image on this post.</p>`;
  }

  const imgSrc = attachment ? "cid:blog-hero-image" : escapeHtml(url);
  const alt = escapeHtml(content.imageAlt || content.title);

  return `
  <div style="margin:16px 0;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
    <p style="margin:0 0 10px;font-weight:600;">LinkedIn image — preview &amp; URL</p>
    <img src="${imgSrc}" alt="${alt}" style="max-width:100%;width:560px;height:auto;border-radius:6px;display:block;margin-bottom:12px;" />
    <p style="margin:0 0 6px;font-size:13px;color:#555;">Right-click image → Save, or copy URL for LinkedIn media upload:</p>
    <p style="margin:0;word-break:break-all;"><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>
  </div>`;
}

/**
 * Email today's LinkedIn copy via Gmail SMTP (App Password).
 * Includes hero image preview + image URL + copy-paste text.
 */
export async function sendSocialDraftEmail(post) {
  initSeoEnv();

  const to = (process.env.SEO_NOTIFY_EMAIL || "").trim();
  const user = (process.env.SMTP_USER || "").trim();
  const pass = (process.env.SMTP_PASS || "").trim();

  if (!to || !user || !pass) {
    seoLog("Email skipped: set SMTP_USER, SMTP_PASS, SEO_NOTIFY_EMAIL in .env");
    return { skipped: true, reason: "missing_config" };
  }

  const content = buildSocialDraftContent(post);
  if (!content) {
    return { skipped: true, reason: "no_post" };
  }

  const attachment = await fetchHeroAttachment(content.imageUrl);

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const fromName = process.env.SMTP_FROM_NAME || "MaatriDev SEO";

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const subject = `[MaatriDev] LinkedIn post — ${content.title}`;
  const siteUrl = getSiteUrl();
  const date = new Date().toISOString().slice(0, 10);

  const imageBlock = buildImageHtml(content, attachment);
  const imageUrlText = content.imageUrl
    ? `\n\n--- LinkedIn hero image ---\n${content.imageUrl}\n(Save from email preview or open URL in browser)`
    : "";

  const html = `<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;max-width:640px;">
  <h2 style="margin:0 0 8px;">Today's LinkedIn post (${date})</h2>
  <p style="color:#555;">1) Add image to LinkedIn post · 2) Copy text below · 3) Paste on company page</p>
  ${imageBlock}
  <h3 style="font-size:15px;margin:24px 0 8px;">Copy this text</h3>
  <pre style="background:#f4f6f8;padding:16px;border-radius:8px;white-space:pre-wrap;font-size:14px;">${escapeHtml(content.linkedin)}</pre>
  <p><strong>Blog URL:</strong> <a href="${content.url}">${content.url}</a></p>
  <hr style="border:none;border-top:1px solid #ddd;margin:24px 0;" />
  <h3 style="font-size:14px;color:#666;">X (Twitter) — optional</h3>
  <pre style="background:#f9f9f9;padding:12px;border-radius:6px;white-space:pre-wrap;font-size:13px;">${escapeHtml(content.twitter)}</pre>
  <p style="font-size:12px;color:#888;">MaatriDev SEO cron · ${siteUrl}</p>
</body>
</html>`;

  const mailAttachments = attachment
    ? [{ filename: attachment.filename, content: attachment.content, cid: attachment.cid }]
    : [];

  const info = await transporter.sendMail({
    from: `"${fromName}" <${user}>`,
    to,
    subject,
    text: `${content.linkedin}${imageUrlText}`,
    html,
    attachments: mailAttachments,
  });

  seoLog(
    `Social email sent → ${to} (${info.messageId || "ok"}${attachment ? ", with image" : ", URL only"})`,
  );
  return { ok: true, to, messageId: info.messageId, hasImageAttachment: Boolean(attachment) };
}
