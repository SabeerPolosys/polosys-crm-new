// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { FiBell, FiUser, FiSearch } from "react-icons/fi";
// import { useState, useRef, useEffect } from "react";
// import validatePermission from "../permissions/PermissionCheckerNew";
// import { usePermissions } from "@/context/PermissionsContext";
// type MenuType = {
//   name: string;
//   path: string;
// };

// export default function Navbar() {
//   const pathname = usePathname();
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const userDropdownRef = useRef<HTMLDivElement>(null);
//   const [menuItems, setMenuItems] = useState<MenuType[]>([]);

//   const navItems = [
//     { name: "Dashboard", path: "/" },
//     { name: "Accounts", path: "/accounts" },
//     { name: "Customers", path: "/customers" },
//     { name: "Leads", path: "/leads" },
//     { name: "Products suite", path: "/products" },
//     { name: "Users & Roles", path: "/users" },
//     { name: "Reports & Analytics", path: "/reports" },
//   ];

//   // Close user dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         userDropdownRef.current &&
//         !userDropdownRef.current.contains(event.target as Node)
//       ) {
//         setUserDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
//   const { permissions } = usePermissions();
//   useEffect(() => {
//     const menus = navItems?.filter((menu) => {
//       if (validatePermission(menu?.path, "canRead", permissions || [])) {
//         return menu;
//       }
//     });
//     setMenuItems(menus);
//   }, [permissions]);
//   const canViewPermissionModule = validatePermission(
//     "/permission/permission-module",
//     "canRead",
//     permissions || []
//   );
//   const canViewPermissionOption = validatePermission(
//     "/permission/permission-options",
//     "canRead",
//     permissions || []
//   );

//   return (
//     <nav className="w-full px-6 py-3 flex items-center justify-between relative bg-white">
//       {/* Left - Logo */}
//       <div className="flex items-center gap-2 font-bold text-2xl text-gray-800">
//         <span>Polosys</span>
//         <span role="img" aria-label="tree">
//           🌳
//         </span>
//       </div>

//       {/* Center - Menu */}
//       <div className="hidden md:flex items-center gap-2 text-gray-700 font-medium text-sm">
//         {menuItems.map((item) => (
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

//         {/* Settings dropdown (on hover) */}
//         <div className="relative group">
//           {(canViewPermissionModule || canViewPermissionOption) && (
//             <div
//               className={`px-3 py-1 rounded-md transition-colors flex items-center cursor-pointer ${
//                 pathname.startsWith("/settings")
//                   ? "bg-gray-800 text-white"
//                   : "hover:bg-gray-200"
//               }`}
//             >
//               Settings
//             </div>
//           )}

//           {/* Dropdown menu */}
//           <div className="absolute top-full left-0 w-48 bg-white border-[1px] border-gray-300 rounded-md shadow-md z-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
//             {canViewPermissionModule && (
//               <Link
//                 href="/permission/permission-module"
//                 className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
//               >
//                 Permission Module
//               </Link>
//             )}
//             {canViewPermissionOption && (
//               <Link
//                 href="/permission/permission-options"
//                 className="block px-4 py-2 text-sm hover:bg-gray-100"
//               >
//                 Permission Options
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Right - Icons */}
//       <div
//         className="flex items-center gap-5 text-gray-600 text-lg relative"
//         ref={userDropdownRef}
//       >
//         <FiSearch className="cursor-pointer hover:text-black" />
//         <FiBell className="cursor-pointer hover:text-black" />

//         {/* User dropdown */}
//         <div className="relative">
//           <FiUser
//             className="cursor-pointer hover:text-black"
//             onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//           />
//           {userDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-20">
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
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import validatePermission from "../permissions/PermissionCheckerNew";
import { usePermissions } from "@/context/PermissionsContext";
import { useLogout } from "@/helpers/useLogout";

type MenuType = {
  label: string;
  link?: string;
  children?: {
    label: string;
    link: string;
  }[];
};

