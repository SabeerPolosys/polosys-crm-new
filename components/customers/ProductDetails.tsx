export default function ProductDetails() {
  const subscriptions = [
    {
      product: "Books",
      version: "Books Gcc",
      purchaseDate: "2025-08-03",
      lastRenewed: "2025-08-03",
      expiryDate: "2025-09-02",
      plan: "Ultimate",
      status: "Active",
      price: 1500,
      currency: "₹",
      customer: "Rahul",
      autoRenew: false,
    },
    {
      product: "Books",
      version: "Books Gcc",
      purchaseDate: "2025-07-15",
      lastRenewed: "2025-07-15",
      expiryDate: "2025-08-14",
      plan: "Ultimate",
      status: "Expired",
      price: 1450,
      currency: "₹",
      customer: "Ayesha",
      autoRenew: true,
    },
    // Add more as needed...
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Product Subscriptions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            {/* Header */}
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{item.product}</h3>
                <p className="text-sm text-gray-500">{item.version}</p>
              </div>

              {/* Status Badge */}
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  item.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {item.status}
              </span>
            </div>

            {/* Details */}
            <div className="mt-4 space-y-1 text-sm text-gray-700">
              <p><span className="font-medium">Purchase Date:</span> {item.purchaseDate}</p>
              <p><span className="font-medium">Last Renewed:</span> {item.lastRenewed}</p>
              <p><span className="font-medium">Expiry Date:</span> {item.expiryDate}</p>
              <p><span className="font-medium">Plan:</span> {item.plan}</p>
              <p><span className="font-medium">Price:</span> {item.currency} {item.price}</p>
              <p><span className="font-medium">Customer:</span> {item.customer}</p>
              <p><span className="font-medium">Auto Renew:</span> {item.autoRenew ? "Yes" : "No"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
