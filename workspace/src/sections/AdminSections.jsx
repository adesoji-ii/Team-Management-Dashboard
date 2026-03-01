import { useState } from "react";
import { Avatar, Badge, Btn, Card, Icon, Input, Modal, Select, SectionHeader, StatCard, StatusBadge, Table, Textarea, AccessDenied } from "../components/UI";
import { avatarColor, currency, fmt, ICONS, today, uid } from "../utils/data";
import { can } from "../utils/permissions";
import { useAuth } from "../context/AuthContext";

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export function Dashboard({ data }) {
  const pending         = data.requests.filter((r) => r.status === "pending").length;
  const activeMembers   = data.members.filter((m) => m.status === "active").length;
  const totalInventory  = data.inventory.reduce((s,i) => s+i.qty*i.value, 0);
  const overdueInvoices = data.invoices.filter((i) => i.status === "overdue").length;
  const pinned          = (data.announcements||[]).find((a) => a.pinned);
  const recentRequests  = [...data.requests].sort((a,b) => b.createdAt>a.createdAt?1:-1).slice(0,5);

  return (
    <div>
      <SectionHeader title="Dashboard" subtitle={new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})} />
      {pinned && (
        <div style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius:14, padding:"15px 20px", marginBottom:22, display:"flex", alignItems:"center", gap:14, color:"#fff" }}>
          <div style={{ fontSize:22 }}>📌</div>
          <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:700 }}>{pinned.title}</div><div style={{ fontSize:12, opacity:0.8, marginTop:2 }}>{pinned.body.slice(0,100)}…</div></div>
          <Badge label="Pinned" color="#fff" bg="rgba(255,255,255,0.2)" />
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        <StatCard label="Active Members"   value={activeMembers}                           icon={ICONS.users}   color="#6366f1" sub="All departments" />
        <StatCard label="Pending Requests" value={pending}                                 icon={ICONS.inbox}   color="#f59e0b" sub="Awaiting approval" />
        <StatCard label="Inventory Value"  value={`$${(totalInventory/1000).toFixed(0)}k`} icon={ICONS.box}     color="#10b981" sub="Total tracked" />
        <StatCard label="Overdue Invoices" value={overdueInvoices}                         icon={ICONS.receipt} color="#ef4444" sub="Needs attention" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20 }}>
        <Card>
          <h3 style={{ margin:"0 0 16px", fontSize:15, fontWeight:700 }}>Recent Requests</h3>
          {recentRequests.map((r) => (
            <div key={r.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #fafafa" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <Avatar initials={r.memberName.split(" ").map((n)=>n[0]).join("")} size={32} color={avatarColor(r.memberName)} />
                <div><div style={{ fontSize:13, fontWeight:600 }}>{r.title}</div><div style={{ fontSize:11, color:"#9ca3af" }}>{r.memberName} · {r.type} · {fmt(r.createdAt)}</div></div>
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card>
            <h3 style={{ margin:"0 0 12px", fontSize:15, fontWeight:700 }}>By Department</h3>
            {["Executive","Product","Engineering","Design","Finance","HR","Operations"].map((dept)=>{
              const count = data.members.filter((m)=>m.dept===dept&&m.status==="active").length;
              return (
                <div key={dept} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0" }}>
                  <span style={{ fontSize:12, color:"#374151" }}>{dept}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:60, height:5, borderRadius:3, background:"#f0f0f0" }}><div style={{ width:`${Math.min(100,count*25)}%`, height:"100%", borderRadius:3, background:"#6366f1" }} /></div>
                    <span style={{ fontSize:12, color:"#6b7280", fontWeight:600, minWidth:14 }}>{count}</span>
                  </div>
                </div>
              );
            })}
          </Card>
          <Card>
            <h3 style={{ margin:"0 0 12px", fontSize:15, fontWeight:700 }}>Quick Stats</h3>
            {[["Approved Requests",data.requests.filter((r)=>r.status==="approved").length,"#10b981"],["Invoices Paid",data.invoices.filter((i)=>i.status==="paid").length,"#6366f1"],["Announcements",(data.announcements||[]).length,"#f59e0b"],["Payroll Runs",(data.payroll||[]).length,"#0ea5e9"]].map(([l,v,c])=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #fafafa" }}>
                <span style={{ fontSize:12, color:"#6b7280" }}>{l}</span>
                <span style={{ fontSize:13, fontWeight:700, color:c }}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── ORG CHART ────────────────────────────────────────────────────────────────
function OrgNode({ member, members, depth=0 }) {
  const [exp, setExp] = useState(true);
  const children = members.filter((m) => m.managerId===member.id);
  const color = avatarColor(member.name);
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div onClick={()=>children.length>0&&setExp((p)=>!p)}
        style={{ background:"#fff", border:`2px solid ${depth===0?color:"#e5e7eb"}`, borderRadius:14, padding:"12px 14px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, width:136, cursor:children.length>0?"pointer":"default", boxShadow:depth===0?`0 6px 24px ${color}25`:"0 1px 4px rgba(0,0,0,0.06)", position:"relative" }}>
        <Avatar initials={member.avatar} size={38} color={color} />
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#111" }}>{member.name}</div>
          <div style={{ fontSize:10, color:"#9ca3af", marginTop:1 }}>{member.role}</div>
          <Badge label={member.dept} color={color} />
        </div>
        {children.length>0 && <div style={{ position:"absolute", bottom:-9, left:"50%", transform:"translateX(-50%)", width:18, height:18, borderRadius:"50%", background:color, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #fff" }}><Icon d={exp?ICONS.chevronDown:ICONS.chevronRight} size={9} stroke="#fff" /></div>}
      </div>
      {children.length>0&&exp&&(
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
          <div style={{ width:2, height:28, background:"#e5e7eb" }} />
          <div style={{ display:"flex", gap:18, alignItems:"flex-start", position:"relative" }}>
            {children.length>1&&<div style={{ position:"absolute", top:0, height:2, background:"#e5e7eb", left:`calc(50% - ${(children.length-1)*77}px)`, right:`calc(50% - ${(children.length-1)*77}px)` }} />}
            {children.map((child)=><div key={child.id} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}><div style={{ width:2, height:20, background:"#e5e7eb" }} /><OrgNode member={child} members={members} depth={depth+1} /></div>)}
          </div>
        </div>
      )}
    </div>
  );
}

export function OrgChart({ data }) {
  const active  = data.members.filter((m) => m.status==="active");
  const roots   = active.filter((m) => !m.managerId||!active.find((a)=>a.id===m.managerId));
  const depts   = Array.from(new Set(active.map((m)=>m.dept)));
  const [view, setView] = useState("chart");
  const [deptF, setDeptF] = useState("All");
  return (
    <div>
      <SectionHeader title="Organisation Chart" subtitle={`${active.length} active members · ${depts.length} departments`}
        action={<div style={{ display:"flex", background:"#f4f4f5", borderRadius:8, padding:3 }}>{[{v:"chart",l:"🌳 Tree"},{v:"list",l:"📋 Cards"}].map(({v,l})=><button key={v} onClick={()=>setView(v)} style={{ padding:"6px 14px", borderRadius:6, border:"none", fontFamily:"inherit", fontSize:12, fontWeight:600, cursor:"pointer", background:view===v?"#fff":"transparent", color:view===v?"#111":"#6b7280" }}>{l}</button>)}</div>} />
      {view==="chart"?(
        <Card style={{ padding:36, overflowX:"auto" }}>
          <div style={{ display:"flex", gap:14, marginBottom:28, flexWrap:"wrap", justifyContent:"center" }}>
            {depts.map((d)=><div key={d} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#6b7280" }}><div style={{ width:8, height:8, borderRadius:"50%", background:avatarColor(d) }} />{d}</div>)}
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:700 }}>
            {roots.map((r)=><OrgNode key={r.id} member={r} members={active} />)}
          </div>
        </Card>
      ):(
        <div>
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            {["All",...depts].map((d)=><button key={d} onClick={()=>setDeptF(d)} style={{ padding:"5px 12px", borderRadius:20, border:`1px solid ${deptF===d?"#6366f1":"#e5e7eb"}`, background:deptF===d?"#eef2ff":"#fff", color:deptF===d?"#6366f1":"#6b7280", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{d}</button>)}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {active.filter((m)=>deptF==="All"||m.dept===deptF).map((m)=>{
              const manager=active.find((a)=>a.id===m.managerId);
              const rpts=active.filter((a)=>a.managerId===m.id);
              const color=avatarColor(m.name);
              return <Card key={m.id} style={{ padding:16 }}><div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}><Avatar initials={m.avatar} size={38} color={color} /><div><div style={{ fontSize:13, fontWeight:700 }}>{m.name}</div><div style={{ fontSize:11, color:"#9ca3af" }}>{m.role}</div></div></div>{[["Dept",<Badge label={m.dept} color={color} />],["Reports to",manager?.name||"—"],["Reports",<span style={{ fontWeight:700, color:rpts.length>0?"#6366f1":"#9ca3af" }}>{rpts.length}</span>]].map(([k,v])=><div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"4px 0", borderTop:"1px solid #fafafa", fontSize:12 }}><span style={{ color:"#9ca3af" }}>{k}</span>{v}</div>)}</Card>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TEAM MEMBERS ─────────────────────────────────────────────────────────────
export function TeamMembers({ data, setData }) {
  const { currentUser } = useAuth();
  const [modal, setModal] = useState(false);
  const [view,  setView]  = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name:"", role:"", dept:"", email:"", phone:"", salary:"", startDate:today(), managerId:"" });
  const f = (k) => (v) => setForm((p) => ({ ...p, [k]:v }));
  const canManage = can(currentUser.systemRole,"manage_members");
  const filtered  = data.members.filter((m)=>m.name.toLowerCase().includes(search.toLowerCase())||m.dept.toLowerCase().includes(search.toLowerCase()));
  const add = () => {
    if (!form.name||!form.role||!form.email) return;
    setData((p)=>({ ...p, members:[...p.members,{ ...form, id:uid(), avatar:form.name.split(" ").map((n)=>n[0]).join("").slice(0,2).toUpperCase(), status:"active", salary:Number(form.salary), systemRole:"team_member" }] }));
    setModal(false); setForm({ name:"", role:"", dept:"", email:"", phone:"", salary:"", startDate:today(), managerId:"" });
  };
  return (
    <div>
      <SectionHeader title="Team Members" subtitle={`${data.members.filter((m)=>m.status==="active").length} active employees`} action={canManage&&<Btn icon="plus" onClick={()=>setModal(true)}>Add Member</Btn>} />
      <Card>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18, background:"#f9fafb", borderRadius:8, padding:"8px 12px", border:"1px solid #e5e7eb" }}>
          <Icon d={ICONS.search} size={16} stroke="#9ca3af" />
          <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search members…" style={{ border:"none", background:"none", outline:"none", fontSize:14, color:"#111", fontFamily:"inherit", flex:1 }} />
        </div>
        <Table cols={[
          { key:"name", label:"Member", render:(m)=><div style={{ display:"flex", alignItems:"center", gap:10 }}><Avatar initials={m.avatar} size={32} color={avatarColor(m.name)} /><div><div style={{ fontWeight:600 }}>{m.name}</div><div style={{ fontSize:11, color:"#9ca3af" }}>{m.email}</div></div></div> },
          { key:"role", label:"Role" },
          { key:"dept", label:"Department" },
          { key:"startDate", label:"Since", render:(m)=>fmt(m.startDate) },
          { key:"status", label:"Status", render:(m)=><StatusBadge status={m.status} /> },
          { key:"a", label:"", render:(m)=><Btn size="sm" variant="ghost" icon="edit" onClick={()=>setView(m)}>View</Btn> },
        ]} rows={filtered} />
      </Card>
      <Modal open={modal} title="Add Team Member" onClose={()=>setModal(false)}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Input label="Full Name"    value={form.name}      onChange={f("name")}      required />
            <Input label="Role"         value={form.role}      onChange={f("role")}      required />
            <Select label="Department"  value={form.dept}      onChange={f("dept")}      options={["Engineering","Product","Design","Finance","HR","Marketing","Operations","Sales","Executive"]} />
            <Input label="Email"        value={form.email}     onChange={f("email")}     type="email" required />
            <Input label="Phone"        value={form.phone}     onChange={f("phone")}     />
            <Input label="Salary (USD)" value={form.salary}    onChange={f("salary")}    type="number" />
            <Input label="Start Date"   value={form.startDate} onChange={f("startDate")} type="date" />
            <Select label="Manager"     value={form.managerId} onChange={f("managerId")} options={data.members.filter((m)=>m.status==="active").map((m)=>({ value:m.id, label:m.name }))} />
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}><Btn variant="secondary" onClick={()=>setModal(false)}>Cancel</Btn><Btn onClick={add}>Add Member</Btn></div>
        </div>
      </Modal>
      <Modal open={!!view} title="Member Profile" onClose={()=>setView(null)} width={560}>
        {view&&<div>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20, padding:16, background:"#f9fafb", borderRadius:12 }}>
            <Avatar initials={view.avatar} size={56} color={avatarColor(view.name)} />
            <div><div style={{ fontSize:18, fontWeight:800 }}>{view.name}</div><div style={{ fontSize:13, color:"#6b7280" }}>{view.role} · {view.dept}</div><div style={{ marginTop:5 }}><StatusBadge status={view.status} /></div></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[["Email",view.email],["Phone",view.phone||"—"],["Start Date",fmt(view.startDate)],canManage&&["Salary",currency(view.salary)],["Manager",data.members.find((m)=>m.id===view.managerId)?.name||"—"]].filter(Boolean).map(([k,v])=>(
              <div key={k} style={{ padding:12, background:"#fafafa", borderRadius:10 }}><div style={{ fontSize:11, color:"#9ca3af", fontWeight:600, textTransform:"uppercase" }}>{k}</div><div style={{ fontSize:13, fontWeight:600, marginTop:3 }}>{v}</div></div>
            ))}
          </div>
        </div>}
      </Modal>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const CHECKLIST_ITEMS = ["Send offer letter","Set up email account","Order equipment","Schedule orientation","Assign buddy","Add to payroll","IT system access","Benefits enrollment"];
const EQUIP_LIST      = ["Laptop","Monitor","Keyboard","Mouse","Headset","Phone"];

export function Onboarding({ data, setData }) {
  const { currentUser } = useAuth();
  if (!can(currentUser.systemRole,"onboard_members")) return <AccessDenied />;
  const [modal, setModal] = useState(false);
  const [checks, setChecks] = useState({});
  const [form, setForm]   = useState({ name:"", role:"", dept:"", email:"", startDate:today(), equipment:[], notes:"" });
  const f = (k) => (v) => setForm((p) => ({ ...p, [k]:v }));
  const toggleEquip = (eq) => setForm((p)=>({ ...p, equipment:p.equipment.includes(eq)?p.equipment.filter((e)=>e!==eq):[...p.equipment,eq] }));
  const submit = () => {
    if (!form.name||!form.email) return;
    setData((p)=>({ ...p, members:[...p.members,{ id:uid(), ...form, avatar:form.name.split(" ").map((n)=>n[0]).join("").slice(0,2).toUpperCase(), status:"active", salary:0, phone:"", managerId:null, systemRole:"team_member" }] }));
    setModal(false); setForm({ name:"", role:"", dept:"", email:"", startDate:today(), equipment:[], notes:"" });
  };
  return (
    <div>
      <SectionHeader title="Onboarding" subtitle="Manage new hire setup" action={<Btn icon="plus" onClick={()=>setModal(true)}>New Hire</Btn>} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <Card>
          <h3 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700 }}>Onboarding Checklist</h3>
          {CHECKLIST_ITEMS.map((item,i)=>(
            <div key={i} onClick={()=>setChecks((p)=>({ ...p, [i]:!p[i] }))} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:"1px solid #fafafa", cursor:"pointer" }}>
              <div style={{ width:20, height:20, borderRadius:6, border:checks[i]?"none":"2px solid #d1d5db", background:checks[i]?"#10b981":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{checks[i]&&<Icon d={ICONS.check} size={12} stroke="#fff" />}</div>
              <span style={{ fontSize:13, color:checks[i]?"#9ca3af":"#374151", textDecoration:checks[i]?"line-through":"none" }}>{item}</span>
            </div>
          ))}
          <div style={{ marginTop:12, padding:10, background:"#f9fafb", borderRadius:8, fontSize:12, color:"#6b7280" }}>{Object.values(checks).filter(Boolean).length}/{CHECKLIST_ITEMS.length} completed</div>
        </Card>
        <Card>
          <h3 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700 }}>Recent Hires</h3>
          {data.members.slice(-5).map((m)=>(
            <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:"1px solid #fafafa" }}>
              <Avatar initials={m.avatar} size={32} color={avatarColor(m.name)} />
              <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600 }}>{m.name}</div><div style={{ fontSize:11, color:"#9ca3af" }}>{m.role} · {fmt(m.startDate)}</div></div>
              <StatusBadge status={m.status} />
            </div>
          ))}
        </Card>
      </div>
      <Modal open={modal} title="New Hire Onboarding" onClose={()=>setModal(false)} width={540}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Input label="Full Name"   value={form.name}      onChange={f("name")}      required />
            <Input label="Role"        value={form.role}      onChange={f("role")}      />
            <Select label="Department" value={form.dept}      onChange={f("dept")}      options={["Engineering","Product","Design","Finance","HR","Marketing","Operations","Sales"]} />
            <Input label="Email"       value={form.email}     onChange={f("email")}     type="email" required />
            <Input label="Start Date"  value={form.startDate} onChange={f("startDate")} type="date" />
          </div>
          <div><label style={{ fontSize:12, fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em" }}>Equipment to Assign</label><div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:8 }}>{EQUIP_LIST.map((eq)=><div key={eq} onClick={()=>toggleEquip(eq)} style={{ padding:"4px 12px", borderRadius:20, fontSize:12, cursor:"pointer", border:`1px solid ${form.equipment.includes(eq)?"#6366f1":"#e5e7eb"}`, background:form.equipment.includes(eq)?"#eef2ff":"#fff", color:form.equipment.includes(eq)?"#6366f1":"#374151", fontWeight:500 }}>{eq}</div>)}</div></div>
          <Textarea label="Notes" value={form.notes} onChange={f("notes")} placeholder="Special instructions…" />
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}><Btn variant="secondary" onClick={()=>setModal(false)}>Cancel</Btn><Btn onClick={submit}>Create & Onboard</Btn></div>
        </div>
      </Modal>
    </div>
  );
}

