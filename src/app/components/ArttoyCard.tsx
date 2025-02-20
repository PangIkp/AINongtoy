import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useMainStore } from "@/mainstore";

interface ArtToyCardProps {
  imageUrls: string[];
  onImageLoad?: () => void;
  isLoading: boolean;
}

export default function ArtToyCard({
  imageUrls,
  onImageLoad,
  isLoading,
}: ArtToyCardProps) {
  const router = useRouter();
  const { favorites, toggleFavorite } = useMainStore(); // ✅ ใช้ Zustand Store
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>(
    {}
  );

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

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {imageUrls.map((imageUrl) => (
          <div key={imageUrl} className="relative p-3 rounded-lg">
            {/* ปุ่มหัวใจ (แสดงเฉพาะตอนรูปโหลดเสร็จ) */}
            {imageLoaded[imageUrl] && !isLoading && (
              <button
                className="absolute top-4 right-4 z-10 bg-transparent hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation(); // ป้องกันการเปิดหน้าใหม่เมื่อกดหัวใจ
                  toggleFavorite(imageUrl);
                }}
              >
                <Heart
                  size={24}
                  className={`transition-all ${
                    favorites[imageUrl]
                      ? "fill-red-500 stroke-red-500"
                      : "fill-gray-300 stroke-gray-500"
                  }`}
                />
              </button>
            )}

            {/* รูปภาพ */}
            <div
              className={`flex justify-center cursor-pointer transition-opacity duration-500 ${
                isLoading ? "opacity-0 invisible" : "opacity-100 visible"
              }`}
              onClick={() => {
                router.push(`/material?image=${encodeURIComponent(imageUrl)}`);
              }}
            >
              <Image
                src={imageUrl}
                onLoad={() => handleImageLoad(imageUrl)}
                alt={`Generated Art Toy`}
                width={300}
                height={300}
                className="w-42 h-42 object-cover rounded-md"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
