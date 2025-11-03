# Tech Internship - Static Site

This is a pure static HTML version of the Tech Internship website using Tailwind CSS via CDN.

## Structure

- `index.html` - Main HTML file with all content
- `*.jpg`, `*.png`, `*.svg` - Image assets
- No build process required!

## Features

- ✅ Pure static HTML (no React/Next.js dependencies)
- ✅ Tailwind CSS via CDN
- ✅ Fully responsive design
- ✅ All images and assets included
- ✅ No build step required - just open `index.html` in a browser

## Usage

Simply open `index.html` in your browser, or serve it with any static file server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Deployment

This static site can be deployed to any static hosting service:
- GitHub Pages
- Netlify
- Vercel (static export)
- AWS S3 + CloudFront
- Any traditional web server

Simply upload the contents of the `final-site` folder.

