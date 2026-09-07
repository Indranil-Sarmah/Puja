# BCPL Viswakarma Puja 2026

Static frontend website for BCPL Viswakarma Puja 2026 — mobile-friendly, QR-ready.

## Quick Start

Open `index.html` in a browser, or serve locally:

```bash
npx serve .
```

## Add Your Photos

1. Put idol progress photos in `assets/images/gallery/`
2. Edit the `galleryImages` array in `assets/js/main.js` — update `src`, `caption`, `day`, and `badge`
3. Use `.jpg`, `.jpeg`, `.png`, or `.webp` formats

## Customize Content

Edit `assets/js/main.js`:

- **punchLines** — celebration quotes shown in the grid
- **featuredPunchLines** — rotating carousel quotes
- **galleryImages** — idol making progress photos
- **schedule** — puja event dates and descriptions

## Deploy (Free Hosting)

### Netlify (easiest)
1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag and drop this entire folder onto the deploy area
3. Your site goes live instantly with a URL like `https://your-site.netlify.app`

### GitHub Pages
1. Push this folder to a GitHub repository
2. Go to **Settings ? Pages ? Source: Deploy from branch ? main / root**
3. Site will be at `https://yourusername.github.io/repo-name`

### Vercel
1. Go to [vercel.com](https://vercel.com) and import the project
2. No build step needed — deploy as static site

## QR Code

After deploying, generate a QR code pointing to your live URL using any free QR generator (e.g. [qr-code-generator.com](https://www.qr-code-generator.com)). Print and place at the pandal entrance.
