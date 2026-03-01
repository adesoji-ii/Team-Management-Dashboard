import { useState } from "react";
import { Avatar, Badge, Btn, Card, Modal, Select, SectionHeader, StatusBadge, Table } from "../components/UI";
import { avatarColor, ICONS } from "../utils/data";
import { ROLE_LABELS, ROLE_COLORS, ROLES, can } from "../utils/permissions";
import { useAuth } from "../context/AuthContext";

const ROLE_DESCRIPTIONS = {
  super_admin:       "Full access to everything. Can assign roles and manage the entire platform.",
  hr_manager:        "Manages onboarding, offboarding, team members, timesheets, and announcements.",
  finance_officer:   "Handles financial requests, invoices, payroll, and cash advances.",
  inventory_manager: "Manages office inventory, assets, and equipment tracking.",
  approver:          "Can approve or reject leave, travel, and general requests.",
  team_member:       "Standard employee access: own profile, requests, timesheets, and announcements.",
};

export default function RolesAccess({ data, setData }) {
  const { currentUser } = useAuth();
  const [modal, setModal]     = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [newRole, setNewRole] = useState("");

  if (!can(currentUser.systemRole, "manage_roles")) {
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
        <h2 style={{ margin:"0 0 8px", fontSize:20, fontWeight:800 }}>Super Admins Only</h2>
        <p style={{ color:"#9ca3af", fontSize:14 }}>Only Super Admins can manage roles and permissions.</p>
      </div>
    );
  }

  const openEdit = (member) => { setEditMember(member); setNewRole(member.systemRole); setModal(true); };
  const saveRole = () => {
    if (!editMember || !newRole) return;
    setData((p) => ({ ...p, members: p.members.map((m) => m.id === editMember.id ? { ...m, systemRole: newRole } : m) }));
    setModal(false); setEditMember(null);
  };

  const activeMembers = data.members.filter((m) => m.status === "active");
  const roleCounts    = Object.fromEntries(Object.keys(ROLES).map((r) => [ROLES[r], activeMembers.filter((m) => m.systemRole === ROLES[r]).length]));

  return (
    <div>
      <SectionHeader title="Roles & Access" subtitle="Control who can access and manage each part of WorkSpace" />

      {/* Role overview cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:28 }}>
        {Object.entries(ROLES).map(([, roleKey]) => {
          const color = ROLE_COLORS[roleKey];
          const count = roleCounts[roleKey] || 0;
          return (
            <Card key={roleKey} style={{ padding:18, borderTop:`3px solid ${color}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <Badge label={ROLE_LABELS[roleKey]} color={color} />
                <span style={{ fontSize:20, fontWeight:800, color }}>{count}</span>
              </div>
              <p style={{ margin:0, fontSize:12, color:"#9ca3af", lineHeight:1.6 }}>{ROLE_DESCRIPTIONS[roleKey]}</p>
            </Card>
          );
        })}
      </div>

      {/* Member role table */}
      <Card>
        <h3 style={{ margin:"0 0 18px", fontSize:15, fontWeight:700 }}>Member Role Assignments</h3>
        <Table
          cols={[
            { key:"name", label:"Member", render:(m) => (
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <Avatar initials={m.avatar} size={34} color={avatarColor(m.name)} />
                <div><div style={{ fontWeight:600 }}>{m.name}</div><div style={{ fontSize:12, color:"#9ca3af" }}>{m.role} · {m.dept}</div></div>
              </div>
            )},
            { key:"systemRole", label:"Current Role", render:(m) => <Badge label={ROLE_LABELS[m.systemRole]||m.systemRole} color={ROLE_COLORS[m.systemRole]||"#6b7280"} /> },
            { key:"access", label:"Can Access", render:(m) => {
              const sections = {
                super_admin:"Everything", hr_manager:"People, Requests, Timesheets, Announcements",
                finance_officer:"Requests, Invoices, Payroll", inventory_manager:"Inventory",
                approver:"Requests (approve/reject)", team_member:"Own profile, requests & timesheets",
              };
              return <span style={{ fontSize:12, color:"#6b7280" }}>{sections[m.systemRole]||"—"}</span>;
            }},
            { key:"status", label:"Status", render:(m) => <StatusBadge status={m.status} /> },
            { key:"a", label:"", render:(m) => m.id !== currentUser.id && (
              <Btn size="sm" variant="ghost" icon="edit" onClick={() => openEdit(m)}>Change Role</Btn>
            )},
          ]}
          rows={activeMembers}
        />
      </Card>

      {/* Permission matrix */}
      <Card style={{ marginTop:20 }}>
        <h3 style={{ margin:"0 0 18px", fontSize:15, fontWeight:700 }}>Permission Matrix</h3>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:"2px solid #f0f0f0" }}>
                <th style={{ padding:"10px 14px", textAlign:"left", fontWeight:700, color:"#374151" }}>Permission</th>
                {Object.values(ROLES).map((r) => (
                  <th key={r} style={{ padding:"10px 10px", textAlign:"center", fontSize:11, fontWeight:700, color:ROLE_COLORS[r] }}>{ROLE_LABELS[r]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Approve Leave",          "approve_leave"],
                ["Approve Travel",         "approve_travel"],
                ["Approve Financial Reqs", "approve_financial"],
                ["Manage Team Members",    "manage_members"],
                ["Manage Inventory",       "manage_inventory"],
                ["View Payroll",           "view_payroll"],
                ["Run Payroll",            "run_payroll"],
                ["Manage Invoices",        "manage_invoices"],
                ["Post Announcements",     "post_announcements"],
                ["Approve Timesheets",     "approve_timesheets"],
                ["Manage Roles",           "manage_roles"],
              ].map(([label, action]) => (
                <tr key={action} style={{ borderBottom:"1px solid #fafafa" }}>
                  <td style={{ padding:"10px 14px", color:"#374151", fontWeight:500 }}>{label}</td>
                  {Object.values(ROLES).map((r) => {
                    const allowed = can(r, action);
                    return (
                      <td key={r} style={{ padding:"10px 10px", textAlign:"center" }}>
                        {allowed
                          ? <span style={{ color:"#10b981", fontSize:16 }}>✓</span>
                          : <span style={{ color:"#e5e7eb", fontSize:16 }}>—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit role modal */}
      <Modal open={modal} title={`Change Role — ${editMember?.name}`} onClose={() => setModal(false)}>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {editMember && (
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:16, background:"#f9fafb", borderRadius:12 }}>
              <Avatar initials={editMember.avatar} size={44} color={avatarColor(editMember.name)} />
              <div>
                <div style={{ fontWeight:700, fontSize:15 }}>{editMember.name}</div>
                <div style={{ fontSize:13, color:"#9ca3af" }}>{editMember.role} · {editMember.dept}</div>
              </div>
            </div>
          )}
          <Select label="New System Role" value={newRole} onChange={setNewRole}
            options={Object.entries(ROLES).map(([,v]) => ({ value:v, label:ROLE_LABELS[v] }))} />
          {newRole && (
            <div style={{ padding:14, background:`${ROLE_COLORS[newRole]}10`, borderRadius:10, border:`1px solid ${ROLE_COLORS[newRole]}30` }}>
              <div style={{ fontSize:12, fontWeight:700, color:ROLE_COLORS[newRole], marginBottom:4 }}>{ROLE_LABELS[newRole]}</div>
              <div style={{ fontSize:13, color:"#6b7280" }}>{ROLE_DESCRIPTIONS[newRole]}</div>
            </div>
          )}
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="secondary" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={saveRole} disabled={!newRole}>Save Role</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
