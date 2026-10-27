# Phase 6 — Notice PDF & About image fixes

- About image at left, text at right; two equal desktop columns.
- About image sourced from Admin → School Sections → `আমাদের বিদ্যালয়` (key=about) image upload, fallback `/united-campus.png`.
- Dedicated Admin `নোটিশ বোর্ড — PDF Upload` section saves records in the same `SchoolDocument` collection used by home marquee, notice list, `/notices` and PDF viewer.
- Previous legacy notices in the old `notices` collection are preserved in the database but not migrated to PDFs automatically; re-upload their PDFs here if needed.
- Proxy defaults to http://127.0.0.1:5001 to match Mac backend. Override using `API_PROXY_TARGET` if different.

Copy files into your existing `ugv` directory. Back up project first. Keep `server/.env` and `server/uploads` intact.

Check `http://localhost:5173/united-campus.png` to test fallback asset, and `http://localhost:5173/uploads/<file>` to test uploaded image. If an uploaded path fails, confirm the physical file is in `server/uploads`.
