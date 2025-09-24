"use client"

import { ProductTypes } from "@/types/auth";
import { useRouter } from "next/navigation";
import { BsBox } from "react-icons/bs";

export default function ProductCard({product}: {product:ProductTypes}) {
    const router = useRouter();
  return (
    <div className="flex flex-row items-center justify-between gap-6 bg-white p-6 rounded cursor-pointer" onClick={()=>router.push(`/products/${product?.productTypeID}`)}>
      <div className="flex flex-row items-center gap-4 md:min-w-60">
        <div className="border-[1px] border-gray-600 rounded-full p-3">
          <BsBox className="w-6 h-6" />
        </div>
        <p>
          <span className="text-2xl font-bold">{product?.name}</span>
          <br />
          <span className="text-gray-400">{product?.productTypeID === 1 ? "Subscription product" : "Subscription product"}</span>
        </p>
      </div>
      <p className="text-gray-400">
        {product?.description}
      </p>
      <button className="border-2 border-gray-300 px-4 py-2 rounded text-gray-500 font-xs">
        Explore
      </button>
    </div>
  );
}
