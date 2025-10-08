"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ProductCardSkeleton() {
  return (
    <div className="flex md:flex-row flex-col items-center justify-between gap-6 bg-white p-6 rounded">
      {/* Left section: Icon + title */}
      <div className="flex flex-row items-center gap-4 md:min-w-60 w-full">
        {/* Circular icon placeholder */}
        <div className="border-[1px] border-gray-300 rounded-full p-3">
          <Skeleton circle height={24} width={24} />
        </div>

        {/* Title and subtitle */}
        <div className="flex flex-col">
          <Skeleton height={20} width={120} style={{ marginBottom: 4 }} />
          <Skeleton height={14} width={100} />
        </div>
      </div>

      {/* Middle section: Description */}
      <div className="w-full flex-1">
        <Skeleton height={14} style={{ marginBottom: 6 }} />
        <Skeleton height={14} width="90%" style={{ marginBottom: 6 }} />
        <Skeleton height={14} width="70%" />
      </div>

      {/* Right section: Button */}
      <Skeleton height={36} width={96} borderRadius={6} />
    </div>
  );
}
