"use client";

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
        url: "/",
        view: true,
        create: true,
        edit: true,
        delete: true
    },
    {
        Name: "User",
        url: "/users",
        view: true,
        create: true,
        edit: true,
        delete: true
    },
    {
        Name: "Role",
        url: "/users/role",
        view: true,
        create: false,
        edit: true,
        delete: true
    },
    {
        Name: "Leads",
        url: "/leads",
        view: true,
        create: false,
        edit: true,
        delete: true
    },
    {
        Name: "Products",
        url: "/products",
        view: true,
        create: true,
        edit: true,
        delete: true
    },
    {
        Name: "Accounts",
        url: "/accounts",
        view: true,
        create: false,
        edit: true,
        delete: true
    },
    {
        Name: "Customers",
        url: "/customers",
        view: true,
        create: false,
        edit: true,
        delete: true
    },
    {
        Name: "Reports",
        url: "/reports",
        view: true,
        create: false,
        edit: true,
        delete: true
    },
    {
        Name: "Permission Modules",
        url: "/settings/permission-module",
        view: true,
        create: false,
        edit: true,
        delete: true
    },
    {
        Name: "Permission Options",
        url: "/settings/permission-options",
        view: true,
        create: false,
        edit: true,
        delete: true
    },
    {
        Name: "Plan",
        url: "/products/plan",
        view: true,
        create: true,
        edit: true,
        delete: true
    },
    {
        Name: "Version",
        url: "/products/version",
        view: true,
        create: true,
        edit: true,
        delete: true
    }
];

export const usePermissions = () => useContext(PermissionsContext);

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const [permissions, setPermissions] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        // 👇 Replace with your real API endpoint
        const res = await axios.get("https://jsonplaceholder.typicode.com/todos/1");

        setPermissions(initialPermission || []);
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
