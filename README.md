# MaatriDev Technologies — Corporate Website

Modern IT & digital services website inspired by Webteck (Envato) and Infosys, with a built-in **Website Builder** admin panel.

## Founders

- **Akshansh Arnab** — Co-Founder & Technology Lead
- **Swetav Savarn** — Co-Founder & Strategy Lead

## Features

- 4 home page variants (Web Agency, Startup, Digital, IT Solutions)
- All template pages: About, Services, Team, Projects, Blog, Shop, Cart, FAQ, Pricing, Contact, etc.
- **Ajax contact form** (no page reload)
- **Admin CMS** at `/admin` — drag-and-drop page builder, media upload, site settings, contact inbox
- React + Vite + Express API
- Bootstrap-style 1170px container, Outfit + DM Sans + EB Garamond fonts
- Font Awesome icons

## Quick Start

```bash
cd website
npm install
npm run dev
```

- **Website:** http://localhost:5173
- **API:** http://localhost:3001 (or `VITE_DEV_API_URL` in `.env`)
- **Admin:** http://localhost:5173/admin — password from `ADMIN_PASSWORD` in `.env`

Copy `.env.example` to `.env` before first run. Deploy keys, live URLs, and SSH settings also live in `.env`.

## Website Builder (WYSIWYG)

1. Open `/admin` and sign in (password in `.env`).
2. **Visual Editor** — full drag-and-drop WYSIWYG (GrapesJS):
   - Click text on the canvas to edit inline
   - Drag blocks from the left panel (sections, text, images, buttons)
   - Style elements with the right panel (colors, spacing, typography)
   - Switch Desktop / Tablet / Mobile preview
   - **Save & publish** — replaces the live page (Home, About, Services, Contact)
   - Uncheck **Publish on live site** to revert to the default React page
3. **Media** — upload images; they appear in the builder **Assets** panel
4. **Settings** — site name, tagline, contact details
5. **Messages** — contact form inbox

## Production

```bash
cp .env.example .env   # set ADMIN_PASSWORD, LIVE_URL, DEPLOY_* etc.
npm run build
npm start
```

**EC2 deploy (Mac/Linux):** `./deploy/ec2-push.sh` (reads `DEPLOY_SSH_*` from `.env`)

Serve `dist` behind nginx; proxy `/api` and `/uploads` to the Node server (see `deploy/nginx-maatridev.conf`).

## Note on Images

Placeholder images use Unsplash URLs. Replace with your own assets via the Media Library.

## GitHub repository

**Public repo:** [github.com/ansharnab/maatridev-technologies](https://github.com/ansharnab/maatridev-technologies)

A **public** repository lets anyone **clone and read** the code. GitHub does **not** allow random users to **push** to your repo — that is intentional. To let someone push directly, add them as a **collaborator** (Write access). Everyone else should **fork** and open a **pull request**.

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for the full workflow.

**Owner — grant push access:**

```powershell
powershell -File scripts\add-collaborator.ps1 -Username their-github-username
```

**Install GitHub CLI + check branch protection:** double-click `INSTALL-GH-AND-FIX-ACCESS.bat`
