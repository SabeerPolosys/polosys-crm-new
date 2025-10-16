"use client";
import DynamicTable from "@/components/table/DynamicTable";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { usePathname, useRouter } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "@/components/permissions/PermissionCheckerNew";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { showToast } from "@/components/common/ShowToast";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import PlanDetailsViewModal from "@/components/product/PlanDetailsViewModal";
import { PlanType } from "@/types/auth";
type PlanResponseType = {
  success: boolean,
  message: string,
  data: PlanType[]
}

// const features = [
//   { name: "Unlimited Projects", available: true },
//   { name: "Team Collaboration", available: true },
//   { name: "Priority Support", available: false },
//   { name: "Custom Domains", available: false },
// ];

export default function PlanList() {
  const [planList, setPlanList] = useState<PlanType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [features, setFeatures] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const getAllPlans = async () => {
      try {
        if(isDeleteOpen) return;
        setIsLoading(true);
        const res = await api.get<PlanResponseType>(`/api/v1/product-plan`);
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setPlanList(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch plans.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getAllPlans();
  }, [isDeleteOpen]);
  const columns = [
    { header: "Name", accessor: "planName" },
    { header: "Price", accessor: "planPrice" },
    { header: "Currency", accessor: "currencyCode" },
    { header: "Billing Cycle", accessor: "billingCycle" },
    { header: "Status", accessor: "isActive" },
    { header: "Plan Code", accessor: "code" },
  ];

  const pathname = usePathname();
  const { permissions } = usePermissions();
  const canCreate = validatePermission(
    pathname,
    "canCreate",
    permissions || []
  );
  const onEditClick = (row: any) => {
    router.push(`/products/plan/update/${row?.planID}`);
  };
  const onDeleteClick = (row: any) => {
    setIsDeleteOpen(true);
    setDeleteId(row?.addonID);
  };
  const handleRowClick = (row:any) => {
    setFeatures(row?.features)
    setIsDetailsOpen(true);
  };
  return (
    <ValidatePermissions>
      <div className="rounded-lg py-10 bg-white">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold px-6">All Plans</h2>

          <div className="flex flex-row gap-2 items-center">
            {canCreate && (
              <Link
                href="/products/plan/create"
                className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs"
              >
                {" "}
                + &nbsp; Add Plan
              </Link>
            )}
          </div>
        </div>
        <DynamicTable
          columns={columns}
          data={planList}
          isDataLoading={isLoading}
          isEditAllowed={true}
          isDeleteAllowed={true}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onRowClick={handleRowClick}
        />
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setDeleteId(null);
          }}
          deleteLabel="Plan"
          deleteId={`?ProductAddonID=${deleteId}` as string}
          deleteUrl={"/api/v1/product-addon"}
          redirectUrl={"/products/addons"}
        />
        <PlanDetailsViewModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailsOpen(false)}
          features={features}
        />
      </div>
    </ValidatePermissions>
  );
}
