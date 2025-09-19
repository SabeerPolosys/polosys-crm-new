"use client";

import toast from "react-hot-toast";

const toastStyles = {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 16px",
    borderRadius: 8,
    minWidth: 280,
    color: "white",
    fontWeight: 500,
    fontSize: 14,
  },
  success: {
    backgroundColor: "#4caf50",
  },
  error: {
    backgroundColor: "#f44336",
  },
  closeButton: {
    marginLeft: 12,
    border: "none",
    background: "transparent",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 16,
    lineHeight: 1,
  },
};

export function showToast({
  message,
  type,
  duration = 2000
}: {
  message: string;
  type: "success" | "error";
  duration?: number
}) {
  toast(
    (t) => (
      <div
        style={{
          ...toastStyles.base,
          ...(type === "success" ? toastStyles.success : toastStyles.error),
        }}
      >
        <span>{message}</span>
        <button
          onClick={() => toast.dismiss(t.id)}
          style={toastStyles.closeButton}
          aria-label="Close toast"
        >
          ✕
        </button>
      </div>
    ),
    {
      duration, // auto dismiss after 3 seconds
      position: "top-right",
    }
  );
}
