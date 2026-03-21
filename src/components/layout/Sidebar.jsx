// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Building2,
//   Briefcase,
//   Users,
//   FileText,
//   MessageSquare,
//   Settings,
//   HelpCircle,
//   Image as ImageIcon,
//   Tag,
//   LogOut,
//   LayoutGrid,
// } from "lucide-react";

// const Sidebar = () => {
//   const menuGroups = [
//     {
//       label: "Main",
//       items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" }],
//     },
//     {
//       label: "Management",
//       items: [
//         { name: "Companies", icon: Building2, path: "/companies" },
//         { name: "Jobs", icon: Briefcase, path: "/jobs" },
//         { name: "Pricing & Plans", icon: Tag, path: "/pricing" },
//       ],
//     },
//     {
//       label: "Taxonomy",
//       items: [
//         { name: "Job Categories", icon: LayoutGrid, path: "/job-category" },
//         { name: "Skills", icon: Tag, path: "/skill-management" },
//       ],
//     },
//     {
//       label: "Content",
//       items: [
//         { name: "Blogs", icon: FileText, path: "/blog" },
//         // { name: 'Gallery', icon: ImageIcon, path: '/slider-management' },
//         // { name: 'FAQs', icon: HelpCircle, path: '/faqs' },
//       ],
//     },
//     {
//       label: "Support",
//       items: [
//         { name: "Support Tickets", icon: MessageSquare, path: "/chat-message" },
//         {
//           name: "Contact Inquiries",
//           icon: HelpCircle,
//           path: "/contact-inquiry",
//         },
//       ],
//     },
//   ];

//   const handelLogout = async () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("adminData");
//     localStorage.removeItem("user-login-id");
//     window.location.href = "/";
//   };

//   return (
//     <aside className="w-64 lg:w-72 bg-brand-primary h-full flex flex-col border-r border-white/10 shrink-0">
//       {/* Brand Logo */}
//       <div className="h-20 w-full mx-auto flex items-center px-8 border-b border-white/5">
//         {/* <span className="text-2xl font-bold text-white tracking-tight italic">
//                     OPPVIA <span className="text-brand-accent not-italic font-black text-sm align-top ml-1">ADMIN</span>
//                 </span> */}
//         <img
//           src={"oppvia.webp"}
//           alt=""
//           className="h-12 w-[80%] mx-auto object-contain"
//         />
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar">
//         {menuGroups.map((group, idx) => (
//           <div key={idx} className="space-y-2">
//             <h3 className="px-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
//               {group.label}
//             </h3>
//             <div className="space-y-1">
//               {group.items.map((item) => (
//                 <NavLink
//                   key={item.path}
//                   to={item.path}
//                   className={({ isActive }) => `
//                     flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group
//                     ${
//                       isActive
//                         ? "bg-white/10 text-white"
//                         : "text-white/70 hover:bg-white/5 hover:text-white"
//                     }
//                   `}
//                 >
//                   <item.icon className="w-[18px] h-[18px]" />
//                   <span className="text-sm font-medium tracking-wide">
//                     {item.name}
//                   </span>
//                 </NavLink>
//               ))}
//             </div>
//           </div>
//         ))}
//       </nav>

//       {/* Footer / Profile */}
//       <div className="p-4 border-t border-white/5">
//         <button
//           onClick={handelLogout}
//           className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-400/5 transition-colors group"
//         >
//           <LogOut className="w-[18px] h-[18px]" />
//           <span className="text-sm font-semibold tracking-wide">Sign Out</span>
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  FileText,
  MessageSquare,
  HelpCircle,
  Tag,
  LogOut,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  // On tablet (md), start collapsed; on desktop (lg+), start expanded
  const [collapsed, setCollapsed] = useState(false);

  const menuGroups = [
    {
      label: "Main",
      items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" }],
    },
    {
      label: "Management",
      items: [
        { name: "Companies", icon: Building2, path: "/companies" },
        { name: "Jobs", icon: Briefcase, path: "/jobs" },
        { name: "Pricing & Plans", icon: Tag, path: "/pricing" },
      ],
    },
    {
      label: "Taxonomy",
      items: [
        { name: "Job Categories", icon: LayoutGrid, path: "/job-category" },
        { name: "Skills", icon: Tag, path: "/skill-management" },
      ],
    },
    {
      label: "Content",
      items: [{ name: "Blogs", icon: FileText, path: "/blog" }],
    },
    {
      label: "Support",
      items: [
        { name: "Support Tickets", icon: MessageSquare, path: "/chat-message" },
        {
          name: "Contact Inquiries",
          icon: HelpCircle,
          path: "/contact-inquiry",
        },
      ],
    },
  ];

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("adminData");
    localStorage.removeItem("user-login-id");
    window.location.href = "/";
  };

  return (
    <aside
      className={`
        relative bg-brand-primary h-full flex flex-col border-r border-white/10 shrink-0
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[68px]" : "w-64 lg:w-72"}
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          absolute -right-3 top-[72px] z-[100]
          w-6 h-6 rounded-full
          bg-brand-primary border border-white/20
          flex items-center justify-center
          text-white/60 hover:text-white
          transition-colors duration-200
          shadow-md
        "
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Brand Logo */}
      <div
        className={`
          h-20 w-full flex items-center border-b border-white/5
          transition-all duration-300
          ${collapsed ? "px-3 justify-center" : "px-8"}
        `}
      >
        {collapsed ? (
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
        ) : (
          <img
            src={"oppvia.webp"}
            alt="Oppvia"
            className="h-12 w-[80%] mx-auto object-contain"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-6 no-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {/* Group label — hidden when collapsed */}
            {!collapsed && (
              <h3 className="px-4 pt-2 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                {group.label}
              </h3>
            )}

            {/* Subtle divider between groups when collapsed */}
            {collapsed && idx !== 0 && (
              <div className="mx-3 border-t border-white/10 mb-1" />
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.name : undefined}
                  className={({ isActive }) => `
                    flex items-center gap-3 rounded-xl transition-all duration-200 group
                    ${collapsed ? "px-0 py-2.5 justify-center" : "px-4 py-2.5"}
                    ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium tracking-wide whitespace-nowrap overflow-hidden">
                      {item.name}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-2 border-t border-white/5">
        <button
          onClick={handleLogout}
          title={collapsed ? "Sign Out" : undefined}
          className={`
            flex items-center gap-3 w-full rounded-xl
            text-white/60 hover:text-red-400 hover:bg-red-400/5
            transition-colors group
            ${collapsed ? "px-0 py-3 justify-center" : "px-4 py-3"}
          `}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && (
            <span className="text-sm font-semibold tracking-wide">
              Sign Out
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
