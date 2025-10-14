"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import NoPermission from "../common/NoPermission";
import validatePermission from "./PermissionCheckerNew";
import { usePermissions } from "@/context/PermissionsContext";

export default function ValidatePermissions({
  children,
  path,
  permissionType,
}: {
  children: ReactNode;
  path?: string;
  permissionType?: "canCreate" | "canUpdate" | "canRead" | "canDelete";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { permissions, loading } = usePermissions();
  useEffect(() => {
    if (!loading && permissions) {
      const canView = validatePermission(
        path ?? pathname,
        permissionType ?? "canRead",
        permissions || []
      );
      if (canView) {
        setHasPermission(true);
      }else{
        setHasPermission(false);
      }
    }
  }, [pathname, router, path, permissionType, permissions]);

  if (loading || hasPermission === null) {
    return null;
  }

  if (!hasPermission && !loading) return <NoPermission />;

  return <>{children}</>;
}
