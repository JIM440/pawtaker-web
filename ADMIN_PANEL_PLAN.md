# PawTaker Admin Panel – UI Revamp Plan

This document describes, in detail, the changes to be implemented for the **PawTaker Admin Panel**. All data will be **mock data only** for now (no Supabase integration). The goal is a fully responsive, production-quality UI that supports English/French static translations and matches the flows described below.

---

## 1. Global Admin Shell & Navigation

### 1.1 Layout & Structure

- Use the existing `app/[locale]/admin/layout.tsx` as the shared shell.
- Keep:
  - Left sidebar (brand + nav).
  - Top bar with global search and notifications.
  - Main content area scrollable independently of sidebar/topbar.
- Continue using the same background style as current admin pages (Material-ish surfaces: `bg-background-base`, `bg-surface-container-lowest`, borders, light shadow).

### 1.2 Tab Order & Routes

Update the sidebar navigation to have **exactly** this order and set of tabs:

1. `Dashboard` → `/[locale]/admin/dashboard`
2. `KYC Reviews` → `/[locale]/admin/kyc`
3. `Care Requests` → `/[locale]/admin/requests`
4. `Users` → `/[locale]/admin/users`
5. `Pets` → `/[locale]/admin/pets` (new)
6. `Reports` → `/[locale]/admin/reports`
7. `Contact` → `/[locale]/admin/contact` (new)

Implementation details:

- Replace the current `navItems` in `admin/layout.tsx` with this exact ordering and labels.
- Remove the `Settings` nav entry completely.
- Ensure the active state logic still works with the new paths.

### 1.3 Profile & Settings

**Settings page**:

- Remove the `Settings` page (`app/[locale]/admin/settings/page.tsx`) from the navigation and consider it unused. We do **not** need a standalone settings screen in this iteration.

**Profile**:

- Remove `/[locale]/admin/profile` as a standalone page (or at least stop linking to it).
- Instead, the **profile area in the sidebar footer** (currently “Alex Admin”) should open a **modal**:
  - Trigger: clicking the footer tile (avatar/name) opens a centered modal.
  - Modal content (all mock data):
    - Admin avatar, name, email.
    - Role (e.g. “Super Admin”).
    - A language toggle (EN/FR) **for the admin panel static text only**.
    - A “Sign out” button that **always** shows a confirmation modal before redirecting (for now, the action can be a no-op or just log to console).

### 1.4 Language Toggle (Admin)

- Add a **language toggle for EN/FR** in the profile modal (see above). The behavior:
  - Uses `next-intl` / the same i18n infrastructure as the marketing site.
  - Changes only static admin text (labels, headings, buttons) once we have translations.
  - It is acceptable initially to have **only English strings** for admin, but the switch should be present and wired so that we can fill `admin.*` translations later.

### 1.5 Global Confirmation Modal

Implement a reusable **confirmation modal** component for destructive actions:

- Props (or equivalent):
  - `isOpen`
  - `title` (string)
  - `description` (string)
  - `confirmLabel` (default e.g. “Confirm” or per call site: “Delete”, “Deactivate”, “Approve”, “Reject”)
  - `cancelLabel` (default “Cancel”)
  - `tone` / `variant` (e.g. `default`, `danger` for red buttons).
  - `onConfirm`, `onCancel` callbacks.
- UI behavior:
  - Semi-opaque backdrop.
  - Centered card with title, description, and two buttons (Cancel + primary action).
  - ESC or clicking backdrop should behave like “Cancel”.
- **All** critical actions below must invoke this confirmation modal:
  - Delete user.
  - Deactivate user account.
  - Delete pet.
  - Delete review.
  - Approve KYC.
  - Reject KYC.
  - Sign out.

---

## 2. Dashboard Page

Route: `/[locale]/admin/dashboard`

### 2.1 Content Focus

The dashboard should emphasise **platform insights**, not raw lists. Using **mock data**, include:

- **Summary metrics** (cards):
  - Total verified users.
  - Active care contracts.
  - Points in circulation.
  - Pending KYC submissions.
- **Recent activity list**:
  - Items like “New KYC submission from X”, “Care request Y completed”, “User Z joined” with timestamps.
- **Graphs/Charts** (mocked):
  - A simple area/line chart for “Platform growth” (e.g., users over time).
  - A bar/pie chart for “Care given vs. care received” or “Points earned vs. spent”.
  - These can be implemented with a small chart library or as simple CSS/SVG shapes; they do not have to show real data, but should look realistic.
- Ensure all cards:
  - Use the same background and shadows as the rest of the admin UI.
  - Are responsive and stack properly on small screens.

---

## 3. KYC Reviews Page

Route: `/[locale]/admin/kyc`

### 3.1 Layout & Filters

Replace the current table with a **card grid**, based on the sketch:

- Top section:
  - Page title + subtitle (already present).
  - **Search bar** on the right: filters KYC submissions by user name/email (mocked client-side filter).
  - Optional settings/filter icon can be kept as a stub button.
- Filters just below header:
  - Tabs or pill buttons: **Pending**, **Completed**, **Approved**, **Rejected**.
  - Clicking a filter shows only cards with that status (mock data).

### 3.2 KYC Card Design (per your sketch)

For each submission, render a card with:

- **Top area: swipeable image strip**:
  - Shows the current image (ID front, ID back, selfie, etc.).
  - Navigation:
    - Left/right arrows and/or horizontal swipe (on mobile).
    - Dots under the image to indicate which of `n` images is active (e.g., `• ○ ○`).
  - Clicking anywhere in this image area opens the **image modal** (see 3.3).
- **Middle content**:
  - User name and email.
  - Submitted date/time.
  - Document type (e.g., Government ID, Passport, Proof of Address).
  - Current status (Pending / Approved / Rejected / Completed) as a pill/badge.
  - Optional notes snippet.
