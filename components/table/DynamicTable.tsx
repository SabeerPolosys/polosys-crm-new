"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./DynamicTable.module.css";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "../permissions/PermissionCheckerNew";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaRegCircleXmark } from "react-icons/fa6";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import Link from "next/link";
import StatusUpdateModal from "./StatusUpdateModal";
import { formatDateTime, getBillingCycle } from "@/helpers/helperFunction";

interface Column {
  header: string;
  accessor: string;
  specialName?: string;
  colour?: any;
  options?: { value: string; key: string }[];
  onClick?: () => void;
  setUpdateDetails?: any;
  isConvert?: boolean;
  defaultValue?: string;
  onUpdate?: (data: any) => Promise<boolean>;
  isFor?: string;
  updateKey?: string;
}

interface DynamicTableProps<T> {
  columns: Column[];
  data: T[];
  initialRowsPerPage?: number;
  onRowClick?: (rowData: T) => void;
  isEditAllowed?: boolean;
  isDeleteAllowed?: boolean;
  onEditClick?: (rowData: T) => void;
  onDeleteClick?: (rowData: T) => void;
  isDataLoading?: boolean;
  setUpdateStatus?: Dispatch<SetStateAction<number>>
}

const DynamicTable = <T extends Record<string, any>>({
  columns,
  data,
  initialRowsPerPage = 10,
  onRowClick,
  isEditAllowed,
  isDeleteAllowed,
  onEditClick,
  onDeleteClick,
  isDataLoading,
  setUpdateStatus
}: DynamicTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const pathname = usePathname();

  const totalPages = Math.ceil(data?.length / rowsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value);
    setRowsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page
  };
  const { permissions } = usePermissions();
  const canEdit = validatePermission(pathname, "canUpdate", permissions || []);
  const canDelete = validatePermission(
    pathname,
    "canDelete",
    permissions || []
  );
