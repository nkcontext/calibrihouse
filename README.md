# calibrihouse

A Zillow-style listing page for **12309 Calibri Ln, Austin, TX 78753**, hosted on GitHub Pages.

**Live:** https://nkcontext.github.io/calibrihouse/

## Stack

Vanilla HTML / CSS / JS. No build step. Leaflet (CDN) for the map.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Project layout

```
index.html             listing page markup
styles.css             Zillow-inspired styling
app.js                 gallery lightbox, contact modal, Leaflet map
images/full/           1600px-wide JPEGs (01.jpg … 32.jpg)
images/thumb/          480px-wide thumbnails for the gallery grid
scripts/optimize_photos.sh   re-runnable photo pipeline (sips)
```

## Photos

Source photos live in a local `Zillow Photos Post on FB/` folder
(gitignored). To regenerate the optimized images:

```bash
./scripts/optimize_photos.sh
```

This uses macOS `sips` to produce 1600px (~78% quality) full-size and
480px thumbnails, named `01.jpg` … `32.jpg`.

## Deploy

Pushing to `main` automatically publishes via GitHub Pages.

```bash
git add .
git commit -m "update site"
git push
```
