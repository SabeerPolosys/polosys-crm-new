"use client"
import { usePermissions } from "@/context/PermissionsContext";
import Link from "next/link";
import validatePermission from "../permissions/PermissionCheckerNew";
import ValidatePermissions from "../permissions/ValidatePermissions";

export default function AddonsList({ addOnsList }: { addOnsList: string[] }) {
  const { permissions } = usePermissions();
  const canCreateAddons = validatePermission(
    "/products/addons",
    "canCreate",
    permissions || []
  );

  return (
    <ValidatePermissions path="/products/addons">
    <div className="md:col-span-1 col-span-3 bg-gray-50">
      <div className="flex flex-row items-center justify-between m-4">
        <h2 className="font-semibold text-xl">Add-ons</h2>
        {canCreateAddons && <Link href={`/products/addons/create`} className="bg-gray-800 text-white px-2 text-xs py-1 rounded">
          + &nbsp; Add Add-ons
        </Link>}
      </div>
      <div className="flex flex-col gap-2 px-6">
        {addOnsList?.map((ons:string, idx:number) => {
          return (
            <div
              key={idx}
              className="p-2 border-1 rounded-lg border-gray-200 bg-white font-medium text-sm"
            >
              {ons}
            </div>
          );
        })}
      </div>
    </div>
    </ValidatePermissions>
  );
}
