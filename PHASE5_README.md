# Phase 5 — Homepage UI correction

## What changed
- Removed duplicate old About, Notice, admission and demo sections from the public homepage.
- About and hero sections use an equal 50/50 layout at desktop sizes and larger typography.
- About section uses the supplied full campus image (public/united-campus.png) with object-fit: cover.
- News marquee sits directly above the 5 latest PDF notices, then the “সকল নোটিশ” link.
- Dynamic notice PDFs use the existing Admin → Academic PDF / Notice tab: choose document type “নোটিশ PDF”, enter title + description, upload PDF, save.
- Principal's message, campus gallery, and gallery background remain controlled from the existing admin tabs.
- Uses Noto Sans Bengali with Hind Siliguri fallback.
- No admin button in navbar.

## Install on existing project
1. BACK UP existing Desktop/ugv.
2. Copy files inside ugv_school_phase3 into Desktop/ugv.
3. KEEP your current server/.env and server/uploads.
4. Run `npm install` then `npm run dev` in root and in server, as before.
5. Go to /admin → একাডেমিক PDF / নোটিশ → নোটিশ PDF. Upload notice PDFs.

The homepage has not been verified end-to-end against your local MongoDB. The image supplied by you is used as a design asset, not asserted as a verified documentary photograph.
