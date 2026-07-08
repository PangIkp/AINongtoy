/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useRouter } from "next/navigation";
import { useMainStore } from "@/mainstore";
import React, { useState, useEffect, useCallback } from "react";
import { ArrowUpRight, Boxes, Loader, Palette, Ruler, Trash2 } from "lucide-react";
import { ArtToy } from "@/mainstore"; // ถ้า ArtToy มี type ให้ใช้
import useHydration from "../../../useHydration";
import { deleteArtToy } from "@/api/arttoyAPI";
import { getArtToyById } from "@/api/arttoyAPI";
import { API_V1_URL } from "@/api/baseUrl";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next"; // Import useTranslation
import "../../i18n"; // Import i18n
import Pagination from "./Pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const { artToyData, setArtToyData, saveArtToy } = useMainStore();
  const itemsPerPage = 6;

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
        setCurrentPage(1);

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

  const getDisplayName = (artToy: ArtToy) =>
    artToy.name === "Unnamed Art Toy" ? t(`artToy.names.${artToy.name}`) : artToy.name;

  const totalPages = Math.ceil(artToys.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = artToys.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {isLoading ? ( // แสดง loader ระหว่างโหลดข้อมูล
        <div className="flex justify-center items-center col-span-3 min-h-[623px]">
          <Loader className="animate-spin text-[#0CACF3]" size={50} />
        </div>
      ) :
        artToys.length > 0 ? (
          currentItems.map((artToy, index) => (
            <div
              key={artToy._id || index}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.94),rgba(11,18,40,0.98))] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-[#5ed8ff]/30 cursor-pointer"
              onClick={() => handleEdit(artToy)}
            >
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#65ddff]/10 to-transparent opacity-0 transition group-hover:opacity-100" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(artToy._id);
                }}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1227]/70 text-white/75 backdrop-blur transition hover:bg-red-400/15 hover:text-white"
                aria-label="Delete configuration"
              >
                <Trash2 size={16} />
              </button>

              {artToy.imageUrl && (
                <img
                  src={artToy.imageUrl}
                  alt={t("artToy.alt")}
                  className="mb-5 h-[240px] w-full rounded-[22px] object-cover"
                />
              )}

              <div className="relative z-[1]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#79e4ff]">
                      Saved Setup
                    </p>
                    <h2 className="mt-2 text-[20px] font-semibold text-white">
                      {getDisplayName(artToy)}
                    </h2>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 p-2 text-white/75 transition group-hover:border-[#5ed8ff]/30 group-hover:text-[#7ee7ff]">
                    <ArrowUpRight size={16} />
                  </div>
                </div>

                <div className="mt-5 grid gap-x-4 gap-y-3 text-[13px] text-[#cad6ef] sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/[0.04] px-3 py-3">
                    <div className="mb-2 flex items-center gap-2 text-white/60">
                      <Ruler size={14} />
                      <span>{t("artToy.size")}</span>
                    </div>
                    <p className="font-medium text-white">{t(`artToy.sizeOptions.${artToy.size}`)}</p>
                  </div>

                  <div className="rounded-2xl bg-white/[0.04] px-3 py-3">
                    <div className="mb-2 flex items-center gap-2 text-white/60">
                      <Palette size={14} />
                      <span>{t("artToy.painting")}</span>
                    </div>
                    <p className="font-medium text-white">{t(`artToy.paintingOptions.${artToy.painting}`)}</p>
                  </div>

                  <div className="rounded-2xl bg-white/[0.04] px-3 py-3">
                    <div className="mb-2 flex items-center gap-2 text-white/60">
                      <Boxes size={14} />
                      <span>{t("artToy.material")}</span>
                    </div>
                    <p className="font-medium text-white">{t(`artToy.materialOptions.${artToy.material}`)}</p>
                  </div>

                  <div className="rounded-2xl bg-white/[0.04] px-3 py-3">
                    <div className="mb-2 flex items-center gap-2 text-white/60">
                      <Boxes size={14} />
                      <span>{t("artToy.assembly")}</span>
                    </div>
                    <p className="font-medium text-white">{t(`artToy.assemblyOptions.${artToy.assembly}`)}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#0b1227]/72 px-4 py-3 text-sm">
                  <div>
                    <p className="text-white/55">{t("artToy.quantity")}</p>
                    <p className="font-semibold text-white">{artToy.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/55">{t("artToy.totalPrice")}</p>
                    <p className="font-semibold text-[#7ee7ff]">{Number(artToy.price ?? 0).toLocaleString()} ฿</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 flex min-h-[520px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-[#0b1227]/55 px-6 text-center">
            <div className="rounded-[24px] border border-white/10 bg-[#0f1835] p-5">
              <Boxes size={28} className="text-[#78e4ff]" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-white">
              {t("artToy.noItems")}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-7 text-[#aebddb]">
              Save a few stronger configuration directions from the material page and they will appear here for quick editing later.
            </p>
          </div>
        )}
      </div>

      {!isLoading && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default ConfigCard;
