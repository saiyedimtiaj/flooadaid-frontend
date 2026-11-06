# FloodAid BD — পূর্ণ ধাপে ধাপে টেস্টিং গাইড (বাংলা)

> **সর্বশেষ code review:** ৬ নভেম্বর ২০২৬  
> **Frontend:** `feature/ui-overhaul-and-uploads` — `a772bbd`  
> **Backend:** `feature/ui-overhaul-and-uploads` — `10937ef`  
> **Frontend URL:** `http://localhost:3000`  
> **Backend API:** `http://localhost:4000/api`  
> **Swagger:** `http://localhost:4000/api/docs`

এই নথি FloodAid BD-এর বর্তমান frontend, backend controller/service, database schema, seed data, role permission, upload flow এবং automated checks দেখে তৈরি করা হয়েছে। এটি developer, QA tester এবং presentation/demo—তিন ক্ষেত্রেই ব্যবহার করা যাবে।

## চিহ্নের অর্থ

| চিহ্ন | অর্থ |
|---|---|
| ✅ | প্রত্যাশিত ফলাফল |
| ❌ | প্রত্যাশিত ফল না এলে defect |
| 🔁 | অন্য browser/account-এ গিয়ে ফল যাচাই করতে হবে |
| ⚠️ | test data বা environment পরিবর্তন করবে |
| 🤖 | automatedভাবে যাচাই করা হয়েছে |
| 👤 | browser-এ manual test করতে হবে |

---

## ১. এই গাইডে যে featureগুলো cover করা হয়েছে

- Public home, live district map এবং public statistics
- বাংলা/English ভাষা পরিবর্তন ও language persistence
- Sign-up, email OTP, resend OTP, login, logout, forgot/reset password
- User profile, home district এবং password change
- Public flood alerts, filter, search, map এবং nearby shelter link
- Admin alert create, edit, delete, expiry এবং district notification
- Public shelter list/map, facility/capacity filter, nearest sorting ও directions
- Admin shelter create, edit, occupancy, close এবং reopen
- Guest এবং logged-in SOS, ছবি upload, priority, nearby help ও tracker
- SOS privacy, নিজের SOS cancel, admin assignment এবং volunteer rescue workflow
- Admin/volunteer Manual SOS
- Volunteer registration, verification, availability এবং assignment eligibility
- Relief inventory, volunteer assignment, delivery, cancellation ও stock restoration
- Relief distribution log এবং evidence photo
- Shelter supply request, partial approval, rejection এবং fulfilment
- Missing/found person report, image, search, masked contact ও reunited status
- Public feedback এবং admin review workflow
- Personal notification, realtime Pusher, polling fallback, read/read-all
- Admin dashboard, analytics, CSV ও PDF export
- Role-based access control, public/private data এবং rate-limit checks
- Responsive, keyboard, geolocation denial, upload failure এবং error-state checks

---

## ২. বর্তমান verification status

### ২.১ এই review-এ যা চালিয়ে দেখা হয়েছে

| পরীক্ষা | ফলাফল |
|---|---|
| Backend unit tests | 🤖 **৫ suite, ১৯/১৯ test pass** |
| Backend ESLint | 🤖 Pass |
| Backend production build | 🤖 Pass |
| Frontend ESLint | 🤖 Pass |
| Frontend production build | 🤖 Pass; মোট **৪৬টি static route** generate হয়েছে |
| Live frontend home | 🤖 HTTP `200` |
| API health | 🤖 HTTP `200`, payload status `ok` |
| Public summary, alerts, shelters | 🤖 HTTP `200` |
| Anonymous notifications access | 🤖 HTTP `401` |
| Admin login, profile, reports, SOS, users | 🤖 HTTP `200` |
| CSV ও PDF export | 🤖 যথাক্রমে `text/csv` ও `application/pdf` |
| User → admin API | 🤖 HTTP `403` |
| User → volunteer task API | 🤖 HTTP `403` |
| Taslima volunteer login ও task list | 🤖 HTTP `200` |
| Volunteer → admin report API | 🤖 HTTP `403` |
| Image endpoint configuration probe | 🤖 Empty upload-এ `400`; endpoint configured এবং request validation চালু |
| Swagger UI | 🤖 HTTP `200` |

### ২.২ বর্তমান known automation issue

Backend-এর একমাত্র e2e test বর্তমানে fail করে, কারণ test file এখনো root response হিসেবে `Hello World!` আশা করে; application বর্তমানে সঠিকভাবে নিচের নতুন message দেয়:

```text
FloodAid BD API is running. See /api/docs for documentation.
```

অর্থাৎ application start failure নয়; `test/app.e2e-spec.ts`-এর expected string পুরনো। Defect ID হিসেবে লিখতে পারেন: **AUT-001 — stale root response assertion**।

### ২.৩ যা এখনো manual execution দরকার

এই নথির browser-based workflowগুলো code অনুযায়ী যাচাই করে লেখা হয়েছে, কিন্তু প্রতিটি destructive scenario এই review-এ database-এ চালানো হয়নি। QA sign-off দেওয়ার আগে section ৭-এর test caseগুলো একটি disposable QA database-এ manualভাবে সম্পন্ন করুন।

---

## ৩. Test environment প্রস্তুতি

### ৩.১ প্রয়োজনীয় software

- Node.js 20 বা তার পরের supported version
- `pnpm`
- PostgreSQL database
- Chrome/Edge/Firefox-এর সাম্প্রতিক version
- OTP test-এর জন্য কাজ করা SMTP inbox
- Realtime test-এর জন্য Pusher credentials
- Image upload-এর জন্য Cloudinary credentials

### ৩.২ Environment variables

Frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=
```

Backend `.env`-এ অন্তত নিচের keyগুলো লাগবে:

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d

SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
EMAIL_FROM=...

PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

বর্তমান local environment-এ SMTP, Pusher এবং Cloudinary key **SET** আছে; তবে credential সত্যিই কাজ করছে কি না সংশ্লিষ্ট manual test দিয়েই নিশ্চিত করতে হবে। Secret কখনো screenshot, issue বা test report-এ লিখবেন না।

### ৩.৩ Install, migration এবং seed

Backend:

```bash
cd flooadaid-backend
pnpm install
pnpm prisma:generate
pnpm prisma:deploy
pnpm db:seed
```

বড় dashboard/demo dataset চাইলে base seed-এর পরে একবার চালান:

```bash
pnpm db:seed:demo
```

`db:seed:demo` additive demo data যোগ করে। Production database-এ এটি চালাবেন না।

Frontend:

```bash
cd flooadaid-frontend
pnpm install
```

### ৩.৪ Application চালু করুন

Terminal 1:

```bash
cd flooadaid-backend
pnpm start:dev
```

Terminal 2:

```bash
cd flooadaid-frontend
pnpm dev
```

তারপর পরীক্ষা করুন:

- `http://localhost:4000/api/health` → status `ok`
- `http://localhost:4000/api/docs` → Swagger UI
- `http://localhost:3000` → FloodAid home page

### ৩.৫ Seeded test accounts

সবগুলোর password: **`Password123`**

| ব্যবহার | Email | Role | মন্তব্য |
|---|---|---|---|
| Admin | `admin@floodaid.bd` | ADMIN | সব admin test |
| Verified volunteer | `taslima@floodaid.bd` | VOLUNTEER | Verified profile আছে; assignment test-এর জন্য ব্যবহার করুন |
| Regular user | `user@floodaid.bd` | USER | User ও volunteer onboarding test |
| Basic volunteer account | `volunteer@floodaid.bd` | VOLUNTEER | Base account; volunteer profile নাও থাকতে পারে, assignment demo-তে ব্যবহার না করাই ভালো |

### ৩.৬ Browser session ব্যবস্থা

একই সময়ে তিনটি role লাগতে পারে:

- **Window A:** normal browser — admin
- **Window B:** Incognito/Private — volunteer
- **Window C:** অন্য browser profile বা Firefox — user/guest

### ৩.৭ Test data naming rule

প্রতিটি test data-র শুরুতে unique prefix দিন:

```text
QA-20261106-
```

উদাহরণ:

- `QA-20261106-Feni Alert`
- `QA-20261106-Shelter`
- `QA-20261106-Rahima SOS`
- `QA-20261106-Rice`

একই QA database একাধিক tester ব্যবহার করলে prefix-এ tester initials যোগ করুন।

---

## ৪. Role ও access matrix

| Feature | Guest | USER | VOLUNTEER | ADMIN |
|---|---:|---:|---:|---:|
| Public alerts/shelters/map | ✅ | ✅ | ✅ | ✅ |
| SOS create ও public tracker | ✅ | ✅ | ✅ | ✅ |
| নিজের linked SOS cancel | — | ✅ | ✅ | ✅, status দিয়ে |
| Missing/found report create | ✅ | ✅ | ✅ | ✅ |
| Full missing-person contact | ❌ | নিজের report | ✅ | ✅ |
| Volunteer onboarding | ❌ | ✅ | Already volunteer | Admin role নয় |
| Manual SOS | ❌ | ❌ | ✅ | ✅ |
| Assigned rescue task update | ❌ | ❌ | নিজের task | সব SOS manage |
| Relief holding/delivery | ❌ | ❌ | নিজের assignment | সব assignment |
| Supply request | ❌ | ❌ | নিজের request | সব request review |
| Alert/shelter/user management | ❌ | ❌ | ❌ | ✅ |
| Reports/export | ❌ | ❌ | ❌ | ✅ |
| Personal notifications/settings | ❌ | ✅ | ✅ | ✅ |

---

## ৫. Recommended execution order

Dependency নষ্ট না করতে এই order অনুসরণ করুন:

1. Automated baseline ও startup
2. Public pages, language, auth
3. User settings
4. Admin alert ও shelter তৈরি
5. Guest/user SOS
6. SOS assignment ও volunteer rescue
7. Volunteer onboarding/verification
8. Relief ও supply request
9. Missing persons ও feedback
10. Notifications, reports, security, mobile
11. Cleanup ও regression recheck

---

## ৬. Test execution record

প্রতিটি case চালানোর সময় এই table কপি করে পূরণ করুন:

| Test ID | Browser/device | Account | Result | Evidence | Defect ID |
|---|---|---|---|---|---|
| FA-01 | Chrome desktop | Guest | PASS/FAIL | Screenshot/link | — |

---

## ৭. পূর্ণ ধাপে ধাপে test cases

### FA-01 — Automated baseline, build ও startup

**ধরন:** 🤖 Automated + smoke

Backend:

```bash
cd flooadaid-backend
pnpm exec jest --runInBand
pnpm exec eslint "{src,apps,libs,test}/**/*.ts"
pnpm build
```

Frontend:

```bash
cd flooadaid-frontend
pnpm lint
pnpm build
```

✅ Expected:

- Backend: ৫ suite, ১৯ test pass
- দুই project-এ lint error নেই
- দুই project-এর production build সফল
- Frontend build-এ ৪৬টি route generate হয়

> Frontend build Google Fonts download করে। Internet বন্ধ থাকলে `Noto Sans Bengali` বা `Plus Jakarta Sans` fetch error আসতে পারে; সেটি application TypeScript error নয়।

E2E command:

```bash
cd flooadaid-backend
pnpm exec jest --config ./test/jest-e2e.json --runInBand
```

⚠️ বর্তমানে **AUT-001**-এর জন্য root response assertion fail করবে। Test expectation update হওয়ার পরে এটি pass হওয়া বাধ্যতামূলক।

---

### FA-02 — Home, public navigation ও static pages

**Account:** Guest  
**URL:** `/`

1. Home page খুলুন।
2. Header থেকে Alerts, Shelters, Missing Persons, How It Works, About এবং Get Involved খুলুন।
3. Footer থেকে Safety, Privacy, Terms এবং Report an Issue খুলুন।
4. Browser Back/Forward ব্যবহার করুন।
5. `/abcxyz` খুলুন।

✅ Expected:

