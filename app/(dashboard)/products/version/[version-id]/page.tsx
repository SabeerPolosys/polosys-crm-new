"use client";
import { showToast } from "@/components/common/ShowToast";
import api from "@/lib/axios";
import { ProductTypes } from "@/types/auth";
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
type GetProductResponse = {
  success: boolean;
  message: string;
  data: ProductTypes;
};

export default function VersionDetails() {
  const [productDetails, setProductDetails] = useState<ProductTypes | null>(
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
  // useEffect(() => {
  //   const getProductDetails = async () => {
  //     try {
  //       const res = await api.get<GetProductResponse>(
  //         `/api/v1/product/${params?.productId}`
  //       );
  //       if (res?.data?.success) {
  //         const respose = res?.data?.data;
  //         setProductDetails(respose);
  //       }
  //     } catch {
  //       showToast({
  //         message: `Failed to fetch product details.`,
  //         type: "error",
  //       });
  //     }
  //   };
  //   getProductDetails();
  // }, [params]);
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
  const canCreatePlan = validatePermission(
    "/products/plan",
    "canCreate",
    permissions || []
  );
  const canCreateVersion = validatePermission(
    "/products/version",
    "canCreate",
    permissions || []
  );
  const canEditProduct = validatePermission(
    "/products",
    "canUpdate",
    permissions || []
  );
  const canDeleteProduct = validatePermission(
    "/products",
    "canDelete",
    permissions || []
  );
  return (
    <ValidatePermissions path="/products">
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
                <h2 className="font-semibold text-xl">Books GCC</h2>
                <div className="relative">
                  {(canEditProduct || canDeleteProduct) && (
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
                      {canEditProduct && (
                        <button
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-blue-500 cursor-pointer"
                          onClick={() => {
                            // router.push(`/products/update/${params?.productId}`);
                          }}
                        >
                          <MdOutlineEdit />
                          Edit
                        </button>
                      )}
                      {canDeleteProduct && (
                        <button
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                          onClick={() => {
                            setIsDeleteOpen(true);
                            setDeleteId(params?.productId);
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
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    Product Details
                  </h2>

                  <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-700">
                    <div className="font-medium text-gray-600">
                      Release Date:
                    </div>
                    <div>2025-10-14</div>

                    <div className="font-medium text-gray-600">Version:</div>
                    <div>v2.1.0</div>

                    <div className="font-medium text-gray-600">Price:</div>
                    <div>$49.99</div>

                    <div className="font-medium text-gray-600">Currency:</div>
                    <div>USD</div>

                    <div className="font-medium text-gray-600">Country:</div>
                    <div>United States</div>
                  </div>
                </div>

                {/* {productDetails?.productTypeID === 1 ? ( */}
                <div className="flex flex-row items-center justify-between">
                  <h3 className="my-6 text-xl font-semibold">
                    Plans Of The Version
                  </h3>
                </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg shadow-lg p-4 bg-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-200">
                    <div className="text-center flex flex-col gap-1">
                      <h3 className="font-semibold text-gray-700 text-lg">
                        Starter
                      </h3>
                      <p className="font-bold text-blue-600 text-xl">
                        &#8377; 1999
                      </p>
                      <p className="text-xs text-gray-500">
                        per user / per month
                      </p>
                      <p className="text-gray-600 text-sm">
                        Perfect for small teams starting out.
                      </p>
                    </div>
                    <div className="flex justify-center text-sm mt-4">
                      <ul className="leading-7">
                        <li className="flex flex-row items-center gap-2">
                          <TiTick />
                          Basic Reports
                        </li>
                        <li className="flex flex-row items-center gap-2">
                          <TiTick />
                          Email Support
                        </li>
                        <li className="flex flex-row items-center gap-2">
                          <TiTick />
                          Access to Dashboard
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-lg shadow-lg p-4 bg-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-200">
                    <div className="text-center flex flex-col gap-1">
                      <h3 className="font-semibold text-gray-700 text-lg">
                        Professional
                      </h3>
                      <p className="font-bold text-green-600 text-xl">
                        &#8377; 3999
                      </p>
                      <p className="text-xs text-gray-500">
                        per user / per month
                      </p>
                      <p className="text-gray-600 text-sm">
                        For growing businesses that need more power.
                      </p>
                    </div>
                    <div className="flex justify-center text-sm mt-4">
                      <ul className="leading-7">
                        <li className="flex flex-row items-center gap-2">
                          <TiTick />
                          Advanced Analytics
                        </li>
                        <li className="flex flex-row items-center gap-2">
                          <TiTick />
                          Priority Support
                        </li>
                        <li className="flex flex-row items-center gap-2">
                          <TiTick />
                          Role-Based Access
                        </li>
                        <li className="flex flex-row items-center gap-2">
                          <TiTick />
                          Custom Reports
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-lg shadow-lg p-4 bg-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-200">
                    <div className="text-center flex flex-col gap-1">
                      <h3 className="font-semibold text-gray-700 text-lg">
                        Enterprise
                      </h3>
                      <p className="font-bold text-purple-600 text-xl">
                        &#8377; 6999
                      </p>
                      <p className="text-xs text-gray-500">
                        per user / per month
                      </p>
                      <p className="text-gray-600 text-sm">
                        Best for large organizations with custom needs.
                      </p>
                    </div>
                    <div className="flex justify-center text-sm mt-4">
                      <ul className="leading-7">
                        <li className="flex flex-row items-center gap-2">
                          <TiTick />
                          Dedicated Account Manager
                        </li>
                        <li className="flex flex-row items-center gap-2">
                          <TiTick />
                          API Access
                        </li>
                        <li className="flex flex-row items-center gap-2">
                          <TiTick />
                          Single Sign-On (SSO)
                        </li>
                        <li className="flex flex-row items-center gap-2">
                          <TiTick />
                          24/7 Support
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-lg shadow-lg p-4 bg-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-200">
                    <div className="text-center flex flex-col gap-1">
                      <h3 className="font-semibold text-gray-700 text-lg">
                        Custom
                      </h3>
                      <p className="font-bold text-pink-600 text-xl">
                        Contact Us
                      </p>
                      <p className="text-xs text-gray-500">Tailored pricing</p>
                      <p className="text-gray-600 text-sm">
                        We build a plan that works for your business.
                      </p>
                    </div>
                    <div className="flex justify-center text-sm mt-4">
                      <ul className="leading-7">
                        <li className="flex flex-row items-center gap-2">
                          <TiTick />
                          Custom Integrations
                        </li>
                        <li className="flex flex-row items-center gap-2">
                          <TiTick />
                          Personalized Onboarding
                        </li>
                        <li className="flex flex-row items-center gap-2">
                          <TiTick />
                          Unlimited Users
                        </li>
                        <li className="flex flex-row items-center gap-2">
                          <TiTick />
                          Dedicated Support
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <VersionAvailableAddons />
          </div>
        </div>
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setDeleteId(null);
          }}
          deleteLabel="Version"
          deleteId={`?productId=${deleteId}` as string}
          deleteUrl={""}
          redirectUrl={"/products"}
        />
      </div>
    </ValidatePermissions>
  );
}
