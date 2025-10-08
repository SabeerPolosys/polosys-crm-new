"use client";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { showToast } from "../common/ShowToast";
import { useRouter } from "next/navigation";
import ValidatePermissions from "../permissions/ValidatePermissions";
// Define the individual right inside rightsMaster
interface UserRight {
  userRightsMasterId: string;
  rightName: string;
  description: string | null;
  endpoint: string | null;
  haveRead: boolean;
  haveCreate: boolean;
  haveUpdate: boolean;
  haveDelete: boolean;
  right: any; 
}

// Define a module with its associated rights
interface ModuleRights {
  moduleId: string;
  moduleName: string;
  description: string;
  rightsMaster: UserRight[];
}

interface UserRightsResponse {
  success: boolean;
  message: string;
  data: ModuleRights[];
  errors: any[];
}
interface Right {
  rightId?: string;
  canRead?: boolean;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  userRightsMasterId?: string;
}

export default function RolePermissions({
  role,
  roleId,
}: {
  role: string | null;
  roleId: string | null;
}) {
  const [permissionDetails, setPermissionDetails] = useState<ModuleRights[]>(
    []
  );
  const [rightObject, setRightObject] = useState<any>({});
  const router = useRouter();
  useEffect(() => {
    const getPermissionDetails = async () => {
      try {
        const res = await api.get<UserRightsResponse>(
          `/api/v1/user-rights/group?utypeid=${roleId}`
        );
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setPermissionDetails(respose);
          const rightsData = {};
          res?.data?.data?.forEach((module) => {
            module.rightsMaster.forEach((right) => {
              rightsData[right.userRightsMasterId] = right.right
                ? {
                    ...right.right,
                    userRightsMasterId: right.userRightsMasterId,
                  }
                : right.right;
              delete rightsData[right.userRightsMasterId]?.userTypeId;
            });
            setRightObject(rightsData);
          });
        }
      } catch {
        showToast({
          message: `Failed to fetch permission details.`,
          type: "error",
        });
      }
    };
    getPermissionDetails();
  }, [roleId]);
  const permissions = ["Full Access", "View", "Create", "Edit", "Delete"];
  // const entities = ["Customers", "Vendors"];
  // const itemEntities = ["Inventory Adjustments", "Item"];
  // const bankingEntities = ["Payments"];
  const updateFullAccess = (isChecked: boolean, rightMaster: any) => {
    const updateValues: any = {};

    if (rightMaster?.haveRead) updateValues.canRead = isChecked;
    if (rightMaster?.haveCreate) updateValues.canCreate = isChecked;
    if (rightMaster?.haveUpdate) updateValues.canUpdate = isChecked;
    if (rightMaster?.haveDelete) updateValues.canDelete = isChecked;

    setRightObject({
      ...rightObject,
      [rightMaster?.userRightsMasterId]: {
        ...(rightObject?.[rightMaster?.userRightsMasterId] || {}),
        ...updateValues,
      },
    });
  };
  const updatePermission = async () => {
    try {
      const rightsArray: Right[] = Object.entries(rightObject)
        .filter(([_, value]) => value !== null)
        .map(([key, value]) => ({
          userRightsMasterId: key,
          ...value!,
        }));
      const res = await api.post(
        `/api/v1/user-rights?utypeid=${roleId}`,
        rightsArray
      );
      if (res?.status == 200) {
        showToast({
          message: `${role
            ?.replaceAll("_", " ")
            ?.replace(/\b\w/g, (char) =>
              char.toUpperCase()
            )} permissions updated successfully.`,
          type: "success",
        });
        router.push("/users");
      } else {
        throw new Error("Failed to update permission.");
      }
    } catch {
      showToast({
        message: `Failed to update permissions.`,
        type: "error",
      });
    }
  };

  return (
    <ValidatePermissions permissionType="canCreate" path="/users/role">
      <div>
        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-semibold">
            {role
              ?.replaceAll("_", " ")
              ?.replace(/\b\w/g, (char) => char.toUpperCase())}
          </h2>
          <button
            className="text-white bg-gray-800 rounded px-2 py-1 text-xs cursor-pointer border-2 hover:bg-white hover:text-gray-800 border-gray-800"
            onClick={updatePermission}
          >
            Update Permission
          </button>
        </div>
        <p className="text-gray-500 my-6">
          {role === "super_admin"
            ? "Super Admin can configure system settings, manage users, and monitor activities without restrictions."
            : `Please select settings for ${role
                ?.replaceAll("_", " ")
                ?.replace(/\b\w/g, (char) => char.toUpperCase())} role`}
        </p>
        <div className="flex flex-col gap-10">
          {permissionDetails?.map((permissionModule) => {
            return (
              <div
                className="rounded-md overflow-hidden"
                key={permissionModule?.moduleId}
              >
                <table className="min-w-full table-fixed border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th
                        className="w-1/6 text-left p-2 border-b-[1px] border-r-[1px] border-l-[1px] border-gray-300 text-lg"
                        colSpan={7}
                      >
                        {permissionModule?.moduleName}
                      </th>
                    </tr>
                    <tr>
                      <th className="w-1/6 text-left p-2 border-[1px] border-gray-300"></th>
                      {permissions.map((perm) => (
                        <th
                          key={perm}
                          className="text-center p-2 border-[1px] border-gray-300"
                        >
                          {perm}
                        </th>
                      ))}
                      {/* <th className="w-1/6 text-left p-4 border-[1px] border-gray-300"></th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {permissionModule?.rightsMaster.map((rightMaster) => (
                      <tr
                        key={rightMaster?.userRightsMasterId}
                        className="text-center"
                      >
                        <td className="text-left p-4 border-[1px] border-gray-300">
                          {rightMaster?.rightName}
                        </td>
                        {rightMaster?.haveRead ||
                        rightMaster?.haveCreate ||
                        rightMaster?.haveUpdate ||
                        rightMaster?.haveDelete ? (
                          <td className="p-4 border-[1px] border-gray-300">
                            <input
                              type="checkbox"
                              className="w-4 h-4"
                              checked={
                                (rightMaster?.haveRead
                                  ? rightObject?.[
                                      rightMaster?.userRightsMasterId
                                    ]?.canRead ?? false
                                  : true) &&
                                (rightMaster?.haveCreate
                                  ? rightObject?.[
                                      rightMaster?.userRightsMasterId
                                    ]?.canCreate ?? false
                                  : true) &&
                                (rightMaster?.haveUpdate
                                  ? rightObject?.[
                                      rightMaster?.userRightsMasterId
                                    ]?.canUpdate ?? false
                                  : true) &&
                                (rightMaster?.haveDelete
                                  ? rightObject?.[
                                      rightMaster?.userRightsMasterId
                                    ]?.canDelete ?? false
                                  : true)
                              }
                              onChange={(e) => {
                                updateFullAccess(e.target.checked, rightMaster);
                              }}
                            />
                          </td>
                        ) : (
                          <td className="p-4 border-[1px] border-gray-300"></td>
                        )}
                        {rightMaster?.haveRead ? (
                          <td className="p-4 border-[1px] border-gray-300">
                            <input
                              type="checkbox"
                              className="w-4 h-4"
                              checked={
                                rightObject?.[rightMaster?.userRightsMasterId]
                                  ?.canRead ?? false
                              }
                              onChange={(e) =>
                                setRightObject({
                                  ...rightObject,
                                  [rightMaster?.userRightsMasterId]: {
                                    ...(rightObject?.[
                                      rightMaster?.userRightsMasterId
                                    ] || {}),
                                    canRead: e.target.checked,
                                  },
                                })
                              }
                            />
                          </td>
                        ) : (
                          <td className="p-4 border-[1px] border-gray-300"></td>
                        )}
                        {rightMaster?.haveCreate ? (
                          <td className="p-4 border-[1px] border-gray-300">
                            <input
                              type="checkbox"
                              className="w-4 h-4"
                              checked={
                                rightObject?.[rightMaster?.userRightsMasterId]
                                  ?.canCreate ?? false
                              }
                              onChange={(e) =>
                                setRightObject({
                                  ...rightObject,
                                  [rightMaster?.userRightsMasterId]: {
                                    ...(rightObject?.[
                                      rightMaster?.userRightsMasterId
                                    ] || {}),
                                    canCreate: e.target.checked,
                                  },
                                })
                              }
                            />
                          </td>
                        ) : (
                          <td className="p-4 border-[1px] border-gray-300"></td>
                        )}
                        {rightMaster?.haveUpdate ? (
                          <td className="p-4 border-[1px] border-gray-300">
                            <input
                              type="checkbox"
                              className="w-4 h-4"
                              checked={
                                rightObject?.[rightMaster?.userRightsMasterId]
                                  ?.canUpdate ?? false
                              }
                              onChange={(e) =>
                                setRightObject({
                                  ...rightObject,
                                  [rightMaster?.userRightsMasterId]: {
                                    ...(rightObject?.[
                                      rightMaster?.userRightsMasterId
                                    ] || {}),
                                    canUpdate: e.target.checked,
                                  },
                                })
                              }
                            />
                          </td>
                        ) : (
                          <td className="p-4 border-[1px] border-gray-300"></td>
                        )}
                        {rightMaster?.haveDelete ? (
                          <td className="p-4 border-[1px] border-gray-300">
                            <input
                              type="checkbox"
                              className="w-4 h-4"
                              checked={
                                rightObject?.[rightMaster?.userRightsMasterId]
                                  ?.canDelete ?? false
                              }
                              onChange={(e) =>
                                setRightObject({
                                  ...rightObject,
                                  [rightMaster?.userRightsMasterId]: {
                                    ...(rightObject?.[
                                      rightMaster?.userRightsMasterId
                                    ] || {}),
                                    canDelete: e.target.checked,
                                  },
                                })
                              }
                            />
                          </td>
                        ) : (
                          <td className="p-4 border-[1px] border-gray-300"></td>
                        )}
                        {/* <td className="text-left p-2 border-[1px] border-gray-300 text-sm text-gray-300 underline cursor-pointer">
                    More Permissions
                  </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
          {/* <div className="rounded-md overflow-hidden">
          <table className="min-w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="w-1/6 text-left p-4 border-b-[1px] border-r-[1px] border-l-[1px] border-gray-300"
                  colSpan={7}
                >
                  Items
                </th>
              </tr>
              <tr>
                <th className="w-1/6 text-left p-4 border-[1px] border-gray-300"></th>
                {permissions.map((perm) => (
                  <th
                    key={perm}
                    className="text-center p-4 border-[1px] border-gray-300"
                  >
                    {perm}
                  </th>
                ))}
                <th className="w-1/6 text-left p-4 border-[1px] border-gray-300"></th>
              </tr>
            </thead>
            <tbody>
              {itemEntities.map((entity) => (
                <tr key={entity} className="text-center">
                  <td className="text-left p-4 border-[1px] border-gray-300">
                    {entity}
                  </td>
                  {permissions.map((perm) => (
                    <td key={perm} className="p-4 border-[1px] border-gray-300">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>
                  ))}
                  <td className="text-left p-2 border-[1px] border-gray-300 text-sm text-gray-300 underline cursor-pointer">
                    More Permissions
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
          {/* <div className="rounded-md overflow-hidden">
          <table className="min-w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="w-1/6 text-left p-4 border-b-[1px] border-r-[1px] border-l-[1px] border-gray-300"
                  colSpan={7}
                >
                  Banking
                </th>
              </tr>
              <tr>
                <th className="w-1/6 text-left p-4 border-[1px] border-gray-300"></th>
                {permissions.map((perm) => (
                  <th
                    key={perm}
                    className="text-center p-4 border-[1px] border-gray-300"
                  >
                    {perm}
                  </th>
                ))}
                <th className="w-1/6 text-left p-4 border-[1px] border-gray-300"></th>
              </tr>
            </thead>
            <tbody>
              {bankingEntities.map((entity) => (
                <tr key={entity} className="text-center">
                  <td className="text-left p-4 border-[1px] border-gray-300">
                    {entity}
                  </td>
                  {permissions.map((perm) => (
                    <td key={perm} className="p-4 border-[1px] border-gray-300">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>
                  ))}
                  <td className="text-left p-2 border-[1px] border-gray-300 text-sm text-gray-300 underline cursor-pointer">
                    More Permissions
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
        <button
            className="text-white bg-gray-800 rounded px-2 py-1 text-xs cursor-pointer border-2 hover:bg-white hover:text-gray-800 border-gray-800"
            onClick={updatePermission}
          >
            Update Permission
          </button>
        </div>
      </div>
    </ValidatePermissions>
  );
}