export default function Navbar() {
  const pathname = usePathname();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const [menuItems, setMenuItems] = useState<MenuType[]>([]);

  const { permissions } = usePermissions();
  const logout = useLogout();

  // Sidebar-like menu structure
  const allMenuItems: MenuType[] = [
    { label: "Dashboard", link: "/" },
    { label: "Users & Roles", link: "/users" },
    {
      label: "Sales",
      children: [
        { label: "Leads", link: "/sales/leads" },
        { label: "Deals", link: "/sales/deals" },
      ],
    },
    { label: "Products suite", link: "/products" },
    {
      label: "Accounts",
      children: [
        { label: "Payments", link: "/accounts/payments" },
        { label: "Invoice", link: "/accounts/invoices" },
        { label: "Purchase", link: "/accounts/purchases" },
      ],
    },
    { label: "Customers", link: "/customers" },
    // { label: "Reports & Analytics", link: "/reports" },
  ];

  const settingsItems: MenuType[] = [
    {
      label: "Settings",
      children: [
        { label: "Add-ons", link: "/products/addons" },
        { label: "Plans", link: "/products/plan" },
        { label: "Payment Gateways", link: "/settings/payment-gateways" },
        { label: "Currency", link: "/settings/currency" },
        { label: "Servers", link: "/settings/servers" },
        { label: "Databases", link: "/settings/databases" },
      ],
    },
    {
      label: "Permissions",
      children: [
        { label: "Permission Module", link: "/permission/permission-module" },
        { label: "Permission Options", link: "/permission/permission-options" },
      ],
    },
  ];

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      // ...prev,
      [label]: !prev[label],
    }));
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter menus by permissions
  useEffect(() => {
    const filtered = allMenuItems
      .map((menu): MenuType | null => {
        if (menu.children) {
          const visibleChildren = menu.children.filter((child) =>
            validatePermission(child.link, "canRead", permissions || [])
          );
          if (visibleChildren.length > 0) {
            return { ...menu, children: visibleChildren };
          }
          return null;
        } else if (validatePermission(menu.link!, "canRead", permissions || [])) {
          return menu;
        }
        return null;
      })
      .filter((menu): menu is MenuType => menu !== null);

    setMenuItems(filtered);
  }, [permissions]);

  return (
    <nav className="w-full px-6 py-3 flex items-center justify-between relative bg-white shadow-sm" onMouseLeave={()=>{setOpenDropdowns({});setUserDropdownOpen(false);}}>
      {/* Left - Logo */}
      <div className="flex items-center gap-2 font-bold text-2xl text-gray-800">
        <span>Polosys</span>
        <span role="img" aria-label="tree">🌳</span>
      </div>

      {/* Center - Menu (Desktop) */}
      <div className="hidden md:flex items-center gap-4 text-gray-700 font-medium text-sm">
        {menuItems.map(({ label, link, children }) => {
          const isActive = pathname === link;
          const isOpen = openDropdowns[label];

          if (children && children.length > 0) {
            return (
              <div key={label} className="relative group">
                <button
                  onClick={() => toggleDropdown(label)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${
                    isOpen ? "bg-gray-800 text-white" : "hover:bg-gray-200"
                  }`}
                >
                  {label}
                  {isOpen ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>

                {isOpen && (
                  <div className="absolute left-0 top-full w-44 bg-white border border-gray-200 rounded-md shadow-lg mt-2 z-20">
                    {children.map((child) => (
                      <Link
                        key={child.link}
                        href={child.link}
                        className={`block px-4 py-2 text-sm hover:bg-gray-400 ${
                          pathname === child.link ? "bg-gray-800 text-white" : ""
                        }`}
                        onClick={()=>setOpenDropdowns({})}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return link ? (
            <Link
              key={label}
              href={link}
              className={`px-3 py-1 rounded-md transition-colors ${
                isActive ? "bg-gray-800 text-white" : "hover:bg-gray-400"
              }`}
              onClick={()=>setOpenDropdowns({})}
            >
              {label}
            </Link>
          ) : null;
        })}

        {/* Settings dropdown */}
        {settingsItems.map(({ label, children }) => {
          const isOpen = openDropdowns[label];
          return (
            <div key={label} className="relative group">
              <button
                onClick={() => toggleDropdown(label)}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${
                  isOpen ? "bg-gray-800 text-white" : "hover:bg-gray-400"
                }`}
              >
                {label}
                {isOpen ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
              </button>

              {isOpen && children && (
                <div className="absolute left-0 top-full w-48 bg-white border border-gray-200 rounded-md shadow-lg mt-2 z-20">
                  {children.map((child) => (
                    <Link
                      key={child.link}
                      href={child.link}
                      className={`block px-4 py-2 text-sm hover:bg-gray-400 ${
                        pathname === child.link ? "bg-gray-800 text-white" : ""
                      }`}
                      onClick={()=>setOpenDropdowns({})}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right - Icons */}
      <div className="flex items-center gap-5 text-gray-600 text-lg relative" ref={userDropdownRef}>
        <FiSearch className="cursor-pointer hover:text-black" />
        <FiBell className="cursor-pointer hover:text-black" />

        {/* User dropdown */}
        <div className="relative">
          <FiUser
            className="cursor-pointer hover:text-black"
            onClick={() => {setUserDropdownOpen(!userDropdownOpen); setOpenDropdowns({});}}
          />
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-20">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-300 hover:rounded-lg cursor-pointer text-sm"
                onClick={logout}
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
