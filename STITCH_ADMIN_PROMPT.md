# Stitch prompt: PawTaker Admin Panel UI

Copy the block below into Stitch to generate the admin panel UI. It describes the panel, every page, and the exact color palette to use.

---

## Prompt (copy from here)

Generate a complete admin panel UI for **PawTaker**, an internal dashboard for a community pet-care app (points-based sitting, no money). Use **Next.js App Router**, **Tailwind CSS**, and the **exact color palette** below. The app already has a shell: a fixed left sidebar (brand + nav links) and a main content area; generate the **layout and all page contents** so the UI is consistent and uses our tokens.

### Layout structure
- **Sidebar (left, fixed, ~256px):** Brand “PawTaker” + “Admin Panel” subtitle at top; vertical nav for: Dashboard, Users, KYC Review, Care Requests, Reports, Settings; optional footer line “Admin”. Sidebar uses **primary** background and **on-primary** text.
- **Main (right):** Scrollable content area; **background-base** behind **surface** cards/panels. Each page has a clear page title and content sections.

### Pages to generate

1. **Login** (`/admin/login`)  
   Centered card: title “Admin Login”, email and password inputs, “Sign In” button, optional “Forgot password?”. Use **surface-container-lowest** for the card, **primary** for button and title, **outline** for borders.

2. **Dashboard** (`/admin/dashboard`)  
   - Top: page title “Dashboard”.  
   - Row of **4 metric cards** (e.g. Total Users, Active Requests, Pending KYC, Open Reports) with label + large number; use **primary**, **secondary**, **tertiary**, **error** for the numbers.  
   - Below: “Recent activity” list (items with text + time). Cards and list on **surface-container-lowest**, borders **frame-stroke**.

3. **Users** (`/admin/users`)  
   - Title “Users” + search input (placeholder: “Search by name or email…”).  
   - Table: columns Name, Email, KYC Status, Points, Joined. Rows with alternating or hover state. KYC status as small pills: **approved** (success), **submitted** (warning), **pending** (neutral), **rejected** (error). Table on **surface-container-lowest**, **outline** for borders.

4. **KYC Review** (`/admin/kyc`)  
   - Title “KYC Review”.  
   - List or table of submissions: user, document type, status (pending/approved/rejected), actions (e.g. Approve / Reject). Use **surface-container-lowest** cards or table, **primary** for primary actions.

5. **Care Requests** (`/admin/requests`)  
   - Title “Care Requests”.  
   - List/cards of requests: pet, owner, dates, status (open/matched/active/completed/cancelled), points. Filters or tabs by status if you like. Same surface and border rules.

6. **Reports** (`/admin/reports`)  
   - Title “Reports”.  
   - List of user reports: reporter, reported user/request, reason, status, actions (e.g. Dismiss / Take action). **error** or **error-container** only for report-related highlights.

7. **Settings** (`/admin/settings`)  
   - Title “Settings”.  
   - Simple form or sections: e.g. site name, support email, feature flags. Primary button to “Save”. Use **primary** for buttons, **surface-container** for sections.

### Color palette (use these hex values)

**Light theme only for this admin UI.**

| Role | Hex | Use for |
|------|-----|--------|
| **Primary** | `#8c4a60` | Sidebar bg, buttons, links, key numbers |
| **On primary** | `#ffffff` | Text and icons on primary (sidebar, buttons) |
| **Primary container** | `#ffd9e2` | Soft backgrounds (e.g. hover on primary areas) |
| **On primary container** | `#703348` | Text on primary container |
| **Secondary** | `#74565f` | Secondary metrics, less prominent buttons |
| **On secondary** | `#ffffff` | Text on secondary |
| **Secondary container** | `#ffe0e8` | Light secondary backgrounds |
| **On secondary container** | `#5a3f47` | Text on secondary container |
| **Tertiary** | `#7c5635` | Tertiary metrics, accents |
| **On tertiary** | `#ffffff` | Text on tertiary |
| **Error** | `#ba1a1a` | Error states, open reports, reject actions |
| **On error** | `#ffffff` | Text on error |
| **Error container** | `#ffdad6` | Light error backgrounds (alerts) |
| **Background (base)** | `#f5f0f0` | Page background |
| **Surface** | `#fff8f8` | Main content surface |
| **On surface** | `#22191c` | Body text, headings |
| **Surface variant** | `#f2dde1` | Subtle panels |
| **On surface variant** | `#665459` | Muted text |
| **Surface container** | `#faf2f4` | Cards/sections |
| **Surface container lowest** | `#ffffff` | Cards, modals, tables |
| **Outline** | `#837377` | Borders, dividers |
| **Outline variant** | `#d5c2c6` | Lighter borders |
| **Frame stroke** | `#e8e7e7` | Card/list borders |

Use **semantic names** in Tailwind (e.g. `bg-primary`, `text-on-surface`, `border-outline`) and map them in your config to these hex values so the generated UI matches the palette exactly.

### Tech and style
- **Stack:** Next.js 16 (App Router), React 19, Tailwind CSS.  
- **No auth logic** in the generated UI (assume routes are protected elsewhere).  
- **Accessible:** focus states (e.g. `ring-2 ring-primary`), labels, contrast.  
- **Responsive:** sidebar can collapse to a drawer on small screens if you like; main content stacks cleanly.  
- **Tone:** Clean, minimal, professional; no playful illustrations in the admin area.

Generate the layout (sidebar + main), all seven pages above, and shared components (e.g. cards, tables, status pills) so the admin panel is ready to plug into our existing routes and data.

---

## End of prompt
