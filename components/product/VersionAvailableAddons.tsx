"use client";
import { usePermissions } from "@/context/PermissionsContext";
import Link from "next/link";
import validatePermission from "../permissions/PermissionCheckerNew";
import ValidatePermissions from "../permissions/ValidatePermissions";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Addons } from "@/types/auth";
import { showToast } from "../common/ShowToast";
type AddonsResponse = {
  success: boolean;
  message: string;
  data: Addons[];
};

export default function VersionAvailableAddons() {
  const [addOnsList, setaddOnsList] = useState<Addons[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { permissions } = usePermissions();
  useEffect(() => {
    const getAllAddons = async () => {
      try {
        setIsLoading(true);
        const res = await api.get<AddonsResponse>(`/api/v1/product-addon`);
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setaddOnsList(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch addons.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getAllAddons();
  }, []);
  
  return (
    // <ValidatePermissions path="/products/addons">
      <div className="md:col-span-1 col-span-3 bg-gray-50">
        <div className="flex flex-row items-center justify-between m-4">
          <h2 className="font-semibold text-xl">Add-ons</h2>
        </div>
        <div className="flex flex-col gap-2 px-3">
          {addOnsList?.map((adOn, idx: number) => {
            return (
              <div className="flex flex-row justify-between w-full relative p-2 border-1 rounded-lg border-gray-200 bg-white font-medium text-sm" key={idx}>
                <div
                >
                  {adOn?.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    // </ValidatePermissions>
  );
}
