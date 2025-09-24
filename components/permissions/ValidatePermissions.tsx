"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import NoPermission from "../common/NoPermission";
import useValidatePermission from "./PermissionCheckerNew";
import { usePermissions } from "@/context/PermissionsContext";

export default function ValidatePermissions({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const { permissions, loading } = usePermissions();

    useEffect(() => {
        const canView = useValidatePermission("/users/create", "view", permissions || []);
        if(canView){
         setHasPermission(true);    
        }
    }, [pathname, router]);

    if(!hasPermission) return(<NoPermission/>)

    return <>{children}</>;
}
