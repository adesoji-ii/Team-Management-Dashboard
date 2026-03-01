# WorkSpace — Office Management Dashboard
### With Role-Based Access Control (RBAC)

---

## 📁 File Structure

```
src/
├── App.jsx                          ← Root: auth gate + data + routing
│
├── context/
│   └── AuthContext.jsx              ← Login/logout state, current user
│
├── components/
│   ├── LoginScreen.jsx              ← User picker / sign-in screen
│   ├── Sidebar.jsx                  ← Role-aware nav (only shows allowed sections)
│   ├── Topbar.jsx                   ← Breadcrumb + current user badge
│   └── UI.jsx                       ← All shared primitives (Button, Card, Modal, Table…)
│
├── sections/
│   ├── AdminSections.jsx            ← Dashboard, Team, Requests, Payroll, etc.
│   ├── MemberSections.jsx           ← MyDashboard, MyProfile, MyRequests, MyTimesheets
│   └── RolesAccess.jsx              ← Role management (Super Admin only)
│
└── utils/
    ├── data.js                      ← Icons, helpers (uid/fmt/currency), seed data
    └── permissions.js               ← ROLES, PERMISSIONS matrix, can() helper
```

---

## 🚀 Quick Start

```bash
npm create vite@latest workspace -- --template react
cd workspace
# Replace src/ with this folder
npm install && npm run dev
```

Open http://localhost:5173

---

## 🔐 Role System

### The 6 Roles

| Role              | What They Can Do |
|-------------------|------------------|
| **Super Admin**   | Everything. Assigns roles. Full access to all modules. |
| **HR Manager**    | Team members, onboarding, offboarding, timesheets, announcements. |
| **Finance Officer** | Financial requests (advances/reimbursements), invoices, payroll. |
| **Inventory Manager** | Inventory management only. |
| **Approver**      | Approve/reject leave and travel requests. |
| **Team Member**   | Own profile, own requests, own timesheets, read announcements. |

### Permission Matrix

| Action                   | Super Admin | HR Manager | Finance | Inventory | Approver | Member |
|--------------------------|:-----------:|:----------:|:-------:|:---------:|:--------:|:------:|
| Approve leave            | ✓ | ✓ | — | — | ✓ | — |
| Approve travel           | ✓ | — | — | — | ✓ | — |
| Approve financial reqs   | ✓ | — | ✓ | — | — | — |
| Manage team members      | ✓ | ✓ | — | — | — | — |
| Manage inventory         | ✓ | — | — | ✓ | — | — |
| View payroll             | ✓ | — | ✓ | — | — | — |
| Run payroll              | ✓ | — | ✓ | — | — | — |
| Manage invoices          | ✓ | — | ✓ | — | — | — |
| Post announcements       | ✓ | ✓ | — | — | — | — |
| Approve timesheets       | ✓ | ✓ | — | — | — | — |
| Manage roles             | ✓ | — | — | — | — | — |

### How Approval Routing Works

- **Leave requests** → HR Manager or Approver
- **Travel requests** → Approver or Super Admin
- **Cash Advances / Reimbursements** → Finance Officer only
- If you don't have permission to approve a request type, you'll see a "No permission" badge instead of action buttons

---

## 👤 Member Dashboard

Team members (and anyone) see a personal view:

- **My Dashboard** — Personal KPI cards, recent requests, latest announcements
- **My Profile** — Name, role, department, manager, system role, direct reports
- **My Requests** — Submit and track leave, travel, advance, reimbursement
- **My Timesheets** — Submit and view own weekly hours
- **Announcements** — Read-only view of all notices

---

## 🛠 Assigning Roles (Super Admin)

1. Sign in as **Elena Torres** (Super Admin)
2. Go to **Roles & Access** in the sidebar
3. Find any team member in the table
4. Click **Change Role** → select new role → **Save**
5. The change takes effect immediately — their sidebar and permissions update on next login

---

## 🧩 Adding a New Role or Permission

**In `src/utils/permissions.js`:**

```js
// Add to ROLES
export const ROLES = {
  ...
  COMPLIANCE_OFFICER: "compliance_officer",
};

// Add sections they can see
sections: {
  compliance_officer: ["dashboard", "invoices", "payroll"],
  ...
}

// Add to any permission actions
can: {
  view_payroll: ["super_admin", "finance_officer", "compliance_officer"],
  ...
}
```

Then add a card for them in `RolesAccess.jsx` descriptions.

---

## 💾 Persistence

Uses `window.storage` (Claude artifact sandbox). For local dev, swap with `localStorage`:

```js
// In App.jsx replace:
window.storage?.get("wsOfficeV4").then(...)
window.storage?.set("wsOfficeV4", ...)

// With:
const saved = localStorage.getItem("wsOfficeV4");
if (saved) setData(JSON.parse(saved));
// ...
localStorage.setItem("wsOfficeV4", JSON.stringify(data));
```

---

## 🎭 Demo Accounts

| Name          | Role              | System Role       |
|---------------|-------------------|-------------------|
| Elena Torres  | CEO               | Super Admin       |
| Sofia Reyes   | HR Manager        | HR Manager        |
| Marcus Webb   | Finance Lead      | Finance Officer   |
| Devon Clarke  | Ops Lead          | Inventory Manager |
| Amara Osei    | Product Manager   | Approver          |
| Jordan Lee    | Sr. Engineer      | Team Member       |
| Priya Nair    | UX Designer       | Team Member       |
