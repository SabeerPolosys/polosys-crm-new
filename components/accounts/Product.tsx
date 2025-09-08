import { BsBox } from "react-icons/bs";

export default function Product() {
  return (
    <div className="p-4">
      <h2 className="font-semibold mb-2">Current Active Products</h2>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-1 bg-gray-50">
          <div className="flex flex-row gap-4 p-2">
            <div className="w-12 h-12 rounded-full border-[1px] flex items-center justify-center">
              <BsBox className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">Product F</p>
              <p className="text-sm">
                <span className="text-gray-500">Start Date</span> 31/09/2023
              </p>
              <p className="text-sm mt-1">
                <span className="text-gray-500">Expiry Date</span> 31/09/2025
              </p>
            </div>
          </div>
          <hr className="border-t-1/4 border-gray-400 w-full" />
          <div className="p-1 flex flex-row justify-between text-sm">
            <p>Active</p>
            <button className="px-2 bg-gray-800 rounded text-white py-1">
              Renew
            </button>
          </div>
        </div>
        <div className="col-span-1 bg-gray-50">
          <div className="flex flex-row gap-4 p-2">
            <div className="w-12 h-12 rounded-full border-[1px] flex items-center justify-center">
              <BsBox className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">Product G</p>
              <p className="text-sm">
                <span className="text-gray-500">Start Date</span> 31/09/2023
              </p>
              <p className="text-sm mt-1">
                <span className="text-gray-500">Expiry Date</span> 31/09/2025
              </p>
            </div>
          </div>
          <hr className="border-t-1/4 border-gray-400 w-full" />
          <div className="p-1 flex flex-row justify-between text-sm">
            <p>Active</p>
            <button className="px-2 bg-gray-800 rounded text-white py-1">
              Renew
            </button>
          </div>
        </div>
        <div className="col-span-1 bg-gray-50">
          <div className="flex flex-row gap-4 p-2">
            <div className="w-12 h-12 rounded-full border-[1px] flex items-center justify-center">
              <BsBox className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">Product H</p>
              <p className="text-sm">
                <span className="text-gray-500">Start Date</span> 31/09/2023
              </p>
              <p className="text-sm mt-1">
                <span className="text-gray-500">Expiry Date</span> 31/09/2025
              </p>
            </div>
          </div>
          <hr className="border-t-1/4 border-gray-400 w-full" />
          <div className="p-1 flex flex-row justify-between text-sm">
            <p>Active</p>
            <button className="px-2 bg-gray-800 rounded text-white py-1">
              Renew
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
