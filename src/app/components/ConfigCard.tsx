"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { ArtToy, useMainStore } from "@/mainstore";
import useHydration from "../../../useHydration";

function ConfigCard() {
  const isHydrated = useHydration();
  const { savedArtToys, removeArtToy,setArtToyData } = useMainStore(); // ดึง removeArtToy มาใช้
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // ✅ กำหนด state เมื่อคอมโพเนนต์โหลดแล้ว
  }, []);

const handleEdit = useCallback((artToy: ArtToy) => {
  if (!isClient) return;
  setArtToyData(artToy); // ✅ กำหนดค่าก่อนพาไปแก้ไข
  router.push(`/material?name=${encodeURIComponent(artToy.name)}&image=${encodeURIComponent(artToy.imageUrl)}`);
}, [router, isClient]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedArtToys?.length > 0 ? (
        savedArtToys.map((artToy, index) => (
          <div
            key={index}
            className="relative bg-[#202133] shadow-lg rounded-lg p-4 cursor-pointer"
            onClick={() => handleEdit(artToy)}
          >
            {/* ปุ่มลบ */}
            <button
             onClick={(e) => {
                e.stopPropagation(); // ป้องกัน event ซ้อนกัน
                removeArtToy(index);
              }}
              className="absolute top-2 right-2 bg-[#51536D] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm 
             hover:bg-red-500 hover:text-white transition duration-200"
            >
              ✕
            </button>

            {artToy.imageUrl && (
              <img
                src={artToy.imageUrl}
                alt="Art Toy"
                className="w-full h-auto object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-[18px] font-semibold mb-2">{artToy.name}</h2>
            <div className="text-[13px] grid grid-cols-[1fr_2fr] gap-x-4 gap-y-2">
              <p>
                <strong className="font-medium">Size :</strong> {artToy.size}
              </p>
              <p>
                <strong className="font-medium">Painting :</strong>{" "}
                {artToy.painting}
              </p>
              <p>
                <strong className="font-medium">Material :</strong>{" "}
                {artToy.material}
              </p>
              <p>
                <strong className="font-medium">Assembly :</strong>{" "}
                {artToy.assembly}
              </p>
              <p>
                <strong className="font-medium">Quantity :</strong>{" "}
                {artToy.quantity}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-3">
          There are no recorded items.
        </p>
      )}
    </div>
  );
}

export default ConfigCard;