- **Bottom actions**:
  - Two buttons spanning the width:
    - **Approve** (primary).
    - **Reject** (danger).
  - Buttons follow the rounded-pill style similar to your sketch.

All cards should:

- Use `bg-surface-container-lowest` (or equivalent) with border + shadow.
- Stack in a single column on small screens and in a multi-column grid on larger screens.

### 3.3 KYC Image Modal

When the image at the top of a card is clicked:

- Open a **full-width modal** (or large dialog) showing a bigger image.
- Include:
  - Index label `1/3` in the top corner.
  - The image itself centered.
  - Dots under the image to indicate position.
  - Left/right buttons to navigate between images.
- Use the same mock image URLs for each KYC submission as you choose for the cards.

### 3.4 Actions & Confirmation Flows

Actions on each card:

- **Approve**:
  - Opens confirmation modal.
  - Title example: “Approve KYC for John Doe?”
  - Description: short explanation of what approval means.
  - Confirm button: “Approve” (green or primary tone).
  - For now, just update the mock status to `Approved` in state.
- **Reject**:
  - Opens confirmation modal **with a required reason input**:
    - Textarea labeled “Rejection reason” (cannot be empty).
    - Confirm button disabled until something is entered.
  - On confirm, update mock status to `Rejected` and store the reason.
- "View details" (optional extra button or icon):
  - Could re-open the same image modal or show a slightly richer info modal. This is optional; core requirement is the image modal + approve/reject flows.

---

## 4. Care Requests Page

Route: `/[locale]/admin/requests`

### 4.1 Changes

- **Remove** the “New Request” button from the header/actions.
- Keep the table-based layout but ensure:
  - Columns are relevant (owner, pet, care type, dates, status, points, actions).
  - Rows are responsive: on smaller screens, stack columns or use a card-like row.
- Actions (for now, mock only):
  - View request (optional).
  - Change status (optional stub for later).

No complex action logic is required at this stage beyond sensible layout and responsiveness.

---

## 5. Users Page

Route: `/[locale]/admin/users`

### 5.1 Remove Add User

- Remove any “Add New User” button from the header/actions.

### 5.2 Search & Filters

- Add a **search bar** above the table:
  - Filters mock users by name or email (client-side).
- Add **sorting/filter controls**:
  - Sort by:
    - Points (ascending/descending).
    - Most care given.
    - Most care received.
  - Implementation can be:
    - A select dropdown + direction toggle, or
    - Several pill buttons (“Most points”, “Most care given”, etc.).

### 5.3 User Actions

For each user row in the table:

- Add an “Actions” column with either:
  - A dropdown menu, or
  - Two small buttons.
- Actions:
  - **Delete user** → opens confirmation modal (danger tone). On confirm, remove from mock data.
  - **Deactivate account** → opens confirmation modal. On confirm, mark user as “Deactivated” (e.g., show status badge and greyed row).

Ensure table is responsive (stack columns or use overflow-x for small screens).

---

## 6. Pets Page (New)

Route: `/[locale]/admin/pets`

### 6.1 Data & Columns

Create a new `Pets` admin page using **mock data** representing all pets in the system.

Table columns (example structure):

- Pet:
  - Name.
  - Species / Breed.
- Owner:
  - Owner name.
  - Owner email.
- Attributes:
  - Age or DOB.
  - Energy level.
  - Any tag like “Special needs”.
- Actions:
  - Delete pet.

### 6.2 Search & Filters

- Search bar filtering by pet name or owner name/email.
- Optional filters:
  - Species (Dog, Cat, Other).
  - Energy level.

### 6.3 Actions

- **Delete pet**:
  - Uses confirmation modal.
  - On confirm, remove pet from mock data.

Make layout consistent with the Users and Care Requests tables and responsive.

---

## 7. Reviews Page (New)

Route: `/[locale]/admin/reviews` **OR** reuse `/[locale]/admin/reports` if you prefer – but spec calls this “Reviews tab”, so a dedicated page is best.

### 7.1 Data & Columns

Mock reviews table containing:

- Stars rating (1–5) rendered as icons.
- Reviewer (name/email).
- Reviewee (name/email or role: “Taker” / “Owner”).
- Excerpt of review text (shortened if long).
- Date.
- Actions:
  - Delete review.

### 7.2 Actions

- **Delete review**:
  - Confirmation modal.
  - On confirm, remove from mock data.

---

## 8. Reports Page

Route: `/[locale]/admin/reports`

No major structural changes requested beyond keeping it in the correct nav order. Ensure:

- It still provides a table or card layout of reported users/content.
- Actions to “Dismiss” or “Take action” can remain mocked.

---

## 9. Contact Page (New)

Route: `/[locale]/admin/contact`

Simple static page with:

- Admin/support contact email.
- Optional contact form mockup (no real submit required; can show a disabled button or placeholder).
- Links to key documents (Privacy, Terms).

Styling should match the admin theme (cards, headings, etc.).

---

## 10. Responsiveness & Completion Criteria

To satisfy the **25% payment milestone** and the requirements you outlined:

- Every admin page (Dashboard, KYC, Requests, Users, Pets, Reports, Contact) must:
  - Render correctly from mobile widths (~375px) up through desktop.
  - Use stacking/scrolling patterns that keep content readable and accessible.
  - Ensure critical buttons and modals work on narrow screens.
- All destructive actions must go through the shared confirmation modal.
- The KYC card + image modal UX must match the sketch closely (swipeable images, clear Approve/Reject).
- Language toggle (EN/FR) is in place and will govern static admin text once translations are expanded.

All of this will be implemented against **mock data only** for now, so you can validate the UX and flows before we wire in Supabase and real backend logic.

