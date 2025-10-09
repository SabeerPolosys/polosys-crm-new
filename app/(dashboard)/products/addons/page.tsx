"use client";
import DynamicTable from "@/components/table/DynamicTable";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { usePathname, useRouter } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "@/components/permissions/PermissionCheckerNew";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Addons } from "@/types/auth";
import { showToast } from "@/components/common/ShowToast";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
type AddonsResponse = {
  success: boolean;
  message: string;
  data: Addons[];
};

export default function AddOnsList() {
  const [addOnsList, setAddOnsList] = useState<Addons[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const getAllAddons = async () => {
      try {
        if(isDeleteOpen) return;
        setIsLoading(true);
        const res = await api.get<AddonsResponse>(`/api/v1/product-addon`);
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setAddOnsList(respose);
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
  }, [isDeleteOpen]);
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Price", accessor: "addonPrice" },
    { header: "Currency", accessor: "currencyCode" },
  ];

  const pathname = usePathname();
  const { permissions } = usePermissions();
  const canCreate = validatePermission(
    pathname,
    "canCreate",
    permissions || []
  );
  const onEditClick = (row: any) => {
    router.push(`/products/addons/update/${row?.addonID}`);
  };
  const onDeleteClick = (row: any) => {
    setIsDeleteOpen(true);
    setDeleteId(row?.addonID);
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold px-6">All Add-ons</h2>

          <div className="flex flex-row gap-2 items-center">
            {canCreate && (
              <Link
                href="/products/addons/create"
                className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs"
              >
                {" "}
                + &nbsp; Add Add-ons
              </Link>
            )}
          </div>
        </div>
        <DynamicTable
          columns={columns}
          data={addOnsList}
          isDataLoading={isLoading}
          isEditAllowed={true}
          isDeleteAllowed={true}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setDeleteId(null);
          }}
          deleteLabel="Add-ons"
          deleteId={`?ProductAddonID=${deleteId}` as string}
          deleteUrl={"/api/v1/product-addon"}
          redirectUrl={"/products/addons"}
        />
      </div>
    </ValidatePermissions>
  );
}
