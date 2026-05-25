# MaatriDev SEO Growth Engine

Autonomous, white-hat SEO automation for [maatridev.com](https://maatridev.com).

## Honest expectations

- **Page 1 in 3 months** is possible for *some* long-tail keywords with consistent content + technical SEO — not guaranteed for competitive terms like "software company India."
- **Backlinks cannot be fully automated** without risk. This repo generates *outreach tasks*, not spam submissions.
- **Rankings require Google Search Console** verification (done) + time + quality content.

## What runs automatically

| Task | When | Command / cron |
|------|------|----------------|
| **Unified daily** (blog + SEO + publish) | 6:00 | `install-daily-automation.sh` |
| Related posts + **retroactive links** | On publish | Old posts link → new post |
| **Bing/Google/Yandex** sitemap ping | Daily | `ping-discovery.mjs` |
| **RSS PubSubHubbub** ping | Daily | feed.xml |
| **LinkedIn/X draft** file | Each new post | `social-drafts/{slug}.md` |
| PageSpeed / CWV audit | Tuesdays | `GOOGLE_PSI_API_KEY` |
| Competitor sitemap watch | Thursdays | `competitor-watch.mjs` |
| Sitemap + IndexNow | After each post | `run-after-publish.mjs` |
| Health audit | Daily | `seo-daily.mjs` |
| Keyword expansion | Mondays | OpenAI |
| Backlink tasks | Wednesdays | `backlink-report.mjs` |
| Broken link scan | Saturdays | `broken-links.mjs` |
| Weekly report | Sundays | `weekly-report.mjs` → `server/data/seo/reports/` |

## Server setup (one-time)

```bash
sudo dnf install -y cronie && sudo systemctl enable --now crond

# In /home/ec2-user/maatridev-technologies/.env
OPENAI_API_KEY=sk-...
UNSPLASH_ACCESS_KEY=...
INDEXNOW_KEY=$(openssl rand -hex 16)
SEO_PUBLISH_WEB_ROOT=/var/www/maatridev
VITE_GA_MEASUREMENT_ID=G-XXXXXXXX   # then npm run build on server

bash deploy/setup-publish-sudo.sh  # once — rsync dist without password
bash deploy/install-daily-automation.sh   # 6:00 blog + SEO + publish

# After deploy, reload nginx (sitemap.xml + feed.xml proxy to API)
sudo nginx -t && sudo systemctl reload nginx
```

## Local commands

```bash
npm run seo:audit      # Health score → server/data/seo/health-latest.json
npm run seo:sitemap    # Regenerate public/sitemap.xml
npm run seo:daily      # Full daily pipeline (no new blog)
npm run seo:daily:full # Blog + SEO pipeline
npm run blog:generate  # Blog + sitemap + IndexNow
```

## Reports (on server, not overwritten by deploy)

- `server/data/seo/health-latest.json`
- `server/data/seo/keywords.json`
- `server/data/seo/backlinks-latest.json`
- `server/data/seo/logs/seo-YYYY-MM-DD.log`

## 90-day focus (priority)

1. **Quick wins:** long-tail blog topics (RAG, K8s cost, CRM India) — automated daily.
2. **Technical:** fresh sitemap, IndexNow, FAQ schema, Core Web Vitals (monitor GSC).
3. **E-E-A-T:** real case studies on `/projects`, author names on blog, About page.
4. **Off-page:** 2–3 manual actions/week from `backlinks-latest.json` (Clutch, GBP, Dev.to canonical cross-posts).
5. **Track:** GSC → Performance → Queries; add notes to `keywords.json` → `rankingNotes`.

## What you must do manually

- Submit sitemap in [Google Search Console](https://search.google.com/search-console) (once).
- Review GSC Coverage / Core Web Vitals weekly.
- Execute backlink outreach (no auto-submit).
- Add `VITE_GA_MEASUREMENT_ID` and rebuild for analytics.
