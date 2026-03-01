import { ICONS } from "../utils/data";

export const Icon = ({ d, size = 20, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export const AVATAR_COLORS_LIST = ["#6366f1","#0ea5e9","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#84cc16"];
export const avatarColorFn = (name) => AVATAR_COLORS_LIST[(name||"A").charCodeAt(0) % AVATAR_COLORS_LIST.length];

export const Avatar = ({ initials, size = 36, color = "#6366f1" }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.36, fontWeight:700, color:"#fff", flexShrink:0, fontFamily:"inherit" }}>
    {initials}
  </div>
);

export const Badge = ({ label, color = "#6366f1", bg }) => (
  <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:600, color, background:bg||`${color}18`, letterSpacing:"0.03em" }}>
    {label}
  </span>
);

const STATUS_MAP = { pending:["#f59e0b","Pending"], approved:["#10b981","Approved"], rejected:["#ef4444","Rejected"], active:["#10b981","Active"], paid:["#10b981","Paid"], overdue:["#ef4444","Overdue"], submitted:["#6366f1","Submitted"], offboarded:["#6b7280","Offboarded"], processed:["#10b981","Processed"] };
export const StatusBadge = ({ status }) => {
  const [c, l] = STATUS_MAP[status] || ["#6b7280", status];
  return <Badge label={l} color={c} />;
};

const BV = { primary:{background:"#6366f1",color:"#fff",border:"none"}, secondary:{background:"#f4f4f5",color:"#374151",border:"1px solid #e5e7eb"}, danger:{background:"#fef2f2",color:"#ef4444",border:"1px solid #fecaca"}, ghost:{background:"transparent",color:"#6b7280",border:"1px solid #e5e7eb"}, success:{background:"#f0fdf4",color:"#10b981",border:"1px solid #bbf7d0"}, dark:{background:"#111",color:"#fff",border:"none"} };
const BS = { sm:{padding:"5px 12px",fontSize:12}, md:{padding:"8px 16px",fontSize:13}, lg:{padding:"11px 22px",fontSize:14} };
export const Btn = ({ children, onClick, variant="primary", size="md", icon, style={}, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ display:"inline-flex", alignItems:"center", gap:6, borderRadius:8, fontWeight:600, cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.5:1, transition:"all 0.15s", fontFamily:"inherit", ...BV[variant], ...BS[size], ...style }}>
    {icon && <Icon d={ICONS[icon]} size={14} />}{children}
  </button>
);

export const Input = ({ label, value, onChange, type="text", placeholder, required, style={} }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
    {label && <label style={{ fontSize:12, fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}{required&&" *"}</label>}
    <input type={type} value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder}
      style={{ padding:"9px 13px", borderRadius:8, border:"1px solid #e5e7eb", fontSize:14, fontFamily:"inherit", color:"#111", outline:"none", background:"#fafafa", ...style }} />
  </div>
);

export const Select = ({ label, value, onChange, options, required }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
    {label && <label style={{ fontSize:12, fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}{required&&" *"}</label>}
    <select value={value} onChange={(e)=>onChange(e.target.value)}
      style={{ padding:"9px 13px", borderRadius:8, border:"1px solid #e5e7eb", fontSize:14, fontFamily:"inherit", color:"#111", outline:"none", background:"#fafafa", cursor:"pointer" }}>
      <option value="">Select…</option>
      {options.map((o)=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
    </select>
  </div>
);

export const Textarea = ({ label, value, onChange, rows=3, placeholder }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
    {label && <label style={{ fontSize:12, fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</label>}
    <textarea value={value} onChange={(e)=>onChange(e.target.value)} rows={rows} placeholder={placeholder}
      style={{ padding:"9px 13px", borderRadius:8, border:"1px solid #e5e7eb", fontSize:14, fontFamily:"inherit", color:"#111", outline:"none", background:"#fafafa", resize:"vertical" }} />
  </div>
);

export const Card = ({ children, style={} }) => (
  <div style={{ background:"#fff", borderRadius:16, border:"1px solid #f0f0f0", boxShadow:"0 1px 4px rgba(0,0,0,0.04)", padding:24, ...style }}>{children}</div>
);

export const StatCard = ({ label, value, icon, color="#6366f1", sub }) => (
  <Card style={{ display:"flex", flexDirection:"column", gap:8 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div>
        <div style={{ fontSize:13, color:"#9ca3af", fontWeight:500, marginBottom:4 }}>{label}</div>
        <div style={{ fontSize:26, fontWeight:800, color:"#111", letterSpacing:"-0.02em" }}>{value}</div>
        {sub && <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>{sub}</div>}
      </div>
      <div style={{ width:44, height:44, borderRadius:12, background:`${color}15`, display:"flex", alignItems:"center", justifyContent:"center", color }}>
        <Icon d={icon} size={20} />
      </div>
    </div>
  </Card>
);

export const Modal = ({ open, title, onClose, children, width=540 }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={(e)=>e.stopPropagation()} style={{ background:"#fff", borderRadius:20, width, maxWidth:"100%", maxHeight:"90vh", overflow:"auto", boxShadow:"0 24px 64px rgba(0,0,0,0.18)" }}>
        <div style={{ padding:"22px 26px", borderBottom:"1px solid #f0f0f0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ margin:0, fontSize:17, fontWeight:700, color:"#111" }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:4 }}><Icon d={ICONS.x} size={20} /></button>
        </div>
        <div style={{ padding:"22px 26px" }}>{children}</div>
      </div>
    </div>
  );
};

export const Table = ({ cols, rows, empty="No data yet." }) => (
  <div style={{ overflowX:"auto" }}>
    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
      <thead><tr>{cols.map((c)=><th key={c.key} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:"1px solid #f0f0f0", whiteSpace:"nowrap" }}>{c.label}</th>)}</tr></thead>
      <tbody>
        {rows.length===0
          ? <tr><td colSpan={cols.length} style={{ padding:"32px 14px", textAlign:"center", color:"#9ca3af", fontSize:13 }}>{empty}</td></tr>
          : rows.map((row,i)=><tr key={row.id||i} style={{ borderBottom:"1px solid #fafafa" }}>{cols.map((c)=><td key={c.key} style={{ padding:"12px 14px", color:"#374151", verticalAlign:"middle" }}>{c.render?c.render(row):row[c.key]}</td>)}</tr>)}
      </tbody>
    </table>
  </div>
);

export const SectionHeader = ({ title, subtitle, action }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
    <div>
      <h2 style={{ margin:0, fontSize:22, fontWeight:800, color:"#111", letterSpacing:"-0.02em" }}>{title}</h2>
      {subtitle && <p style={{ margin:"4px 0 0", fontSize:14, color:"#9ca3af" }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const AccessDenied = ({ message = "You don't have permission to access this section." }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", textAlign:"center" }}>
    <div style={{ width:72, height:72, borderRadius:"50%", background:"#fef2f2", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
      <Icon d={ICONS.lock} size={32} stroke="#ef4444" />
    </div>
    <h2 style={{ margin:"0 0 8px", fontSize:20, fontWeight:800, color:"#111" }}>Access Restricted</h2>
    <p style={{ margin:0, color:"#9ca3af", fontSize:14, maxWidth:320 }}>{message}</p>
  </div>
);
