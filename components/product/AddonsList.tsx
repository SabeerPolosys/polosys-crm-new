import Link from "next/link";

export default function AddonsList({ addOnsList }: { addOnsList: string[] }) {
  return (
    <div className="col-span-1 bg-gray-50">
      <div className="flex flex-row items-center justify-between m-4">
        <h2 className="font-semibold text-xl">Add-ons</h2>
        <Link href={`/products/addons/create`} className="bg-gray-800 text-white px-2 text-xs py-1 rounded">
          + &nbsp; Add Add-ons
        </Link>
      </div>
      <div className="flex flex-col gap-2 px-6">
        {addOnsList?.map((ons:string, idx:number) => {
          return (
            <div
              key={idx}
              className="p-2 border-1 rounded-lg border-gray-200 bg-white font-medium text-sm"
            >
              {ons}
            </div>
          );
        })}
      </div>
    </div>
  );
}