- Home hero, public statistics, live flood map, latest alerts, shelters ও volunteer CTA render হবে।
- কোনো navigation blank page বা console crash দেবে না।
- বর্তমান menu item visually active হবে।
- `/abcxyz`-এ custom “Page not found” page আসবে।
- Footer legal linkগুলো সঠিক page-এ যাবে।

---

### FA-03 — বাংলা/English language এবং persistence

**Account:** Guest

1. Home page-এ **বাংলা** চাপুন।
2. Home, Alerts, Shelters, SOS, Tracker এবং Missing Persons page ঘুরে দেখুন।
3. একটি district/alert/shelter-এর বাংলা নাম available থাকলে তা বাংলা দেখায় কি না দেখুন।
4. Page refresh করুন এবং নতুন tab-এ site খুলুন।
5. **English** চাপুন।

✅ Expected:

- Public navigation ও প্রধান public workflow বাংলা হবে।
- ভাষা page change ও refresh-এর পরেও মনে থাকবে।
- English চাপলে আবার English হবে।
- Dashboard-এর operational UI প্রধানত English থাকা বর্তমান design অনুযায়ী স্বাভাবিক।

---

### FA-04 — Sign-up, OTP verification ও resend

**Account:** Guest  
**URL:** `/signup`

1. নতুন, বাস্তব inbox-সহ email ব্যবহার করুন।
2. লিখুন:

   | Field | Value |
   |---|---|
   | Full name | `QA-20261106 New User` |
   | Email | নতুন unique email |
   | Phone | `01712345678` |
   | Password | `TestPass123` |
   | Confirm password | `TestPass123` |

3. **Create Account** চাপুন।
4. `/verify-otp` page-এ ৬-digit email code দিন।
5. **Verify** চাপুন।
6. `/dashboard` থেকে role অনুযায়ী `/user`-এ redirect হয়েছে কি না দেখুন।
7. Resend test-এর জন্য নতুন আরেকটি account বানিয়ে **Resend code** চাপুন।

✅ Expected:

- Account তৈরি হলে verification page খুলবে।
- OTP ১০ মিনিট valid।
- সঠিক code account verify করে session cookie set করবে।
- Resend-এর ৬০-second cooldown আছে; দ্রুত repeated click নতুন email flood করবে না।

**Negative checks:**

| Input/action | Expected |
|---|---|
| Name ১ character | validation error |
| Invalid email | validation error |
| Password ৮ character-এর কম | error |
| Password-এ digit নেই | error |
| Password mismatch | error |
| Existing email | “already exists” conflict |
| Wrong ৬-digit code | invalid/expired error |
| ৫ বার wrong OTP | code consumed; নতুন code চাইতে হবে |

> Development-এ SMTP fail করলে backend log-এ `[dev only] code:` দেখা যেতে পারে। Production log-এ OTP কখনো দেখা উচিত নয়।

---

### FA-05 — Login, logout ও role redirect

1. `/login`-এ `user@floodaid.bd` / `Password123` দিয়ে login করুন।
2. `/dashboard` খুলুন।
3. Sidebar থেকে logout করুন।
4. একইভাবে admin এবং Taslima account পরীক্ষা করুন।

✅ Expected:

| Account | Expected home |
|---|---|
| USER | `/user` |
| VOLUNTEER | `/volunteer` |
| ADMIN | `/admin` |

**Negative checks:**

- ভুল password → `Invalid email or password`
- Unverified account login → verification message এবং নতুন OTP issue করার চেষ্টা
- Logout-এর পরে protected page খুললে `/login`
- Browser cookie-তে session HttpOnly হবে; frontend JavaScript থেকে token পড়া যাবে না

---

### FA-06 — Forgot password ও reset password

**Account:** FA-04-এর test account

1. Logout করুন।
2. `/forgot-password` খুলে email দিন।
3. **Send Reset Code** চাপুন।
4. Email code নিয়ে `/reset-password`-এ লিখুন।
5. New password দিন `NewTest123`।
6. নতুন password দিয়ে login করুন।
7. পুরনো password দিয়ে login চেষ্টা করুন।

✅ Expected:

- Existing/non-existing দুই email-এর জন্য generic success message; account existence leak হবে না।
- সঠিক code-এ password reset হবে।
- নতুন password কাজ করবে, পুরনোটি করবে না।
- Invalid/expired code error দেবে।

---

### FA-07 — Settings: profile, home district ও password

**Account:** `user@floodaid.bd`  
**URL:** `/user/settings`

1. Name-এর শেষে ` QA` যোগ করুন।
2. Phone `01812345678` দিন।
3. Home district **Feni** করুন।
4. **Save Profile** চাপুন এবং refresh করুন।
5. Current password `Password123`, new password `Password1234` দিয়ে update করুন।
6. Logout/login করে নতুন password যাচাই করুন।
7. শেষে password আবার `Password123` এবং name আগের অবস্থায় ফেরান; Home district Feni রাখুন, FA-09-এ লাগবে।

✅ Expected:

- Profile refresh-এর পরেও থাকে।
- Header/sidebar-এ updated name দেখা যায়।
- Home district description বলে Warning/Danger/Critical alert notification আসবে।
- ভুল current password reject হবে।
- নতুন password-এ অন্তত ৮ character ও একটি digit বাধ্যতামূলক।

---

### FA-08 — Public alert list, map, search ও filter

**Account:** Guest  
**URL:** `/alerts`

1. Search-এ একটি district বা alert title লিখুন।
2. Division নির্বাচন করুন; তারপর District নির্বাচন করুন।
3. একাধিক severity pill নির্বাচন করুন।
4. **Find on Map** দিয়ে location select করুন।
5. Alert card এবং map marker খুলুন।
6. Detail panel-এর **Find Nearby Shelters** চাপুন।
7. **Clear Filters** চাপুন।

✅ Expected:

- Search title ও district-এ filter করে।
- District selector division নির্বাচন না করা পর্যন্ত disabled থাকে।
- একাধিক severity একসাথে filter করা যায়।
- Location filter ৮০ km-এর মধ্যে alert দেখায় এবং distance অনুযায়ী সাজায়।
- Detail-এ severity, district, description, water level ও সময় দেখা যায়।
- Nearby Shelters `/shelters`-এ location query সহ যায়।
- Expired/inactive alert public list-এ থাকে না।

