# United Madhyamik Bidyaloy — Phase 2 (MERN)

এই ZIP আগের Phase 1-এর সব frontend ফাইলসহ আপডেট করা। পুরোনো `ugv` ফোল্ডারে ZIP-এর **ভেতরের** ফাইলগুলো copy করে replace করতে হবে। `node_modules` বা `.env` overwrite করবেন না।

## Step 1 — Frontend
VS Code terminal in `ugv`:
```powershell
npm install
npm run dev
```
Website: http://localhost:5173

## Step 2 — MongoDB Atlas
Atlas-এ একটি cluster ও database user তৈরি করুন। IP access শুধু আপনার current IP দিন (production-এ 0.0.0.0/0 ব্যবহার করবেন না)। Connection string copy করুন।

## Step 3 — Backend
Open **second terminal** in `ugv`:
```powershell
cd server
npm install
Copy-Item .env.example .env
```
`server/.env` file খুলুন: `MONGO_URI` নিজের Atlas URI দিয়ে replace করুন; `JWT_SECRET` একটি দীর্ঘ random value দিন; `CLIENT_ORIGIN=http://localhost:5173` রাখুন। Password-এ reserved URL characters থাকলে URI encoding প্রয়োজন।

## Step 4 — প্রথম admin account
`server/.env`-এ সাময়িকভাবে যোগ করুন:
```
ADMIN_NAME=School Administrator
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=YOUR_UNIQUE_PASSWORD_12_PLUS_CHARS
```
Then, while still in `server`:
```powershell
npm run create-admin
npm run dev
```
Admin তৈরি হয়ে গেলে `server/.env` থেকে `ADMIN_PASSWORD` এবং `ADMIN_EMAIL` লাইন মুছে দিন। `.env` কখনো GitHub-এ push করবেন না।

## Step 5 — Test
- http://localhost:5173/admin — login
- নতুন Notice লিখুন, Published checkbox mark করুন এবং Save করুন
- http://localhost:5173 — homepage Notice Board-এ Notice দেখাবে
- API health: http://localhost:5000/api/health

## Phase 2 delivered
- Bangla dynamic public notice board (published only)
- Secure admin sign-in, HttpOnly cookie
- Admin Notice Create / Read / Update / Delete / Publish / Draft
- Express, MongoDB Atlas & Mongoose

## Not implemented yet
Teachers, gallery, admissions, file uploads, rich-text editor, roles beyond admin, results and production deployment. এগুলো পরের Phase-এর কাজ। Production-এ deployment করার আগে HTTPS, CSRF defense, access control review, audit logging, backups and staging QA প্রয়োজন।
