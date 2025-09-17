"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  FiShield,
  FiUser,
  FiHelpCircle,
  FiBarChart2,
  FiCreditCard,
  FiUsers,
} from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";

export default function UserRoleList() {
  const roles = [
    {
      slug: "super_admin",
      title: "Super admin",
      description: "Complete control over the system",
      icon: <FiShield className="text-xl" />,
    },
    {
      slug: "admin",
      title: "Admin",
      description: "System management hub",
      icon: <FiUser className="text-xl" />,
    },
    {
      slug: "support",
      title: "Support",
      description: "Help and resources, just a click away",
      icon: <FiHelpCircle className="text-xl" />,
    },
    {
      slug: "sales",
      title: "Sales",
      description: "Complete control over the system",
      icon: <FiBarChart2 className="text-xl" />,
    },
    {
      slug: "accounts",
      title: "Accounts",
      description: "Organize every account seamlessly",
      icon: <FiCreditCard className="text-xl" />,
    },
    {
      slug: "user",
      title: "User",
      description: "View and manage user information",
      icon: <FiUsers className="text-xl" />,
    },
  ];

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCardClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", slug);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
      {roles.map((role, index) => (
        <div
          key={index}
          className={`flex flex-col justify-between border-[1px] border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow ${searchParams.get("role") === role.slug ? "bg-gray-800 cursor-none text-white" :"bg-white cursor-pointer"}`}
          onClick={() => handleCardClick(role?.slug)}
        >
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-black text-white">
              {role.icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold">{role.title}</h3>
              <p className={`text-[10px] ${searchParams.get("role") === role.slug ? "text-white" :"text-gray-600"}`}>{role.description}</p>
            </div>
          </div>
          <div className="mt-4 text-black">
            <span className="inline-flex items-center gap-1 font-medium cursor-pointer hover:underline">
              <FaArrowRight />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