---

### FA-09 — Admin alert CRUD, notification ও live map

**Window A:** Admin  
**Window C:** `user@floodaid.bd`, Home district Feni

1. Admin `/admin/alerts` → **New Alert**।
2. লিখুন:

   | Field | Value |
   |---|---|
   | Title | `QA-20261106 Feni Flood Warning` |
   | Bangla title | `পরীক্ষা — ফেনী বন্যা সতর্কতা` |
   | Description | `QA alert; ignore after testing.` |
   | Severity | `WARNING` |
   | District | `Feni` |
   | Water level | `420` |
   | Expires at | ভবিষ্যতের সময় অথবা blank |

3. Create করুন।
4. Window C-তে notification popover/page দেখুন।
5. `/alerts` এবং home live map দেখুন।
6. Admin থেকে alert edit করে severity `DANGER`, water level `430` করুন।
7. শেষে delete করুন।

✅ Expected:

- Create/edit toast ও admin list update হবে।
- WARNING/DANGER/CRITICAL alert একই home district-এর user-কে notification দেয়।
- NORMAL/WATCH alert district-wide notification দেয় না।
- Pusher চালু থাকলে realtime toast/chime; না হলে notification ২০ seconds polling-এ আসবে।
- Public alert list Pusher event-এ refresh হয়; live district map সর্বোচ্চ ৬০ seconds-এ refresh হয়।
- Delete confirmation-এর পরে alert আর public/admin list-এ থাকবে না।

**Expiry check:** অল্প সময়ের expiry-সহ দ্বিতীয় alert বানিয়ে expiry পার হওয়ার পর public list-এ না থাকার বিষয়টি যাচাই করুন।

---

### FA-10 — Public shelter search, facilities, capacity ও directions

**Account:** Guest  
**URL:** `/shelters`

1. Shelter name/location search করুন।
2. District **Feni** নির্বাচন করুন।
3. Food, Water, Medical, Electricity এবং Toilet facility pill আলাদাভাবে পরীক্ষা করুন।
4. Capacity mode `Available` এবং `Full` পরীক্ষা করুন।
5. **Find on Map** দিয়ে location দিন।
6. **Nearest First** toggle করুন।
7. Shelter card/detail খুলে **Directions** ও phone action পরীক্ষা করুন।

✅ Expected:

- Public list-এ শুধু active shelter থাকে।
- Facility filters AND condition হিসেবে কাজ করে।
- `Available` occupancy ৮০%-এর নিচে এবং `Full`/near-capacity ৮০% বা বেশি group করে।
- Location set করলে distance এবং nearest order পাওয়া যায়।
- Directions Google Maps-এ সঠিক latitude/longitude খোলে।
- Capacity, current occupancy ও available space পরস্পর সামঞ্জস্যপূর্ণ।

---

### FA-11 — Admin shelter create, edit, occupancy, close ও reopen

**Account:** Admin  
**URL:** `/admin/shelters`

1. **Add Shelter** চাপুন।
2. লিখুন:

   | Field | Value |
   |---|---|
   | Name | `QA-20261106 Feni School Shelter` |
   | Bangla name | `পরীক্ষা ফেনী স্কুল আশ্রয়কেন্দ্র` |
   | Address | `Ward 1, Feni Sadar` |
   | District | `Feni` |
   | Map location | ফেনীর কাছে pin |
   | Capacity | `200` |
   | Contact | `QA Manager`, `01612345678` |
   | Facilities | Food, Water, Toilet |

3. Save করুন।
4. Edit করে Medical চালু করুন।
5. **Update Occupancy** → `150`।
6. আবার `250` দিন।
7. Public `/shelters`-এ record দেখুন।
8. Admin থেকে **Close shelter** করুন।
9. Closed view থেকে **Reopen shelter** করুন।
10. Cleanup-এর জন্য শেষে আবার close করুন।

✅ Expected:

- Create/edit-এর পরে data refresh-এ থাকে।
- 150/200 = 75% occupancy দেখায়।
- 250 capacity ছাড়ায় বলে reject হয়।
- Closed shelter public list-এ থাকে না।
- Reopen করলে public list-এ ফিরে আসে।

---

### FA-12 — Guest SOS: validation, ছবি, priority, nearby help ও tracker

**Account:** Guest/Incognito  
**URL:** `/sos`

1. খালি form submit করুন।
2. Map-এ location দিন অথবা **Use My Current Location** অনুমতি দিন।
3. Landmark লিখুন `QA-20261106 school roof`।
4. District **Feni**।
5. People **10+**।
6. Help: **Rescue** এবং **Food**।
7. Name `QA-20261106 Rahima`, phone `01812345678`।
8. একটি JPG/PNG ছবি upload করুন।
9. Details লিখুন `Children and an elderly person are on the roof.`
10. SOS submit করুন এবং reference ID সংরক্ষণ করুন।
11. Success page-এর nearby shelters দেখুন।
12. **Open Tracker** অথবা `/tracker?id=REFERENCE_ID` খুলুন।

✅ Expected:

- অসম্পূর্ণ form missing field list দেখায়।
- Phone ঠিক ১১ digit `01...` format চায়।
- Upload progress/preview/remove কাজ করে।
- Rescue + 10+ → priority `CRITICAL`।
- Unique reference ID তৈরি হয়।
- Tracker polling সর্বোচ্চ ১০ seconds-এ status update করে।
- Guest tracker-এ phone, exact GPS, full requester name ও photo redacted থাকে।
- Assigned volunteer থাকলে public view-এ শুধু volunteer-এর first name দেখা যায়।

**Priority matrix:**

| Condition | Expected priority |
|---|---|
| Rescue + 10+ | CRITICAL |
| Rescue + অন্য headcount | HIGH |
| 5–10 বা 10+ without rescue | HIGH |
| ছোট group without rescue | MEDIUM |

---

