import { Avatar, Badge, Icon } from "./UI";
import { ICONS, avatarColor } from "../utils/data";
import { ROLE_LABELS, ROLE_COLORS } from "../utils/permissions";

const SECTION_LABELS = {
  dashboard:"Dashboard", my_dashboard:"My Dashboard", orgchart:"Org Chart",
  team:"Team Members", onboarding:"Onboarding", offboarding:"Offboarding",
  requests:"Requests", my_requests:"My Requests", inventory:"Inventory",
  invoices:"Invoices & Receipts", timesheets:"Timesheets", my_timesheets:"My Timesheets",
  payroll:"Payroll", announcements:"Announcements", roles:"Roles & Access", my_profile:"My Profile",
};

export default function Topbar({ active, pendingCount, currentUser }) {
  const roleColor = ROLE_COLORS[currentUser.systemRole] || "#6b7280";
  return (
    <div style={{ background:"#fff", borderBottom:"1px solid #f0f0f0", padding:"12px 26px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ fontSize:12, color:"#d1d5db" }}>WorkSpace</span>
        <Icon d={ICONS.chevronRight} size={13} stroke="#e5e7eb" />
        <span style={{ fontSize:13, fontWeight:700, color:"#111" }}>{SECTION_LABELS[active] || active}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        {pendingCount > 0 && (
          <div style={{ position:"relative" }}>
            <button style={{ background:"#f4f4f5", border:"none", width:36, height:36, borderRadius:9, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#6b7280" }}>
              <Icon d={ICONS.bell} size={17} />
            </button>
            <span style={{ position:"absolute", top:-2, right:-2, width:16, height:16, borderRadius:"50%", background:"#ef4444", color:"#fff", fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{pendingCount}</span>
          </div>
        )}
        <div style={{ width:1, height:22, background:"#f0f0f0" }} />
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Avatar initials={currentUser.avatar} size={32} color={avatarColor(currentUser.name)} />
          <div>
            <div style={{ fontSize:13, fontWeight:700, lineHeight:1.2 }}>{currentUser.name}</div>
            <Badge label={ROLE_LABELS[currentUser.systemRole]} color={roleColor} />
          </div>
        </div>
      </div>
    </div>
  );
}
