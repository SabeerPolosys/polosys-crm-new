"use client"

import React, { useState } from "react";
import styles from "./DynamicTable2.module.css";

interface Column {
  header: string;
  accessor: string;
}

interface DynamicTableProps<T> {
  columns: Column[];
  data: T[];
  initialRowsPerPage?: number;
}

const DynamicTableType2 = <T extends Record<string, any>>({
  columns,
  data,
  initialRowsPerPage = 10,
}: DynamicTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

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

  return (
    <div className="px-4 py-6">
        <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow}
            >
              {columns.map((col) => {
                let value = row[col.accessor];

                if (col.accessor.toLowerCase() === "status") {
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
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination and Rows per page */}
      <div className={styles.pagination}>
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
      </div>
    </div>
    </div>
  );
};

export default DynamicTableType2;