### FA-13 — Logged-in SOS, My SOS ও নিজের request cancel

**Account:** `user@floodaid.bd`

1. Login অবস্থায় `/sos` থেকে নতুন SOS দিন।
2. People `1`, Help `medicine`, Name `QA-20261106 User SOS`।
3. Submit করে tracker খুলুন।
4. `/user` dashboard-এর **My SOS requests** section দেখুন।
5. **Cancel my request** চাপুন এবং confirm করুন।
6. একই tracker Incognito-তে খুলুন।

✅ Expected:

- SOS user account-এর সঙ্গে linked হয়।
- Owner full phone, GPS, photo ও details দেখতে পায়।
- Owner cancel button পায়; guest পায় না।
- Cancel-এর পরে status `CANCELLED`; polling বন্ধ হয়।
- Resolved বা already cancelled SOS আবার cancel করা যায় না।

---

### FA-14 — Admin SOS queue, filter, assign এবং volunteer rescue E2E

**Prerequisite:** FA-12-এর CRITICAL SOS  
**Window A:** Admin  
**Window B:** Taslima  
**Window C:** Guest tracker

1. Admin `/admin/sos` খুলুন।
2. Search `QA-20261106`।
3. Status, priority ও district filter পরীক্ষা করুন।
4. SOS-এর **Manage** খুলুন।
5. Uploaded photo, phone, need, landmark ও message যাচাই করুন।
6. **Assigned volunteer** থেকে Taslima নির্বাচন করুন।
7. Guest tracker refresh/poll হতে দিন।
8. Taslima `/volunteer/tasks` খুলুন।
9. Task-এর **Start rescue**/next action দিয়ে `IN_PROGRESS` করুন।
10. Call ও Directions link পরীক্ষা করুন।
11. পরের action দিয়ে `RESOLVED` করুন।
12. Guest tracker timeline পরীক্ষা করুন।

✅ Expected:

- Queue priority desc, তারপর newest order-এ থাকে; critical আগে।
- Search name, phone, address এবং district-এ কাজ করে।
- Assign list-এ শুধু verified ও currently available volunteer থাকে।
- Assign-এর পরে status `ASSIGNED` এবং volunteer notification তৈরি হয়।
- Timeline: `PENDING → ASSIGNED → IN_PROGRESS → RESOLVED`।
- Assigned volunteer full contact/location দেখতে পায়।
- Unrelated volunteer tracker ID পেলেও sensitive data দেখতে পায় না।
- Resolve করলে volunteer `totalAssignments` এক বাড়ে।

**Negative checks:**

- Unverified volunteer assign → reject
- Unavailable volunteer assign → reject
- Unassigned volunteer status update → `403`
- Volunteer `CANCELLED` বা arbitrary status দিতে পারে না
- Admin সব status set করতে পারে

---

### FA-15 — Manual SOS: অন্যের হয়ে request record

**Account:** Taslima অথবা Admin  
**URL:** `/volunteer/manual-sos` অথবা `/admin/manual-sos`

1. Person name `QA-20261106 Manual Abdul`।
2. Phone `01912345678`।
3. District Feni, people `2-5`, help `rescue`।
4. Map location দিন।
5. Notes লিখুন।
6. **Record Request** চাপুন।
7. Admin SOS queue-এ record খুঁজুন।

✅ Expected:

- Success toast `Request recorded`।
- SOS `manualEntry=true` হিসেবে একই rescue queue-এ আসে।
- Rescue + 2-5 → `HIGH` priority।
- Entry করা admin/volunteer full details দেখতে পারে।
- Guest/manual requester account ownership না থাকায় owner cancel button থাকবে না।

---

### FA-16 — Volunteer onboarding, verification, availability ও revoke

**Window C:** `user@floodaid.bd`  
**Window A:** Admin

> ⚠️ এই test user role পরিবর্তন করে। শেষে restore বাধ্যতামূলক।

1. User `/volunteer/profile` খুলুন।
2. Skills অন্তত একটি নির্বাচন করুন।
3. District Feni, সময় `08:00`–`20:00` দিন।
4. Register করুন।
5. `/volunteer` ও profile দেখুন।
6. Admin `/admin/volunteers`-এ নতুন profile খুঁজুন।
7. Verify করুন।
8. User notification দেখুন।
9. Volunteer profile-এ availability off করুন।
10. Admin SOS assign list-এ নাম আছে কি না দেখুন।
11. Availability on করুন; আবার list দেখুন।
12. Admin থেকে **Remove verification** পরীক্ষা করুন।
13. Cleanup: `/admin/users` থেকে role USER করুন।

✅ Expected:

- Register-এর সঙ্গে role `VOLUNTEER` হয় এবং re-login ছাড়াই volunteer dashboard আসে।
- Initial verification `Pending/false`।
- Verify হওয়ার আগে SOS assign list-এ থাকে না।
- Verify action personal notification দেয়।
- Verified + available হলে assignable; availability off বা verification removed হলে assignable নয়।
- Admin নিজের role পরিবর্তন করতে পারে না; last admin protection backend-এ থাকতে হবে।

> Role USER-এ ফেরালেও volunteer profile database-এ থাকতে পারে। একই account দিয়ে পুনরায় registration করলে “already registered” আসা বর্তমান backend behaviour। সম্পূর্ণ repeatable onboarding-এর জন্য fresh test account ব্যবহার করুন।

---

### FA-17 — Relief inventory, assignment, delivery ও cancel

**Window A:** Admin  
**Window B:** Taslima

1. Admin `/admin/relief` → **Inventory**।
2. Add item:

   - Item: `QA-20261106 Biscuit`
   - Unit: `packet`
   - Quantity: `100`

3. Edit করে quantity `120` করুন; এটি absolute quantity।
4. **Assignments** → Assign Relief:

   - Item: QA Biscuit
   - Quantity: `30`
   - Volunteer: Taslima
   - Note: `QA Feni delivery`