// ─── OFFBOARDING ──────────────────────────────────────────────────────────────
const OFF_TASKS = ["Revoke system access","Collect equipment","Final payroll processed","Exit interview scheduled","Knowledge transfer done","Remove from channels"];

export function Offboarding({ data, setData }) {
  const { currentUser } = useAuth();
  if (!can(currentUser.systemRole,"offboard_members")) return <AccessDenied />;
  const [modal, setModal]     = useState(false);
  const [selected, setSelected] = useState("");
  const [reason, setReason]   = useState("");
  const [checks, setChecks]   = useState({});
  const offboard = () => {
    if (!selected) return;
    setData((p)=>({ ...p, members:p.members.map((m)=>m.id===selected?{ ...m,status:"offboarded" }:m) }));
    setModal(false); setSelected(""); setReason(""); setChecks({});
  };
  const active     = data.members.filter((m)=>m.status==="active");
  const offboarded = data.members.filter((m)=>m.status==="offboarded");
  return (
    <div>
      <SectionHeader title="Offboarding" subtitle="Manage employee departures" action={<Btn variant="danger" onClick={()=>setModal(true)}>Offboard Employee</Btn>} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <Card>
          <h3 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700 }}>Offboarding Checklist</h3>
          {OFF_TASKS.map((t,i)=>(
            <div key={i} onClick={()=>setChecks((p)=>({ ...p,[i]:!p[i] }))} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:"1px solid #fafafa", cursor:"pointer" }}>
              <div style={{ width:20, height:20, borderRadius:6, border:checks[i]?"none":"2px solid #fecaca", background:checks[i]?"#ef4444":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{checks[i]&&<Icon d={ICONS.check} size={12} stroke="#fff" />}</div>
              <span style={{ fontSize:13, color:checks[i]?"#9ca3af":"#374151", textDecoration:checks[i]?"line-through":"none" }}>{t}</span>
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700 }}>Offboarded ({offboarded.length})</h3>
          {offboarded.length===0?<p style={{ color:"#9ca3af", fontSize:13 }}>None yet.</p>:offboarded.map((m)=>(
            <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:"1px solid #fafafa" }}>
              <Avatar initials={m.avatar} size={32} color="#9ca3af" />
              <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{m.name}</div><div style={{ fontSize:11, color:"#9ca3af" }}>{m.role}</div></div>
              <StatusBadge status="offboarded" />
            </div>
          ))}
        </Card>
      </div>
      <Modal open={modal} title="Offboard Employee" onClose={()=>setModal(false)}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Select label="Select Employee" value={selected} onChange={setSelected} options={active.map((m)=>({ value:m.id, label:m.name }))} required />
          <Textarea label="Reason for Departure" value={reason} onChange={setReason} placeholder="Resignation, end of contract, etc." />
          <div style={{ padding:12, background:"#fef2f2", borderRadius:10, fontSize:13, color:"#ef4444", display:"flex", gap:8, alignItems:"center" }}><Icon d={ICONS.alert} size={16} /><span>This will mark the employee as offboarded.</span></div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}><Btn variant="secondary" onClick={()=>setModal(false)}>Cancel</Btn><Btn variant="danger" onClick={offboard} disabled={!selected}>Confirm</Btn></div>
        </div>
      </Modal>
    </div>
  );
}

