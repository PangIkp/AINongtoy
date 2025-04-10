/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Loader } from "lucide-react"; // เพิ่ม Loader icon
import {
  createFavorite,
  getAllFavorites,
  deleteFavorite,
} from "@/api/favoriteAPI";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import "../../i18n";

interface ArtToyCardProps {
  imageUrls: string[];
  onImageLoad?: () => void;
  isLoading: boolean;
  onFavoriteDeleted?: () => void; // เพิ่ม callback
}

export default function ArtToyCard({
  imageUrls,
  onImageLoad,
  isLoading,
  onFavoriteDeleted, // รับ callback
}: ArtToyCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>({});
  const [favorites, setFavorites] = useState<{ [key: string]: string }>({});
  const [loadingFavorites, setLoadingFavorites] = useState<{ [key: string]: boolean }>({}); // สถานะ loader

  // ฟังก์ชันเมื่อรูปโหลดเสร็จ
  const handleImageLoad = (imageUrl: string) => {
    setImageLoaded((prev) => ({
      ...prev,
      [imageUrl]: true,
    }));

    if (onImageLoad) {
      onImageLoad();
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const favoriteList = await getAllFavorites(token);
        const favoriteMap = favoriteList.reduce((acc: any, item: any) => {
          acc[item.imageUrl] = item._id; // ✅ บันทึก `_id` ของ Favorite
          return acc;
        }, {} as { [key: string]: boolean });

        setFavorites(favoriteMap);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  const handleFavoriteClick = async (imageUrl: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: t("arttoyCard.login.required.title"),
        text: t("arttoyCard.login.required.text"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#0CACF3',
        cancelButtonColor: '#51536D',
        confirmButtonText: t("arttoyCard.login.confirm.button"),
        cancelButtonText: t("arttoyCard.login.cancel.button"),
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login"); // Redirect to login page
        }
      });
      return;
    }

    if (loadingFavorites[imageUrl]) return; // ป้องกันการคลิ้กรัวๆ

    setLoadingFavorites((prev) => ({ ...prev, [imageUrl]: true })); // เริ่ม loader

    try {
      if (favorites[imageUrl]) {
        // ถ้าเป็น Favorite อยู่แล้ว → ให้ลบ
        await handleDeleteFavorite(favorites[imageUrl]);
      } else {
        const favoriteData = await createFavorite(token, imageUrl);
        setFavorites((prev) => ({
          ...prev,
          [imageUrl]: favoriteData._id, // บันทึก `_id` ที่ได้จาก API
        }));
      }
    } catch (error) {
      console.error("❌ Error handling favorite:", error);
    } finally {
      setLoadingFavorites((prev) => ({ ...prev, [imageUrl]: false })); // ปิด loader
    }
  };

  const handleDeleteFavorite = async (favoriteId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: t("arttoyCard.login.required.title"),
        text: t("arttoyCard.login.required.text"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#0CACF3',
        cancelButtonColor: '#51536D',
        confirmButtonText: t("arttoyCard.login.confirm.button"),
        cancelButtonText: t("arttoyCard.login.cancel.button"),
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login"); // Redirect to login page
        }
      });
      return;
    }

    try {
      await deleteFavorite(token, favoriteId);
      setFavorites((prev) => {
        const updatedFavorites = { ...prev };
        Object.keys(updatedFavorites).forEach((key) => {
          if (updatedFavorites[key] === favoriteId) {
            delete updatedFavorites[key]; // ✅ ลบ `_id` ออกจาก state
          }
        });
        return updatedFavorites;
      });
      if (onFavoriteDeleted) onFavoriteDeleted(); // เรียก callback เมื่อสำเร็จ
    } catch (error) {
      console.error("❌ Failed to remove favorite", error);
      Swal.fire({
        title: t("arttoyCard.error.title"),
        text: t("arttoyCard.error.remove.favorite"),
        icon: "error",
        confirmButtonColor: '#0CACF3',
      });
    }
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {imageUrls.map((imageUrl, index) => (
          <div key={index} className="relative p-3 rounded-lg">
            {/* ปุ่มหัวใจ (แสดงเฉพาะตอนรูปโหลดเสร็จ) */}
            {imageLoaded[imageUrl] && !isLoading && (
              <button
                className="absolute top-4 right-4 z-10 bg-transparent hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation(); // ป้องกันการเปิดหน้าใหม่เมื่อกดหัวใจ
                  handleFavoriteClick(imageUrl); // เรียก API บันทึก Favorite
                }}
                disabled={loadingFavorites[imageUrl]} // ปิดการคลิกขณะโหลด
              >
                {loadingFavorites[imageUrl] ? (
                  <Loader className="animate-spin text-[#0CACF3]" size={24} /> // แสดง loader
                ) : (
                  <Heart
                    size={24}
                    className={`transition-all ${favorites[imageUrl]
                      ? "fill-red-500 stroke-red-500"
                      : "fill-gray-300 stroke-gray-500"
                      }`}
                  />
                )}
              </button>
            )}

            {/* รูปภาพ */}
            <div
              className={`flex justify-center cursor-pointer transition-opacity duration-500 ${isLoading ? "opacity-0 invisible" : "opacity-100 visible"
                }`}
              onClick={() => {
                router.push(`/material?image=${encodeURIComponent(imageUrl)}`);
              }}
            >
              <Image
                src={imageUrl}
                onLoad={() => handleImageLoad(imageUrl)}
                alt={t("arttoyCard.image.alt.text")}
                width={300}
                height={300}
                className="w-42 h-42 object-cover rounded-md"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,..."
                unoptimized // ✅ Disables Next.js optimizations, making it behave like <img>
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
