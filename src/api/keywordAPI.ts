import axios from "axios";

const API_URL = "https://nongtoybackend-rby6pw6h.b4a.run/api/v1/keyword";

export const getAllKeywords = async () => {
  try {
    const res = await axios.get(API_URL);
    console.log("Keywords Fetched:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching keywords:", error);
    return []; // หรือ throw error ถ้าอยากให้ frontend รู้ว่าล้มเหลว
  }
};
