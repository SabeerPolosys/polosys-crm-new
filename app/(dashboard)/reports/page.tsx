"use client";

import {
  FaUsers,
  FaEye,
  FaChartLine,
  FaRupeeSign
} from "react-icons/fa";
import { HiFlag } from "react-icons/hi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";
import { IoSettingsOutline } from "react-icons/io5";

export default function Reports() {
  const metrics = [
    {
      title: "Total customers",
      value: "1,868",
      change: "+12%",
      icon: <FaUsers />,
    },
    {
      title: "Visitors",
      value: "21,088",
      change: "-8%",
      icon: <FaEye />,
    },
    {
      title: "Conversion",
      value: "9,986,712",
      change: "+9.3%",
      icon: <FaChartLine />,
    },
    {
      title: "Total Rate",
      value: "178%",
      change: "+55%",
      icon: <FaRupeeSign />,
    },
  ];

  const demographics = [
    { country: "India", value: 90 },
    { country: "Lebanon", value: 75 },
    { country: "Oman", value: 45 },
    { country: "Qatar", value: 35 },
    { country: "Libya", value: 15 },
  ];
  return (
    <div>
      <h2 className="font-semibold mb-4">Reports & Analytics</h2>
      <div className="border-[1px] border-gray-300 rounded-lg">
        <div className="rounded-lg p-4 bg-gray-50">
          <main className="bg-gray-50 min-h-screen">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-xl shadow border-[1px] border-gray-400 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start">
                    {/* Left Section */}
                    <div className="flex flex-col gap-3">
                      <h4 className="text-gray-600 text-sm font-medium">
                        {metric.title}
                      </h4>
                      <p className="text-2xl font-semibold">{metric.value}</p>
                      <p
                        className={`text-sm ${
                          metric.change.startsWith("+")
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {metric.change} vs last month
                      </p>
                    </div>

                    {/* Right Section with Top & Bottom Icons */}
                    <div className="flex flex-col justify-between items-end h-full min-h-[80px] ml-4">
                      {/* Top Icon */}
                      <div>
                        <HiOutlineDotsVertical />
                      </div>

                      {/* Bottom Icon */}
                      <div className="text-gray-400 text-xl">{metric.icon}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map & Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map Section */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow border-[1px] border-gray-400 p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-row gap-4 items-center">
                    <h3 className="text-lg font-semibold">
                      Target Demographics
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-lg inline-flex items-center gap-1">
                      <span className="w-2 h-2 bg-black rounded-full"></span>
                      Beta
                    </span>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <SlCalender />
                    <IoSettingsOutline />
                    <button className="bg-gray-800 rounded px-2 py-1 text-xs text-white">
                      + &nbsp; Add User
                    </button>
                  </div>
                </div>
                {/* Placeholder Map */}
                <div className="w-full h-86 bg-gray-100 rounded-lg relative overflow-hidden">
                  {/* World Map */}
                  <div className="w-full h-full">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d42567152.372097865!2d45!3d23.5!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e578e09c95aef97%3A0x1bfcfcb5a4a0b317!2sGulf%20Cooperation%20Council!5e0!3m2!1sen!2s!4v1695065080894!5m2!1sen!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                    ></iframe>
                  </div>

                  {/* Region Filters - overlay at bottom */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 px-4 py-2 rounded-full shadow flex gap-4 text-sm text-gray-600 backdrop-blur-md">
                    {/* <span className="px-2 py-1 bg-gray-200 rounded-full">
                      Europe
                    </span> */}
                    <span className="px-2 py-1 bg-gray-200 rounded-full inline-flex items-center gap-1 text-sm text-gray-800">
                      <span className="w-2 h-2 bg-black rounded-full"></span>
                      Europe
                    </span>
                    <span className="px-2 py-1 bg-gray-200 rounded-full inline-flex items-center gap-1 text-sm text-gray-800">
                      <span className="w-2 h-2 bg-black rounded-full"></span>
                      Asia
                    </span>
                    <span className="px-2 py-1 bg-gray-200 rounded-full inline-flex items-center gap-1 text-sm text-gray-800">
                      <span className="w-2 h-2 bg-black rounded-full"></span>
                      Africa
                    </span>
                    <span className="px-2 py-1 bg-gray-200 rounded-full inline-flex items-center gap-1 text-sm text-gray-800">
                      <span className="w-2 h-2 bg-black rounded-full"></span>
                      America
                    </span>
                  </div>
                </div>
              </div>

              {/* Demographic Stats */}
              <div className="bg-white rounded-xl shadow border-[1px] border-gray-400 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-4xl font-bold">99,3K</h2>
                  <p className="text-lg text-gray-500 mb-4">
                    Global customers worldwide
                  </p>

                  {demographics.map((demo, idx) => (
                    <div
                      key={idx}
                      className="flex w-full items-start gap-3 mb-4"
                    >
                      {/* Flag Icon */}
                      <div className="mt-1 text-gray-700 border-[1px] rounded-full p-2">
                        <HiFlag />
                      </div>

                      {/* Progress Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-700">
                            {demo.country}
                          </span>
                          <span className="text-sm font-medium">
                            {demo.value}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-gray-700 rounded-full"
                            style={{ width: `${demo.value}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-blue-500 cursor-pointer hover:underline">
                  See all Demographics →
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
