import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {imageUrls.map((imageUrl, index) => (
          <div key={index} className="relative p-3 rounded-lg">
            <div
              className={`flex justify-center cursor-pointer transition-opacity duration-500 ${
                isLoading ? "opacity-0 invisible" : "opacity-100 visible"
              }`}
              onClick={() =>
                router.push(`/material?image=${encodeURIComponent(imageUrl)}`)
              }
            >
              <Image
                src={imageUrl}
                onLoad={onImageLoad}
                alt={`Generated Art Toy ${index + 1}`}
                // fill
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
