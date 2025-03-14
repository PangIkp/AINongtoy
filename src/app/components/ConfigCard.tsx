"use client";
import { useRouter } from "next/navigation";
import { useMainStore } from "@/mainstore";
import React, { useState, useEffect, useCallback } from "react";
import { ArtToy } from "@/mainstore"; // ถ้า ArtToy มี type ให้ใช้
import useHydration from "../../../useHydration";
import { deleteArtToy } from "@/api/arttoyAPI";
import { getArtToyById } from "@/api/arttoyAPI";


function ConfigCard() {
  const isHydrated = useHydration();
  const router = useRouter();
  const [artToys, setArtToys] = useState<ArtToy[]>([]); // ใช้ state เก็บข้อมูลจาก database
  const [isClient, setIsClient] = useState(false);
  const [forceFetchData, setForceFetchData] = useState(false);
  const { artToyData, setArtToyData, saveArtToy } = useMainStore();

  useEffect(() => {
    setIsClient(true);
  
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
        let data: ArtToy[] = await response.json(); // แปลง JSON เป็น array ของ ArtToy
  
        // ✅ ตรวจสอบว่า arttoy ตัวไหนไม่มี `_id` (ยังไม่ถูก save)
        data = data.map((toy) =>
          toy._id
            ? toy // ถ้ามี _id ให้ใช้ค่าที่ได้จาก API
            : {
                _id: "default-arttoy",
                name: "Default ArtToy",
                size: "Small",
                material: "PLA",
                painting: "Hand-painting",
                assembly: "Fixed Pose",
                quantity: 1,
                price: 500,
                imageUrl: "/Images/AINongtoy/WhiteMiku.png",
              }
        );
  
        setArtToys(data);
      } catch (error) {
        console.error("Error fetching ArtToys:", error);
      }
    };
  
    fetchArtToys();
  }, [forceFetchData]);
  

  const handleEdit = useCallback(
    async (artToy: ArtToy) => {
      if (!isClient) return;
  
      console.log("Selected ArtToy:", artToy); // Log ค่า artToy เพื่อตรวจสอบ
  
      if (!artToy._id) {
        console.error("ArtToy object is missing '_id' property:", artToy);
        alert("Invalid ArtToy data");
        return;
      }
  
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not logged in.");
          return;
        }
  
        const artToyData = await getArtToyById(artToy._id, token); // ใช้ _id แทน id
        console.log("Fetched ArtToy Data:", artToyData);
  
        if (!artToyData) {
          alert("Failed to fetch ArtToy details");
          return;
        }
  
        setArtToyData(artToyData);
  
        router.push(
          `/material?name=${encodeURIComponent(
            artToyData.name
          )}&image=${encodeURIComponent(artToyData.imageUrl)}`
        );
      } catch (error) {
        console.error("Error fetching ArtToy details:", error);
        alert("Failed to load ArtToy details");
      }
    },
    [router, isClient, setArtToyData]
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
              className="absolute top-2 right-2 bg-[#51536D] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-500 hover:text-white transition duration-200"
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
