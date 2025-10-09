"use client";
import { usePermissions } from "@/context/PermissionsContext";
import Link from "next/link";
import validatePermission from "../permissions/PermissionCheckerNew";
import ValidatePermissions from "../permissions/ValidatePermissions";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Addons } from "@/types/auth";
import { showToast } from "../common/ShowToast";
import { FiMoreVertical } from "react-icons/fi";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal";
import { useRouter } from "next/navigation";
type AddonsResponse = {
  success: boolean;
  message: string;
  data: Addons[];
};

export default function AddonsList() {
  const [addOnsList, setaddOnsList] = useState<Addons[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { permissions } = usePermissions();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<null | string>(null);
  const canCreateAddons = validatePermission(
    "/products/addons",
    "canCreate",
    permissions || []
  );
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
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );
  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };
  const router = useRouter();
  const canEdit = true;
  const canDelete = true;
  return (
    <ValidatePermissions path="/products/addons">
      <div className="md:col-span-1 col-span-3 bg-gray-50">
        <div className="flex flex-row items-center justify-between m-4">
          <h2 className="font-semibold text-xl">Add-ons</h2>
          {canCreateAddons && (
            <Link
              href={`/products/addons/create`}
              className="bg-gray-800 text-white px-2 text-xs py-1 rounded"
            >
              + &nbsp; Add Add-ons
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-2 px-3">
          {addOnsList?.map((adOn, idx: number) => {
            return (
              <div className="flex flex-row justify-between w-full relative p-2 border-1 rounded-lg border-gray-200 bg-white font-medium text-sm" key={idx}>
                <div
                >
                  {adOn?.name}
                </div>
                <div className="relative">
                  {(canEdit || canDelete) && (
                    <FiMoreVertical
                      className="text-lg cursor-pointer hover:text-white hover:rounded-full p-0.5 hover:bg-gray-800 hover:scale-105 transition-all duration-150 ease-in-out w-6 h-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(idx);
                      }}
                    />
                  )}
                  {openDropdownIndex === idx && (
                    <div
                      className="absolute right-full top-1/2 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {canEdit && (
                        <button
                          className="px-2 py-1 hover:bg-gray-100 text-blue-500 cursor-pointer"
                          onClick={() => {
                            router.push(`/products/addons/update/${adOn?.addonID}`);
                          }}
                        >
                          <MdOutlineEdit />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          className="px-2 py-1 hover:bg-gray-100 text-red-500 cursor-pointer"
                          onClick={() => {
                            setIsDeleteOpen(true);
                            setDeleteId(adOn?.addonID);
                          }}
                        >
                          <MdDeleteOutline />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setDeleteId(null);
          }}
          deleteLabel="Add-ons"
          deleteId={`?ProductAddonID=${deleteId}` as string}
          deleteUrl={"/api/v1/product-addon"}
          redirectUrl={"/products"}
        />
      </div>
    </ValidatePermissions>
  );
}
