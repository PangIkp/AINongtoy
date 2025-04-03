import axios from 'axios';

const API_URL = "http://localhost:3001/api/v1/user";

export const updateUserProfile = async (userId: string, userData: any) => {
    try {
        console.log('Updating user profile:', userId, userData); // Log request details
        const response = await axios.patch(`${API_URL}/${userId}`, userData);
        console.log('API Response:', response.data); // Log response data
        return response.data;
    } catch (error: any) {
        console.error('API Error Data:', error.response?.data); // Log error response data
        console.error('Fetch Error:', error); // Log full error
        throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
};

export const updateUserAddresses = async (userId: string, addressData: any) => {
    try {
        console.log('Updating user addresses:', userId, addressData); // Log request details
        const response = await axios.patch(`${API_URL}/${userId}`, { address: addressData });
        console.log('API Response:', response.data); // Log response data
        return response.data;
    } catch (error: any) {
        console.error('API Error Data:', error.response?.data); // Log error response data
        console.error('Fetch Error:', error); // Log full error
        throw new Error(error.response?.data?.error || 'Failed to update addresses');
    }
};

// New function to get user by ID
export const getUserById = async (userId: string) => {
    try {
        console.log('Fetching user data for ID:', userId); // Log request details
        const response = await axios.get(`${API_URL}/${userId}`);
        console.log('API Response:', response.data); // Log response data
        return response.data;
    } catch (error: any) {
        console.error('API Error Data:', error.response?.data); // Log error response data
        console.error('Fetch Error:', error); // Log full error
        throw new Error(error.response?.data?.error || 'Failed to fetch user data');
    }
};


// for Admin
export const getAllUsersForAdmin = async (token: string) => {
    try {
      console.log("Fetching all orders for admin...");
      const response = await fetch("http://localhost:3001/api/v1/user/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ส่ง token สำหรับการตรวจสอบสิทธิ์
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch all users for admin");
      }
  
      const data = await response.json();
      console.log("All Users for Admin:", data);
      return data;
    } catch (error) {
      console.error("Error fetching all users for admin:", error);
      throw error;
    }
  };

  export const updateUserForAdmin = async (id: string, updates: any, token: string) => {
    try {
      console.log(`Updating user with ID: ${id}...`);
      const response = await fetch(`http://localhost:3001/api/v1/user/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
  
      console.log("Response Status:", response.status); // ตรวจสอบสถานะของการตอบกลับ
      console.log("Response OK:", response.ok); // ตรวจสอบว่าเป็น OK หรือไม่
  
      // ตรวจสอบเนื้อหาที่ได้จาก server
      const responseText = await response.text(); // รับข้อมูลเป็น text ก่อน
      if (!response.ok) {
        console.error("Error response:", responseText); // แสดงข้อมูลจาก API
        throw new Error("Failed to update user");
      }
  
      const data = JSON.parse(responseText); // แปลงจาก text เป็น JSON
      console.log("User updated successfully:", data);
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };
  