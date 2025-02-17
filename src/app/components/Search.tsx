import { useState } from "react";

export default function Search() {
  return (
    <div className="w-full bg-[#202133] text-white px-10 py-6 shadow-md grid lg:grid-cols-[auto_auto_10%] sm:grid-cols-1 gap-4">
      {" "}
      {/* กล่อง 1 */}
      <div className="flex sm:flex-row flex-col items-start sm:items-center gap-2">
        <span className="font-semibold">Art toy Name</span>
        <input
          type="text"
          placeholder="Enter arttoy name"
          className="p-2 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
      </div>
      {/* กล่อง 2 */}
      <div className="flex sm:flex-row flex-col items-start sm:items-center gap-2">
        <span className="font-semibold">Keywords</span>
        <input
          type="text"
          placeholder="animal, blue and unique"
          className="p-2 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
      </div>
      {/* ปุ่ม Search */}
      <button className="flex justify-center p-2 h-10 text-[15px] transition">
        Search
      </button>
    </div>
  );
}
