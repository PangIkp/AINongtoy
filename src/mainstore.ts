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

  savedArtToys: ArtToy[]; // ✅ เก็บรายการ Art Toy ที่บันทึกไว้
  saveArtToy: () => void;
  removeArtToy: (index: number) => void;
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
        set((state) => ({
          artToyData: {
            ...state.artToyData, // ✅ คงค่าเดิมไว้
            ...data, // ✅ รวมค่าที่อัปเดต
          },
        })),

      savedArtToys: [], // ✅ เริ่มต้นเป็นอาร์เรย์ว่าง
        saveArtToy: () => {
          const { artToyData, savedArtToys } = get();
          // set({
          //   savedArtToys: [...savedArtToys, artToyData], // ✅ เพิ่ม Art Toy ใหม่เข้าไปในอาร์เรย์
          // });
          set({
            savedArtToys: savedArtToys.map((toy) => 
              toy.imageUrl === artToyData.imageUrl ? artToyData : toy // ✅ Replace existing toy
            ),
          });
        },
      removeArtToy: (index: number) =>
        set((state) => ({
          savedArtToys: state.savedArtToys.filter((_, i) => i !== index),
        })),
    }),
    {
      name: "mainstore-data",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
