"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
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
  onImageError?: () => void;
  isLoading?: boolean;
  onFavoriteDeleted?: () => void;
  variant?: "grid" | "single";
}

export default function ArtToyCard({
  imageUrls,
  onImageLoad,
  onImageError,
  onFavoriteDeleted,
  variant = "grid",
}: ArtToyCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>({});
  const [imageFailed, setImageFailed] = useState<{ [key: string]: boolean }>({});
  const [favorites, setFavorites] = useState<{ [key: string]: string }>({});
  const [loadingFavorites, setLoadingFavorites] = useState<{ [key: string]: boolean }>({});

  const normalizeFavoriteImageUrl = (rawUrl: string) => {
    try {
      const parsed = new URL(rawUrl);
      if (parsed.hostname !== "image.pollinations.ai") {
        return rawUrl;
      }

      const requiredKeys = ["width", "height", "seed", "model", "nologo", "enhance"];
      const normalizedParams = new URLSearchParams();
      requiredKeys.forEach((key) => {
        const value = parsed.searchParams.get(key);
        if (value !== null) {
          normalizedParams.set(key, value);
        }
      });

      const queryString = normalizedParams.toString();
      return queryString
        ? `${parsed.origin}${parsed.pathname}?${queryString}`
        : `${parsed.origin}${parsed.pathname}`;
    } catch {
      return rawUrl;
    }
  };
  const renderedImageUrls = variant === "single" ? imageUrls.slice(0, 1) : imageUrls;
  const imageSignature = renderedImageUrls.join("||");

  const markImageDone = (imageUrl: string) => {
    setImageLoaded((prev) => ({
      ...prev,
      [imageUrl]: true,
    }));

    if (onImageLoad) {
      onImageLoad();
    }
  };

  const handleImageError = (imageUrl: string) => {
    setImageFailed((prev) => ({
      ...prev,
      [imageUrl]: true,
    }));

    if (onImageError) {
      onImageError();
    }
  };

  const syncImageElementState = (imageUrl: string, element: HTMLImageElement | null) => {
    if (!element) return;
    if (imageLoaded[imageUrl] || imageFailed[imageUrl]) return;

    if (element.complete && element.naturalWidth > 0) {
      markImageDone(imageUrl);
      return;
    }

    if (element.complete && element.naturalWidth === 0) {
      handleImageError(imageUrl);
    }
  };

  useEffect(() => {
    setImageLoaded({});
    setImageFailed({});
  }, [imageSignature]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const favoriteList = await getAllFavorites(token);
        const favoriteMap = favoriteList.reduce((acc: any, item: any) => {
          const normalizedUrl = normalizeFavoriteImageUrl(item.imageUrl);
          acc[normalizedUrl] = item._id;
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
    const normalizedImageUrl = normalizeFavoriteImageUrl(imageUrl);
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
          router.push("/login");
        }
      });
      return;
    }

    if (loadingFavorites[normalizedImageUrl]) return;

    setLoadingFavorites((prev) => ({ ...prev, [normalizedImageUrl]: true }));

    try {
      if (favorites[normalizedImageUrl]) {
        await handleDeleteFavorite(favorites[normalizedImageUrl]);
      } else {
        const favoriteData = await createFavorite(token, normalizedImageUrl);
        setFavorites((prev) => ({
          ...prev,
          [normalizedImageUrl]: favoriteData._id,
        }));
      }
    } catch (error) {
      console.error("❌ Error handling favorite:", error);
    } finally {
      setLoadingFavorites((prev) => ({ ...prev, [normalizedImageUrl]: false }));
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
          router.push("/login");
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
            delete updatedFavorites[key];
          }
        });
        return updatedFavorites;
      });
      if (onFavoriteDeleted) onFavoriteDeleted();
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
    <div className={`flex justify-center ${variant === "single" ? "h-full" : ""}`}>
      <div
        className={
          variant === "single"
            ? "h-full w-full max-w-[560px]"
            : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        }
      >
        {renderedImageUrls.map((imageUrl, index) => (
          (() => {
            const normalizedImageUrl = normalizeFavoriteImageUrl(imageUrl);
            return (
          <div
            key={index}
            className={
              variant === "single"
                ? "relative flex h-full flex-col rounded-2xl border border-white/10 bg-[#111831] p-4"
                : "relative rounded-lg p-3"
            }
          >
            {imageLoaded[imageUrl] && !imageFailed[imageUrl] && (
              <button
                className="absolute right-6 top-6 z-10 rounded-full border border-white/15 bg-[#0B1227]/85 p-2 shadow-lg backdrop-blur transition hover:bg-[#16203D]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavoriteClick(imageUrl);
                }}
                disabled={loadingFavorites[normalizedImageUrl]}
                aria-label="Toggle favorite"
              >
                {loadingFavorites[normalizedImageUrl] ? (
                  <Loader className="animate-spin text-[#0CACF3]" size={24} />
                ) : (
                  <Heart
                    size={24}
                    className={`transition-all ${favorites[normalizedImageUrl]
                      ? "fill-red-500 stroke-red-500"
                      : "fill-gray-300 stroke-gray-500"
                      }`}
                  />
                )}
              </button>
            )}

            {/* รูปภาพ */}
            <div
              className={`relative flex cursor-pointer justify-center ${
                variant === "single" ? "min-h-0 flex-1 items-stretch" : ""
              }`}
              onClick={() => {
                router.push(`/material?image=${encodeURIComponent(imageUrl)}`);
              }}
            >
              {imageFailed[imageUrl] ? (
                <div
                  className={`flex items-center justify-center text-center text-xs text-white/70 ${
                    variant === "single"
                      ? "h-full min-h-[360px] w-full rounded-xl bg-[#090E22]"
                      : "h-[168px] w-[168px] rounded-md bg-[#16182C]"
                  }`}
                >
                  Image unavailable
                </div>
              ) : (
                <img
                  ref={(element) => syncImageElementState(imageUrl, element)}
                  src={imageUrl}
                  onLoad={() => markImageDone(imageUrl)}
                  onError={() => handleImageError(imageUrl)}
                  alt={t("arttoyCard.image.alt.text")}
                  loading={variant === "single" || index < 6 ? "eager" : "lazy"}
                  fetchPriority={variant === "single" || index < 2 ? "high" : "auto"}
                  decoding="async"
                  className={`rounded-md object-cover transition-opacity duration-300 ${
                    variant === "single" ? "h-full min-h-[360px] w-full rounded-xl" : "h-[168px] w-[168px]"
                  } ${imageLoaded[imageUrl] ? "opacity-100" : "opacity-0"}`}
                />
              )}
            </div>

            {variant === "single" && imageLoaded[imageUrl] && !imageFailed[imageUrl] && (
              <p className="pt-3 text-center text-xs text-white/70 sm:text-sm">{t("arttoy.imageReadyHint")}</p>
            )}
          </div>
            );
          })()
        ))}
      </div>
    </div>
  );
}