// ─── REQUESTS ─────────────────────────────────────────────────────────────────
const TC = { leave:"#8b5cf6", travel:"#0ea5e9", advance:"#f59e0b", reimbursement:"#10b981" };
const EXPENSE_CATS = ["Meals","Transport","Accommodation","Electronics","Accessories","Office Supplies","Cleaning","Furniture","Software","Other"];

function lineTotal(items=[]) { return items.reduce((s,i)=>s+Number(i.total||0),0); }

function exportExpenseCSV(req) {
  const header = ["Category","Description","Qty","Unit Cost","Total"];
  const rows   = (req.lineItems||[]).map((li)=>[li.category, li.description, li.qty, li.unitCost.toFixed(2), li.total.toFixed(2)]);
  const grand  = ["","TOTAL","","",lineTotal(req.lineItems).toFixed(2)];
  const meta   = [
    [`Expense Report: ${req.title}`],
    [`Employee: ${req.memberName}`],
    [`Type: ${req.type}`],
    [`Date Submitted: ${req.createdAt}`],
    [`Status: ${req.status}`],
    [],
    header,
    ...rows,
    grand,
  ];
  const csv  = meta.map((r)=>r.join(",")).join("\n");
  const a    = document.createElement("a");
  a.href     = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  a.download = `expense-report-${req.id}.csv`;
  a.click();
}

