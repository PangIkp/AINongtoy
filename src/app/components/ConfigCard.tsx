"use client";
import { useRouter } from "next/navigation";
import { useMainStore } from "@/mainstore";
import React, { useState, useEffect, useCallback } from "react";
import { Loader } from "lucide-react"; // เพิ่มการ import Loader
import { ArtToy } from "@/mainstore"; // ถ้า ArtToy มี type ให้ใช้
import useHydration from "../../../useHydration";
import { deleteArtToy } from "@/api/arttoyAPI";
import { getArtToyById } from "@/api/arttoyAPI";
import Swal from "sweetalert2";

interface ConfigCardProps {
  onConfigCountChange: (count: number) => void; // Callback สำหรับส่งจำนวนข้อมูล
}

function ConfigCard({ onConfigCountChange }: ConfigCardProps) {
  const isHydrated = useHydration();
  const router = useRouter();
  const [artToys, setArtToys] = useState<ArtToy[]>([]); // ใช้ state เก็บข้อมูลจาก database
  const [isLoading, setIsLoading] = useState<boolean>(true); // เพิ่ม state สำหรับ loader
  const [isClient, setIsClient] = useState(false);
  const [forceFetchData, setForceFetchData] = useState(false);
  const { artToyData, setArtToyData, saveArtToy } = useMainStore();

  useEffect(() => {
    setIsClient(true);

    const fetchArtToys = async () => {
      try {
        setIsLoading(true); // เปิด loader ก่อนเริ่มโหลดข้อมูล
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "You are not logged in.",
            timer: 1500,
            showConfirmButton: false,
          });
          setIsLoading(false); // ปิด loader หากไม่มี token
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

        // ตรวจสอบว่า arttoy ตัวไหนไม่มี `_id` (ยังไม่ถูก save)
        data = data.map((toy) =>
          toy._id
            ? toy
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

        // ส่งจำนวนข้อมูลกลับไปยัง Configuration
        onConfigCountChange(data.length);
      } catch (error: any) {
        console.error("Error fetching ArtToys:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to fetch ArtToys",
          timer: 1500,
          showConfirmButton: false,
        });
      } finally {
        setIsLoading(false); // ปิด loader หลังโหลดข้อมูลเสร็จ
      }
    };

    fetchArtToys();
  }, [forceFetchData, onConfigCountChange]);

  const handleEdit = useCallback(
    async (artToy: ArtToy) => {
      if (!isClient) return;

      console.log("Selected ArtToy:", artToy);

      if (!artToy._id) {
        console.error("ArtToy object is missing '_id' property:", artToy);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid ArtToy data",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "You are not logged in.",
            timer: 1500,
            showConfirmButton: false,
          });
          return;
        }

        const artToyData = await getArtToyById(artToy._id, token);
        console.log("Fetched ArtToy Data:", artToyData);

        if (!artToyData) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to fetch ArtToy details",
            timer: 1500,
            showConfirmButton: false,
          });
          return;
        }

        setArtToyData(artToyData);

        router.push(
          `/material?name=${encodeURIComponent(
            artToyData.name
          )}&image=${encodeURIComponent(artToyData.imageUrl)}`
        );
      } catch (error: any) {
        console.error("Error fetching ArtToy details:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to load ArtToy details",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    },
    [router, isClient, setArtToyData]
  );

  const handleDelete = async (id: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "You are not logged in.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    if (!artToyData) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid ArtToy data",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const response = await deleteArtToy(id, token);
      console.log("API Response:", response);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "ArtToy deleted successfully",
        timer: 1500,
        showConfirmButton: false,
      });
      setForceFetchData(!forceFetchData);
    } catch (error: any) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to delete ArtToy",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {isLoading ? ( // แสดง loader ระหว่างโหลดข้อมูล
        <div className="flex justify-center items-center col-span-3 min-h-[470px]">
          <Loader className="animate-spin text-[#0CACF3]" size={50} />
        </div>
      ) : artToys.length > 0 ? (
        artToys.map((artToy, index) => (
          <div
            key={index}
            className="relative bg-[#202133] shadow-lg rounded-lg p-4 cursor-pointer"
            onClick={() => handleEdit(artToy)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log("Clicked ArtToy ID:", artToy._id);
                handleDelete(artToy._id);
              }}
              className="z-10 absolute top-2 right-2 bg-[#51536D] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-500 hover:text-white transition duration-200"
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