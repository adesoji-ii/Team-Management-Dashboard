import { useState } from "react";
import { Avatar, Badge, Card, Icon } from "./UI";
import { ICONS, avatarColor } from "../utils/data";
import { ROLE_LABELS, ROLE_COLORS } from "../utils/permissions";

export default function LoginScreen({ members, onLogin }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ minHeight:"100vh", background:"#0c0c11", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif" }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:48 }}>
        <div style={{ width:44, height:44, borderRadius:14, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon d={ICONS.dashboard} size={22} stroke="#fff" />
        </div>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:"#fff", letterSpacing:"-0.02em" }}>WorkSpace</div>
          <div style={{ fontSize:12, color:"#4b4b5e" }}>Office Management Platform</div>
        </div>
      </div>

      <div style={{ width:"100%", maxWidth:600 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <h2 style={{ margin:"0 0 8px", fontSize:24, fontWeight:800, color:"#fff" }}>Who are you?</h2>
          <p style={{ margin:0, color:"#55556a", fontSize:14 }}>Select your account to sign in. Each person has different access based on their role.</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {members.filter((m) => m.status === "active").map((m) => {
            const color = ROLE_COLORS[m.systemRole] || "#6b7280";
            const isHov = hovered === m.id;
            return (
              <div
                key={m.id}
                onClick={() => onLogin(m.id)}
                onMouseEnter={() => setHovered(m.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isHov ? "#18182a" : "#111117",
                  border: `1px solid ${isHov ? color : "#1f1f2a"}`,
                  borderRadius: 16, padding: "18px 20px",
                  cursor: "pointer", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 14,
                  boxShadow: isHov ? `0 0 0 1px ${color}40` : "none",
                }}
              >
                <Avatar initials={m.avatar} size={46} color={avatarColor(m.name)} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginBottom:4 }}>{m.name}</div>
                  <div style={{ fontSize:12, color:"#55556a", marginBottom:6 }}>{m.role} · {m.dept}</div>
                  <Badge label={ROLE_LABELS[m.systemRole] || m.systemRole} color={color} />
                </div>
                <Icon d={ICONS.chevronRight} size={18} stroke={isHov ? color : "#2e2e40"} />
              </div>
            );
          })}
        </div>

        <p style={{ textAlign:"center", marginTop:28, fontSize:12, color:"#2e2e40" }}>
          In production, this would be replaced with secure authentication (SSO, email/password, etc.)
        </p>
      </div>
    </div>
  );
}
