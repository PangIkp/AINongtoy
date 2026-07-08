/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useRouter } from "next/navigation";
import { useMainStore } from "@/mainstore";
import React, { useState, useEffect, useCallback } from "react";
import { Loader } from "lucide-react"; // เพิ่มการ import Loader
import { ArtToy } from "@/mainstore"; // ถ้า ArtToy มี type ให้ใช้
import useHydration from "../../../useHydration";
import { deleteArtToy } from "@/api/arttoyAPI";
import { getArtToyById } from "@/api/arttoyAPI";
import { API_V1_URL } from "@/api/baseUrl";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next"; // Import useTranslation
import "../../i18n"; // Import i18n

interface ConfigCardProps {
  onConfigCountChange: (count: number) => void; // Callback สำหรับส่งจำนวนข้อมูล
}

function ConfigCard({ onConfigCountChange }: ConfigCardProps) {
  const { t } = useTranslation(); // Initialize useTranslation
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
            title: t("Swal.configCard.error.title"), // ใช้การแปล
            text: t("Swal.configCard.error.notLoggedIn"), // ใช้การแปล
            timer: 1500,
            showConfirmButton: false,
          });
          setIsLoading(false); // ปิด loader หากไม่มี token
          return;
        }
        const response = await fetch(`${API_V1_URL}/arttoy`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(t("error.fetchFailed")); // ใช้การแปล
        }
        let data: ArtToy[] = await response.json(); // แปลง JSON เป็น array ของ ArtToy

        // ตรวจสอบว่า arttoy ตัวไหนไม่มี `_id` (ยังไม่ถูก save)
        data = data.map((toy) =>
          toy._id
            ? toy
            : {
              _id: "default-arttoy",
              name: t("defaultArtToy.name"), // ใช้การแปล
              size: t("defaultArtToy.size"), // ใช้การแปล
              material: t("defaultArtToy.material"), // ใช้การแปล
              painting: t("defaultArtToy.painting"), // ใช้การแปล
              assembly: t("defaultArtToy.assembly"), // ใช้การแปล
              quantity: 1,
              price: 500,
              imageUrl: "/Images/AINongtoy/WhiteMiku.png",
            }
        );

        setArtToys(data);

        // ส่งจำนวนข้อมูลกลับไปยัง Configuration
        onConfigCountChange(data.length);
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: t("Swal.configCard.error.title"), // ใช้การแปล
          text: error.message || t("Swal.configCard.error.fetchFailed"), // ใช้การแปล
          timer: 1500,
          showConfirmButton: false,
        });
      } finally {
        setIsLoading(false); // ปิด loader หลังโหลดข้อมูลเสร็จ
      }
    };

    fetchArtToys();
  }, [forceFetchData, onConfigCountChange, t]);

  const handleEdit = useCallback(
    async (artToy: ArtToy) => {
      if (!isClient) return;

      if (!artToy._id) {
        Swal.fire({
          icon: "error",
          title: t("error.title"), // ใช้การแปล
          text: t("error.invalidData"), // ใช้การแปล
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
            title: t("Swal.configCard.error.title"), // ใช้การแปล
            text: t("Swal.configCard.error.notLoggedIn"), // ใช้การแปล
            timer: 1500,
            showConfirmButton: false,
          });
          return;
        }

        const artToyData = await getArtToyById(artToy._id, token);

        if (!artToyData) {
          Swal.fire({
            icon: "error",
            title: t("Swal.configCard.error.title"), // ใช้การแปล
            text: t("Swal.configCard.error.fetchFailed"), // ใช้การแปล
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
        Swal.fire({
          icon: "error",
          title: t("Swal.configCard.error.title"), // ใช้การแปล
          text: error.message || t("Swal.configCard.error.fetchFailed"), // ใช้การแปล
          timer: 1500,
          showConfirmButton: false,
        });
      }
    },
    [router, isClient, setArtToyData, t]
  );

  const handleDelete = async (id: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: t("Swal.configCard.error.title"), // ใช้การแปล
        text: t("Swal.configCard.error.notLoggedIn"), // ใช้การแปล
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    if (!artToyData) {
      Swal.fire({
        icon: "error",
        title: t("Swal.configCard.error.title"), // ใช้การแปล
        text: t("Swal.configCard.error.invalidData"), // ใช้การแปล
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const response = await deleteArtToy(id, token);
      Swal.fire({
        icon: "success",
        title: t("Swal.configCard.success.title"), // ใช้การแปล
        text: t("Swal.configCard.success.deleted"), // ใช้การแปล
        timer: 1500,
        showConfirmButton: false,
      });
      setForceFetchData(!forceFetchData);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: t("Swal.configCard.error.title"), // ใช้การแปล
        text: error.message || t("Swal.configCard.error.deleteFailed"), // ใช้การแปล
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {isLoading ? ( // แสดง loader ระหว่างโหลดข้อมูล
        <div className="flex justify-center items-center col-span-3 min-h-[623px]">
          <Loader className="animate-spin text-[#0CACF3]" size={50} />
        </div>
      ) :
        artToys.length > 0 ? (
          artToys.map((artToy, index) => (
            <div
              key={index}
              className="relative bg-[#202133] shadow-lg rounded-lg p-4 cursor-pointer"
              onClick={() => handleEdit(artToy)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(artToy._id);
                }}
                className="z-10 absolute top-2 right-2 bg-[#51536D] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-500 hover:text-white transition duration-200"
              >
                ✕
              </button>

              {artToy.imageUrl && (
                <img
                  src={artToy.imageUrl}
                  alt={t("artToy.alt")} // ใช้การแปล
                  className="w-full h-auto object-cover rounded-md mb-4"
                />
              )}
              <h2 className="text-[18px] font-semibold mb-2">
                {artToy.name === "Unnamed Art Toy" ? t(`artToy.names.${artToy.name}`) : artToy.name}
              </h2>
              <div className="text-[13px] grid grid-cols-[1fr_1fr] gap-x-4 gap-y-2">
                <p>
                  <strong className="font-medium">{t("artToy.size")}:</strong> {t(`artToy.sizeOptions.${artToy.size}`)}
                </p>
                <p>
                  <strong className="font-medium">{t("artToy.painting")}:</strong> {t(`artToy.paintingOptions.${artToy.painting}`)}
                </p>
                <p>
                  <strong className="font-medium">{t("artToy.material")}:</strong> {t(`artToy.materialOptions.${artToy.material}`)}
                </p>
                <p>
                  <strong className="font-medium">{t("artToy.assembly")}:</strong> {t(`artToy.assemblyOptions.${artToy.assembly}`)}
                </p>
                <p>
                  <strong className="font-medium">{t("artToy.quantity")}:</strong> {artToy.quantity}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3 min-h-[623px]">
            {t("artToy.noItems")} {/* ใช้การแปล */}
          </p>
        )}
    </div>
  );
}

export default ConfigCard;
