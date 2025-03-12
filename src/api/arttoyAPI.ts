import { ArtToy } from "@/mainstore";
export const createArtToy = async (artToyData: ArtToy, token: string) => {
    try {
      const response = await fetch("http://localhost:3001/api/v1/arttoy", {
        method: "POST", // ใช้ POST เพื่อส่งข้อมูล
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ส่ง token สำหรับการตรวจสอบสิทธิ์
        },
        body: JSON.stringify(artToyData), // แปลงข้อมูลเป็น JSON ก่อนส่ง
      });
  
      if (!response.ok) {
        throw new Error("Failed to create ArtToy");
      }
  
      const data = await response.json(); // รับข้อมูลกลับมาจาก API
      return data;
    } catch (error) {
      console.error("Error creating ArtToy:", error);
      throw error; // แจ้งข้อผิดพลาด
    }
  };

// ✅ เพิ่มฟังก์ชันสำหรับลบ ArtToy
export const deleteArtToy = async (id: string, token?: string) => {
  if (!token) {
    throw new Error("Unauthorized: Token is missing");
  }

  try {
    const response = await fetch(`http://localhost:3001/api/v1/arttoy/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete ArtToy");
    }

    return { message: "ArtToy deleted successfully" };
  } catch (error) {
    console.error("Error deleting ArtToy:", error);
    throw error;
  }
};

