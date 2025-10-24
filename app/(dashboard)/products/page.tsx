"use client";
import { showToast } from "@/components/common/ShowToast";
import validatePermission from "@/components/permissions/PermissionCheckerNew";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import AddonsList from "@/components/product/AddonsList";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import { usePermissions } from "@/context/PermissionsContext";
import api from "@/lib/axios";
import { ProductTypes } from "@/types/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
type ProductResponseType = {
  success: boolean;
  message: string;
  data: ProductTypes[];
};

export default function Products() {
  const [products, setProducts] = useState<ProductTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getAllPermissionModules = async () => {
      try {
        setIsLoading(true);
        const res = await api.get<ProductResponseType>(`/api/v1/product`);
        if (res?.data?.success) {
          const respose = res?.data?.data;
          setProducts(respose);
        }
      } catch {
        showToast({
          message: `Failed to fetch products.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getAllPermissionModules();
  }, []);
  const pathname = usePathname();
  const { permissions } = usePermissions();
  const canCreate = validatePermission(
    pathname,
    "canCreate",
    permissions || []
  );
  return (
    <ValidatePermissions>
      <div>
        <div className="flex flex-row items-center justify-between my-4">
          <h2 className="font-semibold">Product Suite</h2>
          {/* <button className="bg-gray-800 text-white px-2 text-xs py-1 rounded">
            + &nbsp; Add Lead
          </button> */}
        </div>
        <div className="p-4 rounded-lg border-[1px] border-gray-300">
          <div className="grid grid-cols-3 gap-4">
            <div className="md:col-span-2 col-span-3 bg-gray-50 pb-4">
              <div className="flex flex-row items-center justify-between m-4">
                <div className="flex flex-row items-center">
                  <h2 className="font-semibold text-xl">All Products</h2>
                </div>
                {canCreate && (
                  <Link
                    href={"/products/create"}
                    className="bg-gray-800 text-white px-2 text-xs py-1 rounded"
                  >
                    + &nbsp; Add Products
                  </Link>
                )}
              </div>
              <div className="flex flex-col gap-4 px-4">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <ProductCardSkeleton key={idx} />
                    ))
                  : products?.map((product, idx) => (
                      <ProductCard key={idx} product={product} />
                    ))}
              </div>
            </div>
            <AddonsList />
          </div>
        </div>
      </div>
    </ValidatePermissions>
  );
}
