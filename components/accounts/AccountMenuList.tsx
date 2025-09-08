"use client";
import { useState } from "react";
import Purchase from "./Purchase";
import Product from "./Product";
import Addons from "./Addons";

export default function AccountMenuList() {
  const [selectedMenu, setSelectedMenu] = useState("overview");

  const menuItems = ["overview", "purchase", "products", "add-ons", "invoices"];

  return (
    <div className="my-6">
      <ul className="flex flex-row items-center justify-between font-semibold text-xs border-b border-gray-200">
        {menuItems.map((item) => (
          <li
            key={item}
            onClick={() => setSelectedMenu(item)}
            className={`cursor-pointer capitalize px-2 pb-2 transition-all ${
              selectedMenu === item
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {item.replace("-", " ")}
          </li>
        ))}
      </ul>
      <div className="bg-white min-h-full min-w-full">
        {selectedMenu === "purchase" && <Purchase/>}
        {selectedMenu === "products" && <Product/>}
        {selectedMenu === "add-ons" && <Addons/>}
      </div>
    </div>
  );
}
