"use client";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaBoxOpen,
  FaFileInvoice,
  FaUserFriends,
  FaChartBar,
  FaCog,
  FaQuestionCircle,
  FaMoon,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaRegQuestionCircle,
} from "react-icons/fa";
import { RiMenuAddLine } from "react-icons/ri";
import { usePathname } from "next/navigation";
import { MdOutlineDarkMode } from "react-icons/md";
import { RiLogoutCircleLine } from "react-icons/ri";

const menuItems = [
  { label: "Dashboard", icon: <FaHome />, link: "/" },
  { label: "Users & Roles", icon: <FaUsers />, link: "/users" },
  { label: "Leads", icon: <FaUserTie />, link: "/leads" },
  { label: "Products suite", icon: <FaBoxOpen />, link: "/products" },
  { label: "Accounts", icon: <FaFileInvoice />, link: "/accounts" },
  { label: "Customers", icon: <FaUserFriends />, link: "/customers" },
  { label: "Reports & Analytics", icon: <FaChartBar />, link: "/reports" },
];

const settingsItems = [
  { label: "Settings", icon: <FaCog /> },
  { label: "Help Center", icon: <FaQuestionCircle /> },
];

type SidebarPropsType = {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
};

export default function Sidebar({ collapsed, setCollapsed }: SidebarPropsType) {
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Expanded Sidebar */}
      {!collapsed && (
        <div className="min-h-screen w-64 bg-gray-800 text-white flex flex-col transition-all duration-300">
          {/* Header */}
          <div className="p-4 text-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              Polosys
              <span className="text-gray-800 rounded-full p-1">🌳</span>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Main Scrollable Section */}
          <div className="flex-1 overflow-y-auto sidebar-scroll">
            {/* Main Menu */}
            <p className="px-4 py-2 text-gray-400 text-xs">MAIN</p>
            {menuItems.map(({ label, icon, link }) => {
              const isActive = pathname === link;

              return (
                <Link
                  href={link}
                  key={label}
                  className={`flex items-center w-full px-4 py-3 text-sm gap-3 hover:bg-gray-700 transition ${
                    isActive ? "bg-gray-700" : ""
                  }`}
                >
                  {icon}
                  {label}
                </Link>
              );
            })}

            {/* Settings */}
            <p className="px-4 py-2 text-gray-400 text-xs mt-4">SETTINGS</p>
            {settingsItems.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => alert(`${label} clicked`)}
                className={`flex items-center w-full px-4 py-3 text-sm gap-3 hover:bg-gray-700 transition`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-700 p-2">
            {/* Dark Mode */}
            <div className="flex items-center justify-between px-4 py-2 text-sm">
              <div className="flex items-center gap-3">
                <FaMoon />
                Dark Mode
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <div
                  className="w-9 h-5 bg-gray-600 rounded-full peer peer-checked:bg-blue-500 
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all 
                                peer-checked:after:translate-x-4"
                />
              </label>
            </div>

            {/* Logout */}
            <button
              onClick={() => alert("Logging out...")}
              className="flex items-center w-full px-4 py-2 text-sm gap-3 text-red-400 hover:bg-gray-700 transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Collapsed Sidebar */}
      {collapsed && (
        <div className="min-h-screen w-16 text-gray-800 flex flex-col justify-between items-center py-4 transition-all duration-300 bg-white">
          {/* Top Buttons */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setCollapsed(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-600 border-[1px]"
            >
              <FaChevronRight />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-600 border-[1px]">
              <RiMenuAddLine />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-600 border-[1px]">
              <FaRegQuestionCircle />
            </button>
          </div>

          {/* Bottom Button */}
          <div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-600 border-[1px]">
              <MdOutlineDarkMode />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-600 border-[1px] mt-4">
              <RiLogoutCircleLine />
            </button>
          </div>
        </div>
      )}

      {/* Scoped Styles for Scrollbar */}
      <style>
        {`
          .sidebar-scroll::-webkit-scrollbar {
            display: none;
          }
          .sidebar-scroll {
            scrollbar-width: none;
          }
        `}
      </style>
    </>
  );
}
