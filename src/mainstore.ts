import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ArtToy {
  name: string;
  prompt: string;
  size: string;
  material: string;
  painting: string;
  assembly: string;
  quantity: number;
  totalPrice: number;
  imageUrl: string;
  shipingCost: number;
}

interface MainStore {
  favorites: { [key: string]: boolean };
  toggleFavorite: (imageUrl: string) => void;

  artToyData: ArtToy; 
  setArtToyData: (data: Partial<ArtToy>) => void;

  savedArtToys: ArtToy[];  // ✅ เก็บรายการ Art Toy ที่บันทึกไว้
  saveArtToy: () => void; 

}

export const useMainStore = create<MainStore>()(
  persist(
    (set, get) => ({
      favorites: {},
      toggleFavorite: (imageUrl) =>
        set((state) => ({
          favorites: {
            ...state.favorites,
            [imageUrl]: !state.favorites[imageUrl],
          },
        })),

      artToyData: {
        name: "Unnamed Art Toy",
        prompt: "art toy",
        size: "",
        material: "",
        painting: "",
        assembly: "",
        quantity: 1,
        totalPrice: 0,
        imageUrl: "",
        shipingCost: 0,
      }, 

      setArtToyData: (data) =>
        set((prevState) => ({
          artToyData: {
            ...prevState.artToyData,
            ...data,
          },
        })),

      savedArtToys: [],  // ✅ เริ่มต้นเป็นอาร์เรย์ว่าง
      saveArtToy: () => {
        const { artToyData, savedArtToys } = get();
        set({
          savedArtToys: [...savedArtToys, artToyData],  // ✅ เพิ่ม Art Toy ใหม่เข้าไปในอาร์เรย์
        });
      },
    }),
    {
      name: "mainstore-data",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
