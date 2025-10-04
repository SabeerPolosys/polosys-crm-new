"use client";

import api from "@/lib/axios";
import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

type PermissionsContextType = {
  permissions: string[] | null;
  loading: boolean;
};

const PermissionsContext = createContext<PermissionsContextType>({
  permissions: null,
  loading: true,
});

const initialPermission = [
    {
        Name: "Dashboard",
        endPoint: "/",
        canRead: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true
    },
    {
        Name: "User",
        endPoint: "/users",
        canRead: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true
    },
    {
        Name: "Role",
        endPoint: "/users/role",
        canRead: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true
    },
    {
        Name: "Leads",
        endPoint: "/leads",
        canRead: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true
    },
    {
        Name: "Products",
        endPoint: "/products",
        canRead: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true
    },
    {
        Name: "Accounts",
        endPoint: "/accounts",
        canRead: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true
    },
    {
        Name: "Customers",
        endPoint: "/customers",
        canRead: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true
    },
    {
        Name: "Reports",
        endPoint: "/reports",
        canRead: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true
    },
    {
        Name: "Permission Modules",
        endPoint: "/settings/permission-module",
        canRead: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true
    },
    {
        Name: "Permission Options",
        endPoint: "/settings/permission-options",
        canRead: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true
    },
    {
        Name: "Plan",
        endPoint: "/products/plan",
        canRead: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true
    },
    {
        Name: "Version",
        endPoint: "/products/version",
        canRead: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true
    },
    {
        Name: "Add ons",
        endPoint: "/products/addons",
        canRead: true,
        canCreate: true,
        canUpdate: true,
        canDelete: true
    }
];

export const usePermissions = () => useContext(PermissionsContext);

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const [permissions, setPermissions] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const res = await api.get(`/api/v1/user-rights?utypeid=${localStorage.getItem("rid")}`);
        if(res?.data?.success){
          setPermissions(res?.data?.data || []);
          // setPermissions(initialPermission || []);
        }
      } catch (error) {
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, []);

  return (
    <PermissionsContext.Provider value={{ permissions, loading }}>
      {children}
    </PermissionsContext.Provider>
  );
}
