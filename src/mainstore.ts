import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface MainStore {
  favorites: { [key: string]: boolean }; // เก็บสถานะหัวใจของแต่ละรูป
  toggleFavorite: (imageUrl: string) => void;

  arttoyName: string;
  keywords: string;
  setArtToyData: (name: string, keywords: string) => void;
}

// Zustand Store พร้อม persist
export const useMainStore = create<MainStore>()(
  persist(
    (set) => ({
      favorites: {}, // เริ่มต้นให้ว่าง
      toggleFavorite: (imageUrl) =>
        set((state) => ({
          favorites: {
            ...state.favorites,
            [imageUrl]: !state.favorites[imageUrl], // เปลี่ยนค่า true/false
          },
        })),

      arttoyName: "",
      keywords: "",
      setArtToyData: (name, keywords) =>
        set({ arttoyName: name, keywords: keywords }),
    }),
    {
      name: "mainstore-data", // Key ที่ใช้เก็บใน localStorage
      storage: createJSONStorage(() => localStorage), // ใช้ localStorage
    }
  )
);
