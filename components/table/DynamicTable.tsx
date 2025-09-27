"use client";

import React, { useState } from "react";
import styles from "./DynamicTable.module.css";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/context/PermissionsContext";
import validatePermission from "../permissions/PermissionCheckerNew";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Column {
  header: string;
  accessor: string;
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
}: DynamicTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const pathname = usePathname();

  const totalPages = Math.ceil(data.length / rowsPerPage);

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
  const canEdit = validatePermission(pathname, "edit", permissions || []);
  const canDelete = validatePermission(pathname, "delete", permissions || []);

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
                        columns.length +
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
                      } else if (col.accessor.toLowerCase() === "status") {
                        value = (
                          <span
                            className={`${styles.status} ${
                              row[col.accessor] === "Pending"
                                ? styles.pending
                                : row[col.accessor] === "Paid"
                                ? styles.paid
                                : styles.overdue
                            }`}
                          >
                            {row[col.accessor]}
                          </span>
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
                      columns.length +
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

        {/* Pagination and Rows per page */}
        {/* <div className={styles.pagination}>
          <div className={styles.rowsPerPage}>
            <label htmlFor="rowsPerPage">Rows per page:</label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              {[10, 20, 30, 40].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.pageControls}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div> */}
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