export function Requests({ data, setData }) {
  const { currentUser } = useAuth();
  const [tab,        setTab]        = useState("all");
  const [detailReq,  setDetailReq]  = useState(null);

  const canApproveLeave     = can(currentUser.systemRole,"approve_leave");
  const canApproveFinancial = can(currentUser.systemRole,"approve_financial");
  const canApproveTravel    = can(currentUser.systemRole,"approve_travel");

  const canApprove = (r) => {
    if (r.type==="leave")                             return canApproveLeave;
    if (r.type==="travel")                            return canApproveTravel;
    if (r.type==="advance"||r.type==="reimbursement") return canApproveFinancial;
    return false;
  };

  const act = (id, status) => {
    setData((p)=>({...p, requests:p.requests.map((r)=>r.id===id?{...r,status}:r)}));
    setDetailReq((prev)=>prev?.id===id?{...prev,status}:prev);
  };

  const shown = tab==="all" ? data.requests : data.requests.filter((r)=>r.type===tab);

  // Stats
  const financial = data.requests.filter((r)=>r.type==="advance"||r.type==="reimbursement");
  const totalFinancial = financial.reduce((s,r)=>s+lineTotal(r.lineItems),0);
  const pendingFinancial = financial.filter((r)=>r.status==="pending").reduce((s,r)=>s+lineTotal(r.lineItems),0);

  return (
    <div>
      <SectionHeader title="Requests" subtitle="All employee requests and expense reports" />

      {/* Financial summary strip */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
        <StatCard label="Total Requests"      value={data.requests.length}                                        icon={ICONS.inbox}   color="#6366f1" />
        <StatCard label="Pending"             value={data.requests.filter((r)=>r.status==="pending").length}      icon={ICONS.clock}   color="#f59e0b" sub="Needs action" />
        <StatCard label="Financial Exposure"  value={currency(pendingFinancial)}                                   icon={ICONS.money}   color="#ef4444" sub="Pending advances + reimbursements" />
        <StatCard label="Total Expenses"      value={currency(totalFinancial)}                                     icon={ICONS.receipt} color="#10b981" sub="All financial requests" />
      </div>

      {/* Tab bar */}
      <div style={{ display:"flex", gap:4, marginBottom:20, background:"#f4f4f5", padding:4, borderRadius:10, width:"fit-content" }}>
        {[{k:"all",l:"All"},{k:"leave",l:"Leave"},{k:"travel",l:"Travel"},{k:"advance",l:"Advances"},{k:"reimbursement",l:"Reimbursements"}].map(({k,l})=>(
          <button key={k} onClick={()=>setTab(k)}
            style={{ padding:"7px 14px", borderRadius:7, border:"none", fontFamily:"inherit", fontSize:12, fontWeight:600, cursor:"pointer", background:tab===k?"#fff":"transparent", color:tab===k?"#111":"#6b7280" }}>
            {l}
          </button>
        ))}
      </div>

      <Card>
        <Table
          cols={[
            { key:"type",       label:"Type",    render:(r)=><Badge label={r.type.toUpperCase()} color={TC[r.type]} /> },
            { key:"memberName", label:"From",    render:(r)=>(
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Avatar initials={r.memberName.split(" ").map((n)=>n[0]).join("")} size={26} color={avatarColor(r.memberName)} />
                {r.memberName}
              </div>
            )},
            { key:"title",     label:"Title"   },
            { key:"amount",    label:"Amount",  render:(r)=>{
              if (r.lineItems?.length) return <span style={{ fontWeight:700, color:"#374151" }}>{currency(lineTotal(r.lineItems))}</span>;
              if (r.from) return <span style={{ fontSize:12, color:"#6b7280" }}>{fmt(r.from)} → {fmt(r.to)}</span>;
              return "—";
            }},
            { key:"items",     label:"Items",   render:(r)=>r.lineItems?.length
              ? <Badge label={`${r.lineItems.length} line items`} color="#6366f1" />
              : <span style={{ color:"#d1d5db", fontSize:12 }}>—</span>
            },
            { key:"createdAt", label:"Date",    render:(r)=>fmt(r.createdAt) },
            { key:"status",    label:"Status",  render:(r)=><StatusBadge status={r.status} /> },
            { key:"a",         label:"",        render:(r)=>(
              <div style={{ display:"flex", gap:5 }}>
                <Btn size="sm" variant="ghost" onClick={()=>setDetailReq(r)}>
                  {r.lineItems?.length ? "View Report" : "View"}
                </Btn>
                {r.status==="pending" && canApprove(r) && (
                  <>
                    <Btn size="sm" variant="success" icon="check" onClick={()=>act(r.id,"approved")}>✓</Btn>
                    <Btn size="sm" variant="danger"  icon="x"     onClick={()=>act(r.id,"rejected")}>✗</Btn>
                  </>
                )}
                {r.status==="pending" && !canApprove(r) && <Badge label="No permission" color="#9ca3af" />}
              </div>
            )},
          ]}
          rows={shown}
        />
      </Card>

      {/* ── Request / Expense Report detail modal ── */}
      <Modal open={!!detailReq} title={detailReq?.title||""} onClose={()=>setDetailReq(null)} width={700}>
        {detailReq && (()=>{
          const isFinancial = detailReq.type==="advance"||detailReq.type==="reimbursement";
          const total = lineTotal(detailReq.lineItems);
          // Category breakdown for financial requests
          const catMap = {};
          (detailReq.lineItems||[]).forEach((li)=>{ catMap[li.category]=(catMap[li.category]||0)+li.total; });

          return (
            <div>
              {/* Header meta */}
              <div style={{ display:"flex", gap:12, marginBottom:20, padding:16, background:"#f9fafb", borderRadius:12, flexWrap:"wrap", alignItems:"center" }}>
                <Avatar initials={detailReq.memberName.split(" ").map((n)=>n[0]).join("")} size={40} color={avatarColor(detailReq.memberName)} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:15 }}>{detailReq.memberName}</div>
                  <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>
                    Submitted {fmt(detailReq.createdAt)} · <Badge label={detailReq.type.toUpperCase()} color={TC[detailReq.type]} />
                  </div>
                </div>
                <StatusBadge status={detailReq.status} />
              </div>

              {/* Reason / notes */}
              {detailReq.reason && (
                <div style={{ padding:12, background:"#f0f9ff", borderRadius:10, fontSize:13, color:"#374151", marginBottom:16, borderLeft:"3px solid #0ea5e9" }}>
                  <span style={{ fontWeight:600, color:"#0ea5e9" }}>Reason: </span>{detailReq.reason}
                </div>
              )}

              {/* Travel/leave dates */}
              {detailReq.from && (
                <div style={{ display:"flex", gap:16, marginBottom:16 }}>
                  <div style={{ padding:"10px 16px", background:"#f9fafb", borderRadius:10 }}>
                    <div style={{ fontSize:11, color:"#9ca3af", fontWeight:600, textTransform:"uppercase" }}>From</div>
                    <div style={{ fontSize:14, fontWeight:700, marginTop:2 }}>{fmt(detailReq.from)}</div>
                  </div>
                  <div style={{ padding:"10px 16px", background:"#f9fafb", borderRadius:10 }}>
                    <div style={{ fontSize:11, color:"#9ca3af", fontWeight:600, textTransform:"uppercase" }}>To</div>
                    <div style={{ fontSize:14, fontWeight:700, marginTop:2 }}>{fmt(detailReq.to)}</div>
                  </div>
                  {detailReq.destination && (
                    <div style={{ padding:"10px 16px", background:"#f9fafb", borderRadius:10 }}>
                      <div style={{ fontSize:11, color:"#9ca3af", fontWeight:600, textTransform:"uppercase" }}>Destination</div>
                      <div style={{ fontSize:14, fontWeight:700, marginTop:2 }}>{detailReq.destination}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Expense line items */}
              {isFinancial && (detailReq.lineItems||[]).length > 0 && (
                <div style={{ marginBottom:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <h4 style={{ margin:0, fontSize:14, fontWeight:700 }}>Expense Line Items</h4>
                    <Btn size="sm" variant="ghost" icon="download" onClick={()=>exportExpenseCSV(detailReq)}>Export CSV</Btn>
                  </div>
                  <div style={{ overflowX:"auto", borderRadius:10, border:"1px solid #f0f0f0" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                      <thead>
                        <tr style={{ background:"#f9fafb" }}>
                          {["Category","Description","Qty","Unit Cost","Total"].map((h)=>(
                            <th key={h} style={{ padding:"9px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {detailReq.lineItems.map((li)=>(
                          <tr key={li.id} style={{ borderBottom:"1px solid #fafafa" }}>
                            <td style={{ padding:"10px 14px" }}><Badge label={li.category} color={avatarColor(li.category)} /></td>
                            <td style={{ padding:"10px 14px", color:"#374151" }}>{li.description}</td>
                            <td style={{ padding:"10px 14px", color:"#6b7280", textAlign:"right" }}>{li.qty}</td>
                            <td style={{ padding:"10px 14px", color:"#6b7280", textAlign:"right" }}>{currency(li.unitCost)}</td>
                            <td style={{ padding:"10px 14px", fontWeight:700, color:"#374151", textAlign:"right" }}>{currency(li.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ background:"#f9fafb", borderTop:"2px solid #e5e7eb" }}>
                          <td colSpan={4} style={{ padding:"11px 14px", fontSize:13, fontWeight:800, color:"#111" }}>Grand Total</td>
                          <td style={{ padding:"11px 14px", fontWeight:800, fontSize:15, color:"#6366f1", textAlign:"right" }}>{currency(total)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Category breakdown */}
                  {Object.keys(catMap).length > 1 && (
                    <div style={{ marginTop:14, padding:14, background:"#f9fafb", borderRadius:10 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:10 }}>Breakdown by Category</div>
                      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                        {Object.entries(catMap).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>{
                          const pct = Math.round((amt/total)*100);
                          return (
                            <div key={cat}>
                              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                                <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>{cat}</span>
                                <span style={{ fontSize:12, color:"#6b7280" }}>{currency(amt)} ({pct}%)</span>
                              </div>
                              <div style={{ height:5, borderRadius:3, background:"#e5e7eb" }}>
                                <div style={{ width:`${pct}%`, height:"100%", borderRadius:3, background:avatarColor(cat) }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Approve / reject actions */}
              {detailReq.status==="pending" && canApprove(detailReq) && (
                <div style={{ display:"flex", gap:10, justifyContent:"flex-end", paddingTop:12, borderTop:"1px solid #f0f0f0" }}>
                  {isFinancial && <Btn variant="ghost" icon="download" onClick={()=>exportExpenseCSV(detailReq)}>Export for Audit</Btn>}
                  <Btn variant="danger"  icon="x"     onClick={()=>act(detailReq.id,"rejected")}>Reject</Btn>
                  <Btn variant="success" icon="check" onClick={()=>act(detailReq.id,"approved")}>Approve</Btn>
                </div>
              )}
              {detailReq.status!=="pending" && isFinancial && (
                <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:12, borderTop:"1px solid #f0f0f0" }}>
                  <Btn variant="ghost" icon="download" onClick={()=>exportExpenseCSV(detailReq)}>Export CSV for Audit</Btn>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

// ─── INVENTORY ────────────────────────────────────────────────────────────────
const INV_STATUS_CFG = {
  in_storage: { label:"In Storage",  color:"#6366f1" },
  in_use:     { label:"In Use",      color:"#10b981" },
  on_loan:    { label:"On Loan",     color:"#f59e0b" },
  returned:   { label:"Returned",    color:"#9ca3af" },
};

export function Inventory({ data, setData }) {
  const { currentUser } = useAuth();
  if (!can(currentUser.systemRole,"view_inventory")) return <AccessDenied />;
  const canManage = can(currentUser.systemRole,"manage_inventory");

  const [addItemModal,   setAddItemModal]   = useState(false);
  const [checkoutModal,  setCheckoutModal]  = useState(null);   // item being checked out
  const [detailItem,     setDetailItem]     = useState(null);   // item whose assignments we're viewing
  const [statusFilter,   setStatusFilter]   = useState("all");
  const [itemForm, setItemForm] = useState({ name:"", category:"", qty:"", value:"", condition:"Good", returnable:true });
  const [checkoutForm, setCheckoutForm] = useState({ memberId:"", checkedOut:today(), dueBack:"", qty:1 });
  const if_ = (k) => (v) => setItemForm((p)=>({...p,[k]:v}));
  const cf  = (k) => (v) => setCheckoutForm((p)=>({...p,[k]:v}));

  // Computed counts across all items
  const allAssignments = data.inventory.flatMap((i) => i.assignments||[]);
  const inUseCount     = allAssignments.filter((a)=>a.status==="in_use").length;
  const onLoanCount    = allAssignments.filter((a)=>a.status==="on_loan").length;
  const inStorageCount = data.inventory.reduce((s,i)=>{
    const active = (i.assignments||[]).filter((a)=>a.status==="in_use"||a.status==="on_loan").length;
    return s + (i.qty - active);
  }, 0);
  const totalValue = data.inventory.reduce((s,i)=>s+i.qty*i.value, 0);

  const addItem = () => {
    if (!itemForm.name) return;
    setData((p)=>({...p, inventory:[...p.inventory, { id:uid(), ...itemForm, qty:Number(itemForm.qty), value:Number(itemForm.value), assignments:[] }]}));
    setAddItemModal(false);
    setItemForm({ name:"", category:"", qty:"", value:"", condition:"Good", returnable:true });
  };

  const checkout = (item) => {
    if (!checkoutForm.memberId) return;
    const member = data.members.find((m)=>m.id===checkoutForm.memberId);
    const newAssignment = {
      id: uid(),
      assignedTo: member.name,
      memberId:   member.id,
      checkedOut: checkoutForm.checkedOut,
      dueBack:    checkoutForm.dueBack || null,
      status:     checkoutForm.dueBack ? "on_loan" : "in_use",
      qty:        Number(checkoutForm.qty)||1,
    };
    setData((p)=>({...p, inventory: p.inventory.map((i)=>
      i.id!==item.id ? i : { ...i, assignments:[...(i.assignments||[]), newAssignment] }
    )}));
    setCheckoutModal(null);
    setCheckoutForm({ memberId:"", checkedOut:today(), dueBack:"", qty:1 });
  };

  const returnItem = (itemId, assignmentId) => {
    setData((p)=>({...p, inventory: p.inventory.map((i)=>
      i.id!==itemId ? i : { ...i, assignments: i.assignments.map((a)=>
        a.id!==assignmentId ? a : { ...a, status:"returned", dueBack:today() }
      )}
    )}));
  };

  // Filter items by whether they have any matching status
  const filtered = data.inventory.filter((i)=>{
    if (statusFilter==="all") return true;
    if (statusFilter==="in_storage") {
      const active = (i.assignments||[]).filter((a)=>a.status==="in_use"||a.status==="on_loan").length;
      return (i.qty - active) > 0;
    }
    return (i.assignments||[]).some((a)=>a.status===statusFilter);
  });

  return (
    <div>
      <SectionHeader title="Inventory" subtitle="Track assets, assignments and storage status"
        action={canManage&&<Btn icon="plus" onClick={()=>setAddItemModal(true)}>Add Item</Btn>} />

      {/* KPI cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
        <StatCard label="In Storage"  value={inStorageCount} icon={ICONS.box}   color="#6366f1" sub="Available to issue" />
        <StatCard label="In Use"      value={inUseCount}     icon={ICONS.check} color="#10b981" sub="Permanently assigned" />
        <StatCard label="On Loan"     value={onLoanCount}    icon={ICONS.clock} color="#f59e0b" sub="Temporary / returnable" />
        <StatCard label="Total Value" value={`$${(totalValue/1000).toFixed(1)}k`} icon={ICONS.money} color="#0ea5e9" sub="All items" />
      </div>

      {/* Status filter pills */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {[["all","All Items","#374151"], ["in_storage","In Storage","#6366f1"], ["in_use","In Use","#10b981"], ["on_loan","On Loan","#f59e0b"], ["returned","Returned","#9ca3af"]].map(([k,l,c])=>(
          <button key={k} onClick={()=>setStatusFilter(k)}
            style={{ padding:"5px 14px", borderRadius:20, border:`1px solid ${statusFilter===k?c:"#e5e7eb"}`, background:statusFilter===k?`${c}15`:"#fff", color:statusFilter===k?c:"#6b7280", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            {l}
          </button>
        ))}
      </div>

      {/* Items table */}
      <Card>
        <Table
          cols={[
            { key:"name",      label:"Item",       render:(i)=><div><div style={{ fontWeight:600 }}>{i.name}</div><div style={{ fontSize:11, color:"#9ca3af" }}>{i.category}{i.returnable?" · Returnable":""}</div></div> },
            { key:"qty",       label:"Total Qty",  render:(i)=><span style={{ fontWeight:700 }}>{i.qty}</span> },
            { key:"storage",   label:"In Storage", render:(i)=>{
              const active=(i.assignments||[]).filter((a)=>a.status==="in_use"||a.status==="on_loan").length;
              const stored=i.qty-active;
              return <span style={{ fontWeight:700, color:stored>0?"#6366f1":"#ef4444" }}>{stored}</span>;
            }},
            { key:"inuse",     label:"In Use",     render:(i)=>{
              const n=(i.assignments||[]).filter((a)=>a.status==="in_use").length;
              return <span style={{ color:n>0?"#10b981":"#d1d5db", fontWeight:600 }}>{n}</span>;
            }},
            { key:"onloan",    label:"On Loan",    render:(i)=>{
              const n=(i.assignments||[]).filter((a)=>a.status==="on_loan").length;
              return <span style={{ color:n>0?"#f59e0b":"#d1d5db", fontWeight:600 }}>{n}</span>;
            }},
            { key:"condition", label:"Condition",  render:(i)=><Badge label={i.condition} color={i.condition==="Good"||i.condition==="Excellent"?"#10b981":"#f59e0b"} /> },
            { key:"value",     label:"Unit Value", render:(i)=>currency(i.value) },
            { key:"a",         label:"",           render:(i)=>(
              <div style={{ display:"flex", gap:6 }}>
                <Btn size="sm" variant="ghost" onClick={()=>setDetailItem(i)}>Assignments</Btn>
                {canManage && <Btn size="sm" variant="secondary" onClick={()=>{ setCheckoutModal(i); setCheckoutForm({ memberId:"", checkedOut:today(), dueBack:"", qty:1 }); }}>Check Out</Btn>}
              </div>
            )},
          ]}
          rows={filtered}
        />
      </Card>

      {/* ── Assignment detail modal ── */}
      <Modal open={!!detailItem} title={detailItem?`${detailItem.name} — Assignment Log`:""} onClose={()=>setDetailItem(null)} width={700}>
        {detailItem && (()=>{
          const active = (detailItem.assignments||[]).filter((a)=>a.status==="in_use"||a.status==="on_loan").length;
          const stored = detailItem.qty - active;
          return (
            <div>
              {/* Item summary */}
              <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
                {[
                  [detailItem.qty,  "Total",      "#374151"],
                  [stored,          "In Storage", "#6366f1"],
                  [(detailItem.assignments||[]).filter((a)=>a.status==="in_use").length,  "In Use",  "#10b981"],
                  [(detailItem.assignments||[]).filter((a)=>a.status==="on_loan").length, "On Loan", "#f59e0b"],
                  [(detailItem.assignments||[]).filter((a)=>a.status==="returned").length,"Returned","#9ca3af"],
                ].map(([v,l,c])=>(
                  <div key={l} style={{ padding:"10px 16px", background:`${c}10`, borderRadius:10, border:`1px solid ${c}20`, minWidth:80, textAlign:"center" }}>
                    <div style={{ fontSize:22, fontWeight:800, color:c }}>{v}</div>
                    <div style={{ fontSize:11, color:"#9ca3af" }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Assignment rows */}
              {(detailItem.assignments||[]).length === 0 ? (
                <p style={{ color:"#9ca3af", fontSize:13, textAlign:"center", padding:"24px 0" }}>No assignments yet. Use "Check Out" to issue this item.</p>
              ) : (
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead>
                    <tr style={{ background:"#f9fafb" }}>
                      {["Assigned To","Checked Out","Due Back / Returned","Status", canManage?"Action":""].map((h)=>(
                        <th key={h} style={{ padding:"9px 12px", textAlign:"left", fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(detailItem.assignments||[]).map((a)=>(
                      <tr key={a.id} style={{ borderBottom:"1px solid #f4f4f5" }}>
                        <td style={{ padding:"10px 12px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <Avatar initials={a.assignedTo.split(" ").map((n)=>n[0]).join("")} size={26} color={avatarColor(a.assignedTo)} />
                            <span style={{ fontWeight:600 }}>{a.assignedTo}</span>
                          </div>
                        </td>
                        <td style={{ padding:"10px 12px", color:"#6b7280" }}>{fmt(a.checkedOut)}</td>
                        <td style={{ padding:"10px 12px", color:"#6b7280" }}>{a.dueBack ? fmt(a.dueBack) : <span style={{ color:"#d1d5db" }}>—</span>}</td>
                        <td style={{ padding:"10px 12px" }}>
                          <Badge label={INV_STATUS_CFG[a.status]?.label||a.status} color={INV_STATUS_CFG[a.status]?.color||"#6b7280"} />
                        </td>
                        {canManage && (
                          <td style={{ padding:"10px 12px" }}>
                            {(a.status==="in_use"||a.status==="on_loan") ? (
                              <Btn size="sm" variant="secondary" onClick={()=>{
                                returnItem(detailItem.id, a.id);
                                setDetailItem((prev)=>prev?{...prev,assignments:prev.assignments.map((x)=>x.id===a.id?{...x,status:"returned",dueBack:today()}:x)}:null);
                              }}>Mark Returned</Btn>
                            ) : <span style={{ fontSize:11, color:"#d1d5db" }}>—</span>}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* ── Check Out modal ── */}
      <Modal open={!!checkoutModal} title={checkoutModal?`Check Out — ${checkoutModal.name}`:""} onClose={()=>setCheckoutModal(null)}>
        {checkoutModal && (()=>{
          const active  = (checkoutModal.assignments||[]).filter((a)=>a.status==="in_use"||a.status==="on_loan").length;
          const stored  = checkoutModal.qty - active;
          return (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ padding:14, background:"#f9fafb", borderRadius:10, display:"flex", gap:16, fontSize:13 }}>
                <span><b>{stored}</b> in storage</span>
                <span><b>{active}</b> currently issued</span>
                <span><b>{checkoutModal.qty}</b> total</span>
              </div>
              {stored <= 0 && (
                <div style={{ padding:12, background:"#fef2f2", borderRadius:10, color:"#ef4444", fontSize:13, display:"flex", gap:8 }}>
                  <Icon d={ICONS.alert} size={16} /> No units available in storage.
                </div>
              )}
              <Select label="Issue To (Employee)" value={checkoutForm.memberId} onChange={cf("memberId")}
                options={data.members.filter((m)=>m.status==="active").map((m)=>({value:m.id,label:m.name}))} required />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <Input label="Date Issued"  value={checkoutForm.checkedOut} onChange={cf("checkedOut")} type="date" />
                <Input label="Due Back"     value={checkoutForm.dueBack}    onChange={cf("dueBack")}    type="date" />
                <Input label="Qty"          value={checkoutForm.qty}        onChange={cf("qty")}        type="number" />
              </div>
              <div style={{ padding:12, background:"#f0f9ff", borderRadius:10, fontSize:12, color:"#0ea5e9" }}>
                {checkoutForm.dueBack
                  ? `This will be marked as "On Loan" (returnable — due ${fmt(checkoutForm.dueBack)}).`
                  : `No due date set — this will be marked as "In Use" (permanently assigned).`}
              </div>
              <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                <Btn variant="secondary" onClick={()=>setCheckoutModal(null)}>Cancel</Btn>
                <Btn onClick={()=>checkout(checkoutModal)} disabled={!checkoutForm.memberId||stored<=0}>Confirm Check Out</Btn>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ── Add Item modal ── */}
      {canManage && (
        <Modal open={addItemModal} title="Add Inventory Item" onClose={()=>setAddItemModal(false)}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Input label="Item Name"    value={itemForm.name}      onChange={if_("name")}      required />
            <Select label="Category"   value={itemForm.category}   onChange={if_("category")}  options={["Electronics","Furniture","Software","Office Supplies","Other"]} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <Input label="Total Qty"       value={itemForm.qty}       onChange={if_("qty")}       type="number" />
              <Input label="Unit Value (USD)" value={itemForm.value}    onChange={if_("value")}     type="number" />
            </div>
            <Select label="Condition"  value={itemForm.condition}  onChange={if_("condition")} options={["Excellent","Good","Fair","Poor"]} />
            <div onClick={()=>if_("returnable")(!itemForm.returnable)}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"#f9fafb", borderRadius:10, cursor:"pointer", border:"1px solid #e5e7eb" }}>
              <div style={{ width:20, height:20, borderRadius:6, border:itemForm.returnable?"none":"2px solid #d1d5db", background:itemForm.returnable?"#6366f1":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {itemForm.returnable && <Icon d={ICONS.check} size={12} stroke="#fff" />}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>Returnable item</div>
                <div style={{ fontSize:12, color:"#9ca3af" }}>Items that are expected to be checked back in</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <Btn variant="secondary" onClick={()=>setAddItemModal(false)}>Cancel</Btn>
              <Btn onClick={addItem}>Add Item</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── INVOICES ─────────────────────────────────────────────────────────────────
export function Invoices({ data, setData }) {
  const { currentUser } = useAuth();
  if (!can(currentUser.systemRole,"view_invoices")) return <AccessDenied />;
  const canManage = can(currentUser.systemRole,"manage_invoices");
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({ vendor:"", amount:"", date:today(), due:"", category:"", status:"pending" });
  const f = (k) => (v) => setForm((p)=>({ ...p, [k]:v }));
  const add = () => {
    if (!form.vendor||!form.amount) return;
    setData((p)=>({ ...p, invoices:[{ id:uid(), ...form, amount:Number(form.amount) }, ...p.invoices] }));
    setModal(false); setForm({ vendor:"", amount:"", date:today(), due:"", category:"", status:"pending" });
  };
  const markPaid = (id) => setData((p)=>({ ...p, invoices:p.invoices.map((i)=>i.id===id?{ ...i, status:"paid" }:i) }));
  const total   = data.invoices.reduce((s,i)=>s+i.amount,0);
  const paid    = data.invoices.filter((i)=>i.status==="paid").reduce((s,i)=>s+i.amount,0);
  const overdue = data.invoices.filter((i)=>i.status==="overdue").reduce((s,i)=>s+i.amount,0);
  return (
    <div>
      <SectionHeader title="Invoices & Receipts" subtitle="Track vendor invoices and payments" action={canManage&&<Btn icon="plus" onClick={()=>setModal(true)}>Add Invoice</Btn>} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:22 }}>
        <StatCard label="Total Invoiced" value={currency(total)}   icon={ICONS.receipt} color="#6366f1" />
        <StatCard label="Paid"           value={currency(paid)}    icon={ICONS.check}   color="#10b981" />
        <StatCard label="Overdue"        value={currency(overdue)} icon={ICONS.alert}   color="#ef4444" />
      </div>
      <Card>
        <Table cols={[
          { key:"vendor",   label:"Vendor"       },
          { key:"category", label:"Category"     },
          { key:"amount",   label:"Amount",      render:(i)=><span style={{ fontWeight:700 }}>{currency(i.amount)}</span> },
          { key:"due",      label:"Due",         render:(i)=>fmt(i.due) },
          { key:"status",   label:"Status",      render:(i)=><StatusBadge status={i.status} /> },
          { key:"a",        label:"",            render:(i)=>canManage&&i.status!=="paid"?<Btn size="sm" variant="success" onClick={()=>markPaid(i.id)}>Mark Paid</Btn>:<span style={{ fontSize:12, color:"#9ca3af" }}>{i.status==="paid"?"✓ Paid":"—"}</span> },
        ]} rows={data.invoices} />
      </Card>
      {canManage&&<Modal open={modal} title="Add Invoice" onClose={()=>setModal(false)}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Input label="Vendor" value={form.vendor} onChange={f("vendor")} required />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Input label="Amount" value={form.amount} onChange={f("amount")} type="number" required />
            <Select label="Category" value={form.category} onChange={f("category")} options={["Infrastructure","Software","Supplies","Facilities","HR Tools","Marketing","Other"]} />
            <Input label="Invoice Date" value={form.date} onChange={f("date")} type="date" />
            <Input label="Due Date"     value={form.due}  onChange={f("due")}  type="date" />
          </div>
          <Select label="Status" value={form.status} onChange={f("status")} options={[{value:"pending",label:"Pending"},{value:"paid",label:"Paid"},{value:"overdue",label:"Overdue"}]} />
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}><Btn variant="secondary" onClick={()=>setModal(false)}>Cancel</Btn><Btn onClick={add}>Add Invoice</Btn></div>
        </div>
      </Modal>}
    </div>
  );
}

// ─── TIMESHEETS ───────────────────────────────────────────────────────────────
const TS_DAYS = ["mon","tue","wed","thu","fri"];
const TS_DAY_LABELS = ["Mon","Tue","Wed","Thu","Fri"];

export function Timesheets({ data, setData }) {
  const { currentUser } = useAuth();
  const canApprove = can(currentUser.systemRole,"approve_timesheets");
  const canViewAll = can(currentUser.systemRole,"view_all_timesheets");
  const sheets     = canViewAll ? data.timesheets : data.timesheets.filter((t)=>t.memberId===currentUser.id);
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({ memberId:"", week:today(), mon:8, tue:8, wed:8, thu:8, fri:8 });
  const f = (k) => (v) => setForm((p)=>({...p,[k]:v}));

  const submit = () => {
    const member = data.members.find((m)=>m.id===form.memberId);
    if (!member) return;
    setData((p)=>({...p, timesheets:[{ id:uid(), memberName:member.name, status:"submitted",
      ...form, mon:Number(form.mon), tue:Number(form.tue), wed:Number(form.wed), thu:Number(form.thu), fri:Number(form.fri) }, ...p.timesheets]}));
    setModal(false);
    setForm({ memberId:"", week:today(), mon:8, tue:8, wed:8, thu:8, fri:8 });
  };
  const approve = (id) => setData((p)=>({...p, timesheets:p.timesheets.map((t)=>t.id===id?{...t,status:"approved"}:t)}));
  const reject  = (id) => setData((p)=>({...p, timesheets:p.timesheets.map((t)=>t.id===id?{...t,status:"rejected"}:t)}));

  const totalHours    = sheets.reduce((s,t)=>s+TS_DAYS.reduce((d,k)=>d+Number(t[k]||0),0),0);
  const pendingCount  = sheets.filter((t)=>t.status==="submitted").length;
  const approvedCount = sheets.filter((t)=>t.status==="approved").length;

  return (
    <div>
      <SectionHeader
        title="Timesheets"
        subtitle={canViewAll ? "Weekly hours tracking for all team members" : "Your weekly hour submissions"}
        action={<Btn icon="plus" onClick={()=>setModal(true)}>Submit Timesheet</Btn>}
      />

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
        <StatCard label="Total Hours Logged" value={`${totalHours}h`}  icon={ICONS.clock} color="#6366f1" sub="All visible sheets" />
        <StatCard label="Total Sheets"       value={sheets.length}      icon={ICONS.inbox} color="#0ea5e9" sub="All submissions" />
        <StatCard label="Pending Approval"   value={pendingCount}       icon={ICONS.alert} color="#f59e0b" sub="Awaiting review" />
        <StatCard label="Approved"           value={approvedCount}      icon={ICONS.check} color="#10b981" sub="Confirmed sheets" />
      </div>

      <Card>
        <Table
          cols={[
            { key:"memberName", label:"Employee", render:(t)=>(
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Avatar initials={t.memberName.split(" ").map((n)=>n[0]).join("")} size={28} color={avatarColor(t.memberName)} />
                <span style={{ fontWeight:600 }}>{t.memberName}</span>
              </div>
            )},
            { key:"week",   label:"Week Of",  render:(t)=>fmt(t.week) },
            ...TS_DAY_LABELS.map((d,i)=>({ key:TS_DAYS[i], label:d, render:(t)=>(
              <span style={{ fontWeight:600, color: t[TS_DAYS[i]] > 8 ? "#f59e0b" : "#374151" }}>{t[TS_DAYS[i]]}h</span>
            )})),
            { key:"total",  label:"Total",  render:(t)=>(
              <span style={{ fontWeight:800, color:"#6366f1" }}>{TS_DAYS.reduce((s,d)=>s+Number(t[d]),0)}h</span>
            )},
            { key:"status", label:"Status", render:(t)=><StatusBadge status={t.status} /> },
            { key:"a",      label:"",       render:(t)=>{
              if (!canApprove || t.status!=="submitted") return <span style={{ fontSize:12, color:"#d1d5db" }}>—</span>;
              return (
                <div style={{ display:"flex", gap:5 }}>
                  <Btn size="sm" variant="success" icon="check" onClick={()=>approve(t.id)}>Approve</Btn>
                  <Btn size="sm" variant="danger"  icon="x"     onClick={()=>reject(t.id)}>Reject</Btn>
                </div>
              );
            }},
          ]}
          rows={sheets}
          empty="No timesheets submitted yet."
        />
      </Card>

      <Modal open={modal} title="Submit Timesheet" onClose={()=>setModal(false)}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Select label="Employee" value={form.memberId} onChange={f("memberId")}
            options={data.members.filter((m)=>m.status==="active").map((m)=>({value:m.id,label:m.name}))} required />
          <Input label="Week Starting (Monday)" value={form.week} onChange={f("week")} type="date" />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
            {TS_DAYS.map((d,i)=><Input key={d} label={TS_DAY_LABELS[i]} value={form[d]} onChange={f(d)} type="number" />)}
          </div>
          <div style={{ padding:12, background:"#f0f9ff", borderRadius:10, fontSize:13, color:"#0ea5e9", fontWeight:600 }}>
            Total: {TS_DAYS.reduce((s,d)=>s+Number(form[d]||0),0)} hours this week
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="secondary" onClick={()=>setModal(false)}>Cancel</Btn>
            <Btn onClick={submit} disabled={!form.memberId}>Submit</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── PAYROLL ──────────────────────────────────────────────────────────────────
export function Payroll({ data, setData }) {
  const { currentUser } = useAuth();
  if (!can(currentUser.systemRole,"view_payroll")) return <AccessDenied />;
  const canRun   = can(currentUser.systemRole,"run_payroll");
  const active   = data.members.filter((m)=>m.status==="active");
  const monthly  = (m) => m.salary/12;
  const [runModal, setRunModal]         = useState(false);
  const [previewModal, setPreviewModal] = useState(null);
  const [period, setPeriod]             = useState("");
  const [deductPct, setDeductPct]       = useState(25);
  const [bonuses, setBonuses]           = useState({});
  const grossTotal  = active.reduce((s,m)=>s+monthly(m),0)+Object.values(bonuses).reduce((s,b)=>s+Number(b||0),0);
  const deductTotal = grossTotal*(deductPct/100);
  const netTotal    = grossTotal-deductTotal;
  const exportCSV = (run) => {
    const rows=[["Employee","Dept","Monthly Gross","Deductions","Net Pay"],...active.map((m)=>[m.name,m.dept,monthly(m).toFixed(2),(monthly(m)*deductPct/100).toFixed(2),(monthly(m)*(1-deductPct/100)).toFixed(2)]),["","TOTAL",run.totalGross.toFixed(2),run.totalDeductions.toFixed(2),run.totalNet.toFixed(2)]];
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([rows.map((r)=>r.join(",")).join("\n")],{type:"text/csv"})); a.download=`payroll-${run.period}.csv`; a.click();
  };
  const runPayroll = () => {
    if (!period) return;
    setData((p)=>({ ...p, payroll:[{ id:uid(), period, processedAt:today(), status:"processed", totalGross:Math.round(grossTotal), totalNet:Math.round(netTotal), totalDeductions:Math.round(deductTotal) },...(p.payroll||[])] }));
    setRunModal(false); setPeriod(""); setBonuses({});
  };
  const lastRun = (data.payroll||[])[0];
  return (
    <div>
      <SectionHeader title="Payroll" subtitle="Process and export payroll reports" action={canRun&&<Btn icon="money" onClick={()=>setRunModal(true)}>Run Payroll</Btn>} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:22 }}>
        <StatCard label="Monthly Payroll" value={currency(active.reduce((s,m)=>s+monthly(m),0))} icon={ICONS.money}   color="#6366f1" sub="Gross" />
        <StatCard label="Annual Total"    value={`$${(active.reduce((s,m)=>s+m.salary,0)/1000).toFixed(0)}k`}          icon={ICONS.payroll} color="#0ea5e9" />
        <StatCard label="Avg. Salary"     value={currency(active.reduce((s,m)=>s+m.salary,0)/(active.length||1))}      icon={ICONS.users}   color="#10b981" sub="Per year" />
        <StatCard label="Last Run"        value={lastRun?.period||"—"}                                                   icon={ICONS.clock}   color="#f59e0b" sub={lastRun?fmt(lastRun.processedAt):"None yet"} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:22 }}>
        <Card>
          <h3 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700 }}>By Department</h3>
          {Array.from(new Set(active.map((m)=>m.dept))).map((dept)=>{
            const dT=active.filter((m)=>m.dept===dept).reduce((s,m)=>s+m.salary,0);
            const aT=active.reduce((s,m)=>s+m.salary,0);
            const pct=Math.round((dT/aT)*100);
            return <div key={dept} style={{ marginBottom:12 }}><div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}><span style={{ fontSize:13, fontWeight:600 }}>{dept}</span><span style={{ fontSize:12, color:"#6b7280" }}>{currency(dT)} ({pct}%)</span></div><div style={{ height:7, borderRadius:4, background:"#f0f0f0" }}><div style={{ width:`${pct}%`, height:"100%", borderRadius:4, background:avatarColor(dept) }} /></div></div>;
          })}
        </Card>
        <Card>
          <h3 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700 }}>Compensation</h3>
          <div style={{ overflowY:"auto", maxHeight:240 }}>
            {[...active].sort((a,b)=>b.salary-a.salary).map((m)=>(
              <div key={m.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #fafafa" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}><Avatar initials={m.avatar} size={28} color={avatarColor(m.name)} /><div><div style={{ fontSize:12, fontWeight:600 }}>{m.name}</div><div style={{ fontSize:11, color:"#9ca3af" }}>{m.dept}</div></div></div>
                <div style={{ textAlign:"right" }}><div style={{ fontSize:12, fontWeight:700 }}>{currency(m.salary)}<span style={{ fontSize:10, color:"#9ca3af" }}>/yr</span></div><div style={{ fontSize:11, color:"#10b981" }}>{currency(monthly(m))}/mo</div></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <h3 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700 }}>Payroll History</h3>
        <Table cols={[
          { key:"period",          label:"Period",    render:(r)=><span style={{ fontWeight:700, fontFamily:"monospace" }}>{r.period}</span> },
          { key:"processedAt",     label:"Processed", render:(r)=>fmt(r.processedAt) },
          { key:"totalGross",      label:"Gross",     render:(r)=><span style={{ fontWeight:600 }}>{currency(r.totalGross)}</span> },
          { key:"totalDeductions", label:"Deductions",render:(r)=><span style={{ color:"#ef4444" }}>{currency(r.totalDeductions)}</span> },
          { key:"totalNet",        label:"Net Paid",  render:(r)=><span style={{ fontWeight:800, color:"#10b981" }}>{currency(r.totalNet)}</span> },
          { key:"status",          label:"Status",    render:(r)=><StatusBadge status={r.status} /> },
          { key:"a",               label:"",          render:(r)=><div style={{ display:"flex", gap:6 }}><Btn size="sm" variant="secondary" onClick={()=>setPreviewModal(r)}>Preview</Btn><Btn size="sm" variant="ghost" icon="download" onClick={()=>exportCSV(r)}>CSV</Btn></div> },
        ]} rows={data.payroll||[]} />
      </Card>
      {canRun&&<Modal open={runModal} title="Run Payroll" onClose={()=>setRunModal(false)} width={640}>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}><Input label="Pay Period (YYYY-MM)" value={period} onChange={setPeriod} placeholder="2025-03" /><Input label="Deduction %" value={deductPct} onChange={(v)=>setDeductPct(Number(v))} type="number" /></div>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Bonus Adjustments</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:200, overflowY:"auto" }}>
              {active.map((m)=>(
                <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 12px", background:"#f9fafb", borderRadius:8 }}>
                  <Avatar initials={m.avatar} size={26} color={avatarColor(m.name)} /><div style={{ flex:1, fontSize:13, fontWeight:600 }}>{m.name}</div>
                  <div style={{ fontSize:12, color:"#9ca3af" }}>{currency(monthly(m))}/mo</div>
                  <input type="number" placeholder="+Bonus" value={bonuses[m.id]||""} onChange={(e)=>setBonuses((p)=>({ ...p, [m.id]:e.target.value }))} style={{ width:80, padding:"4px 8px", borderRadius:6, border:"1px solid #e5e7eb", fontSize:12, fontFamily:"inherit", outline:"none" }} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:"linear-gradient(135deg,#0f0f14,#1a1a2e)", borderRadius:14, padding:18, color:"#fff" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Summary Preview</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {[["Gross",currency(grossTotal),"#6366f1"],["Deductions",currency(deductTotal),"#ef4444"],["Net",currency(netTotal),"#10b981"]].map(([l,v,c])=>(
                <div key={l} style={{ padding:12, background:"rgba(255,255,255,0.06)", borderRadius:10, borderTop:`3px solid ${c}` }}><div style={{ fontSize:10, color:"#9ca3af", marginBottom:3 }}>{l}</div><div style={{ fontSize:18, fontWeight:800, color:c }}>{v}</div></div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}><Btn variant="secondary" onClick={()=>setRunModal(false)}>Cancel</Btn><Btn variant="dark" icon="money" onClick={runPayroll} disabled={!period}>Process Payroll</Btn></div>
        </div>
      </Modal>}
      <Modal open={!!previewModal} title={`Report — ${previewModal?.period}`} onClose={()=>setPreviewModal(null)} width={660}>
        {previewModal&&<div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
            {[["Gross",currency(previewModal.totalGross),"#6366f1"],["Deductions",currency(previewModal.totalDeductions),"#ef4444"],["Net",currency(previewModal.totalNet),"#10b981"]].map(([l,v,c])=>(
              <div key={l} style={{ padding:14, background:`${c}10`, borderRadius:12, border:`1px solid ${c}30` }}><div style={{ fontSize:11, color:"#9ca3af", fontWeight:600, textTransform:"uppercase" }}>{l}</div><div style={{ fontSize:20, fontWeight:800, color:c, marginTop:3 }}>{v}</div></div>
            ))}
          </div>
          <Table cols={[
            { key:"name", label:"Employee", render:(m)=><div style={{ display:"flex", alignItems:"center", gap:8 }}><Avatar initials={m.avatar} size={24} color={avatarColor(m.name)} />{m.name}</div> },
            { key:"dept",  label:"Dept" },
            { key:"gross", label:"Gross",       render:(m)=>currency(monthly(m)) },
            { key:"ded",   label:"Deductions",  render:(m)=><span style={{ color:"#ef4444" }}>{currency(monthly(m)*deductPct/100)}</span> },
            { key:"net",   label:"Net Pay",     render:(m)=><span style={{ fontWeight:800, color:"#10b981" }}>{currency(monthly(m)*(1-deductPct/100))}</span> },
          ]} rows={active} />
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:14 }}><Btn icon="download" onClick={()=>exportCSV(previewModal)}>Download CSV</Btn></div>
        </div>}
      </Modal>
    </div>
  );
}

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────────
const CATS=["General","Holiday","HR","IT","Finance","Celebration","Policy","Urgent"];
const PC={high:"#ef4444",medium:"#f59e0b",low:"#10b981"};
const CE={Holiday:"🏖️",HR:"📋",IT:"💻",Finance:"💰",Celebration:"🎉",Policy:"📄",Urgent:"🚨",General:"📢"};

export function Announcements({ data, setData }) {
  const { currentUser } = useAuth();
  const canPost = can(currentUser.systemRole,"post_announcements");
  const [modal, setModal]   = useState(false);
  const [filter, setFilter] = useState("All");
  const [form, setForm]     = useState({ title:"", body:"", category:"General", priority:"medium", author:currentUser.name, pinned:false });
  const f = (k) => (v) => setForm((p)=>({ ...p, [k]:v }));
  const post = () => {
    if (!form.title||!form.body) return;
    setData((p)=>({ ...p, announcements:[{ id:uid(), ...form, createdAt:today() },...(p.announcements||[])] }));
    setModal(false); setForm({ title:"", body:"", category:"General", priority:"medium", author:currentUser.name, pinned:false });
  };
  const remove    = (id) => setData((p)=>({ ...p, announcements:p.announcements.filter((a)=>a.id!==id) }));
  const togglePin = (id) => setData((p)=>({ ...p, announcements:p.announcements.map((a)=>a.id===id?{ ...a, pinned:!a.pinned }:a) }));
  const shown = (data.announcements||[]).filter((a)=>filter==="All"||a.category===filter).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));
  return (
    <div>
      <SectionHeader title="Announcements & Notices" subtitle="Team-wide communications" action={canPost&&<Btn icon="plus" onClick={()=>setModal(true)}>Post Announcement</Btn>} />
      <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        {["All",...CATS].map((c)=><button key={c} onClick={()=>setFilter(c)} style={{ padding:"5px 12px", borderRadius:20, border:`1px solid ${filter===c?"#6366f1":"#e5e7eb"}`, background:filter===c?"#eef2ff":"#fff", color:filter===c?"#6366f1":"#6b7280", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{CE[c]||""} {c}</button>)}
      </div>
      {shown.length===0?<Card style={{ textAlign:"center", padding:48, color:"#9ca3af" }}><div style={{ fontSize:40, marginBottom:10 }}>📢</div><div style={{ fontSize:15, fontWeight:700 }}>No announcements yet</div></Card>:(
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {shown.map((a)=>(
            <Card key={a.id} style={{ padding:20, borderLeft:`4px solid ${PC[a.priority]}`, position:"relative" }}>
              {a.pinned&&<div style={{ position:"absolute", top:12, right:52, fontSize:10, color:"#6366f1", fontWeight:700, display:"flex", alignItems:"center", gap:3 }}><Icon d={ICONS.pin} size={11} /> PINNED</div>}
              <div style={{ position:"absolute", top:10, right:12, display:"flex", gap:3 }}>
                {canPost&&<button onClick={()=>togglePin(a.id)} style={{ background:"none", border:"none", cursor:"pointer", color:a.pinned?"#6366f1":"#d1d5db", padding:4 }}><Icon d={ICONS.pin} size={14} /></button>}
                {canPost&&<button onClick={()=>remove(a.id)}    style={{ background:"none", border:"none", cursor:"pointer", color:"#fca5a5", padding:4 }}><Icon d={ICONS.trash} size={14} /></button>}
              </div>
              <div style={{ display:"flex", gap:12, marginBottom:8 }}>
                <span style={{ fontSize:20 }}>{CE[a.category]||"📢"}</span>
                <div style={{ flex:1, paddingRight:64 }}>
                  <div style={{ fontSize:15, fontWeight:800 }}>{a.title}</div>
                  <div style={{ fontSize:11, color:"#9ca3af", marginTop:3, display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                    <span>By {a.author}</span><span>·</span><span>{fmt(a.createdAt)}</span>
                    <Badge label={a.category} color={avatarColor(a.category)} /><Badge label={a.priority.toUpperCase()} color={PC[a.priority]} />
                  </div>
                </div>
              </div>
              <p style={{ margin:0, fontSize:13, color:"#374151", lineHeight:1.75 }}>{a.body}</p>
            </Card>
          ))}
        </div>
      )}
      {canPost&&<Modal open={modal} title="Post Announcement" onClose={()=>setModal(false)} width={560}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Input label="Title" value={form.title} onChange={f("title")} required placeholder="What's this announcement about?" />
          <Textarea label="Content" value={form.body} onChange={f("body")} rows={4} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
            <Select label="Category" value={form.category} onChange={f("category")} options={CATS} />
            <Select label="Priority"  value={form.priority} onChange={f("priority")} options={[{value:"low",label:"Low"},{value:"medium",label:"Medium"},{value:"high",label:"High ⚠️"}]} />
            <Input  label="Posted By" value={form.author}   onChange={f("author")} />
          </div>
          <div onClick={()=>f("pinned")(!form.pinned)} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"#f9fafb", borderRadius:10, cursor:"pointer", border:"1px solid #e5e7eb" }}>
            <div style={{ width:20, height:20, borderRadius:6, border:form.pinned?"none":"2px solid #d1d5db", background:form.pinned?"#6366f1":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{form.pinned&&<Icon d={ICONS.check} size={12} stroke="#fff" />}</div>
            <div><div style={{ fontSize:13, fontWeight:600 }}>📌 Pin this announcement</div><div style={{ fontSize:12, color:"#9ca3af" }}>Pinned posts appear on the dashboard</div></div>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}><Btn variant="secondary" onClick={()=>setModal(false)}>Cancel</Btn><Btn onClick={post}>Post</Btn></div>
        </div>
      </Modal>}
    </div>
  );
}
