import { useState } from "react";
import { Avatar, Badge, Icon } from "./UI";
import { ICONS, avatarColor } from "../utils/data";
import { allowedSections, ROLE_LABELS, ROLE_COLORS } from "../utils/permissions";

// All possible nav items
const ALL_NAV = [
  { key:"dashboard",     label:"Dashboard",     icon:ICONS.dashboard,  group:"Overview"       },
  { key:"my_dashboard",  label:"My Dashboard",  icon:ICONS.dashboard,  group:"Overview"       },
  { key:"orgchart",      label:"Org Chart",     icon:ICONS.orgchart,   group:"Overview"       },
  { key:"team",          label:"Team Members",  icon:ICONS.users,      group:"People"         },
  { key:"onboarding",    label:"Onboarding",    icon:ICONS.onboard,    group:"People"         },
  { key:"offboarding",   label:"Offboarding",   icon:ICONS.offboard,   group:"People"         },
  { key:"requests",      label:"Requests",      icon:ICONS.inbox,      group:"Operations"     },
  { key:"my_requests",   label:"My Requests",   icon:ICONS.inbox,      group:"Operations"     },
  { key:"inventory",     label:"Inventory",     icon:ICONS.box,        group:"Operations"     },
  { key:"invoices",      label:"Invoices",      icon:ICONS.receipt,    group:"Operations"     },
  { key:"timesheets",    label:"Timesheets",    icon:ICONS.clock,      group:"Operations"     },
  { key:"my_timesheets", label:"My Timesheets", icon:ICONS.clock,      group:"Operations"     },
  { key:"payroll",       label:"Payroll",       icon:ICONS.payroll,    group:"Finance & Comms"},
  { key:"announcements", label:"Announcements", icon:ICONS.megaphone,  group:"Finance & Comms"},
  { key:"roles",         label:"Roles & Access",icon:ICONS.shield,     group:"Administration" },
  { key:"my_profile",   label:"My Profile",    icon:ICONS.person,     group:"Overview"       },
];

const GROUP_ORDER = ["Overview","People","Operations","Finance & Comms","Administration"];

export default function Sidebar({ active, setActive, currentUser, badges = {}, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  const allowed   = allowedSections(currentUser.systemRole);
  const navItems  = ALL_NAV.filter((n) => allowed.includes(n.key));
  const roleColor = ROLE_COLORS[currentUser.systemRole] || "#6b7280";

  // Group them
  const groups = GROUP_ORDER.map((g) => ({ label:g, items:navItems.filter((n) => n.group===g) })).filter((g) => g.items.length > 0);

  return (
    <div style={{ width:collapsed?64:244, background:"#0c0c11", flexShrink:0, display:"flex", flexDirection:"column", transition:"width 0.2s ease", overflow:"hidden", borderRight:"1px solid #1a1a25" }}>
      {/* Logo */}
      <div style={{ padding:collapsed?"18px 14px":"20px 18px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid #1a1a25" }}>
        <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Icon d={ICONS.dashboard} size={15} stroke="#fff" />
        </div>
        {!collapsed && <div><div style={{ fontSize:14, fontWeight:800, color:"#fff" }}>WorkSpace</div><div style={{ fontSize:10, color:"#3d3d52" }}>Office Manager</div></div>}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"8px 8px", overflowY:"auto" }}>
        {groups.map((group) => (
          <div key={group.label} style={{ marginBottom:4 }}>
            {!collapsed && <div style={{ fontSize:9.5, fontWeight:700, color:"#2e2e40", textTransform:"uppercase", letterSpacing:"0.1em", padding:"10px 12px 4px" }}>{group.label}</div>}
            {group.items.map((item) => {
              const isActive = active === item.key;
              const badge    = badges[item.key];
              return (
                <button key={item.key} onClick={() => setActive(item.key)}
                  style={{ display:"flex", alignItems:"center", gap:9, width:"100%", padding:"8px 12px", borderRadius:8, border:"none", background:isActive?"#18182a":"transparent", color:isActive?"#fff":"#55556a", cursor:"pointer", marginBottom:1, transition:"all 0.12s", fontFamily:"inherit", position:"relative" }}>
                  <span style={{ color:isActive?"#818cf8":"inherit", flexShrink:0, display:"flex" }}><Icon d={item.icon} size={16} /></span>
                  {!collapsed && <span style={{ fontSize:13, fontWeight:isActive?700:500, whiteSpace:"nowrap", flex:1, textAlign:"left" }}>{item.label}</span>}
                  {badge>0 && !collapsed && <span style={{ background:"#6366f1", color:"#fff", borderRadius:20, fontSize:10, fontWeight:700, padding:"1px 6px", lineHeight:1.6 }}>{badge}</span>}
                  {badge>0 && collapsed && <span style={{ position:"absolute", top:5, right:5, width:7, height:7, borderRadius:"50%", background:"#6366f1" }} />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Current user + logout */}
      <div style={{ padding:"12px 8px", borderTop:"1px solid #1a1a25" }}>
        {!collapsed && (
          <div style={{ padding:"10px 12px", borderRadius:10, background:"#111117", marginBottom:6 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <Avatar initials={currentUser.avatar} size={30} color={avatarColor(currentUser.name)} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{currentUser.name}</div>
                <Badge label={ROLE_LABELS[currentUser.systemRole]} color={roleColor} />
              </div>
            </div>
          </div>
        )}
        <button onClick={onLogout}
          style={{ display:"flex", alignItems:"center", gap:9, width:"100%", padding:"8px 12px", borderRadius:8, border:"none", background:"transparent", color:"#55556a", cursor:"pointer", fontFamily:"inherit" }}>
          <Icon d={ICONS.logout} size={15} />
          {!collapsed && <span style={{ fontSize:12 }}>Sign out</span>}
        </button>
        <button onClick={() => setCollapsed((p)=>!p)}
          style={{ display:"flex", alignItems:"center", gap:9, width:"100%", padding:"8px 12px", borderRadius:8, border:"none", background:"transparent", color:"#2e2e40", cursor:"pointer", fontFamily:"inherit" }}>
          <div style={{ transform:collapsed?"rotate(0deg)":"rotate(180deg)", transition:"transform 0.2s", display:"flex" }}><Icon d={ICONS.chevronRight} size={15} /></div>
          {!collapsed && <span style={{ fontSize:12 }}>Collapse</span>}
        </button>
      </div>
    </div>
  );
}
