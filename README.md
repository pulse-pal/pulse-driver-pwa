# PulsePal Driver PWA

A Progressive Web App for PulsePal, a Kenyan vehicle telematics platform.
Drivers monitor their vehicle in real time, get plain-English fault
explanations, plan fuel-aware routes, book mechanics, and manage their
subscription — all from a device installed in their car (Teltonika
FMB125, streaming over 4G).

## Status

Frontend demo build, running entirely on dummy data (`js/dummy-data.js`).
No backend integration yet — see `pulse_database_prompt.md` for the
intended PostgreSQL schema this will eventually connect to.

## Stack

- Vanilla HTML/CSS/JS, no build step
- Single-page app: `js/router.js` fetches page fragments (`pages/*.frag`)
  into `#content` and re-executes their inline scripts
- Leaflet.js for maps, OSRM public API for routing
- Service worker (`sw.js`) for offline caching and PWA installability

## Running locally

1. Open this folder in VS Code
2. Install the "Live Server" extension if you don't have it
3. Right-click `index.html` → "Open with Live Server"
4. The app loads at `http://127.0.0.1:5500`

**Important:** page fragments use a `.frag` extension, not `.html`.
Live Server injects a reload script into `.html` responses that
corrupts fetched fragments — this is deliberate, not a typo.

## Project structure

## Design system

- Light theme by default, with a working Dark theme toggle
  (Settings → Theme). Semantic colors (accent orange, success,
  warning, danger) stay identical across both themes — only
  surfaces and text invert.
- Dark mode uses CSS variables (`--color-bg-primary`,
  `--color-text-primary`, etc. redefined under
  `:root[data-theme="dark"]`) rather than a separate stylesheet.
- Brand accent: `#FF7A1A`. Font: Inter.

## Known gaps

- Speed Alert and Curfew/Geofence toggles save state but aren't yet
  wired into live map behavior
- App Lock stores a PIN but doesn't yet intercept app launch
- Several placeholder values need real data before launch — see the
  project's build notes for the full list (WhatsApp number, Terms/
  Privacy URLs, FAQ content)

## Credits

Built by Mwangi and Adow, PulsePal.