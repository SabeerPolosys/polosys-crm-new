

export default function PlanDetailsCard({plan}: {plan: any}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow transform hover:-translate-y-1">
    <div className="bg-[#727582] text-white p-4">
      <h2 className="text-lg font-bold">{plan?.eName}</h2>
    </div>

    <div className="p-6 space-y-3">
      <p><span className="font-semibold text-gray-700">Plan Code:</span> {plan?.code}</p>
      <p><span className="font-semibold text-gray-700">Plan Name:</span> {plan?.planName}</p>
      {
        plan?.offerPrice < plan?.planPrice ? 
        <>
        <p><span className="font-semibold text-gray-700">Standard Price:</span> <span className="line-through text-gray-400 font-2xl">{plan?.planPrice}</span></p>
      <p><span className="font-semibold text-gray-700">Offer Price:</span> <span className="text-gray-800 font-extrabold text-3xl">{plan?.offerPrice}</span></p>
        </> :
      <p><span className="font-semibold text-gray-700">Price:</span> <span className="text-gray-800 font-extrabold text-3xl">{plan?.planPrice}</span></p>
      }
      <p className="w-full text-blue-600 text-center border-2 font-semibold py-2 rounded-lg mt-4 transition-colors">
        {plan?.billingCycle}
      </p>
    </div>
    </div>
  )
}
