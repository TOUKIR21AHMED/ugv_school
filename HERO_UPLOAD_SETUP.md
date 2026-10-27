# Phase 3 — Admin-managed Hero Image

This is the previous Phase 2 project with an added image uploader.

1. Make a backup of your Desktop/ugv first. Copy the CONTENTS of `ugv_school_phase3` into `ugv` and replace matching files. Preserve your real `server/.env` file (not included in this ZIP).
2. CMD terminal in `ugv\server`: `npm install` then `npm run dev`.
3. Separate terminal in `ugv`: `npm install` then `npm run dev`.
4. Visit `http://localhost:5173/admin`, log in using your existing admin account, choose a JPG, PNG, or WebP image and click the upload button.
5. Visit `http://localhost:5173` and refresh. The hero will show the uploaded file. If there is no custom file, the previous demo image is shown.

Implementation: `server/src/models/SiteSettings.js` stores `heroImage` URL in MongoDB. Express + Multer save the file in `server/uploads`. Public `/api/site-settings` reads the URL; protected `POST /api/admin/hero-image` accepts multipart/form-data and updates the record. Frontend reads the setting and applies it as `backgroundImage`.

IMPORTANT: Files in server/uploads are saved to local disk. For reliable production deployment on Vercel/Render or multiple servers, use persistent cloud object storage (Cloudinary/S3) instead; do not rely on ephemeral disks. Never publish your .env secrets.
