# Phase 4 — United Madhyamik Bidyalaya: website + admin modules

This update builds on your earlier Phase 3 files. It introduces public routes for class documents, board/internal results, staff/officers, PDF viewer, admissions, notices, contact and gallery, plus admin forms for documents, staff, content, photos and admission notifications.

## Update your Windows desktop project

1. Make a copy of `C:\Users\Toukir Ahmed\Desktop\ugv` before replacing files.
2. Copy all files **inside** this extracted folder to the existing `ugv` project and replace matching files. Preserve your actual `server/.env` and anything stored in `server/uploads`.
3. From CMD terminal: `cd "C:\Users\Toukir Ahmed\Desktop\ugv\server"` then `npm install` and `npm run dev`.
4. From a second CMD terminal: `cd "C:\Users\Toukir Ahmed\Desktop\ugv"` then `npm install` and `npm run dev`.
5. Website: http://localhost:5173; protected admin: http://localhost:5173/admin (intentionally not linked on the public navbar).

## Admin data entry recipes

* Syllabus example: Academic PDF / Notice > Type Syllabus > Grade 9 > Group Science > Term Half > PDF upload > Save. Public: `/documents/syllabus` > 9 > Science > Half.
* Exam routine: type Exam Routine + grade/group as needed; term is optional. Public: `/documents/routines` > grade/group > Exam Routine.
* Class routine: type Class Routine + grade/group. Public: `/documents/routines` > grade/group > Class Routine.
* Internal result: type Internal Result + grade/group + Half/Final.
* Board result: type Board Result + board JSC or SSC; use group for SSC.
* Offline admission form: type Admission Form + PDF. Public `/documents/admission-form`.
* PDF Notice: type Notice + title and PDF; public `/notices`; notices are separate from the earlier text-only Notice Manager.
* Teachers/Officers: staff tab > choose type > name/designation/subject/phone + photo.
* Headteacher: Content tab > Headteacher > title as name > message in text > photo.
* About: Content tab > About > description.
* Gallery Background: Content tab > Gallery Background > upload school background image.
* Photos: Gallery tab > caption + image.
* Admissions: visitors submit at `/admission/apply`; admin Admissions tab lists applications, unread counter and status. Counter refreshes every 30 seconds.

## Important release readiness / limitations

This is an implementation draft for local development, **not production approved**. At minimum before collecting real student data: add server-side admission submission rate limiting/CAPTCHA, retention/deletion flows, purpose-specific privacy notice and consent, access logs, upload cleanup, strict admission-photo access controls (currently public static uploads), transport-layer protection, verify official contact/map location, and perform security and accessibility testing. Admission fields are generic; validate them against the school's approved paper form. The government 5-school choice requirement is deliberately not part of this school's own application.

The original home landing page has legacy demonstration sections alongside the new dynamic sections; these can be refined after the page layout review. Real PDFs/photos must be uploaded from admin before the pages display content. The earlier hero upload and notice text management remain.
