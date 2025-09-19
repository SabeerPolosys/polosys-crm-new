"use client";

import { showToast } from "@/components/common/ShowToast";
import api from "@/lib/axios";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { FaUserCog, FaSave, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Permissions {
  users: boolean;
  products: boolean;
  accounts: boolean;
  customers: boolean;
  reports: boolean;
  settings: boolean;
}

interface RoleFormData {
  roleName: string;
  description: string;
  permissions: Permissions;
}

const initialPermissions: Permissions = {
  users: false,
  products: false,
  accounts: false,
  customers: false,
  reports: false,
  settings: false,
};

const CreateRoleForm: React.FC = () => {
  const [formData, setFormData] = useState<RoleFormData>({
    roleName: "",
    description: "",
    permissions: initialPermissions,
  });
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = (permission: keyof Permissions) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission],
      },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault()
      const res = await api.post(
        `/api/v1/user-type`, formData
      );
      if (res?.status == 200) {
        // ✅ Backend should set auth cookie via Set-Cookie
        showToast({
          message: `Role created successfully.`,
          type: "success",
        });
        router.push("/");
      } else {
        throw new Error("Failed to create role.");
      }
    } catch (err: any) {
      showToast({
          message: `Failed to create role.`,
          type: "error",
        });
    }
  };

  const handleCancel = () => {
    setFormData({
      roleName: "",
      description: "",
      permissions: initialPermissions,
    });
  };

  return (
    <div>
      <h2 className="font-semibold text-xl mb-2">User & Role</h2>
      <div className="bg-gray-50 rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FaUserCog className="text-blue-600 text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Create New Role
            </h2>
            <p className="text-gray-500">Define access levels for user roles</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="roleName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role Name
              </label>
              <input
                type="text"
                id="roleName"
                name="roleName"
                value={formData.roleName}
                onChange={handleInputChange}
                className="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="e.g., Admin, Super Admin"
                required
              />
            </div>
            <div></div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Brief description of this role"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <FaTimes className="inline mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <FaSave className="inline mr-2" />
              Create Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoleForm;
