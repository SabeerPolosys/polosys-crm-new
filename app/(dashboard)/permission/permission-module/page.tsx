"use client";
import DynamicTable from "@/components/table/DynamicTable";
import Link from "next/link";
import { useEffect, useState } from "react";
import { showToast } from "@/components/common/ShowToast";
import { PermissionModuleType } from "@/types/auth";
import api from "@/lib/axios";
import { usePathname, useRouter } from "next/navigation";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import validatePermission from "@/components/permissions/PermissionCheckerNew";
import { usePermissions } from "@/context/PermissionsContext";
type GetPermissionModuleResponse = {
  success: boolean;
  message: string;
  data: PermissionModuleType[];
};

export default function PermissionModule() {
  const [data, setData] = useState<PermissionModuleType[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const columns = [
    { header: "Module Name", accessor: "moduleName" },
    { header: "Description", accessor: "description" },
  ];
  const router = useRouter();
  useEffect(() => {
    const getAllPermissionModules = async () => {
      try {
        const res = await api.get<GetPermissionModuleResponse>(
          `/api/v1/module`
        );
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setData(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch permission module.`,
          type: "error",
        });
      }
    };
    getAllPermissionModules();
  }, []);
  const onEditClick = (row: any) => {
    router.push(`/permission/permission-module/update/${row?.moduleId}`);
  };
  const onDeleteClick = (row: any) => {
    setIsDeleteOpen(true);
    setDeleteId(row?.moduleId);
  };
  const pathname = usePathname();
  const { permissions } = usePermissions();
  const canCreate = validatePermission(
    pathname,
    "canCreate",
    permissions || []
  );

  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold px-6">All Permission Modules</h2>
          <div className="flex flex-row gap-2 items-center">
            {canCreate && (
              <Link
                href={"/permission/permission-module/create"}
                className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs"
              >
                {" "}
                + &nbsp; Add Permission Module
              </Link>
            )}
          </div>
        </div>
        <DynamicTable
          columns={columns}
          data={data}
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
          deleteLabel="Permission Module"
          deleteId={`?moduleId=${deleteId}` as string}
          deleteUrl={"/api/v1/module"}
          redirectUrl={"/permission/permission-module"}
        />
      </div>
    </ValidatePermissions>
  );
}
