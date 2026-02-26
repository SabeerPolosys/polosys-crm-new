// "use client";

// import ConvertInvoiceForm from "@/components/accounts/ConvertInvoiceForm";
// import { showToast } from "@/components/common/ShowToast";
// import { formatDateToDDMMYYYY } from "@/helpers/helperFunction";
// import api from "@/lib/axios";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import { FiBox, FiKey, FiPlusCircle } from "react-icons/fi";
// import { FiShoppingCart, FiEyeOff } from "react-icons/fi";
// import { IoMdArrowBack } from "react-icons/io";

// export default function ProductDetailsPage() {
//   const [purchaseDetails, setPurchaseDetails] = useState<any>(null);
//   const [purchaseProducts, setPurchaseProducts] = useState<any[]>([]);
//   const [otherProducts, setOtherProducts] = useState<any[]>([]);
//   const [addons, setAddons] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const params = useParams();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const getPurchaseProducts = async () => {
//       try {
//         setIsLoading(true);
//         const res = await api.get(
//           `/api/v1/purchase/PurchaseDetails/${params?.["purchase-id"]}`
//         );
//         if (res?.data?.success) {
//           const response = res?.data?.data;
//           setPurchaseProducts(response);
//         }
//       } catch {
//         showToast({
//           message: `Failed to fetch purchase products.`,
//           type: "error",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     const getPurchaDetails = async () => {
//       try {
//         setIsLoading(true);
//         const res = await api.get(
//           `/api/v1/purchase/${params?.["purchase-id"]}`
//         );
//         if (res?.data?.success) {
//           const response = res?.data?.data;
//           setPurchaseDetails(response);
//         }
//       } catch {
//         showToast({
//           message: `Failed to fetch purchase details.`,
//           type: "error",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     getPurchaseProducts();
//     getPurchaDetails();
//   }, []);
//   useEffect(() => {
//     setAddons(
//       purchaseProducts?.filter((product) => product?.productType === "Addon")
//     );
//     setOtherProducts(
//       purchaseProducts?.filter((product) => product?.productType !== "Addon")
//     );
//   }, [purchaseProducts]);
//   const handleClick = (type: string) => {
//     const params = new URLSearchParams(searchParams.toString());

//     if (type === "cancel") {
//       params.delete("is_convert");
//     } else {
//       params.set("is_convert", "true");
//     }

//     router.push(`?${params.toString()}`, { scroll: false });
//   };

//   return (
//     <div>
//       <div className="flex flex-row items-center justify-between my-4">
//         <h2 className="font-semibold">Purchase</h2>
//       </div>
//       <div className="p-4 rounded-lg border-[1px] border-gray-300 bg-gray-50">
//         <div className="bg-gray-100 p-6 rounded-xl m-4">
//           {/* Header */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//             <div className="flex items-center gap-3">
//               <div
//                 className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 cursor-pointer"
//                 onClick={() => router.back()}
//               >
//                 <IoMdArrowBack className="w-6 h-6" />
//               </div>
//               <h2 className="font-semibold text-gray-800 text-2xl">
//                 Purchase details
//               </h2>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//             <div>
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Purchase Date</p>
//                 <p className="text-base font-medium text-gray-800">
//                   {formatDateToDDMMYYYY(purchaseDetails?.purchaseDate)}
//                 </p>
//               </div>
//               <div className="mt-10">
//                 <p className="text-sm text-gray-500 mb-1">Customer</p>
//                 <p className="text-base font-medium text-gray-800">
//                   {purchaseDetails?.clientName}
//                 </p>
//               </div>
//               <div className="flex gap-6 items-center mt-10">
//             <p className="text-sm text-gray-500">Price</p>
//             <p className="text-xl font-semibold text-gray-800">
//               {purchaseDetails?.currencyCode} {purchaseDetails?.totalPrice}
//             </p>
//           </div>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Billing Address</p>
//               <address className="not-italic leading-relaxed">
//                 {purchaseDetails?.billingName && (
//                   <div>{purchaseDetails.billingName}</div>
//                 )}
//                 {purchaseDetails?.addressLine1 && (
//                   <div>{purchaseDetails.addressLine1}</div>
//                 )}
//                 {purchaseDetails?.addressLine2 && (
//                   <div>{purchaseDetails.addressLine2}</div>
//                 )}
//                 {(purchaseDetails?.city || purchaseDetails?.district) && (
//                   <div>
//                     {[purchaseDetails.city, purchaseDetails.district]
//                       .filter(Boolean)
//                       .join(", ")}
//                   </div>
//                 )}
//                 {(purchaseDetails?.region || purchaseDetails?.postalCode) && (
//                   <div>
//                     {[purchaseDetails.region, purchaseDetails.postalCode]
//                       .filter(Boolean)
//                       .join(" - ")}
//                   </div>
//                 )}
//               </address>
//             </div>
//             <div>
//               {(!searchParams?.get("is_convert") && purchaseDetails?.statusname === "Confirm") && (
//                 <button
//                   onClick={() => handleClick("add")}
//                   className="mt-4 md:mt-0 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition cursor-pointer"
//                 >
//                   Convert to Invoice
//                 </button>)}
             
