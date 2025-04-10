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

// for admin
export const getKeywordsForAdmin = async (token: string) => {
  try {
    console.log("Fetching keywords for admin...");
    const response = await fetch(`${API_URL}/admin/keywords`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ส่ง token สำหรับการตรวจสอบสิทธิ์
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to fetch keywords for admin"
      );
    }

    const data = await response.json();
    console.log("Keywords Fetched:", data);
    return data;
  } catch (error) {
    console.error("Error fetching keywords for admin:", error);
    return [];
  }
};

export const updateKeywordForAdmin = async (
  token: string,
  id: string,
  updatedData: object
) => {
  try {
    console.log(`Updating keyword with ID: ${id}...`);
    const response = await fetch(`${API_URL}/admin/keyword/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ส่ง token สำหรับการตรวจสอบสิทธิ์
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to update keyword for admin"
      );
    }

    const data = await response.json();
    console.log("Keyword Updated:", data);
    return data;
  } catch (error) {
    console.error("Error updating keyword for admin:", error);
    throw error;
  }
};

export const deleteKeywordForAdmin = async (token: string, id: string) => {
  try {
    console.log(`Deleting keyword with ID: ${id}...`);
    const response = await fetch(`${API_URL}/admin/keyword/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ส่ง token สำหรับการตรวจสอบสิทธิ์
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to delete keyword for admin"
      );
    }

    const data = await response.json();
    console.log("Keyword Deleted:", data);
    return data;
  } catch (error) {
    console.error("Error deleting keyword for admin:", error);
    throw error;
  }
};

export const createKeywordForAdmin = async (
    token: string,
    keywordData: object
) => {
  try {
    console.log("Creating new keyword...");
    const response = await fetch(`${API_URL}/admin/keyword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ส่ง token สำหรับการตรวจสอบสิทธิ์
      },
      body: JSON.stringify(keywordData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to create keyword for admin"
      );
    }

    const data = await response.json();
    console.log("Keyword Created:", data);
    return data;
  } catch (error) {
    console.error("Error creating keyword for admin:", error);
    throw error;
  }
}