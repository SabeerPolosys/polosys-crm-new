"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col max-h-screen">
      {/* Navbar */}
      {isCollapsed && <Navbar />}

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar collapsed={isCollapsed} setCollapsed={setIsCollapsed} />

        {/* Main content */}
        <main className="flex-1 p-6 max-h-screen overflow-y-scroll">{children}</main>
      </div>
    </div>
  );
}
