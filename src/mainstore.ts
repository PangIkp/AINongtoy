import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
interface MainStore {
  favorites: { [key: string]: boolean }; // เก็บสถานะหัวใจของแต่ละรูป
  toggleFavorite: (imageUrl: string) => void;

  artToyData: { name: string; prompt: string }; // ✅ ชัดเจนขึ้น
  setArtToyData: (data: Partial<{ name: string; prompt: string }>) => void;

  selecting: {
    [artToyName: string]: {
      size: string;
      material: string;
      painting: string;
      assembly: string;
      quantity: number;
    };
  };
  setSelecting: (artToyName: string, data: Partial<MainStore["selecting"][string]>) => void;
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

      artToyData: { name: "Unnamed Art Toy", prompt: "art toy" }, // ✅ ตั้งค่าเริ่มต้นให้ตรงกับโครงสร้างใหม่
      setArtToyData: (data: Partial<{ name: string; prompt: string }>) =>
        set((prevState) => ({
          artToyData: {
            ...prevState.artToyData, // คงค่าที่มีอยู่เดิม
            ...data, // อัปเดตเฉพาะค่าที่ถูกส่งเข้ามา
          },
        })),

        selecting: {}, // เก็บข้อมูลเป็น object ที่แยกตามชื่อ Art Toy
        setSelecting: (artToyName, data) =>
          set((prevState) => ({
            selecting: {
              ...prevState.selecting,
              [artToyName]: {
                ...prevState.selecting[artToyName], // คงค่าที่มีอยู่
                ...data, // อัปเดตค่าที่เปลี่ยน
              },
            },
          })),
      
    }),
    {
      name: "mainstore-data",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
