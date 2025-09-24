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
        Name: "User",
        url: "/users",
        view: true,
        create: true,
        edit: false,
        delete: false
    },
    {
        Name: "Role",
        url: "/role",
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
