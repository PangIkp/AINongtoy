import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface MainStore {
  favorites: { [key: string]: boolean }; // เก็บสถานะหัวใจของแต่ละรูป
  toggleFavorite: (imageUrl: string) => void;

  artToyData: string; // ✅ ใช้ artToyData เป็นหลัก
  setArtToyData: (name: string) => void;
}

// Zustand Store พร้อม persist
export const useMainStore = create<MainStore>()(
  persist(
    (set) => ({
      favorites: {},
      toggleFavorite: (imageUrl) =>
        set((state) => ({
          favorites: {
            ...state.favorites,
            [imageUrl]: !state.favorites[imageUrl],
          },
        })),

      artToyData: "Unnamed Art Toy", // ✅ ตั้งค่าเริ่มต้น
      setArtToyData: (name) => set({ artToyData: name }),
    }),
    {
      name: "mainstore-data",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
