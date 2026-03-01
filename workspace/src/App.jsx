import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginScreen from "./components/LoginScreen";
import Sidebar     from "./components/Sidebar";
import Topbar      from "./components/Topbar";
import { SEED }    from "./utils/data";
import { allowedSections } from "./utils/permissions";

// Admin sections
import {
  Dashboard, OrgChart, TeamMembers, Onboarding, Offboarding,
  Requests, Inventory, Invoices, Timesheets, Payroll, Announcements,
} from "./sections/AdminSections";
import RolesAccess from "./sections/RolesAccess";

// Member-facing sections
import {
  MyDashboard, MyProfile, MyRequests, MyTimesheets,
} from "./sections/MemberSections";

// ── Inner app (rendered once logged in) ──────────────────────────────────────
function AppShell({ data, setData }) {
  const { currentUser, logout } = useAuth();
  const allowed = allowedSections(currentUser.systemRole);
  const [active, setActive] = useState(allowed[0] || "my_dashboard");

  // If active section becomes disallowed after a role change, reset
  useEffect(() => {
    if (!allowed.includes(active)) setActive(allowed[0] || "my_dashboard");
  }, [currentUser.systemRole]);

  const badges = {
    requests:    data.requests.filter((r) => r.status === "pending").length,
    my_requests: data.requests.filter((r) => r.memberId === currentUser.id && r.status === "pending").length,
  };

  const SECTIONS = {
    // Admin / privileged
    dashboard:     <Dashboard     data={data} setData={setData} />,
    orgchart:      <OrgChart      data={data} setData={setData} />,
    team:          <TeamMembers   data={data} setData={setData} />,
    onboarding:    <Onboarding    data={data} setData={setData} />,
    offboarding:   <Offboarding   data={data} setData={setData} />,
    requests:      <Requests      data={data} setData={setData} />,
    inventory:     <Inventory     data={data} setData={setData} />,
    invoices:      <Invoices      data={data} setData={setData} />,
    timesheets:    <Timesheets    data={data} setData={setData} />,
    payroll:       <Payroll       data={data} setData={setData} />,
    announcements: <Announcements data={data} setData={setData} />,
    roles:         <RolesAccess   data={data} setData={setData} />,
    // Member-facing
    my_dashboard:  <MyDashboard   data={data} />,
    my_profile:    <MyProfile     data={data} />,
    my_requests:   <MyRequests    data={data} setData={setData} />,
    my_timesheets: <MyTimesheets  data={data} setData={setData} />,
  };

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif", background:"#f8f8fb", color:"#111" }}>
      <Sidebar
        active={active}
        setActive={setActive}
        currentUser={currentUser}
        badges={badges}
        onLogout={logout}
      />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <Topbar active={active} pendingCount={badges.requests + badges.my_requests} currentUser={currentUser} />
        <main style={{ flex:1, overflowY:"auto", padding:26 }}>
          {SECTIONS[active] || <div style={{ color:"#9ca3af", padding:40, textAlign:"center" }}>Section not found.</div>}
        </main>
      </div>
    </div>
  );
}

// ── Root with auth provider ───────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(SEED);

  // Persist state
  useEffect(() => {
    window.storage?.get("wsOfficeV4")
      .then((r) => { if (r?.value) setData(JSON.parse(r.value)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    window.storage?.set("wsOfficeV4", JSON.stringify(data)).catch(() => {});
  }, [data]);

  // Sync currentUser with latest data (so role changes reflect immediately)
  return (
    <AuthProvider members={data.members}>
      <AuthConsumerApp data={data} setData={setData} />
    </AuthProvider>
  );
}

function AuthConsumerApp({ data, setData }) {
  const { currentUser, login } = useAuth();

  // Keep currentUser in sync when data.members changes (e.g. role updated)
  useEffect(() => {
    if (currentUser) {
      const updated = data.members.find((m) => m.id === currentUser.id);
      if (updated && updated.systemRole !== currentUser.systemRole) {
        login(currentUser.id); // re-login to pick up new role
      }
    }
  }, [data.members]);

  if (!currentUser) {
    return <LoginScreen members={data.members} onLogin={login} />;
  }

  return <AppShell data={data} setData={setData} />;
}
