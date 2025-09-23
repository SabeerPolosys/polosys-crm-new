"use client";
import DynamicTable from "@/components/table/DynamicTable";
import UserRoleList from "@/components/users/UserRoleList";
import { FaRegUser } from "react-icons/fa";
import { LuUserRoundCog } from "react-icons/lu";
import { useSearchParams } from "next/navigation";
import RolePermissions from "@/components/users/RolePermissions";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { UserType } from "@/types/auth";
import { showToast } from "@/components/common/ShowToast";
import { useRouter } from "next/navigation";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
type GetUsersResponse = {
  success: boolean;
  messaage: string;
  data: UserType[];
};

export default function Users() {
  const [data, setData] = useState<UserType[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();
  const getAllUsers = async () => {
    try {
      const res = await api.get<GetUsersResponse>(`/api/v1/user`);
      if (res?.data?.success) {
        setData(res?.data?.data ?? []);
      }
    } catch {
      showToast({
        message: `Failed to fetch role.`,
        type: "error",
      });
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  const columns = [
    { header: "No", accessor: "slno" },
    { header: "Name", accessor: "userName" },
    { header: "Contact", accessor: "contact" },
    { header: "Role", accessor: "typeName" },
    // { header: "Email", accessor: "email" },
  ];
  const searchParams = useSearchParams();
  const onEditClick = (row: UserType) => {
    router.push(`/users/update/${row?.userId}`);
  };
  const onDeleteClick = (row: UserType) => {
    setIsDeleteOpen(true);
    setDeleteId(row?.userId);
  };

  return (
    <div>
      <h2 className="font-semibold mb-4">Users & Roles</h2>
      <div className="grid grid-cols-5 border-[1px] border-gray-300 rounded-lg">
        <div className="rounded-lg p-4 m-4 bg-gray-50 col-span-3">
          {searchParams?.get("role") ? (
            <RolePermissions role={searchParams?.get("role")} />
          ) : (
            <>
              <div className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-bold px-6">All Users</h2>
                <div className="flex flex-row gap-2 items-center">
                  <button className="border-[1px] border-gray-400 px-2 py-1 rounded-md text-xs flex flex-row items-center gap-1 text-gray-400">
                    {" "}
                    <FaRegUser /> Users
                  </button>
                  <button className="border-[1px] border-gray-400 px-2 py-1 rounded-md text-xs flex flex-row items-center gap-1 text-gray-400">
                    {" "}
                    <LuUserRoundCog /> Manage Users
                  </button>
                  <Link
                    href={"/users/create-user"}
                    className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs"
                  >
                    {" "}
                    + &nbsp; Add User
                  </Link>
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
            </>
          )}
          <DeleteConfirmationModal
            isOpen={isDeleteOpen}
            onClose={() => {
              setIsDeleteOpen(false);
              setDeleteId(null);
            }}
            deleteLabel="User"
            deleteId={`?userId=${deleteId}` as string}
            deleteUrl={"/api/v1/user"}
            redirectUrl={"/users"}
          />
        </div>
        <div className="col-span-2 rounded-lg p-4 my-4 mr-4 bg-gray-50">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-bold px-6">Manage The Roles</h2>
            <div className="flex flex-row gap-2 items-center">
              <Link
                href="/users/role/add-role"
                className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs"
              >
                {" "}
                + &nbsp; Add Role
              </Link>
            </div>
          </div>
          <UserRoleList />
        </div>
      </div>
    </div>
  );
}
