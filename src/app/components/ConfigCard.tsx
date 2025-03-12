"use client";
import { useRouter } from "next/navigation";
import { useMainStore } from "@/mainstore";
import React, { useState, useEffect, useCallback } from "react";
import { ArtToy } from "@/mainstore"; // ถ้า ArtToy มี type ให้ใช้
import useHydration from "../../../useHydration";
import { deleteArtToy } from "@/api/arttoyAPI";

function ConfigCard() {
  const isHydrated = useHydration();
  const router = useRouter();
  const [artToys, setArtToys] = useState<ArtToy[]>([]); // ใช้ state เก็บข้อมูลจาก database
  const [isClient, setIsClient] = useState(false);
  const [forceFetchData, setForceFetchData] = useState(false);
  const { artToyData, setArtToyData, saveArtToy } = useMainStore();

  useEffect(() => {
    setIsClient(true);

    // ดึงข้อมูลจาก API
    const fetchArtToys = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not logged in.");
          return;
        }
        const response = await fetch("http://localhost:3001/api/v1/arttoy", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch ArtToys");
        }
        const data: ArtToy[] = await response.json(); // แปลง JSON เป็น array ของ ArtToy
        setArtToys(data); // บันทึกข้อมูลลง state
      } catch (error) {
        console.error("Error fetching ArtToys:", error);
      }
    };

    fetchArtToys();
  }, [forceFetchData]);

  const handleEdit = useCallback(
    (artToy: ArtToy) => {
      if (!isClient) return;
      router.push(
        `/material?name=${encodeURIComponent(
          artToy.name
        )}&image=${encodeURIComponent(artToy.imageUrl)}`
      );
    },
    [router, isClient]
  );

  const handleDelete = async (id: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in.");
      return;
    }

    if (!artToyData) {
      alert("Invalid ArtToy data");
      return;
    }

    try {
      const response = await deleteArtToy(id, token); // เรียก API ลบ
      console.log("API Response:", response);

      alert("ArtToy deleted successfully"); // แจ้งเตือนเมื่อลบสำเร็จ
      setForceFetchData(!forceFetchData); // อัปเดต state เพื่อดึงข้อมูลใหม่
      // setArtToys((prev) => prev.filter((item) => item !== artToyData)); // อัปเดต state
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete ArtToy"); // แจ้งเตือนหากเกิดข้อผิดพลาด
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {artToys.length > 0 ? (
        artToys.map((artToy, index) => (
          <div
            key={index}
            className="relative bg-[#202133] shadow-lg rounded-lg p-4 cursor-pointer"
            onClick={() => handleEdit(artToy)}
          >
            {/* ปุ่มลบ */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log("Clicked ArtToy ID:", artToy._id);
                handleDelete(artToy._id);
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
