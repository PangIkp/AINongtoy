import axios from "axios";

const API_URL = "http://localhost:3001/api/v1/favorite";

// ดึงรายการ Favorite ทั้งหมด
export const getAllFavorites = async (token: string) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Favorites Fetched:", res.data);
  return res.data;
};


// เพิ่ม Favorite
export const createFavorite = async (token: string, imageUrl: string) => {
  try {
    const res = await axios.post(
      API_URL,
      { imageUrl },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// ลบ Favorite โดยใช้ _id
export const deleteFavorite = async (token: string, id: string) => {
    try {
    //   console.log("🔍 API DELETE Request:", `${API_URL}/${id}`);
    //   console.log("🛠 Authorization Token:", token);
  
      const res = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("✅ API Response:", res.data);
      return res.data;
    } catch (error) {
    //   console.error("❌ Delete Favorite API Error:", error.response?.data || error.message);
      throw error;
    }
  };
  