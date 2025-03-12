import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ArtToy {
  _id?: string;
  // id:string;
  name: string;
  // prompt: string;
  size: string;
  material: string;
  painting: string;
  assembly: string;
  quantity: number;
  price: number;
  imageUrl: string;
  // shipingCost: number;
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
        // id:"",
        name: "Unnamed Art Toy",
        prompt: "art toy",
        size: "",
        material: "",
        painting: "",
        assembly: "",
        quantity: 1,
        price: 0,
        imageUrl: "",
        // shipingCost: 0,
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

        const existingIndex = savedArtToys.findIndex(
          (toy) => toy.imageUrl === artToyData.imageUrl
        );

        if (existingIndex !== -1) {
          // ✅ อัปเดตเฉพาะ ArtToy ที่ตรงกัน
          const updatedToys = [...savedArtToys];
          updatedToys[existingIndex] = { ...artToyData };

          set({ savedArtToys: updatedToys });
        } else {
          // ✅ ถ้าไม่เจอให้เพิ่มเข้าไปใหม่
          set({ savedArtToys: [...savedArtToys, artToyData] });
        }
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