//                 {(searchParams?.get("is_convert") && purchaseDetails?.statusname === "Confirm") && <ConvertInvoiceForm handleClick={handleClick} purchaseDetails={purchaseDetails}/>}
              
//             </div>
//           </div>

//         </div>
//         <div className="p-6">
//           <div className="flex items-center mb-6 gap-4">
//             <div className="p-2 bg-white rounded-full border border-gray-300">
//               <FiShoppingCart className="text-xl text-gray-700" />
//             </div>
//             <div>
//               <h2 className="text-lg font-bold text-gray-800">
//                 Purchased Items
//               </h2>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {otherProducts?.map((product) => {
//               if (product?.planCode) {
//                 return (
//                   <div
//                     key={product?.orderDetailsID}
//                     className="bg-gray-100 p-4 rounded-xl shadow-sm flex flex-col justify-between"
//                   >
//                     {/* Header */}
//                     <div>
//                       <div className="flex items-start gap-3 mb-4">
//                         <div className="p-2 bg-white rounded-full border border-gray-300">
//                           <FiBox className="text-xl text-gray-700" />
//                         </div>
//                         <div>
//                           <p className="text-lg font-semibold text-gray-800">
//                             {product?.productName}{" "}
//                             <span className="text-gray-500 font-normal">
//                               {product?.versionNumber}
//                             </span>
//                           </p>
//                           <p className="text-xs text-gray-500 mt-0.5">
//                             From: {formatDateToDDMMYYYY(product?.purchaseDate)}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Top Details */}
//                       <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
//                         <div>
//                           <p className="text-gray-500">Plan</p>
//                           <p className="font-medium">{product?.planName}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Plan Code</p>
//                           <p className="font-medium">{product?.planCode}</p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Bottom Detail */}
//                     <div className="pt-4 border-t border-gray-300 text-sm text-gray-700">
//                       <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
//                         <div>
//                           <p className="text-gray-500">Expiry Date</p>
//                           <p className="font-medium">
//                             {formatDateToDDMMYYYY(product?.expiryDate)}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Price</p>
//                           <p className="font-medium">
//                             {product?.currencyCode} {product?.itemPrice}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               } else if (product?.productType === "License") {
//                 return (
//                   <div
//                     key={product?.orderDetailsID}
//                     className="bg-gray-100 p-4 rounded-xl shadow-sm flex flex-col justify-between"
//                   >
//                     {/* Header */}
//                     <div>
//                       <div className="flex items-start gap-3 mb-4">
//                         <div className="p-2 bg-white rounded-full border border-gray-300">
//                           <FiKey className="text-xl text-gray-700" />
//                         </div>
//                         <div>
//                           <p className="text-lg font-semibold text-gray-800">
//                             License{" "}
//                             <span className="text-gray-500 font-normal">
//                               Information
//                             </span>
//                           </p>
//                           <p className="text-xs text-gray-500 mt-0.5">
//                             Start Date: Feb 22, 2024
//                           </p>
//                         </div>
//                       </div>

//                       {/* Top Details */}
//                       <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
//                         <div>
//                           <p className="text-gray-500">ID</p>
//                           <p className="font-medium">672542</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Start Date</p>
//                           <p className="font-medium">Feb 22, 2024</p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Bottom Detail */}
//                     <div className="pt-4 border-t border-gray-300 text-sm text-gray-700">
//                       <p className="text-gray-500">Expiry Date</p>
//                       <p className="font-medium">Feb 22, 2027</p>
//                     </div>
//                   </div>
//                 );
//               } else {
//                 return null;
//               }
//             })}

