import DynamicTableType2 from "../table/DynamicTableType2";


export default function Purchase() {
    const columns = [
    { header: "Product Name", accessor: "productName" },
    { header: "Purchase Date", accessor: "purchaseDate" },
    { header: "price", accessor: "price" },
  ];

  const data = [
  {
    productName: "Pro Plan Subscription",
    purchaseDate: "2025-08-01",
    price: 1200,
  },
  {
    productName: "Design Toolkit Add-on",
    purchaseDate: "2025-08-03",
    price: 250,
  },
  {
    productName: "Team Collaboration Suite",
    purchaseDate: "2025-08-10",
    price: 800,
  },
  {
    productName: "AI Assistant Integration",
    purchaseDate: "2025-08-15",
    price: 300,
  },
  {
    productName: "Custom Reports Module",
    purchaseDate: "2025-08-20",
    price: 600,
  },
];

  return (
    <div>
        <h2 className="font-semibold pt-4 pl-6">Purchase History</h2>
      <DynamicTableType2 columns={columns} data={data} />
    </div>
  )
}
