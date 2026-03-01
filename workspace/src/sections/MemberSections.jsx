import { useState } from "react";
import { Avatar, Badge, Btn, Card, Icon, Input, Modal, Select, SectionHeader, StatCard, StatusBadge, Table, Textarea } from "../components/UI";
import { avatarColor, currency, fmt, ICONS, today, uid } from "../utils/data";
import { ROLE_LABELS, ROLE_COLORS } from "../utils/permissions";
import { useAuth } from "../context/AuthContext";

// ─── MY DASHBOARD ─────────────────────────────────────────────────────────────
export function MyDashboard({ data }) {
  const { currentUser } = useAuth();
  const myRequests   = data.requests.filter((r) => r.memberId === currentUser.id);
  const myTimesheets = data.timesheets.filter((t) => t.memberId === currentUser.id);
  const pending      = myRequests.filter((r) => r.status === "pending").length;
  const approved     = myRequests.filter((r) => r.status === "approved").length;
  const pinned       = (data.announcements || []).filter((a) => a.pinned);
  const recent       = (data.announcements || []).slice(0, 3);

  const manager = data.members.find((m) => m.id === currentUser.managerId);

  return (
    <div>
      {/* Welcome banner */}
      <div style={{ background:"linear-gradient(135deg,#0f0f14,#1a1a2e)", borderRadius:20, padding:"28px 32px", marginBottom:24, display:"flex", alignItems:"center", gap:20 }}>
        <Avatar initials={currentUser.avatar} size={64} color={avatarColor(currentUser.name)} />
        <div>
          <div style={{ fontSize:24, fontWeight:800, color:"#fff", letterSpacing:"-0.02em" }}>Good {getGreeting()}, {currentUser.name.split(" ")[0]}! 👋</div>
          <div style={{ fontSize:14, color:"#55556a", marginTop:4 }}>{currentUser.role} · {currentUser.dept}</div>
          <div style={{ marginTop:8 }}><Badge label={ROLE_LABELS[currentUser.systemRole]} color={ROLE_COLORS[currentUser.systemRole]} /></div>
        </div>
        <div style={{ marginLeft:"auto", textAlign:"right" }}>
          <div style={{ fontSize:12, color:"#3d3d52" }}>Started</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#818cf8" }}>{fmt(currentUser.startDate)}</div>
          {manager && <>
            <div style={{ fontSize:12, color:"#3d3d52", marginTop:6 }}>Reports to</div>
            <div style={{ fontSize:14, fontWeight:700, color:"#818cf8" }}>{manager.name}</div>
          </>}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        <StatCard label="My Requests"      value={myRequests.length}   icon={ICONS.inbox}    color="#6366f1" sub="All time" />
        <StatCard label="Pending"          value={pending}             icon={ICONS.clock}    color="#f59e0b" sub="Awaiting decision" />
        <StatCard label="Approved"         value={approved}            icon={ICONS.check}    color="#10b981" sub="This year" />
        <StatCard label="Timesheets Filed" value={myTimesheets.length} icon={ICONS.payroll}  color="#0ea5e9" sub="Total submitted" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:20 }}>
        {/* Recent requests */}
        <Card>
          <h3 style={{ margin:"0 0 16px", fontSize:15, fontWeight:700 }}>My Recent Requests</h3>
          {myRequests.length === 0
            ? <p style={{ color:"#9ca3af", fontSize:14 }}>No requests yet. Use "My Requests" to submit one.</p>
            : myRequests.slice(0,5).map((r) => (
              <div key={r.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #fafafa" }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600 }}>{r.title}</div>
                  <div style={{ fontSize:12, color:"#9ca3af" }}>{r.type} · {fmt(r.createdAt)}</div>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
        </Card>

        {/* Announcements */}
        <Card>
          <h3 style={{ margin:"0 0 16px", fontSize:15, fontWeight:700 }}>📢 Latest Notices</h3>
          {recent.length === 0
            ? <p style={{ color:"#9ca3af", fontSize:14 }}>No announcements yet.</p>
            : recent.map((a) => (
              <div key={a.id} style={{ padding:"10px 0", borderBottom:"1px solid #fafafa" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#111", marginBottom:2 }}>{a.title}</div>
                <div style={{ fontSize:11, color:"#9ca3af" }}>By {a.author} · {fmt(a.createdAt)}</div>
              </div>
            ))}
        </Card>
      </div>
    </div>
  );
}

// ─── MY PROFILE ───────────────────────────────────────────────────────────────
export function MyProfile({ data }) {
  const { currentUser } = useAuth();
  const manager  = data.members.find((m) => m.id === currentUser.managerId);
  const reports  = data.members.filter((m) => m.managerId === currentUser.id && m.status === "active");
  const roleColor = ROLE_COLORS[currentUser.systemRole] || "#6b7280";

  return (
    <div>
      <SectionHeader title="My Profile" subtitle="Your personal information and role" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Profile card */}
        <Card>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
            <Avatar initials={currentUser.avatar} size={72} color={avatarColor(currentUser.name)} />
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:"#111" }}>{currentUser.name}</div>
              <div style={{ fontSize:14, color:"#6b7280" }}>{currentUser.role}</div>
              <div style={{ marginTop:6, display:"flex", gap:6 }}>
                <StatusBadge status="active" />
                <Badge label={ROLE_LABELS[currentUser.systemRole]} color={roleColor} />
              </div>
            </div>
          </div>
          {[
            ["Email",       currentUser.email],
            ["Phone",       currentUser.phone || "—"],
            ["Department",  currentUser.dept],
            ["Start Date",  fmt(currentUser.startDate)],
            ["Reports to",  manager?.name || "—"],
          ].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #fafafa" }}>
              <span style={{ fontSize:13, color:"#9ca3af", fontWeight:500 }}>{k}</span>
              <span style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{v}</span>
            </div>
          ))}
        </Card>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* System role */}
          <Card style={{ borderTop:`3px solid ${roleColor}` }}>
            <h3 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700 }}>System Access</h3>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:`${roleColor}15`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon d={ICONS.shield} size={22} stroke={roleColor} />
              </div>
              <div>
                <div style={{ fontWeight:700, color:"#111" }}>{ROLE_LABELS[currentUser.systemRole]}</div>
                <div style={{ fontSize:12, color:"#9ca3af" }}>Your permission level</div>
              </div>
            </div>
            <p style={{ margin:0, fontSize:13, color:"#6b7280", lineHeight:1.7 }}>
              {currentUser.systemRole === "super_admin" && "You have full access to all WorkSpace modules and can manage user roles."}
              {currentUser.systemRole === "hr_manager" && "You can manage team members, onboarding, offboarding, timesheets, and post announcements."}
              {currentUser.systemRole === "finance_officer" && "You can handle financial requests, invoices, and run payroll."}
              {currentUser.systemRole === "inventory_manager" && "You can manage office inventory and asset tracking."}
              {currentUser.systemRole === "approver" && "You can approve or reject leave and travel requests."}
              {currentUser.systemRole === "team_member" && "You can view and submit your own requests, timesheets, and read announcements."}
            </p>
          </Card>

          {/* Direct reports */}
          {reports.length > 0 && (
            <Card>
              <h3 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700 }}>Direct Reports ({reports.length})</h3>
              {reports.map((r) => (
                <div key={r.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid #fafafa" }}>
                  <Avatar initials={r.avatar} size={32} color={avatarColor(r.name)} />
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{r.name}</div>
                    <div style={{ fontSize:11, color:"#9ca3af" }}>{r.role}</div>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MY REQUESTS ──────────────────────────────────────────────────────────────
const TYPE_COLORS = { leave:"#8b5cf6", travel:"#0ea5e9", advance:"#f59e0b", reimbursement:"#10b981" };
const MY_EXPENSE_CATS = ["Meals","Transport","Accommodation","Electronics","Accessories","Office Supplies","Cleaning","Furniture","Software","Other"];

function myLineTotal(items=[]) { return items.reduce((s,i)=>s+Number(i.total||0),0); }

function exportMyExpenseCSV(req) {
  const header = ["Category","Description","Qty","Unit Cost","Total"];
  const rows   = (req.lineItems||[]).map((li)=>[li.category,li.description,li.qty,li.unitCost.toFixed(2),li.total.toFixed(2)]);
  const grand  = ["","TOTAL","","",myLineTotal(req.lineItems).toFixed(2)];
  const meta   = [
    [`Expense Report: ${req.title}`],[`Employee: ${req.memberName}`],
    [`Type: ${req.type}`],[`Date: ${req.createdAt}`],[`Status: ${req.status}`],[],
    header,...rows,grand,
  ];
  const a = document.createElement("a");
  a.href  = URL.createObjectURL(new Blob([meta.map((r)=>r.join(",")).join("\n")],{type:"text/csv"}));
  a.download = `expense-report-${req.id}.csv`;
  a.click();
}

const BLANK_ITEM = { category:"", description:"", qty:1, unitCost:"" };

export function MyRequests({ data, setData }) {
  const { currentUser } = useAuth();
  const [modal,     setModal]     = useState(false);
  const [detailReq, setDetailReq] = useState(null);
  const [type,      setType]      = useState("leave");
  const [form,      setForm]      = useState({ title:"", from:today(), to:today(), destination:"", reason:"" });
  const [lineItems, setLineItems] = useState([{ ...BLANK_ITEM, id:uid() }]);
  const f = (k) => (v) => setForm((p)=>({...p,[k]:v}));

  const isFinancial = type==="advance" || type==="reimbursement";
  const myRequests  = data.requests.filter((r)=>r.memberId===currentUser.id);

  // Line item helpers
  const updateItem = (id, field, value) => setLineItems((p)=>p.map((li)=>{
    if (li.id!==id) return li;
    const updated = {...li, [field]:value};
    if (field==="qty"||field==="unitCost") updated.total = Number(updated.qty||0)*Number(updated.unitCost||0);
    return updated;
  }));
  const addItem    = ()  => setLineItems((p)=>[...p, {...BLANK_ITEM, id:uid()}]);
  const removeItem = (id)=> setLineItems((p)=>p.filter((li)=>li.id!==id));
  const grandTotal = myLineTotal(lineItems);

  const resetModal = () => {
    setModal(false);
    setType("leave");
    setForm({ title:"", from:today(), to:today(), destination:"", reason:"" });
    setLineItems([{...BLANK_ITEM, id:uid()}]);
  };

  const submit = () => {
    if (!form.title) return;
    const base = { id:uid(), type, memberId:currentUser.id, memberName:currentUser.name, createdAt:today(), status:"pending", ...form };
    const req  = isFinancial
      ? { ...base, lineItems: lineItems.map((li)=>({...li, qty:Number(li.qty), unitCost:Number(li.unitCost), total:Number(li.qty)*Number(li.unitCost)})) }
      : base;
    setData((p)=>({...p, requests:[req,...p.requests]}));
    resetModal();
  };

  return (
    <div>
      <SectionHeader title="My Requests" subtitle="Submit and track your requests and expense reports"
        action={<Btn icon="plus" onClick={()=>setModal(true)}>New Request</Btn>} />

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
        {[["All",myRequests.length,"#6b7280"],["Pending",myRequests.filter((r)=>r.status==="pending").length,"#f59e0b"],["Approved",myRequests.filter((r)=>r.status==="approved").length,"#10b981"],["Rejected",myRequests.filter((r)=>r.status==="rejected").length,"#ef4444"]].map(([l,v,c])=>(
          <Card key={l} style={{ textAlign:"center", padding:16 }}>
            <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
            <div style={{ fontSize:12, color:"#9ca3af", marginTop:4 }}>{l}</div>
          </Card>
        ))}
      </div>

      <Card>
        <Table
          cols={[
            { key:"type",      label:"Type",      render:(r)=><Badge label={r.type.toUpperCase()} color={TYPE_COLORS[r.type]} /> },
            { key:"title",     label:"Title"      },
            { key:"amount",    label:"Amount / Dates", render:(r)=>{
              if (r.lineItems?.length) return <span style={{ fontWeight:700 }}>{currency(myLineTotal(r.lineItems))}</span>;
              if (r.from) return <span style={{ fontSize:12, color:"#6b7280" }}>{fmt(r.from)} → {fmt(r.to)}</span>;
              return "—";
            }},
            { key:"items",     label:"",          render:(r)=>r.lineItems?.length
              ? <Badge label={`${r.lineItems.length} items`} color="#6366f1" />
              : null },
            { key:"createdAt", label:"Submitted", render:(r)=>fmt(r.createdAt) },
            { key:"status",    label:"Status",    render:(r)=><StatusBadge status={r.status} /> },
            { key:"a",         label:"",          render:(r)=>(
              <Btn size="sm" variant="ghost" onClick={()=>setDetailReq(r)}>
                {r.lineItems?.length ? "View Report" : "View"}
              </Btn>
            )},
          ]}
          rows={myRequests}
          empty="No requests yet. Click 'New Request' to submit one."
        />
      </Card>

      {/* ── Detail / expense report view ── */}
      <Modal open={!!detailReq} title={detailReq?.title||""} onClose={()=>setDetailReq(null)} width={660}>
        {detailReq && (()=>{
          const isF = detailReq.type==="advance"||detailReq.type==="reimbursement";
          const total = myLineTotal(detailReq.lineItems);
          const catMap = {};
          (detailReq.lineItems||[]).forEach((li)=>{ catMap[li.category]=(catMap[li.category]||0)+li.total; });
          return (
            <div>
              <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
                <Badge label={detailReq.type.toUpperCase()} color={TYPE_COLORS[detailReq.type]} />
                <span style={{ fontSize:12, color:"#9ca3af" }}>Submitted {fmt(detailReq.createdAt)}</span>
                <StatusBadge status={detailReq.status} />
              </div>
              {detailReq.reason && (
                <div style={{ padding:12, background:"#f0f9ff", borderRadius:10, fontSize:13, color:"#374151", marginBottom:14, borderLeft:"3px solid #0ea5e9" }}>
                  <span style={{ fontWeight:600, color:"#0ea5e9" }}>Reason: </span>{detailReq.reason}
                </div>
              )}
              {detailReq.from && (
                <div style={{ display:"flex", gap:12, marginBottom:14 }}>
                  {[["From",fmt(detailReq.from)],["To",fmt(detailReq.to)],detailReq.destination&&["Destination",detailReq.destination]].filter(Boolean).map(([l,v])=>(
                    <div key={l} style={{ padding:"10px 14px", background:"#f9fafb", borderRadius:10 }}>
                      <div style={{ fontSize:11, color:"#9ca3af", fontWeight:600, textTransform:"uppercase" }}>{l}</div>
                      <div style={{ fontSize:13, fontWeight:700, marginTop:2 }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
              {isF && (detailReq.lineItems||[]).length > 0 && (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <h4 style={{ margin:0, fontSize:14, fontWeight:700 }}>Expense Line Items</h4>
                    <Btn size="sm" variant="ghost" icon="download" onClick={()=>exportMyExpenseCSV(detailReq)}>Export CSV</Btn>
                  </div>
                  <div style={{ borderRadius:10, border:"1px solid #f0f0f0", overflow:"hidden" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                      <thead>
                        <tr style={{ background:"#f9fafb" }}>
                          {["Category","Description","Qty","Unit Cost","Total"].map((h)=>(
                            <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {detailReq.lineItems.map((li)=>(
                          <tr key={li.id} style={{ borderBottom:"1px solid #fafafa" }}>
                            <td style={{ padding:"9px 12px" }}><Badge label={li.category} color={avatarColor(li.category)} /></td>
                            <td style={{ padding:"9px 12px", color:"#374151" }}>{li.description}</td>
                            <td style={{ padding:"9px 12px", color:"#6b7280", textAlign:"right" }}>{li.qty}</td>
                            <td style={{ padding:"9px 12px", color:"#6b7280", textAlign:"right" }}>{currency(li.unitCost)}</td>
                            <td style={{ padding:"9px 12px", fontWeight:700, textAlign:"right" }}>{currency(li.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ background:"#f9fafb", borderTop:"2px solid #e5e7eb" }}>
                          <td colSpan={4} style={{ padding:"10px 12px", fontWeight:800 }}>Total</td>
                          <td style={{ padding:"10px 12px", fontWeight:800, color:"#6366f1", textAlign:"right", fontSize:15 }}>{currency(total)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  {Object.keys(catMap).length > 1 && (
                    <div style={{ marginTop:12, padding:12, background:"#f9fafb", borderRadius:10 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", marginBottom:8 }}>By Category</div>
                      {Object.entries(catMap).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>{
                        const pct=Math.round((amt/total)*100);
                        return (
                          <div key={cat} style={{ marginBottom:8 }}>
                            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                              <span style={{ fontSize:12, fontWeight:600 }}>{cat}</span>
                              <span style={{ fontSize:12, color:"#6b7280" }}>{currency(amt)} ({pct}%)</span>
                            </div>
                            <div style={{ height:5, borderRadius:3, background:"#e5e7eb" }}>
                              <div style={{ width:`${pct}%`, height:"100%", borderRadius:3, background:avatarColor(cat) }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* ── New Request modal ── */}
      <Modal open={modal} title="Submit a Request" onClose={resetModal} width={isFinancial ? 680 : 520}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Select label="Request Type" value={type} onChange={(v)=>{ setType(v); setLineItems([{...BLANK_ITEM,id:uid()}]); }}
            options={[{value:"leave",label:"🌴 Leave"},{value:"travel",label:"✈️ Travel"},{value:"advance",label:"💵 Cash Advance"},{value:"reimbursement",label:"🧾 Reimbursement"}]} />
          <Input label="Title / Subject" value={form.title} onChange={f("title")} required />
          {(type==="leave"||type==="travel") && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <Input label="From" value={form.from} onChange={f("from")} type="date" />
              <Input label="To"   value={form.to}   onChange={f("to")}   type="date" />
            </div>
          )}
          {type==="travel" && <Input label="Destination" value={form.destination} onChange={f("destination")} />}
          <Textarea label="Reason / Notes" value={form.reason} onChange={f("reason")} rows={2} />

          {/* Line items for financial requests */}
          {isFinancial && (
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>
                Expense Line Items
              </div>
              <div style={{ border:"1px solid #e5e7eb", borderRadius:10, overflow:"hidden" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead>
                    <tr style={{ background:"#f9fafb" }}>
                      {["Category","Description","Qty","Unit Cost (USD)","Total",""].map((h)=>(
                        <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((li)=>(
                      <tr key={li.id} style={{ borderBottom:"1px solid #fafafa" }}>
                        <td style={{ padding:"6px 8px" }}>
                          <select value={li.category} onChange={(e)=>updateItem(li.id,"category",e.target.value)}
                            style={{ width:"100%", padding:"5px 6px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:12, fontFamily:"inherit", background:"#fff" }}>
                            <option value="">Select…</option>
                            {MY_EXPENSE_CATS.map((c)=><option key={c}>{c}</option>)}
                          </select>
                        </td>
                        <td style={{ padding:"6px 8px" }}>
                          <input value={li.description} onChange={(e)=>updateItem(li.id,"description",e.target.value)}
                            placeholder="What was it for?" style={{ width:"100%", padding:"5px 6px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:12, fontFamily:"inherit", outline:"none" }} />
                        </td>
                        <td style={{ padding:"6px 8px", width:52 }}>
                          <input type="number" value={li.qty} onChange={(e)=>updateItem(li.id,"qty",e.target.value)} min={1}
                            style={{ width:"100%", padding:"5px 6px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:12, fontFamily:"inherit", outline:"none", textAlign:"right" }} />
                        </td>
                        <td style={{ padding:"6px 8px", width:100 }}>
                          <input type="number" value={li.unitCost} onChange={(e)=>updateItem(li.id,"unitCost",e.target.value)} placeholder="0.00"
                            style={{ width:"100%", padding:"5px 6px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:12, fontFamily:"inherit", outline:"none", textAlign:"right" }} />
                        </td>
                        <td style={{ padding:"6px 10px", fontWeight:700, color:"#374151", whiteSpace:"nowrap", textAlign:"right" }}>
                          {currency(Number(li.qty||0)*Number(li.unitCost||0))}
                        </td>
                        <td style={{ padding:"6px 8px" }}>
                          {lineItems.length > 1 && (
                            <button onClick={()=>removeItem(li.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"#fca5a5", padding:"2px 4px" }}>
                              <Icon d={ICONS.x} size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                <Btn size="sm" variant="secondary" icon="plus" onClick={addItem}>Add Line</Btn>
                <div style={{ fontSize:14, fontWeight:800, color:"#6366f1" }}>
                  Total: {currency(grandTotal)}
                </div>
              </div>
            </div>
          )}

          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="secondary" onClick={resetModal}>Cancel</Btn>
            <Btn onClick={submit} disabled={!form.title||(isFinancial&&grandTotal===0)}>Submit Request</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── MY TIMESHEETS ────────────────────────────────────────────────────────────
// ── helpers shared with admin version ─────────────────────────────────────────
function mLabel(ym) {
  const [y,m] = ym.split("-");
  return new Date(Number(y), Number(m)-1, 1).toLocaleDateString("en-US",{month:"long",year:"numeric"});
}
function pMonth(ym) { const [y,m]=ym.split("-").map(Number); return m===1?`${y-1}-12`:`${y}-${String(m-1).padStart(2,"0")}`; }
function nMonth(ym) { const [y,m]=ym.split("-").map(Number); return m===12?`${y+1}-01`:`${y}-${String(m+1).padStart(2,"0")}`; }
function cYM()      { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; }

export function MyTimesheets({ data, setData }) {
  const { currentUser } = useAuth();
  const [viewMonth, setViewMonth] = useState(cYM());
  const [addModal,  setAddModal]  = useState(false);
  const [entry, setEntry] = useState({ date:today(), project:"", description:"", hours:"" });
  const se = (k) => (v) => setEntry((p)=>({...p,[k]:v}));

  // Find or create the sheet for this member + month
  const mySheet = data.timesheets.find((ts) => ts.memberId===currentUser.id && ts.month===viewMonth);
  const entries = mySheet?.entries || [];
  const totalHours = entries.reduce((s,e)=>s+Number(e.hours),0);
  const projMap = {};
  entries.forEach((e)=>{ projMap[e.project]=(projMap[e.project]||0)+Number(e.hours); });

  const submitEntry = () => {
    if (!entry.project || !entry.hours) return;
    const newE = { id:uid(), ...entry, hours:Number(entry.hours), status:"pending" };
    setData((p) => {
      const existing = p.timesheets.find((ts)=>ts.memberId===currentUser.id&&ts.month===viewMonth);
      if (existing) {
        return { ...p, timesheets: p.timesheets.map((ts)=>ts.id===existing.id?{ ...ts, entries:[...ts.entries, newE] }:ts) };
      }
      return { ...p, timesheets:[...p.timesheets, { id:uid(), memberId:currentUser.id, memberName:currentUser.name, month:viewMonth, entries:[newE] }] };
    });
    setEntry({ date:today(), project:"", description:"", hours:"" });
    setAddModal(false);
  };

  return (
    <div>
      <SectionHeader title="My Timesheets" subtitle="Log your tasks and hours month by month"
        action={<Btn icon="plus" onClick={()=>setAddModal(true)}>Log Entry</Btn>} />

      {/* Month navigator */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button onClick={()=>setViewMonth(pMonth(viewMonth))} style={{ background:"#f4f4f5", border:"none", borderRadius:8, padding:"7px 14px", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:600 }}>← Prev</button>
        <span style={{ fontSize:16, fontWeight:800, color:"#111", minWidth:160, textAlign:"center" }}>{mLabel(viewMonth)}</span>
        <button onClick={()=>setViewMonth(nMonth(viewMonth))} style={{ background:"#f4f4f5", border:"none", borderRadius:8, padding:"7px 14px", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:600 }}>Next →</button>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <Card style={{ padding:16, textAlign:"center" }}><div style={{ fontSize:24, fontWeight:800, color:"#6366f1" }}>{totalHours}h</div><div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>Total Hours</div></Card>
        <Card style={{ padding:16, textAlign:"center" }}><div style={{ fontSize:24, fontWeight:800, color:"#0ea5e9" }}>{entries.length}</div><div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>Entries</div></Card>
        <Card style={{ padding:16, textAlign:"center" }}><div style={{ fontSize:24, fontWeight:800, color:"#f59e0b" }}>{entries.filter((e)=>e.status==="pending").length}</div><div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>Pending</div></Card>
        <Card style={{ padding:16, textAlign:"center" }}><div style={{ fontSize:24, fontWeight:800, color:"#10b981" }}>{entries.filter((e)=>e.status==="approved").length}</div><div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>Approved</div></Card>
      </div>

      {/* Entries table */}
      <Card style={{ marginBottom:20 }}>
        <h3 style={{ margin:"0 0 16px", fontSize:15, fontWeight:700 }}>Task Log — {mLabel(viewMonth)}</h3>
        {entries.length === 0 ? (
          <div style={{ textAlign:"center", padding:"36px 0", color:"#9ca3af" }}>
            <div style={{ fontSize:36, marginBottom:8 }}>🕐</div>
            <div style={{ fontSize:14, fontWeight:600 }}>No entries yet for {mLabel(viewMonth)}</div>
            <div style={{ fontSize:12, marginTop:4 }}>Click "Log Entry" to record your work</div>
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:"#f9fafb" }}>
                  {["Date","Project / Task","Description","Hours","Status"].map((h)=>(
                    <th key={h} style={{ padding:"9px 12px", textAlign:"left", fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((e)=>(
                  <tr key={e.id} style={{ borderBottom:"1px solid #f4f4f5" }}>
                    <td style={{ padding:"10px 12px", whiteSpace:"nowrap", color:"#6b7280", fontSize:12 }}>{fmt(e.date)}</td>
                    <td style={{ padding:"10px 12px" }}>
                      <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:`${avatarColor(e.project)}18`, color:avatarColor(e.project) }}>{e.project}</span>
                    </td>
                    <td style={{ padding:"10px 12px", color:"#374151", maxWidth:280 }}>{e.description || <span style={{ color:"#d1d5db" }}>—</span>}</td>
                    <td style={{ padding:"10px 12px", fontWeight:800, color:"#6366f1" }}>{e.hours}h</td>
                    <td style={{ padding:"10px 12px" }}><StatusBadge status={e.status} /></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background:"#f9fafb", borderTop:"2px solid #e5e7eb" }}>
                  <td colSpan={3} style={{ padding:"10px 12px", fontSize:12, fontWeight:700, color:"#374151" }}>Monthly Total</td>
                  <td style={{ padding:"10px 12px", fontWeight:800, color:"#6366f1", fontSize:15 }}>{totalHours}h</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>

      {/* Hours by project */}
      {Object.keys(projMap).length > 0 && (
        <Card>
          <h3 style={{ margin:"0 0 16px", fontSize:15, fontWeight:700 }}>Hours by Project — {mLabel(viewMonth)}</h3>
          {Object.entries(projMap).sort((a,b)=>b[1]-a[1]).map(([proj,hrs])=>{
            const pct=Math.round((hrs/totalHours)*100);
            return (
              <div key={proj} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{proj}</span>
                  <span style={{ fontSize:12, color:"#6b7280" }}>{hrs}h <span style={{ color:"#9ca3af" }}>({pct}%)</span></span>
                </div>
                <div style={{ height:7, borderRadius:4, background:"#f0f0f0" }}>
                  <div style={{ width:`${pct}%`, height:"100%", borderRadius:4, background:avatarColor(proj) }} />
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {/* Add entry modal */}
      <Modal open={addModal} title="Log a Task Entry" onClose={()=>setAddModal(false)}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Input label="Date"         value={entry.date}        onChange={se("date")}        type="date" required />
            <Input label="Project/Task" value={entry.project}     onChange={se("project")}     placeholder="e.g. Q2 Planning" required />
          </div>
          <Input  label="Description" value={entry.description} onChange={se("description")} placeholder="What did you work on?" />
          <Input  label="Hours"       value={entry.hours}       onChange={se("hours")}       type="number" placeholder="e.g. 4" required />
          <div style={{ padding:10, background:"#f0f9ff", borderRadius:8, fontSize:12, color:"#0ea5e9" }}>
            Logging to <strong>{mLabel(viewMonth)}</strong>. Your manager will review and approve.
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="secondary" onClick={()=>setAddModal(false)}>Cancel</Btn>
            <Btn onClick={submitEntry} disabled={!entry.project||!entry.hours}>Log Entry</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
