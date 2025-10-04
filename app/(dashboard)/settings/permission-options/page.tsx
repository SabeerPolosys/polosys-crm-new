"use client";
import DynamicTable from "@/components/table/DynamicTable";
import Link from "next/link";
import { useEffect, useState } from "react";
import { showToast } from "@/components/common/ShowToast";
import { PermissionOptions } from "@/types/auth";
import api from "@/lib/axios";
import { usePathname, useRouter } from "next/navigation";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "@/components/permissions/PermissionCheckerNew";
type GetPermissionModuleResponse = {
  success: boolean;
  message: string;
  data: PermissionOptions[];
};

export default function PermissionModule() {
  const [data, setData] = useState<PermissionOptions[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const columns = [
    { header: "Option Name", accessor: "rightName" },
    { header: "Module Name", accessor: "moduleName" },
    { header: "Description", accessor: "description" },
    { header: "Endpoint", accessor: "endpoint" },
    { header: "View", accessor: "haveRead" },
    { header: "Create", accessor: "haveCreate" },
    { header: "Edit", accessor: "haveUpdate" },
    { header: "Delete", accessor: "haveDelete" },
  ];
  const router = useRouter();
  useEffect(() => {
    const getAllPermissionModules = async () => {
      try {
        const res = await api.get<GetPermissionModuleResponse>(
          `/api/v1/user-rights-master`
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
    router.push(
      `/settings/permission-options/update/${row?.userRightsMasterId}`
    );
  };
  const onDeleteClick = (row: any) => {
    setIsDeleteOpen(true);
    setDeleteId(row?.userRightsMasterId);
  };
  const pathname = usePathname();
  const { permissions } = usePermissions();
  const canCreatePlan = validatePermission(
    pathname,
    "canCreate",
    permissions || []
  );

  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold px-6">All Permission Option</h2>
          <div className="flex flex-row gap-2 items-center">
            {canCreatePlan && (
              <Link
                href={"/settings/permission-options/create"}
                className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs"
              >
                {" "}
                + &nbsp; Add Permission Options
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
          deleteLabel="Permission Option"
          deleteId={`?userRightsMasterId=${deleteId}` as string}
          deleteUrl={"/api/v1/user-rights-master"}
          redirectUrl={"/settings/permission-options"}
        />
      </div>
    </ValidatePermissions>
  );
}
