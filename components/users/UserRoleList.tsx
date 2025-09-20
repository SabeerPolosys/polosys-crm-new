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
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { RoleType } from "@/types/auth";
import api from "@/lib/axios";
import { showToast } from "../common/ShowToast";
import { FiMoreVertical } from "react-icons/fi";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
type GetRoleResponse = {
  success: boolean;
  message: string;
  data: RoleType[];
};

export default function UserRoleList() {
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const searchParams = useSearchParams();
  const getAllRoles = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<GetRoleResponse>(`/api/v1/user-type`);
      if (res?.data?.message) {
        setRoles(res?.data?.data);
      } else {
        throw new Error("Password reset failed");
      }
    } catch (err: any) {
      return showToast({
        message: "Failed to fetch roles.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllRoles();
  }, [searchParams]);
  const getIcon = (typeName: string) => {
    if (typeName?.toLowerCase().includes("super"))
      return <FiShield className="text-xl" />;
    if (typeName?.toLowerCase().includes("admin"))
      return <FiUser className="text-xl" />;
    if (typeName?.toLowerCase().includes("support"))
      return <FiHelpCircle className="text-xl" />;
    if (typeName?.toLowerCase().includes("sales"))
      return <FiBarChart2 className="text-xl" />;
    if (typeName?.toLowerCase().includes("account"))
      return <FiCreditCard className="text-xl" />;
    return <FiUsers className="text-xl" />;
  };

  const router = useRouter();

  const handleCardClick = (id: string, name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("val", id);
    params.set("role", name);
    router.push(`?${params.toString()}`);
  };
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );

  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
      {roles?.map((role, index) => (
        <div
          key={index}
          className={`flex flex-col justify-between border-[1px] border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow ${
            searchParams.get("val") === role.userTypeId
              ? "bg-gray-800 text-white"
              : "bg-white"
          }`}
        >
          <div
            className="flex flex-col items-start gap-1"
            onMouseLeave={() => setOpenDropdownIndex(null)}
          >
            <div className="flex flex-row justify-between w-full relative">
              {/* Left Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-black text-white">
                {getIcon(role?.typeName)}
              </div>

              {/* 3 Dots and Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(index);
                  }}
                  className="p-2 rounded-full hover:bg-gray-400 transition"
                >
                  <FiMoreVertical className="text-lg" />
                </button>

                {openDropdownIndex === index && (
                  <div
                    className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                    onClick={(e) => e.stopPropagation()} // prevent closing on parent click
                  >
                    <button
                      className="px-2 py-1 hover:bg-gray-100 text-blue-500 cursor-pointer"
                      onClick={() => {
                        router.push(`/users/role/${role?.userTypeId}`);
                      }}
                    >
                      <MdOutlineEdit />
                    </button>
                    <button
                      className="px-2 py-1 hover:bg-gray-100 text-red-500 cursor-pointer"
                      onClick={() => {
                        setIsDeleteOpen(true);
                        setDeleteId(role?.userTypeId);
                      }}
                    >
                      <MdDeleteOutline />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold">{role.typeName}</h3>
              <p
                className={`text-[10px] ${
                  searchParams.get("val") === role.userTypeId
                    ? "text-white"
                    : "text-gray-600"
                }`}
              >
                {role.description}
              </p>
            </div>
          </div>
          <div
            className="mt-4 text-black cursor-pointer"
            onClick={() => handleCardClick(role?.userTypeId, role?.typeName)}
          >
            <span className="inline-flex items-center gap-1 font-medium cursor-pointer hover:underline">
              {searchParams.get("val") === role.userTypeId ? (
                <FaArrowLeft className="text-white" />
              ) : (
                <FaArrowRight />
              )}
            </span>
          </div>
        </div>
      ))}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {setIsDeleteOpen(false); setDeleteId(null);}}
        deleteLabel="Role"
        deleteId={`?userTypeId=${deleteId}` as string}
        deleteUrl={"/api/v1/user-type"}
        redirectUrl={"/users"}
      />
    </div>
  );
}
