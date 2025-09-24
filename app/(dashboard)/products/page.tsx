"use client"
import { showToast } from "@/components/common/ShowToast";
import ProductCard from "@/components/product/ProductCard";
import api from "@/lib/axios";
import { ProductTypes } from "@/types/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
type ProductResponseType = {
  success: boolean,
  message: string,
  data: ProductTypes[]
}

export default function Products() {
  const [products, setProducts] = useState<ProductTypes[]>([]);
  useEffect(() => {
    const getAllPermissionModules = async () => {
      try {
        const res = await api.get<ProductResponseType>(
          `/api/v1/product`
        );
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setProducts(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch products.`,
          type: "error",
        });
      }
    };
    getAllPermissionModules();
  }, []);
  const addOnsList = [
    "User action report",
    "Schemes",
    "RPOS Sync service",
    "Biometric",
    "Additional database",
    "Report data sync",
    "RPOS Theme",
    "Vansales",
    "Weigh scale",
    "Web report",
    "Polosys live",
    "Bank POS",
    "FAM",
  ];
//   const products = [
//     {
//         id:1,
//         title:"Polosys ERP",
//         label: "Licensed product",
//         description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
//     },
//     {
//         id:2,
//         title:"EazyBiz",
//         label: "Licensed product",
//         description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
//     },
//     {
//         id:3,
//         title:"Books",
//         label: "Subscription product",
//         description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
//     }
// ]
  return (
    <div>
      <div className="flex flex-row items-center justify-between my-4">
        <h2 className="font-semibold">Product Suite</h2>
        <button className="bg-gray-800 text-white px-4 text-xs py-2 rounded">
          + &nbsp; Add Lead
        </button>
      </div>
      <div className="p-4 rounded-lg border-[1px] border-gray-300">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-gray-50">
            <div className="flex flex-row items-center justify-between m-4">
              <h2 className="font-semibold text-xl">All Products</h2>
              <Link href={"/products/create"} className="bg-gray-800 text-white px-4 text-xs py-2 rounded">
                + &nbsp; Add Products
              </Link>
            </div>
            <div className="flex flex-col gap-4 px-4">
                {
                    products?.map((product, idx)=><ProductCard key={idx} product={product}/>)
                }
            </div>
          </div>
          <div className="col-span-1 bg-gray-50">
            <div className="flex flex-row items-center justify-between m-4">
              <h2 className="font-semibold text-xl">Add-ons</h2>
              <button className="bg-gray-800 text-white px-4 text-xs py-2 rounded">
                + &nbsp; Add Add-ons
              </button>
            </div>
            <div className="flex flex-col gap-2 px-6">
              {addOnsList?.map((ons, idx) => {
                return (
                  <div
                    key={idx}
                    className="p-2 border-1 rounded-lg border-gray-200 bg-white font-medium"
                  >
                    {ons}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
