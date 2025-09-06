"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBell, FiUser, FiSearch } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Accounts", path: "/accounts" },
    { name: "Customers", path: "/customers" },
    { name: "Leads", path: "/leads" },
    { name: "Products suite", path: "/products" },
    { name: "Users & Roles", path: "/users" },
    { name: "Reports & Analytics", path: "/reports" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full px-6 py-3 flex items-center justify-between relative">
      {/* Left - Logo */}
      <div className="flex items-center gap-2 font-bold text-2xl text-gray-800">
        <span>Polosys</span>
        <span role="img" aria-label="tree">
          🌳
        </span>
      </div>

      {/* Center - Menu */}
      <div className="hidden md:flex items-center gap-2 text-gray-700 font-medium">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`px-3 py-1 rounded-md transition-colors ${
              pathname === item.path
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Right - Icons */}
      <div
        className="flex items-center gap-5 text-gray-600 text-lg relative"
        ref={dropdownRef}
      >
        <FiSearch className="cursor-pointer hover:text-black" />
        <FiBell className="cursor-pointer hover:text-black" />

        {/* User dropdown */}
        <div className="relative">
          <FiUser
            className="cursor-pointer hover:text-black"
            onClick={() => setOpen(!open)}
          />
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-800 hover:rounded-lg hover:text-white"
                onClick={() => alert("Logging out...")}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
