"use client";
import { showToast } from "@/components/common/ShowToast";
import api from "@/lib/axios";
import { ProductTypes, ProductVersion } from "@/types/auth";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { FiMoreVertical } from "react-icons/fi";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import Link from "next/link";
import AddonsList from "@/components/product/AddonsList";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "@/components/permissions/PermissionCheckerNew";
import { IoMdArrowBack } from "react-icons/io";
type GetProductResponse = {
  success: boolean;
  message: string;
  data: ProductTypes;
};
type GetProductVersionResponse = {
  success: boolean;
  message: string;
  data: ProductVersion[];
};

export default function IndividualProduct() {
  const [productDetails, setProductDetails] = useState<ProductTypes | null>(
    null
  );
  const [productVersions, setProductVersions] = useState<ProductVersion[]>([]);
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
    const getProductDetails = async () => {
      try {
        const res = await api.get<GetProductResponse>(
          `/api/v1/product/${params?.productId}`
        );
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setProductDetails(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch product details.`,
          type: "error",
        });
      }
    };
    getProductDetails();
  }, [params]);
  useEffect(() => {
    const getProductVersions = async () => {
      try {
        const res = await api.get<GetProductVersionResponse>(
          `/api/v1/product-version/ByProductID/${params?.productId}`
        );
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setProductVersions(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch product versions.`,
          type: "error",
        });
      }
    };
    getProductVersions();
  }, [params]);
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
          <h2 className="font-semibold">Product Suite</h2>
          {/* <button className="bg-gray-800 text-white px-2 text-xs py-1 rounded">
            + &nbsp; Add Lead
          </button> */}
        </div>
        <div className="p-4 rounded-lg border-[1px] border-gray-300">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-gray-50">
              <div className="flex flex-row items-center justify-between m-4">
                <div className="flex flex-row items-center">
                  <div
                    className="mr-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 cursor-pointer"
                    onClick={() => router.push("/products")}
                  >
                    <IoMdArrowBack className="w-6 h-6" />
                  </div>
                  <h2 className="font-semibold text-xl">
                    {productDetails?.name}
                  </h2>
                </div>
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
                            router.push(
                              `/products/update/${params?.productId}`
                            );
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
                <p>{productDetails?.description}</p>
                <ValidatePermissions path="/products/version">
                  <>
                    <div className="flex flex-row items-center justify-between">
                      <h3 className="my-6 text-xl font-semibold">
                        Version Of Products
                      </h3>
                      {canCreateVersion && (
                        <Link
                          href={`/products/version/create?productId=${params?.productId}`}
                          className="px-2 py-1 rounded bg-gray-800 text-white text-sm cursor-pointer"
                        >
                          + &nbsp;Create Version
                        </Link>
                      )}
                    </div>

                    <div className="flex felx-row gap-4 flex-wrap justify-self-auto">
                      {productVersions?.map((version) => {
                        return (
                          <Link
                            href={`/products/version/${version?.versionID}`}
                            className="px-12 py-2 border-1 rounded-lg border-gray-200 bg-white font-medium"
                            key={version?.versionID}
                          >
                            {version?.versionNumber}
                          </Link>
                        );
                      })}
                    </div>
                  </>
                </ValidatePermissions>
              </div>
            </div>
            <AddonsList />
          </div>
        </div>
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setDeleteId(null);
          }}
          deleteLabel="Product"
          deleteId={`?productId=${deleteId}` as string}
          deleteUrl={"/api/v1/product"}
          redirectUrl={"/products"}
        />
      </div>
    </ValidatePermissions>
  );
}