5. Inventory ও Who Holds What দেখুন।
6. ৫০০ assign করার চেষ্টা করুন।
7. Taslima `/volunteer/relief`-এ 30 packet দেখুন।
8. Active shelter নির্বাচন করে deliver করুন।
9. Admin ledger-এ delivered status দেখুন।
10. আরেকটি 10 packet assign করে admin থেকে cancel করুন।

✅ Expected:

- Edit-এর পরে stock 120; assign 30-এর পরে 90।
- Insufficient stock assignment atomicভাবে fail; stock/assignment partial change হবে না।
- Taslima শুধু নিজের holding deliver করতে পারে।
- Delivery-তে shelter, delivered time ও history থাকে।
- Undelivered 10 cancel করলে stock 10 ফেরত আসে।
- Delivered/cancelled assignment আবার cancel বা deliver করা যায় না।

---

### FA-18 — Relief distribution log ও evidence photo

**Account:** Admin  
**URL:** `/admin/relief` → Distribution Log

1. **Log Distribution** খুলুন।
2. District Feni, Location `QA-20261106 Bazar`।
3. Distributed By `QA Relief Team`।
4. Families Served `25`, আজকের date।
5. Items: Rice `100` `kg`; আরেকটি item যোগ/সরান।
6. JPG evidence photo upload করুন।
7. Notes লিখে submit করুন।
8. Search দিয়ে location/team/item খুঁজুন।
9. Photo thumbnail খুলুন।

✅ Expected:

- অন্তত একটি item দরকার।
- Log list-এ district, team, family count, items, date ও photo আসে।
- Search location, distributed-by team ও item-এ কাজ করে।
- Public relief coverage/stats পরের fetch-এ update হয়।

---

### FA-19 — Shelter supply request: approve, partial dispatch, reject, fulfil

**Window B:** Taslima  
**Window A:** Admin

1. Inventory-তে যথেষ্ট `Rice (kg)` ও `Blankets` আছে নিশ্চিত করুন।
2. Taslima `/volunteer/supply-requests`।
3. Active shelter, urgency HIGH নির্বাচন করুন।
4. Rice 50 ও Blankets 20 যোগ করুন।
5. Note `QA-20261106 320 people tonight` দিয়ে send করুন।
6. Admin notification দেখুন।
7. Admin Relief → Supply Requests → Pending।
8. Approve খুলে Rice 30, Blankets 20 dispatch করুন; carrier Taslima।
9. Taslima notification ও My Relief দেখুন।
10. দুই assignment নির্ধারিত shelter-এ deliver করুন।
11. নতুন দ্বিতীয় request তৈরি করে admin থেকে reason-সহ reject করুন।

✅ Expected:

- Request initial status `PENDING`; pendingগুলো urgency অনুযায়ী সাজে।
- Admin partial quantity approve করতে পারে; request-এ না থাকা item যোগ করতে পারে না।
- সব stock decrement একটি transaction-এ হয়; কোনো item short হলে কিছুই dispatch হয় না।
- Approval status `APPROVED`; UI “On the way” হিসেবে দেখাতে পারে।
- সব related assignment delivered হলে request `FULFILLED`।
- Reject status `REJECTED`, requester reason এবং notification পায়।
- একই request দ্বিতীয়বার approve/reject করা যায় না।

---

### FA-20 — Missing/found person, photo, privacy ও reunited

**Window C:** Guest  
**Window B:** Taslima  
**Window A:** Admin

1. Guest `/missing-persons` → Report a person।
2. Type `I am looking for someone`।
3. Name `QA-20261106 Jamal`, age 12, gender Male।
4. District Feni, last seen text এবং description দিন।
5. একটি photo upload করুন।
6. Reporter `QA Father`, phone `01512345678`।
7. Publish করুন।
8. Search, district এবং Missing/Found/Reunited tab পরীক্ষা করুন।
9. Guest হিসেবে phone দেখুন।
10. Taslima হিসেবে একই record দেখুন।
11. Admin `/admin/missing-persons` থেকে `REUNITED` করুন।
12. একইভাবে একটি FOUND report তৈরি করুন।

✅ Expected:

- Public reporter phone `015•••••678` আকারে masked।
- Admin/volunteer full phone দেখতে পায়।
- Logged-in reporter নিজের record-এর full phone দেখতে পায়।
- Search name, description ও last-seen place-এ কাজ করে।
- Admin, volunteer বা logged-in original reporter status update করতে পারে।
- Anonymous report guest নিজে status update করতে পারে না।
- Reunited record Reunited tab/count-এ যায়।

---

### FA-21 — Public feedback ও admin review

**Window C:** Guest  
**Window A:** Admin

1. `/report` খুলুন।
2. Name `QA-20261106 Reporter`।
3. Optional email দিন।
4. Category Data Error/BUG/SAFETY/ABUSE/OTHER থেকে একটি দিন।
5. Message অন্তত ৫ character লিখে send করুন।
6. Admin `/admin/feedback`-এ record খুঁজুন।
7. Category/search filter পরীক্ষা করুন।
8. Status `NEW → REVIEWING → RESOLVED` করুন।

✅ Expected:

- Guest success screen `Report received`।
- Invalid email বা ৫ character-এর কম message reject।
- Admin summary count status change-এর সঙ্গে বদলায়।
- Email থাকলে mailto link কাজ করে।

---

### FA-22 — Notifications: realtime, polling, read ও read-all

**Account:** User, Volunteer ও Admin—তিন role-এ আলাদাভাবে

1. কোনো unread notification আছে এমন account login করুন।
2. Topbar bell খুলুন।
3. একটি notification click/read করুন।
4. **Mark all read** চাপুন।
5. FA-09/FA-14/FA-19 থেকে নতুন notification trigger করুন।
6. Pusher configured অবস্থায় realtime toast/chime দেখুন।
7. সাময়িকভাবে frontend Pusher key blank রেখে polling fallback পরীক্ষা করুন।

✅ Expected:

- Bell badge unread count দেখায়; ৯-এর বেশি হলে `9+`।
- Single read শুধু নিজের notification update করে।
- Mark all read সব unread clear করে।
- অন্য user-এর notification ID mark read করলেও তার record পরিবর্তন হবে না।
- Realtime event list invalidate করে toast/chime দেয়।
- Pusher না থাকলেও ২০ seconds interval-এ notification আসে।