//             {/* Card 3 - Add-ons (unchanged) */}
//             {addons?.length > 0 && (
//               <div className="bg-gray-100 p-4 rounded-xl shadow-sm">
//                 <div className="flex items-start gap-3 mb-4">
//                   <div className="p-2 bg-white rounded-full border border-gray-300">
//                     <FiPlusCircle className="text-xl text-gray-700" />
//                   </div>
//                   <div>
//                     <p className="text-lg font-semibold text-gray-800">
//                       Add-ons{" "}
//                       <span className="text-gray-500 font-normal">
//                         Avaialble
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//                 <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
//                   {addons?.map((addon) => (
//                     <li key={addon?.orderDetailsID}>
//                       {addon?.name ?? "Addon"} - ( {addon?.currencyCode}{" "}
//                       {addon?.itemPrice} )
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import ConvertInvoiceForm from "@/components/accounts/ConvertInvoiceForm";
import { showToast } from "@/components/common/ShowToast";
import { formatDateToDDMMYYYY } from "@/helpers/helperFunction";
import api from "@/lib/axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FiBox, FiKey, FiPlusCircle } from "react-icons/fi";
import { FiShoppingCart, FiEyeOff } from "react-icons/fi";
import { IoMdArrowBack } from "react-icons/io";

export default function ProductDetailsPage() {
  const [purchaseDetails, setPurchaseDetails] = useState<any>(null);
  const [purchaseProducts, setPurchaseProducts] = useState<any>(null);
  const [otherProducts, setOtherProducts] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const getPurchaseProducts = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(
          `/api/v1/purchase/PurchaseDetails/${params?.["purchase-id"]}`
        );
        if (res?.data?.success) {
          const response = res?.data?.data;
          setPurchaseProducts(response?.[0]);
        }
      } catch {
        showToast({
          message: `Failed to fetch purchase products.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    const getPurchaDetails = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(
          `/api/v1/purchase/${params?.["purchase-id"]}`
        );
        if (res?.data?.success) {
          const response = res?.data?.data;
          setPurchaseDetails(response?.[0]);
        }
      } catch {
        showToast({
          message: `Failed to fetch purchase details.`,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getPurchaseProducts();
    getPurchaDetails();
  }, []);
  console.log("purchaseDetails", purchaseProducts)
  return (
  <div className="min-h-screen bg-gray-50 p-6">
  <div className="w-full mx-auto">

    <h1 className="text-2xl font-semibold mb-6">Product Details</h1>

    {purchaseProducts ? (
      <div className="bg-white rounded-xl shadow-sm p-6">

        {/* ---------- HEADER ---------- */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-lg bg-indigo-100 flex items-center justify-center">
              <FiBox className="text-indigo-600 text-xl" />
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                {purchaseProducts.productName}
              </p>

              <p className="text-sm text-gray-500">
                Product
              </p>

              <p className="text-xs text-gray-400">
                Purchased on:{" "}
                {formatDateToDDMMYYYY(purchaseProducts.purchaseDate)}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
            Registered
          </span>
        </div>

        {/* ---------- INFO GRID ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Plan</p>
            <p className="text-sm font-medium text-gray-900">
              {purchaseProducts.planName || "-"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Plan Code</p>
            <p className="text-sm font-medium text-gray-900">
              {purchaseProducts.planCode || "-"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Billing</p>
            <p className="text-sm font-medium text-indigo-600">
              Monthly
            </p>
          </div>
        </div>

        {/* ---------- FOOTER ---------- */}
        <div className="flex flex-col md:flex-row justify-between pt-4">

          <div>
            <p className="text-xs text-gray-500">Expiry Date</p>
            <p className="text-sm font-medium text-gray-900">
              {purchaseProducts.expiryDate
                ? formatDateToDDMMYYYY(purchaseProducts.expiryDate)
                : "—"}
            </p>

            <p className="text-xs text-green-600 mt-1">
              Active Subscription
            </p>
          </div>

          <div className="mt-3 md:mt-0">
            <p className="text-xs text-gray-500">Plan Price</p>
            <p className="text-lg font-semibold text-gray-900">
              {purchaseProducts.currencyCode}{" "}
              {purchaseProducts.planPrice}
            </p>
          </div>
        </div>

        {/* ---------- EDITION DETAILS ---------- */}
        <div className="mt-5 bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">
            Edition Details
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

            <div>
              <p className="text-xs text-gray-500">Product</p>
              <p className="font-medium text-gray-900">
                {purchaseProducts.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Quantity</p>
              <p className="font-medium text-gray-900">
                {purchaseProducts.quantity}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Item Price</p>
              <p className="font-medium text-gray-900">
                {purchaseProducts.currencyCode}{" "}
                {purchaseProducts.itemPrice}
              </p>
            </div>

          </div>
        </div>

      </div>
    ) : (
      <p className="text-gray-500">No product details found.</p>
    )}

  </div>
</div>
);
}
