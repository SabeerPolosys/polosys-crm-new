import ProductCard from "@/components/product/ProductCard";

export default function page() {
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
  const products = [
    {
      id: 1,
      title: "Polosys ERP",
      label: "Licensed product",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    },
    {
      id: 2,
      title: "EazyBiz",
      label: "Licensed product",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    },
    {
      id: 3,
      title: "Books",
      label: "Subscription product",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    },
  ];
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
              <h2 className="font-semibold text-xl">Easybiz</h2>
            </div>
            <div className="bg-white m-4 p-6 min-h-screen">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>
              <h3 className="my-6 text-xl font-semibold">
                Version of products
              </h3>
              <div className="flex felx-row gap-4 flex-wrap justify-self-auto">
                <div className="px-12 py-2 border-1 rounded-lg border-gray-200 bg-white font-medium">
                  EasyBiz Neo Soft Bill
                </div>
                <div className="px-12 py-2 border-1 rounded-lg border-gray-200 bg-white font-medium">
                  EasyBiz Neo Gold ite
                </div>
                <div className="px-12 py-2 border-1 rounded-lg border-gray-200 bg-white font-medium">
                  EasyBiz Neo Silver
                </div>
                <div className="px-12 py-2 border-1 rounded-lg border-gray-200 bg-white font-medium">
                  EasyBiz Neo Gold
                </div>
                <div className="px-12 py-2 border-1 rounded-lg border-gray-200 bg-white font-medium">
                  EasyBiz Neo Platinum
                </div>
              </div>
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
