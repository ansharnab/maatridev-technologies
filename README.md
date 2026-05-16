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
- **API:** http://localhost:3001
- **Admin:** http://localhost:5173/admin (password: `maatridev2026` or set `ADMIN_PASSWORD`)

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
npm run build
ADMIN_PASSWORD=your-secure-password npm start
```

Serve `dist` behind nginx or similar; proxy `/api` and `/uploads` to the Node server.

## Note on Images

Placeholder images use Unsplash URLs. Replace with your own assets via the Media Library.
