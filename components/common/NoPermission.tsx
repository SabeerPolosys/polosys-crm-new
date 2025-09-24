"use client";

// import Image from "next/image";
import Lottie from "lottie-react";
import animationData from "../../public/json-images/lock_data.json";
import { useRouter } from "next/navigation";

export default function NoPermission() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center max-w-md w-full">
        {/* Animation */}
        <div className="w-[300px] h-[300px]">
          <Lottie animationData={animationData} loop={true} />
        </div>

        {/* Title */}
        <h2 className="mt-6 text-2xl font-bold text-gray-800">
          Access Denied
        </h2>

        {/* Subtitle */}
        <p className="mt-3 text-gray-600">
          You don’t have permission to view this page.
        </p>

        {/* Call to Action */}
        <button
          onClick={() => router.back()}
          className="mt-6 bg-gray-800 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-900 transition cursor-pointer"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
