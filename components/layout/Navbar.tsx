// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { FiBell, FiUser, FiSearch } from "react-icons/fi";
// import { useState, useRef, useEffect } from "react";

// export default function Navbar() {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const navItems = [
//     { name: "Dashboard", path: "/" },
//     { name: "Accounts", path: "/accounts" },
//     { name: "Customers", path: "/customers" },
//     { name: "Leads", path: "/leads" },
//     { name: "Products suite", path: "/products" },
//     { name: "Users & Roles", path: "/users" },
//     { name: "Reports & Analytics", path: "/reports" },
//     { name: "Settings", path: "" },
//   ];

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <nav className="w-full px-6 py-3 flex items-center justify-between relative">
//       {/* Left - Logo */}
//       <div className="flex items-center gap-2 font-bold text-2xl text-gray-800">
//         <span>Polosys</span>
//         <span role="img" aria-label="tree">
//           🌳
//         </span>
//       </div>

//       {/* Center - Menu */}
//       <div className="hidden md:flex items-center gap-2 text-gray-700 font-medium text-sm">
//         {navItems.map((item) => (
//           <Link
//             key={item.path}
//             href={item.path}
//             className={`px-3 py-1 rounded-md transition-colors ${
//               pathname === item.path
//                 ? "bg-gray-800 text-white"
//                 : "hover:bg-gray-200"
//             }`}
//           >
//             {item.name}
//           </Link>
//         ))}
//       </div>

//       {/* Right - Icons */}
//       <div
//         className="flex items-center gap-5 text-gray-600 text-lg relative"
//         ref={dropdownRef}
//       >
//         <FiSearch className="cursor-pointer hover:text-black" />
//         <FiBell className="cursor-pointer hover:text-black" />

//         {/* User dropdown */}
//         <div className="relative">
//           <FiUser
//             className="cursor-pointer hover:text-black"
//             onClick={() => setOpen(!open)}
//           />
//           {open && (
//             <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
//               <button
//                 className="w-full text-left px-4 py-2 hover:bg-gray-800 hover:rounded-lg hover:text-white"
//                 onClick={() => alert("Logging out...")}
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBell, FiUser, FiSearch } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Accounts", path: "/accounts" },
    { name: "Customers", path: "/customers" },
    { name: "Leads", path: "/leads" },
    { name: "Products suite", path: "/products" },
    { name: "Users & Roles", path: "/users" },
    { name: "Reports & Analytics", path: "/reports" },
    // Settings handled separately
  ];

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full px-6 py-3 flex items-center justify-between relative bg-white">
      {/* Left - Logo */}
      <div className="flex items-center gap-2 font-bold text-2xl text-gray-800">
        <span>Polosys</span>
        <span role="img" aria-label="tree">
          🌳
        </span>
      </div>

      {/* Center - Menu */}
      <div className="hidden md:flex items-center gap-2 text-gray-700 font-medium text-sm">
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

        {/* Settings dropdown (on hover) */}
        <div className="relative group">
          <div
            className={`px-3 py-1 rounded-md transition-colors flex items-center cursor-pointer ${
              pathname.startsWith("/settings")
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            Settings
          </div>

          {/* Dropdown menu */}
          <div className="absolute top-full left-0 w-48 bg-white border-[1px] border-gray-300 rounded-md shadow-md z-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
            <Link
              href="/settings/permission-module"
              className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
            >
              Permission Module
            </Link>
            <Link
              href="/settings/permission-options"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Permission Options
            </Link>
          </div>
        </div>
      </div>

      {/* Right - Icons */}
      <div
        className="flex items-center gap-5 text-gray-600 text-lg relative"
        ref={userDropdownRef}
      >
        <FiSearch className="cursor-pointer hover:text-black" />
        <FiBell className="cursor-pointer hover:text-black" />

        {/* User dropdown */}
        <div className="relative">
          <FiUser
            className="cursor-pointer hover:text-black"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          />
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-20">
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
