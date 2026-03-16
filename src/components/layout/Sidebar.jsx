import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  Image as ImageIcon,
  Tag,
  LogOut,
  LayoutGrid,
} from "lucide-react";

const Sidebar = () => {
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
      items: [
        { name: "Blogs", icon: FileText, path: "/blog" },
        // { name: 'Gallery', icon: ImageIcon, path: '/slider-management' },
        // { name: 'FAQs', icon: HelpCircle, path: '/faqs' },
      ],
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

  const handelLogout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("adminData");
    localStorage.removeItem("user-login-id");
    window.location.href = "/";
  };

  return (
    <aside className="w-64 lg:w-72 bg-brand-primary h-full flex flex-col border-r border-white/10 shrink-0">
      {/* Brand Logo */}
      <div className="h-20 w-full mx-auto flex items-center px-8 border-b border-white/5">
        {/* <span className="text-2xl font-bold text-white tracking-tight italic">
                    OPPVIA <span className="text-brand-accent not-italic font-black text-sm align-top ml-1">ADMIN</span>
                </span> */}
        <img
          src={"oppvia.webp"}
          alt=""
          className="h-12 w-[80%] mx-auto object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="px-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group
                    ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  <span className="text-sm font-medium tracking-wide">
                    {item.name}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handelLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-400/5 transition-colors group"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span className="text-sm font-semibold tracking-wide">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
