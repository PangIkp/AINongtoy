import { useState } from "react";

interface ArtToyCardProps {
  imageUrls: string[];
}

export default function ArtToyCard({ imageUrls }: ArtToyCardProps) {
  return (
    <div className="bg-[#51536D] flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {imageUrls.map((imageUrl, index) => (
          <div key={index} className="relative p-3 rounded-lg">
            <div className="flex justify-center">
              <img
                src={imageUrl}
                alt={`Generated Art Toy ${index + 1}`}
                className="w-42 h-42 object-cover rounded-md"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
