"use client";
import DynamicTable from "@/components/table/DynamicTable";
import UserRoleList from "@/components/users/UserRoleList";
import { FaRegUser } from "react-icons/fa";
import { LuUserRoundCog } from "react-icons/lu";
import { useSearchParams } from "next/navigation";
import RolePermissions from "@/components/users/RolePermissions";
import Link from "next/link";

export default function Users() {
  const columns = [
    { header: "No", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Contact", accessor: "contact" },
    { header: "Role", accessor: "role" },
    // { header: "Email", accessor: "email" },
  ];
  const searchParams = useSearchParams();

  const data = [
    {
      id: 1,
      name: "Alice Johnson",
      contact: "+1 555-1234",
      role: "Admin",
      email: "alice.johnson@example.com",
      action: "Edit",
    },
    {
      id: 2,
      name: "Bob Smith",
      contact: "+1 555-5678",
      role: "Editor",
      email: "bob.smith@example.com",
      action: "Edit",
    },
    {
      id: 3,
      name: "Charlie Brown",
      contact: "+1 555-9012",
      role: "Viewer",
      email: "charlie.brown@example.com",
      action: "Edit",
    },
    {
      id: 4,
      name: "Diana Prince",
      contact: "+1 555-3456",
      role: "Admin",
      email: "diana.prince@example.com",
      action: "Edit",
    },
    {
      id: 5,
      name: "Ethan Hunt",
      contact: "+1 555-7890",
      role: "Editor",
      email: "ethan.hunt@example.com",
      action: "Edit",
    },
    {
      id: 6,
      name: "Fiona Gallagher",
      contact: "+1 555-2345",
      role: "Viewer",
      email: "fiona.gallagher@example.com",
      action: "Edit",
    },
    {
      id: 7,
      name: "George Martin",
      contact: "+1 555-6789",
      role: "Admin",
      email: "george.martin@example.com",
      action: "Edit",
    },
    {
      id: 8,
      name: "Hannah Davis",
      contact: "+1 555-0123",
      role: "Editor",
      email: "hannah.davis@example.com",
      action: "Edit",
    },
    {
      id: 9,
      name: "Ian Curtis",
      contact: "+1 555-4567",
      role: "Viewer",
      email: "ian.curtis@example.com",
      action: "Edit",
    },
    {
      id: 10,
      name: "Julia Roberts",
      contact: "+1 555-8910",
      role: "Admin",
      email: "julia.roberts@example.com",
      action: "Edit",
    },
  ];

  return (
    <div>
      <h2 className="font-semibold mb-4">Users & Roles</h2>
      <div className="grid grid-cols-5 border-[1px] border-gray-300 rounded-lg">
        <div className="rounded-lg p-4 m-4 bg-gray-50 col-span-3">
          {searchParams?.get("role") ? (
              <RolePermissions role={searchParams?.get("role")}/>
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
                  <button className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs">
                    {" "}
                    + &nbsp; Add User
                  </button>
                </div>
              </div>
              <DynamicTable
                columns={columns}
                data={data}
                isEditAllowed={true}
                isDeleteAllowed={true}
              />
            </>
          )}
        </div>
        <div className="col-span-2 rounded-lg p-4 my-4 mr-4 bg-gray-50">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-bold px-6">Manage The Roles</h2>
            <div className="flex flex-row gap-2 items-center">
              <Link href="/users/add-role" className="px-4 py-1 rounded-md bg-gray-700 text-white text-xs">
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