---

### FA-23 — Admin dashboard, reports, CSV ও PDF

**Account:** Admin

1. `/admin` dashboard খুলুন।
2. Active Alerts, Open Shelters, SOS, Active Volunteers এবং occupancy দেখুন।
3. Recent SOS ও SOS-by-status chart-এর count list-এর সঙ্গে তুলনা করুন।
4. `/admin/reports` খুলুন।
5. SOS analytics, average resolution এবং relief analytics দেখুন।
6. **Export CSV** এবং **Export PDF** চাপুন।
7. Downloaded files খুলুন।

✅ Expected:

- Dashboard loading skeleton-এর পরে data আসে।
- Count corresponding admin/public lists-এর সঙ্গে যুক্তিসঙ্গতভাবে মেলে।
- CSV header/row readable এবং spreadsheet-এ খোলে।
- PDF valid situation report হিসেবে খোলে; blank/corrupt নয়।
- Non-admin report endpoint/page access পায় না।

---

### FA-24 — Role permission, privacy ও security negative tests

Browser address bar-এ সরাসরি route দিন:

| Actor | Route | Expected |
|---|---|---|
| Guest | `/admin` | `/login` |
| Guest | `/volunteer/tasks` | `/login` |
| USER | `/admin/users` | `/user` |
| USER | `/volunteer/tasks` | `/volunteer/profile` |
| VOLUNTEER | `/admin/reports` | `/volunteer` |
| ADMIN | `/user` | `/admin` |

API checks:

```bash
curl -i http://localhost:4000/api/notifications
curl -i http://localhost:4000/api/reports/dashboard
```

✅ Guest দুই ক্ষেত্রেই `401`। Logged-in wrong role-এ `403`।

আরও যাচাই করুন:

- Guest SOS tracker sensitive field return করে না।
- Missing-person public phone masked।
- Password API response-এ কখনো আসে না।
- Unknown request field validation pipe-এর কারণে `400`।
- CORS শুধু `FRONTEND_URL`-এর allowed origin নেয়।
- Response header-এ Helmet security headers থাকে।

**Rate limit — isolated environment-এ করুন:**

- Auth credential endpoint: প্রতি minute ১০ request।
- Public SOS create: প্রতি minute ২০ request।
- Public feedback create: প্রতি minute ৫ request।
- OTP ৫ ভুল attempt-এর পরে consumed।
- Upload limit: প্রতি minute ৩০ request।
- Missing-person create: প্রতি minute ১০ request।

Production/shared demo account-এ brute-force test করবেন না।

---

### FA-25 — Image upload rules ও failure states

SOS, Missing Persons এবং Relief Log—তিন জায়গায় পরীক্ষা করুন।

1. Valid JPG, PNG, WEBP বা HEIC upload করুন।
2. ৮ MB-এর বড় image দিন।
3. `.pdf`, `.txt` বা unsupported file দিন।
4. Upload চলার সময় progress/spinner দেখুন।
5. Uploaded preview remove করুন।
6. Cloudinary credential সাময়িক invalid test environment-এ failure দেখুন।

✅ Expected:

- Valid image secure Cloudinary URL দেয় এবং preview হয়।
- ৮ MB-এর বড় image frontend/backend reject করে।
- Unsupported type-এ `Please upload a JPG, PNG, WEBP or HEIC image.`
- Too many upload-এ 429-friendly message।
- Cloudinary unavailable হলে form crash না করে retry-friendly error।
- Image upload public হলেও folder শুধু allowed list: `sos`, `missing-persons`, `relief`, `shelters`, `general`।

---

### FA-26 — Responsive, keyboard, geolocation ও browser compatibility

Chrome DevTools device toolbar দিয়ে অন্তত পরীক্ষা করুন:

- 390 × 844 mobile
- 768 × 1024 tablet
- 1366 × 768 laptop

Pages:

- Home
- Alerts map/list
- Shelters map/list
- SOS form/success
- Tracker
- Missing Persons
- Admin SOS
- Volunteer tasks

✅ Expected:

- Horizontal page overflow নেই।
- Mobile sidebar/menu usable।
- Dialog/sheet viewport-এর বাইরে যায় না।
- Table/list mobile layout readable।
- Map control button overlap করে না।
- Keyboard `Tab`, `Enter`, `Space`, `Escape` দিয়ে form/dialog/filter ব্যবহার করা যায়।
- Visible focus indicator থাকে।
- Image-এর meaningful alt/label এবং icon button-এর aria-label থাকে।

**Geolocation denial test:**

1. Browser location permission `Block` করুন।
2. SOS/Shelter-এর current-location action চাপুন।

✅ Clear error দেখাবে এবং manual map selection চালু থাকবে।

শেষে Chrome, Firefox এবং Edge/Safari-এর অন্তত একটি current version-এ critical path চালান।

---

## ৮. API smoke test quick commands

### ৮.১ Public ও unauthenticated checks

```bash
curl -i http://localhost:4000/api/health
curl -i http://localhost:4000/api/stats/public-summary
curl -i "http://localhost:4000/api/alerts?limit=2"
curl -i "http://localhost:4000/api/shelters?limit=2"
curl -i http://localhost:4000/api/notifications
```

Expected: প্রথম চারটি `200`, notifications `401`।

### ৮.২ Admin cookie session

```bash
curl -c /tmp/floodaid-admin.cookies \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@floodaid.bd","password":"Password123"}' \
  http://localhost:4000/api/auth/login

curl -b /tmp/floodaid-admin.cookies http://localhost:4000/api/auth/me
curl -b /tmp/floodaid-admin.cookies http://localhost:4000/api/reports/dashboard
curl -b /tmp/floodaid-admin.cookies "http://localhost:4000/api/sos?limit=1"
```

Expected: সব `200`। Cookie file কখনো repository-তে commit করবেন না।

### ৮.৩ Swagger

`http://localhost:4000/api/docs` খুলুন। Authentication httpOnly `session` cookie ব্যবহার করে; bearer token paste করার প্রয়োজন নেই।

