"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  Search,
  ArrowUp,
  ArrowDown,
  Filter,
  Ellipsis,
  Eye,
  Edit,
  Trash,
  Plus,
} from "lucide-react";

const orders = Array(8).fill({
  orderId: "67ce8829cb353540c2634df0",
  createdAt: "2025-03-20 11:43:01",
  customer: "Somchai Jaidee",
  name: "The dragon",
  qty: 3,
  total: "2,500",
  // arttoy: "https://pol...",
  // confirmation: "https://pol...",
  payment: "Unpaid",
  status: "Pending",
});

export default function OrderDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNewest, setIsNewest] = useState(true);
  const [isPaid, setIsPaid] = useState(true);
  const [isAll, setIsAll] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const orderStatusList = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
  ];

  const [selectedIndex, setSelectedIndex] = useState(null); // menu of order

  const toggleSort = () => {
    setIsNewest(!isNewest);
  };

  const togglePaymentStatus = () => {
    if (isAll) {
      setIsAll(false); // ถ้าเป็น "All" เปลี่ยนเป็น "Paid" หรือ "Unpaid"
    } else {
      setIsPaid(!isPaid); // สลับสถานะ "Paid" หรือ "Unpaid"
    }
  };

  const handleMenuClick = (index: any) => {
    setSelectedIndex(selectedIndex === index ? null : index); // Toggle the menu for each row
  };

  return (
    <div className="text-white bg-[#212121] flex">
      {/* Pass isCollapsed and setIsCollapsed to Sidebar */}
      <Sidebar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />

      {/* Content area with dynamic margin-left */}
      <div
        className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-[130px]"
        }`}
      >
        <h1 className="text-3xl font-bold mb-4">Orders</h1>

        <div className="grid grid-cols-5 gap-4 mb-8">
          <Card title="Total orders" value="120" />
          <Card title="Total order amount" value="120,000 ฿" />
          <Card title="Avg. order value" value="1,000 ฿" />
          <Card title="Order quantity" value="24" />
          <Card title="Returns" value="0" />
        </div>

        <div className="mb-8 flex gap-2 items-center">
          <div className="relative flex-1 max-w-[400px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Find order..."
              className="p-2 pl-10 bg-[#2F2F2F] rounded-md w-full border border-[#5B5B5B] text-white focus:outline-none mb-1"
            />
          </div>

          <button
            onClick={toggleSort}
            className="border border-[#5B5B5B] bg-[#212121] text-[14px] font-medium flex items-center gap-2 py-2 rounded-md hover:bg-[#2F2F2F]"
          >
            {isNewest ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            {isNewest ? "Newest" : "Oldest"}
          </button>

          <button
            onClick={togglePaymentStatus}
            className="border border-[#5B5B5B] bg-[#212121] text-[14px] font-medium py-2 rounded-md hover:bg-[#2F2F2F] h-full flex items-center gap-2 px-4"
          >
            <Filter size={16} className="text-gray-400" />
            {isAll ? "All" : isPaid ? "Paid" : "Unpaid"}{" "}
            {/* แสดง All, Paid, Unpaid */}
          </button>

          <select
            className="border border-[#5B5B5B] bg-[#212121] w-[140px] text-[14px] font-medium rounded-md hover:bg-[#2F2F2F] text-white mb-1"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {orderStatusList.map((status) => (
              <option
                key={status}
                value={status}
                className="bg-[#212121] text-white"
              >
                {status}
              </option>
            ))}
          </select>

          <button className="ml-auto text-white text-[14px] py-2 px-2">
            <Plus size={18} className="inline-block mr-1" /> 
            Create order
          </button>
        </div>

        <div className="rounded-lg overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700 text-[#B8B8B8]">
                {[
                  "Order ID",
                  "Created at",
                  "Customer",
                  "Name",
                  "Qty",
                  "Total",
                  // "Arttoy",
                  // "Confirmation",
                  "Payment",
                  "Status",
                  "  ",
                ].map((header) => (
                  <th key={header} className="p-2 text-sm font-medium">
                    {header === "" ? (
                      <span className="inline-block text-xl cursor-pointer">
                        {/* Use the ArrowDown icon from lucide-react */}
                      </span>
                    ) : (
                      header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b border-gray-700 text-sm">
                  {Object.values(order).map((value, idx) => (
                    <td key={idx} className="p-2">
                      {String(value)}
                    </td>
                  ))}

                  <td className="p-2 text-center">
                    <Ellipsis
                      className="w-5 cursor-pointer"
                      onClick={() => handleMenuClick(index)} // Toggle menu on click
                    />
                    {/* Show menu only for the selected row */}
                    {selectedIndex === index && (
                      <div className="absolute bg-[#2F2F2F] border border-[#5B5B5B] rounded-lg shadow-lg p-2 w-10">
                        <ul className="flex flex-col items-center justify-center">
                          <li className="cursor-pointer p-1 text-[12px] hover:bg-[#525152] flex justify-center items-center">
                            <Eye className="inline-block w-4 h-4" />
                          </li>
                          <li className="cursor-pointer p-1 text-[12px] hover:bg-[#525152] flex justify-center items-center">
                            <Edit className="inline-block w-4 h-4" />
                          </li>
                          <li className="cursor-pointer p-1 text-[12px] hover:bg-[#525152] flex justify-center items-center">
                            <Trash className="inline-block w-4 h-4 text-red-500" />
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-[#2F2F2F] rounded-lg w-full">
      <div className="bg-[#0AACF0] h-1 rounded-t-lg"></div> {/* Blue bar */}
      <div className="p-4">
        <p className="text-sm text-[#B8B8B8]">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
