// ── Helpers ───────────────────────────────────────────────────────────────────
export const uid      = () => Math.random().toString(36).slice(2, 9);
export const today    = () => new Date().toISOString().split("T")[0];
export const fmt      = (d) => new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
export const currency = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits:2 })}`;

export const AVATAR_COLORS = ["#6366f1","#0ea5e9","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#84cc16"];
export const avatarColor   = (name) => AVATAR_COLORS[(name||"A").charCodeAt(0) % AVATAR_COLORS.length];

// ── Icons ─────────────────────────────────────────────────────────────────────
export const ICONS = {
  dashboard:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  users:        "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  onboard:      "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8zM19 8l3 3-3 3M22 11h-7",
  offboard:     "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8zM22 8l-3 3 3 3M19 11h-7",
  money:        "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  inbox:        "M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z",
  box:          "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  receipt:      "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  clock:        "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  check:        "M20 6L9 17l-5-5",
  x:            "M18 6L6 18M6 6l12 12",
  plus:         "M12 5v14M5 12h14",
  chevronRight: "M9 18l6-6-6-6",
  chevronDown:  "M6 9l6 6 6-6",
  search:       "M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z",
  bell:         "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  edit:         "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:        "M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2",
  alert:        "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  download:     "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  orgchart:     "M3 9h4v6H3zM17 9h4v6h-4zM10 3h4v5h-4zM10 16h4v5h-4zM5 12h14M12 8v8",
  megaphone:    "M3 11l19-9-9 19-2-8-8-2z",
  payroll:      "M9 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M13 3h8v8M21 3L9 15",
  pin:          "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 10a1 1 0 110-2 1 1 0 010 2z",
  shield:       "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  person:       "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  logout:       "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  lock:         "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
};

// ── Seed Data ─────────────────────────────────────────────────────────────────
export const SEED = {
  // members also serve as user accounts — each has a systemRole
  members: [
    { id:"m0", name:"Elena Torres",  role:"CEO",             dept:"Executive",   email:"elena@acme.io",  phone:"+1 555-0100", startDate:"2018-01-01", status:"active", avatar:"ET", salary:220000, managerId:null,  systemRole:"super_admin"       },
    { id:"m1", name:"Amara Osei",    role:"Product Manager", dept:"Product",     email:"amara@acme.io",  phone:"+1 555-0101", startDate:"2022-03-15", status:"active", avatar:"AO", salary:110000, managerId:"m0", systemRole:"approver"          },
    { id:"m2", name:"Jordan Lee",    role:"Sr. Engineer",    dept:"Engineering", email:"jordan@acme.io", phone:"+1 555-0102", startDate:"2021-08-01", status:"active", avatar:"JL", salary:130000, managerId:"m0", systemRole:"team_member"       },
    { id:"m3", name:"Priya Nair",    role:"UX Designer",     dept:"Design",      email:"priya@acme.io",  phone:"+1 555-0103", startDate:"2023-01-10", status:"active", avatar:"PN", salary:95000,  managerId:"m1", systemRole:"team_member"       },
    { id:"m4", name:"Marcus Webb",   role:"Finance Lead",    dept:"Finance",     email:"marcus@acme.io", phone:"+1 555-0104", startDate:"2020-06-20", status:"active", avatar:"MW", salary:120000, managerId:"m0", systemRole:"finance_officer"   },
    { id:"m5", name:"Sofia Reyes",   role:"HR Manager",      dept:"HR",          email:"sofia@acme.io",  phone:"+1 555-0105", startDate:"2019-11-05", status:"active", avatar:"SR", salary:105000, managerId:"m0", systemRole:"hr_manager"        },
    { id:"m6", name:"Devon Clarke",  role:"Ops Lead",        dept:"Operations",  email:"devon@acme.io",  phone:"+1 555-0106", startDate:"2021-03-01", status:"active", avatar:"DC", salary:98000,  managerId:"m0", systemRole:"inventory_manager" },
  ],
  requests: [
    { id:"r1", type:"leave",  memberId:"m1", memberName:"Amara Osei", title:"Annual Leave",
      from:"2025-03-10", to:"2025-03-14", reason:"Family vacation", status:"pending", createdAt:"2025-02-20" },
    { id:"r2", type:"travel", memberId:"m2", memberName:"Jordan Lee", title:"NYC Tech Summit",
      from:"2025-03-05", to:"2025-03-07", destination:"New York, NY", reason:"Conference attendance", status:"approved", createdAt:"2025-02-18" },
    { id:"r3", type:"advance", memberId:"m3", memberName:"Priya Nair", title:"Equipment Purchase Advance",
      reason:"New laptop and peripherals for design work", status:"pending", createdAt:"2025-02-22",
      lineItems:[
        { id:"li1", category:"Electronics",    description:"MacBook Pro 14\" M3",        qty:1, unitCost:1999, total:1999 },
        { id:"li2", category:"Electronics",    description:"External Monitor 27\"",       qty:1, unitCost:399,  total:399  },
        { id:"li3", category:"Accessories",    description:"USB-C Hub",                  qty:1, unitCost:89,   total:89   },
        { id:"li4", category:"Accessories",    description:"Ergonomic Mouse",            qty:1, unitCost:79,   total:79   },
      ]},
    { id:"r4", type:"reimbursement", memberId:"m4", memberName:"Marcus Webb", title:"Client Entertainment — Q1",
      reason:"Dinner with Apex Corp stakeholders — deal closing", status:"approved", createdAt:"2025-02-15",
      lineItems:[
        { id:"li5", category:"Meals",          description:"Dinner — Nobu Restaurant (6 guests)", qty:1, unitCost:280, total:280 },
        { id:"li6", category:"Transport",      description:"Uber Black — airport to venue",        qty:2, unitCost:45,  total:90  },
      ]},
    { id:"r5", type:"leave",  memberId:"m5", memberName:"Sofia Reyes", title:"Sick Leave",
      from:"2025-02-28", to:"2025-02-28", reason:"Unwell", status:"approved", createdAt:"2025-02-28" },
    { id:"r6", type:"reimbursement", memberId:"m2", memberName:"Jordan Lee", title:"Conference Expenses — NYC",
      reason:"Meals and transport during NYC Tech Summit", status:"pending", createdAt:"2025-02-19",
      lineItems:[
        { id:"li7",  category:"Transport",     description:"Flight JFK return",                   qty:1, unitCost:420, total:420 },
        { id:"li8",  category:"Accommodation", description:"Hotel — 2 nights",                    qty:2, unitCost:189, total:378 },
        { id:"li9",  category:"Meals",         description:"Per diem meals (3 days)",             qty:3, unitCost:55,  total:165 },
        { id:"li10", category:"Other",         description:"Conference registration fee",          qty:1, unitCost:299, total:299 },
      ]},
    { id:"r7", type:"advance", memberId:"m6", memberName:"Devon Clarke", title:"Office Supplies — Q1 Restock",
      reason:"Quarterly restock of operations supplies", status:"pending", createdAt:"2025-02-25",
      lineItems:[
        { id:"li11", category:"Office Supplies", description:"Printer paper (5 reams)",           qty:5,  unitCost:12,  total:60  },
        { id:"li12", category:"Office Supplies", description:"Whiteboard markers set",            qty:3,  unitCost:18,  total:54  },
        { id:"li13", category:"Cleaning",        description:"Cleaning supplies bundle",          qty:2,  unitCost:45,  total:90  },
        { id:"li14", category:"Furniture",       description:"Cable management trays",            qty:6,  unitCost:22,  total:132 },
      ]},
  ],
  inventory: [
    { id:"i1", name:"MacBook Pro 16\"",    category:"Electronics", qty:8,  condition:"Good", value:2499, returnable:true,
      assignments:[
        { id:"a1", assignedTo:"Jordan Lee",  memberId:"m2", checkedOut:"2024-09-01", dueBack:null,         status:"in_use"    },
        { id:"a2", assignedTo:"Priya Nair",  memberId:"m3", checkedOut:"2024-09-01", dueBack:null,         status:"in_use"    },
        { id:"a3", assignedTo:"Amara Osei",  memberId:"m1", checkedOut:"2024-10-15", dueBack:null,         status:"in_use"    },
        { id:"a4", assignedTo:"Marcus Webb", memberId:"m4", checkedOut:"2024-08-01", dueBack:"2025-01-31", status:"returned"  },
      ]},
    { id:"i2", name:"Standing Desk",        category:"Furniture",   qty:12, condition:"Good", value:650,  returnable:false,
      assignments:[
        { id:"a5", assignedTo:"Jordan Lee",  memberId:"m2", checkedOut:"2023-01-10", dueBack:null, status:"in_use" },
        { id:"a6", assignedTo:"Priya Nair",  memberId:"m3", checkedOut:"2023-01-10", dueBack:null, status:"in_use" },
        { id:"a7", assignedTo:"Sofia Reyes", memberId:"m5", checkedOut:"2023-03-01", dueBack:null, status:"in_use" },
      ]},
    { id:"i3", name:"Ergonomic Chair",      category:"Furniture",   qty:15, condition:"Good", value:420,  returnable:false,
      assignments:[
        { id:"a8",  assignedTo:"Jordan Lee",  memberId:"m2", checkedOut:"2023-01-10", dueBack:null, status:"in_use" },
        { id:"a9",  assignedTo:"Priya Nair",  memberId:"m3", checkedOut:"2023-01-10", dueBack:null, status:"in_use" },
        { id:"a10", assignedTo:"Marcus Webb", memberId:"m4", checkedOut:"2023-01-10", dueBack:null, status:"in_use" },
      ]},
    { id:"i4", name:"Monitor 27\"",         category:"Electronics", qty:10, condition:"Fair", value:399,  returnable:true,
      assignments:[
        { id:"a11", assignedTo:"Jordan Lee",  memberId:"m2", checkedOut:"2024-01-15", dueBack:null,         status:"in_use"   },
        { id:"a12", assignedTo:"Devon Clarke",memberId:"m6", checkedOut:"2024-03-01", dueBack:"2025-02-28", status:"returned" },
      ]},
    { id:"i5", name:"Webcam HD",            category:"Electronics", qty:20, condition:"Good", value:89,   returnable:true,
      assignments:[
        { id:"a13", assignedTo:"Amara Osei",  memberId:"m1", checkedOut:"2024-06-01", dueBack:null, status:"in_use"  },
        { id:"a14", assignedTo:"Sofia Reyes", memberId:"m5", checkedOut:"2024-06-01", dueBack:null, status:"on_loan" },
      ]},
    { id:"i6", name:"Noise-Cancel Headset", category:"Electronics", qty:18, condition:"Good", value:179,  returnable:true,
      assignments:[
        { id:"a15", assignedTo:"Jordan Lee",  memberId:"m2", checkedOut:"2024-07-01", dueBack:null, status:"in_use"  },
        { id:"a16", assignedTo:"Priya Nair",  memberId:"m3", checkedOut:"2024-07-01", dueBack:null, status:"on_loan" },
        { id:"a17", assignedTo:"Devon Clarke",memberId:"m6", checkedOut:"2024-08-15", dueBack:null, status:"in_use"  },
      ]},
  ],
  invoices: [
    { id:"inv1", vendor:"AWS Cloud Services",  amount:4320.00, date:"2025-02-01", due:"2025-02-28", status:"paid",    category:"Infrastructure" },
    { id:"inv2", vendor:"Office Supplies Co.", amount:890.50,  date:"2025-02-10", due:"2025-03-10", status:"pending", category:"Supplies"       },
    { id:"inv3", vendor:"Figma Inc.",          amount:216.00,  date:"2025-02-01", due:"2025-03-01", status:"paid",    category:"Software"       },
    { id:"inv4", vendor:"WeWork Coworking",    amount:3200.00, date:"2025-02-01", due:"2025-03-01", status:"overdue", category:"Facilities"     },
    { id:"inv5", vendor:"LinkedIn Recruiter",  amount:1450.00, date:"2025-02-15", due:"2025-03-15", status:"pending", category:"HR Tools"       },
  ],
  timesheets: [
    { id:"t1", memberId:"m1", memberName:"Amara Osei",  week:"2025-02-17", mon:8, tue:9,  wed:8, thu:8, fri:7, status:"submitted" },
    { id:"t2", memberId:"m2", memberName:"Jordan Lee",  week:"2025-02-17", mon:9, tue:10, wed:9, thu:8, fri:8, status:"approved"  },
    { id:"t3", memberId:"m3", memberName:"Priya Nair",  week:"2025-02-17", mon:8, tue:8,  wed:7, thu:9, fri:8, status:"submitted" },
    { id:"t4", memberId:"m4", memberName:"Marcus Webb", week:"2025-02-17", mon:8, tue:8,  wed:8, thu:8, fri:8, status:"approved"  },
    { id:"t5", memberId:"m1", memberName:"Amara Osei",  week:"2025-02-24", mon:8, tue:8,  wed:9, thu:8, fri:8, status:"submitted" },
    { id:"t6", memberId:"m2", memberName:"Jordan Lee",  week:"2025-02-24", mon:8, tue:9,  wed:8, thu:9, fri:8, status:"submitted" },
  ],
  announcements: [
    { id:"a1", title:"🏖️ Office Closed – Public Holiday", body:"The office will be closed on March 17th. Enjoy the long weekend!", category:"Holiday", priority:"high", author:"Sofia Reyes", createdAt:"2025-02-28", pinned:true  },
    { id:"a2", title:"📋 Q1 Performance Reviews Starting", body:"Q1 reviews begin the week of March 10th. Managers should schedule 1:1s with their direct reports.", category:"HR", priority:"medium", author:"Sofia Reyes", createdAt:"2025-02-25", pinned:false },
    { id:"a3", title:"🎉 Jordan Lee – 3-Year Anniversary!", body:"Please join us in congratulating Jordan on their 3-year work anniversary!", category:"Celebration", priority:"low", author:"Elena Torres", createdAt:"2025-02-22", pinned:false },
  ],
  payroll: [
    { id:"pay1", period:"2025-02", processedAt:"2025-02-28", status:"processed", totalGross:560000, totalNet:420000, totalDeductions:140000 },
    { id:"pay2", period:"2025-01", processedAt:"2025-01-31", status:"processed", totalGross:560000, totalNet:418000, totalDeductions:142000 },
  ],
};
