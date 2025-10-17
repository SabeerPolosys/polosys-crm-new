"use client";
import { Addons } from "@/types/auth";

export default function VersionAvailableAddons({addOns}:{addOns: Addons[]|undefined}) {
  
  return (
      <div className="md:col-span-1 col-span-3 bg-gray-50">
        <div className="flex flex-row items-center justify-between m-4">
          <h2 className="font-semibold text-xl">Available Add-ons</h2>
        </div>
        <div className="flex flex-col gap-2 px-3">
          {addOns?.map((adOn, idx: number) => {
            return (
              <div className="flex flex-row justify-between w-full relative p-2 border-1 rounded-lg border-gray-200 bg-white font-medium text-sm" key={idx}>
                <div
                >
                  {adOn?.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
  );
}