---

## ৯. Non-functional checklist

### Performance

- Chrome DevTools Network-এ public list ও dashboard API time record করুন।
- Cached ও uncached দুই run নিন।
- Pagination থাকা list-এ large demo dataset দিয়ে পরীক্ষা করুন।
- Home map/public summary ৬০-second polling-এ duplicate request storm তৈরি করছে কি না দেখুন।
- Admin SOS ১৫ seconds, tracker ১০ seconds, notification ২০ seconds interval প্রত্যাশিত।

Suggested target:

| Metric | Target |
|---|---|
| Typical API median | ≤ 1 second |
| Normal API maximum | ≤ 2 seconds |
| No UI freeze | Long request চললেও form/navigation responsive |

Remote database region দূরে হলে latency code logic ছাড়াও বাড়তে পারে; report-এ client, backend ও database region লিখুন।

### Reliability

- Backend বন্ধ থাকলে frontend error state/toast দেখাবে; whole page crash নয়।
- Network Offline করে retry behaviour পরীক্ষা করুন।
- Double-click submit-এ duplicate SOS/report তৈরি হচ্ছে কি না দেখুন।
- Refresh-এর পর completed form data প্রয়োজন অনুযায়ী থাকে বা cleanly reset হয়।

### Security

- Production-এ HTTPS এবং cookie `Secure` হওয়া চাই।
- `JWT_SECRET` strong এবং source control-এর বাইরে।
- SMTP/Pusher/Cloudinary secret frontend bundle-এ থাকবে না।
- Sensitive API data role/ownership অনুযায়ী redacted।
- Uploaded file MIME ও size server-side-এও validate হয়।

### Accessibility

- Text/background contrast পরীক্ষা করুন।
- Form error শুধু color দিয়ে নয়, text দিয়েও বোঝা যায়।
- Map ছাড়া alternate search/list path আছে।
- 200% zoom-এ content ব্যবহারযোগ্য।
- বাংলা text কাটে না।

---

## ১০. Test data cleanup

QA শেষ হলে:

- Admin Alerts → সব `QA-...` alert delete
- Admin Shelters → QA shelter close
- Admin SOS → open QA SOS `CANCELLED` বা `RESOLVED`
- Admin Users → পরিবর্তিত role আগের অবস্থায় ফেরত
- Volunteer availability/verification আগের অবস্থায় ফেরত
- `user@floodaid.bd` password আবার `Password123`
- QA stock item quantity `0` করুন অথবা admin API দিয়ে delete করুন
- Pending QA relief assignment cancel করে stock ফেরত দিন
- QA Missing Person `CLOSED`/`REUNITED`
- QA Feedback `RESOLVED`

⚠️ বর্তমান UI থেকে relief log, supply request, missing-person report এবং feedback hard-delete করার option নেই। তাই full regression-এর জন্য disposable QA database সবচেয়ে নিরাপদ। Production database-এ test data তৈরি করবেন না।

---

## ১১. Defect report template

```text
Title: [FA-14] Assigned volunteer cannot start rescue

Environment:
- Date/time:
- Frontend commit:
- Backend commit:
- Browser/device:
- Account/role:
- API/database environment:

Precondition:
- SOS reference ID:
- Current status:

Steps:
1.
2.
3.

Expected:

Actual:

HTTP status / API response:

Evidence:
- Screenshot/video:
- Console log:
- Network request:

Severity: Blocker / Critical / Major / Minor
Reproducibility: Always / Sometimes / Once
```

Emergency-flow defect-এ real phone, exact GPS, password, cookie বা secret screenshot-এ প্রকাশ করবেন না।

---

## ১২. Feature-to-test coverage matrix

| Module | Main test cases |
|---|---|
| Auth/Profile | FA-04–FA-07 |
| Public pages/i18n | FA-02–FA-03 |
| Alerts/Live map | FA-08–FA-09 |
| Shelters | FA-10–FA-11 |
| SOS/Tracker/Privacy | FA-12–FA-15 |
| Volunteers | FA-14–FA-16 |
| Relief inventory/log | FA-17–FA-18 |
| Supply requests | FA-19 |
| Missing persons | FA-20 |
| Feedback | FA-21 |
| Notifications | FA-22 |
| Reports/Exports | FA-23 |
| RBAC/Security | FA-24 |
| Uploads | FA-25 |
| Responsive/Accessibility | FA-26 |

---

## ১৩. Release sign-off checklist

- [ ] FA-01 automated baseline complete
- [ ] AUT-001 fixed অথবা accepted with owner/date
- [ ] Guest critical path pass
- [ ] USER critical path pass
- [ ] VOLUNTEER critical path pass
- [ ] ADMIN critical path pass
- [ ] SOS end-to-end `PENDING → ASSIGNED → IN_PROGRESS → RESOLVED` pass
- [ ] Supply request `PENDING → APPROVED → FULFILLED` pass
- [ ] OTP email, Pusher realtime ও Cloudinary upload pass
- [ ] CSV এবং PDF খুলেছে
- [ ] Role/privacy negative tests pass
- [ ] Mobile 390 px critical pages pass
- [ ] No open Blocker/Critical defect
- [ ] QA data cleaned or QA database reset
- [ ] Tester, date, frontend commit ও backend commit recorded

---

## ১৪. Presentation-এর আগে ১০-minute smoke checklist

- [ ] `/api/health` → `ok`
- [ ] Home map ও public stats load
- [ ] বাংলা/English toggle কাজ করে
- [ ] Guest SOS submit করে reference ID পাওয়া যায়
- [ ] Tracker status ও privacy ঠিক
- [ ] Admin SOS-টি Taslima-কে assign করতে পারে
- [ ] Taslima In Progress এবং Resolved করতে পারে
- [ ] User notification পাওয়া যায়
- [ ] Public alert ও shelter filter কাজ করে
- [ ] Missing-person phone guest-এর কাছে masked
- [ ] Admin CSV/PDF export download হয়
- [ ] Test data cleanup করা হয়েছে
