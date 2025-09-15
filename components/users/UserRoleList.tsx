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
      title: "Super admin",
      description: "Complete control over the system",
      icon: <FiShield className="text-xl" />,
    },
    {
      title: "Admin",
      description: "System management hub",
      icon: <FiUser className="text-xl" />,
    },
    {
      title: "Support",
      description: "Help and resources, just a click away",
      icon: <FiHelpCircle className="text-xl" />,
    },
    {
      title: "Sales",
      description: "Complete control over the system",
      icon: <FiBarChart2 className="text-xl" />,
    },
    {
      title: "Accounts",
      description: "Organize every account seamlessly",
      icon: <FiCreditCard className="text-xl" />,
    },
    {
      title: "User",
      description: "View and manage user information",
      icon: <FiUsers className="text-xl" />,
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
      {roles.map((role, index) => (
        <div
          key={index}
          className="flex flex-col justify-between border-[1px] border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow bg-white"
        >
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-black text-white">
              {role.icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold">{role.title}</h3>
              <p className="text-[10px] text-gray-600">{role.description}</p>
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
