import OverviewCard from "@/components/dashboard/OverviewCard";
import ValidatePermissions from "@/components/permissions/ValidatePermissions";
import { GoBell } from "react-icons/go";

export default function Dashboard() {
  return (
    <ValidatePermissions>
      <div className="min-h-screen p-6 text-sm text-gray-800">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Overview</h1>
          <div className="flex flex-row items-center gap-4">
            <div className="p-2 border-[1px] border-gray-400 rounded">
              <GoBell className="w-4 h-4" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search anything"
                className="pl-10 pr-4 py-2 border-[1px] border-gray-400 rounded-lg text-sm focus:outline-none"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
        </header>

        <div className="p-4 border-[1px] rounded-lg border-gray-400 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">All Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <section className="col-span-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <OverviewCard title="Total customers" value="1,324" />
              <OverviewCard title="Active subscriptions" value="876" />
              <OverviewCard title="MRR" value="₹ 30,892" />
              <OverviewCard title="Open deals" value="30" />
            </section>
            <div className="col-span-1 bg-white rounded-lg shadow p-4 border border-gray-200 h-64">
              {/* Replace with a chart component */}
              <h2 className="text-sm font-semibold mb-2">Lead level</h2>
              <div className="h-30 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                Chart Placeholder
              </div>
            </div>
          </div>

          {/* Middle section */}
          <section className="grid grid-cols-1 md:grid-cols-7 gap-4 mt-6">
            <div className="col-span-1 md:col-span-4 bg-white rounded-lg shadow p-4 border border-gray-200">
              <h2 className="text-sm font-semibold mb-2">Customer lifecycle</h2>
              <div className="flex items-center justify-center h-60 text-gray-400">
                Chart Placeholder
              </div>
            </div>
            <div className="col-span-1 md:col-span-3 bg-white rounded-lg shadow p-4 border border-gray-200">
              <h2 className="text-sm font-semibold mb-2">Deals</h2>
              <div className="flex items-center justify-center h-60 text-gray-400">
                Chart Placeholder
              </div>
            </div>
          </section>

          {/* Bottom section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <h2 className="text-sm font-semibold mb-2">New subscriptions</h2>
              <p className="text-2xl font-bold mb-2">₹ 12,113</p>
              <div className="text-sm">
                <p>
                  MRR <span className="float-right">+42.00</span>
                </p>
                <p>
                  Expans <span className="float-right">+18.00</span>
                </p>
                <p>
                  Churn <span className="float-right">₹ 800</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <h2 className="text-sm font-semibold mb-2">
                Projected collection
              </h2>
              <p className="text-2xl font-bold mb-2">₹ 5,983</p>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Upcoming</span>
                  <span>₹ 23.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Due today</span>
                  <span>₹ 12.00</span>
                </div>
                <div className="flex justify-between font-medium text-red-600">
                  <span>Overdue</span>
                  <span>₹ 30.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Due later</span>
                  <span>₹ 21.00</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ValidatePermissions>
  );
}
