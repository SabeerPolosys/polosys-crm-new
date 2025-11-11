"use client";
import { showToast } from "@/components/common/ShowToast";
import api from "@/lib/axios";
import { ProductEdition } from "@/types/auth";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { FiMoreVertical } from "react-icons/fi";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "@/components/permissions/PermissionCheckerNew";
import VersionAvailableAddons from "@/components/product/VersionAvailableAddons";
import { formatDateToDDMMYYYY } from "@/helpers/helperFunction";
import PlanViewCard from "@/components/product/PlanViewCard";
import { IoMdArrowBack } from "react-icons/io";
import Link from "next/link";
type GetEditionResponse = {
  success: boolean;
  message: string;
  data: ProductEdition;
};

export default function EditionDetails() {
  const [editionDetails, setEditionDetails] = useState<ProductEdition | null>(
    null
  );
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<any>();
  const router = useRouter();
  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };
  const params = useParams();
  useEffect(() => {
    const getEditionDetails = async () => {
      try {
        const res = await api.get<GetEditionResponse>(
          `/api/v1/edition/${params?.["edition-id"]}`
        );
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setEditionDetails(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch version details.`,
          type: "error",
        });
      }
    };
    getEditionDetails();
  }, [params]);
  // const addOnsList = [
  //   "User action report",
  //   "Schemes",
  //   "RPOS Sync service",
  //   "Biometric",
  //   "Additional database",
  //   "Report data sync",
  //   "RPOS Theme",
  //   "Vansales",
  //   "Weigh scale",
  //   "Web report",
  //   "Polosys live",
  //   "Bank POS",
  //   "FAM",
  // ];
  const { permissions } = usePermissions();
  const canEditVersion = validatePermission(
    "/products/version",
    "canUpdate",
    permissions || []
  );
  const canDeleteVersion = validatePermission(
    "/products/version",
    "canDelete",
    permissions || []
  );
  return (
    <ValidatePermissions path="/products/version">
      <div
        onClick={() => openDropdownIndex !== null && setOpenDropdownIndex(null)}
      >
        <div className="flex flex-row items-center justify-between my-4">
          <h2 className="font-semibold">Version Details</h2>
        </div>
        <div className="p-4 rounded-lg border-[1px] border-gray-300">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-gray-50">
              <div className="flex flex-row items-center justify-between m-4">
                <div className="flex flex-row items-center">
                  <div
                    className="mr-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 cursor-pointer"
                    onClick={() => router.back()}
                  >
                    <IoMdArrowBack className="w-6 h-6" />
                  </div>
                  <h2 className="font-semibold text-xl">
                    {editionDetails?.eName}
                  </h2>
                </div>
                <div className="relative">
                  {(canEditVersion || canDeleteVersion) && (
                    <FiMoreVertical
                      className="text-lg cursor-pointer hover:text-white hover:rounded-full p-0.5 hover:bg-gray-800 hover:scale-105 transition-all duration-150 ease-in-out w-6 h-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(0);
                      }}
                    />
                  )}

                  {openDropdownIndex === 0 && (
                    <div
                      className="absolute right-full top-1/2 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {canEditVersion && (
                        <button
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-blue-500 cursor-pointer"
                          onClick={() => {
                            router.push(
                              `/products/editions/update/${editionDetails?.editionId}`
                            );
                          }}
                        >
                          <MdOutlineEdit />
                          Edit
                        </button>
                      )}
                      {canDeleteVersion && (
                        <button
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                          onClick={() => {
                            setIsDeleteOpen(true);
                            setDeleteId(editionDetails?.editionId);
                          }}
                        >
                          <MdDeleteOutline />
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white m-4 p-6 min-h-screen">
                <div className=" mx-auto bg-white shadow-md rounded-md p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Edition Details
                  </h2>

                  <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-700">
                    <div className="font-medium text-gray-600">
                      Product Name:
                    </div>
                    <div>{editionDetails?.productName}</div>
                    <div className="font-medium text-gray-600">
                      Edition Name:
                    </div>
                    <div>{editionDetails?.eName}</div>

                    {/* <div className="font-medium text-gray-600">Version:</div>
                    <div>v2.1.0</div> */}

                    <div className="font-medium text-gray-600">
                      Edition Code:
                    </div>
                    <div>{editionDetails?.eCode}</div>

                    <div className="font-medium text-gray-600">
                      Number Of Users:
                    </div>
                    <div>{editionDetails?.noOfUsers}</div>
                  </div>
                </div>

                {/* {productDetails?.productTypeID === 1 ? ( */}
                {/* ) : (
                <div className="flex flex-row items-center justify-between">
                  <h3 className="my-6 text-xl font-semibold">
                    Plans Of Products
                  </h3>
                  {canCreatePlan && <Link href={`/products/plan/create?productId=${params?.productId}`} className="px-2 py-1 rounded bg-gray-800 text-white text-sm cursor-pointer">
                    + &nbsp;Create Plan
                  </Link>}
                </div>
              )} */}
              </div>
            </div>
          </div>
        </div>
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setDeleteId(null);
          }}
          deleteLabel="Edition"
          deleteId={`?editionId=${deleteId}` as string}
          deleteUrl={"/api/v1/edition"}
          redirectUrl={`/products/${editionDetails?.productId}`}
        />
      </div>
    </ValidatePermissions>
  );
}
