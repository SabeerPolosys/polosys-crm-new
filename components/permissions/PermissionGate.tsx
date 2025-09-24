"use client"
import { usePermissions } from "@/context/PermissionsContext";

export function PermissionGate({ children }: { children: React.ReactNode }) {
  const { loading } = usePermissions();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading permissions...</p>
      </div>
    );
  }

  return <>{children}</>;
}