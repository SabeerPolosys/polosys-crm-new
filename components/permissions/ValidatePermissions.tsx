"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import NoPermission from "../common/NoPermission";
import validatePermission from "./PermissionCheckerNew";
import { usePermissions } from "@/context/PermissionsContext";

export default function ValidatePermissions({ children, path, permissionType }: { children: ReactNode, path?: string, permissionType?: "create"|"edit"|"view"|"delete" }) {
    const pathname = usePathname();
    const router = useRouter();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const { permissions } = usePermissions();

    useEffect(() => {
        const canView = validatePermission(path ?? pathname, permissionType ?? "view", permissions || []);
        if(canView){
         setHasPermission(true);    
        }
    }, [pathname, router, path, permissionType, permissions]);

    if(!hasPermission) return(<NoPermission/>)

    return <>{children}</>;
}
