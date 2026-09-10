import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  PenSquare,
  Users,
  CreditCard,
  X,
  Briefcase,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const navLinks = [
    { to: "/admin/dashboard", icon: LayoutDashboard, text: "Dashboard" },
    { to: "/admin/trainings", icon: BookOpen, text: "Trainings" },
    { to: "/admin/blog", icon: PenSquare, text: "Blog Posts" },
    { to: "/admin/registrations", icon: Users, text: "Registrations" },
    { to: "/admin/payments", icon: CreditCard, text: "Payments" },
    { to: "/admin/leads", icon: Users, text: "Leads & Inquiries" },
  ];

  const activeClass = "bg-primary text-white";
  const inactiveClass = "text-gray-600 hover:bg-gray-200";

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <aside
        className={`absolute left-0 top-0 h-full bg-white w-64 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-y-0 transition-transform duration-300 ease-in-out z-30 shadow-lg`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link
            to="/admin/dashboard"
            className="flex items-center space-x-2 text-l font-extrabold text-primary"
          >
            {/* <Briefcase size={24} /> */}
            <img src="/mtmkay_logo.png" width="68" height="68" />
            <span>MTMKay Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-4">
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 my-1 rounded-md text-sm font-medium ${
                      isActive ? activeClass : inactiveClass
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <link.icon className="mr-3" size={20} />
                  {link.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
