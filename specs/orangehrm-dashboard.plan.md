# Test Plan: OrangeHRM Dashboard

**Application under test:** https://opensource-demo.orangehrmlive.com/
**Seed:** `seed.spec.ts`
**Test credentials:** `Admin` / `admin123` (public OrangeHRM demo instance)

## Assumptions
- Starting state is a fresh, unauthenticated browser session (no stored cookies/local storage).
- The public OrangeHRM demo instance is available and its demo data (widgets, buzz posts, employee distribution) may vary over time — assertions target structure/labels, not volatile content.

---

## 1. Dashboard Access & Load

### 1.1 Successful Login Redirects to Dashboard
**Steps:**
1. Navigate to `/web/index.php/auth/login`
2. Fill "Username" with `Admin`
3. Fill "Password" with `admin123`
4. Click the "Login" button

**Expected Outcome:** Browser navigates to `/web/index.php/dashboard/index`; the page heading reads "Dashboard".

**Success Criteria:** URL contains `dashboard/index` and "Dashboard" heading is visible.
**Failure Conditions:** Login error message appears, or URL remains on the login page.

### 1.2 Dashboard Displays Core Widgets
**Steps:**
1. Complete login (see 1.1)
2. Observe the dashboard widget area

**Expected Outcome:** The following widgets are visible: "Time at Work", "My Actions", "Quick Launch", "Buzz Latest Posts", "Employees on Leave Today", "Employee Distribution by Sub Unit", "Employee Distribution by Location".

**Success Criteria:** All listed widget titles are visible on the page.
**Failure Conditions:** One or more widgets fail to render within a reasonable wait.

### 1.3 Unauthenticated Access Redirects to Login (Negative)
**Steps:**
1. With no active session (fresh context), navigate directly to `/web/index.php/dashboard/index`

**Expected Outcome:** Application redirects to the login page instead of showing the dashboard.

**Success Criteria:** Final URL contains `auth/login`; login form is visible.
**Failure Conditions:** Dashboard content is visible without authentication.

---

## 2. Sidebar Navigation

### 2.1 Sidebar Contains All Expected Modules
**Steps:**
1. Complete login
2. Inspect the left sidebar navigation list

**Expected Outcome:** Sidebar lists: Admin, PIM, Leave, Time, Recruitment, My Info, Performance, Dashboard, Directory, Maintenance, Claim, Buzz.

**Success Criteria:** Each module link is visible with correct label.
**Failure Conditions:** A module is missing or mislabeled.

### 2.2 Navigating Away and Back to Dashboard
**Steps:**
1. Complete login
2. Click the "PIM" sidebar link
3. Verify navigation to the PIM module (URL contains `pim/viewPimModule`)
4. Click the "Dashboard" sidebar link

**Expected Outcome:** User returns to `/web/index.php/dashboard/index` and dashboard widgets are visible again.

**Success Criteria:** URL and heading confirm return to Dashboard.
**Failure Conditions:** Navigation fails or dashboard does not reload widgets.

---

## 3. Quick Launch Actions

### 3.1 Quick Launch Tile Set is Complete
**Steps:**
1. Complete login
2. Inspect the "Quick Launch" widget

**Expected Outcome:** Tiles present: "Assign Leave", "Leave List", "Timesheets", "Apply Leave", "My Leave", "My Timesheet".

**Success Criteria:** All six tiles are visible with correct labels.
**Failure Conditions:** A tile is missing, mislabeled, or not clickable.

### 3.2 "Assign Leave" Quick Launch Opens Assign Leave Flow
**Steps:**
1. Complete login
2. Click the "Assign Leave" tile in Quick Launch

**Expected Outcome:** Application navigates to (or opens) the Assign Leave form (URL contains `leave/assignLeave` or equivalent leave-assignment view).

**Success Criteria:** Assign Leave form/page becomes visible.
**Failure Conditions:** Click has no effect, or an unrelated view opens.

---

## 4. User/Profile Menu

### 4.1 Profile Dropdown Shows Expected Options
**Steps:**
1. Complete login
2. Click the profile dropdown in the top-right of the topbar (shows "Demo Source")

**Expected Outcome:** Dropdown menu opens showing: "About", "Support", "Change Password", "Logout".

**Success Criteria:** All four menu items are visible.
**Failure Conditions:** Menu does not open or an item is missing.

### 4.2 Logout Returns to Login Page
**Steps:**
1. Complete login
2. Open the profile dropdown
3. Click "Logout"

**Expected Outcome:** Session ends and user is redirected to the login page.

**Success Criteria:** Final URL contains `auth/login`; login form is visible.
**Failure Conditions:** User remains authenticated or is routed elsewhere.

---

## Notes for Test Generation
- Each numbered scenario (e.g. 1.1, 3.2) should become an independent, runnable test — no test should depend on state left by another.
- Prefer role/label-based locators (e.g. `getByRole('link', { name: 'PIM' })`) over CSS classes, since OrangeHRM's demo markup can change between releases.
- Demo data in "Buzz Latest Posts" and "Employees on Leave Today" is not stable — do not assert on specific post content, only widget presence/structure.