const getStatusStringWithNumber = (status: string|number) => {
  switch(status){
    case 41:
    case "41":
      return "New";
    case 42:
    case "42":
      return "Contacted";
    case 43:
    case "43":
      return "Qualified";
    case 44:
    case "44":
      return "Lost";
    case 45:
    case "45":
      return "Pending";
    case 51:
    case "51":
      return "Open";
    case 52:
    case "52":
      return "Won";
    case 53:
    case "53":
      return "Lost";
    case 54:
    case "54":
      return "OnHold";
    default:
      return "Other";
  }
}
  return (
    <div className="px-4 py-6">
      <div className={pathname?.includes("/users") ? "" : styles.tableWrapper}>
        <div className="min-h-[400px]">
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.accessor}>{col.header}</th>
                ))}
                {isEditAllowed && canEdit && <th></th>}
                {isDeleteAllowed && canDelete && <th></th>}
              </tr>
            </thead>
            <tbody>
              {isDataLoading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <tr key={i}>
                    <td
                      colSpan={
                        columns?.length +
                        (isEditAllowed && canEdit ? 1 : 0) +
                        (isDeleteAllowed && canDelete ? 1 : 0)
                      }
                    >
                      <Skeleton height={20} />
                    </td>
                  </tr>
                ))
              ) : paginatedData?.length > 0 ? (
                paginatedData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`${
                      rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow
                    } ${onRowClick ? "cursor-pointer" : ""}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((col) => {
                      let value = row[col.accessor];
                      if (col.accessor.toLowerCase() === "slno") {
                        value = rowIndex + 1;
                      } else if (
                        col?.specialName?.toLowerCase() === "changeablestatus"
                      ) {
                        value = (
                          <StatusUpdateModal
                            status={col?.isConvert ? getStatusStringWithNumber(row[col.accessor]) : row[col.accessor] || col?.defaultValue}
                            colour={
                              col?.colour?.[row[col.accessor] || col?.defaultValue] ?? "bg-blue-500"
                            }
                            options={col?.options ?? []}
                            handleSubmit={col?.onUpdate}
                            submitData={(col?.isFor??"") === "leadStatus" ? {leadID: row?.leadID, userID: row?.userID, countryID: row?.countryID, fullName: row?.fullName, email: row?.email, mobile: row?.mobile, source: row?.source, priority: row?.priority, status: row?.status } : {}}
                            updateKey={col?.updateKey}
                            canEdit={canEdit}
                            setUpdateStatus={setUpdateStatus}
                          />
                        );
                      }else if(col?.specialName?.toLowerCase() === "paymenttotal"){
                          value = <span>{(row?.amountPaid ?? 0)+(row?.taxAmount ?? 0)}</span>
                      }else if(col?.specialName?.toLowerCase() === "convertdatetime"){
                          value = <span>{formatDateTime(row[col.accessor])}</span>
                      } else if (col.accessor.toLowerCase() === "status") {
                        value = (
                          <span
                            className={`${
                              col?.colour?.[row?.[col?.accessor]]
                            } px-3 py-1 rounded-2xl cursor-pointer`}
                          >
                            {row[col.accessor]}
                          </span>
                        );
                      } else if (
                        col.accessor.toLowerCase() === "billingcycle"
                      ) {
                        value = (
                          <span>{getBillingCycle(row[col.accessor])}</span>
                        );
                      } else if (col.accessor.toLowerCase() === "isactive") {
                        value = row[col.accessor] ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            Incactive
                          </span>
                        );
                      } else if (col.accessor.toLowerCase() === "statusname") {
                        value =
                          row[col.accessor] === "Active" ? (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Active
                            </span>
                          ) : row[col.accessor] === "Inactive" ? (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
                              Incactive
                            </span>
                          ) : (
                            <span>{row[col.accessor]}</span>
                          );
                      } else if (
                        [
                          "haveRead",
                          "haveCreate",
                          "haveUpdate",
                          "haveDelete",
                          "isInvoiced",
                        ]?.includes(col.accessor)
                      ) {
                        value = (
                          <div className="flex items-center justify-center h-full">
                            {row[col.accessor] ? (
                              <IoCheckmarkCircleOutline className="w-5 h-5 text-green-500" />
                            ) : (
                              <FaRegCircleXmark className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                        );
                      } else if (
                        col.accessor.toLowerCase() === "convertoinvoice"
                      ) {
                        value = row[col.accessor] ? (
                          <button className="text-xs px-2 py-1 rounded bg-blue-700 text-white">
                            Convert
                          </button>
                        ) : null;
                      } else if (
                        col.accessor.toLowerCase() === "converttodeal"
                      ) {
                        value = (
                          <Link
                            href={`/sales/leads/convert-to-deal/${row?.id}`}
                            className="text-xs px-2 py-1 rounded bg-blue-800 text-white"
                          >
                            Convert
                          </Link>
                        );
                      } else if (col.accessor.toLowerCase() === "deactivate") {
                        value =
                          row?.statusID === 11 ? (
                            <button
                              className="text-xs px-2 py-1 rounded bg-red-400 text-white cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                col?.onClick && col?.onClick();
                                col?.setUpdateDetails &&
                                  col?.setUpdateDetails(row);
                              }}
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              className="text-xs px-2 py-1 rounded bg-green-400 text-white cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                col?.onClick && col?.onClick();
                                col?.setUpdateDetails &&
                                  col?.setUpdateDetails(row);
                              }}
                            >
                              Activate
                            </button>
                          );
                      }

                      return <td key={col.accessor}>{value}</td>;
                    })}
                    {isEditAllowed && canEdit && (
                      <td>
                        <button
                          className={`${styles.editBtn} cursor-pointer transition-transform transform hover:scale-150 duration-200`}
                          onClick={(e) => {
                            e.stopPropagation(); // prevent row click
                            onEditClick?.(row);
                          }}
                        >
                          <MdOutlineEdit className="text-blue-500" />
                        </button>
                      </td>
                    )}
                    {isDeleteAllowed && canDelete && (
                      <td>
                        <button
                          className={`${styles.editBtn} cursor-pointer transition-transform transform hover:scale-150 duration-200`}
                          onClick={(e) => {
                            e.stopPropagation(); // prevent row click
                            onDeleteClick?.(row);
                          }}
                        >
                          <MdDeleteOutline className="text-red-500" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={
                      columns?.length +
                      (isEditAllowed && canEdit ? 1 : 0) +
                      (isDeleteAllowed && canDelete ? 1 : 0)
                    }
                  >
                    <span>No Record Found</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex md:justify-between md:flex-row flex-col justify-start items-center p-4 text-sm">
          <div className="flex items-center gap-2">
            <label htmlFor="rowsPerPage">Rows per page:</label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm cursor-pointer"
            >
              {[10, 20, 30, 40].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center md:flex-row flex-col md:mt-0 mt-4 gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className={`px-3 py-1 border border-gray-300 rounded-md bg-white text-sm transition
                  ${
                    currentPage <= 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={`px-3 py-1 border border-gray-300 rounded-md bg-white text-sm transition
               ${
                 currentPage >= totalPages
                   ? "opacity-50 cursor-not-allowed"
                   : "hover:bg-gray-100"
               }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicTable;
