// ─────────────────────────────────────────────────────────────────────────────
// ROLES
// ─────────────────────────────────────────────────────────────────────────────
export const ROLES = {
  SUPER_ADMIN:       "super_admin",
  HR_MANAGER:        "hr_manager",
  FINANCE_OFFICER:   "finance_officer",
  INVENTORY_MANAGER: "inventory_manager",
  APPROVER:          "approver",
  TEAM_MEMBER:       "team_member",
};

export const ROLE_LABELS = {
  super_admin:       "Super Admin",
  hr_manager:        "HR Manager",
  finance_officer:   "Finance Officer",
  inventory_manager: "Inventory Manager",
  approver:          "Approver",
  team_member:       "Team Member",
};

export const ROLE_COLORS = {
  super_admin:       "#6366f1",
  hr_manager:        "#8b5cf6",
  finance_officer:   "#0ea5e9",
  inventory_manager: "#10b981",
  approver:          "#f59e0b",
  team_member:       "#6b7280",
};

// ─────────────────────────────────────────────────────────────────────────────
// PERMISSIONS — what each role can access/do
// ─────────────────────────────────────────────────────────────────────────────
export const PERMISSIONS = {
  // Nav sections each role can SEE
  sections: {
    super_admin:       ["dashboard","orgchart","team","onboarding","offboarding","requests","inventory","invoices","timesheets","payroll","announcements","roles"],
    hr_manager:        ["dashboard","orgchart","team","onboarding","offboarding","requests","timesheets","announcements"],
    finance_officer:   ["dashboard","requests","invoices","payroll"],
    inventory_manager: ["dashboard","inventory"],
    approver:          ["dashboard","requests"],
    team_member:       ["my_dashboard","my_profile","my_requests","my_timesheets","announcements"],
  },

  // Granular action permissions
  can: {
    // Approvals
    approve_requests:      ["super_admin","hr_manager","finance_officer","approver"],
    approve_financial:     ["super_admin","finance_officer"],   // advances + reimbursements
    approve_leave:         ["super_admin","hr_manager","approver"],
    approve_travel:        ["super_admin","approver"],

    // Financial
    view_payroll:          ["super_admin","finance_officer"],
    run_payroll:           ["super_admin","finance_officer"],
    view_invoices:         ["super_admin","finance_officer"],
    manage_invoices:       ["super_admin","finance_officer"],

    // Inventory
    view_inventory:        ["super_admin","inventory_manager","finance_officer"],
    manage_inventory:      ["super_admin","inventory_manager"],

    // People
    manage_members:        ["super_admin","hr_manager"],
    onboard_members:       ["super_admin","hr_manager"],
    offboard_members:      ["super_admin","hr_manager"],
    view_all_timesheets:   ["super_admin","hr_manager","finance_officer"],
    approve_timesheets:    ["super_admin","hr_manager"],

    // Announcements
    post_announcements:    ["super_admin","hr_manager"],
    view_announcements:    ["super_admin","hr_manager","finance_officer","inventory_manager","approver","team_member"],

    // Org / Roles
    manage_roles:          ["super_admin"],
    view_orgchart:         ["super_admin","hr_manager","approver","team_member"],
  },
};

// Helper — check if a role has a permission
export const can = (role, action) =>
  (PERMISSIONS.can[action] || []).includes(role);

// Helper — get sections a role can see
export const allowedSections = (role) =>
  PERMISSIONS.sections[role] || PERMISSIONS.sections.team_member;
