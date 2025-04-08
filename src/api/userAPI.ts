/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = "https://nongtoybackend-rby6pw6h.b4a.run/api/v1/user";

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

export const checkUserExists = async (data: { email?: string; username?: string; phoneNumber?: string }) => {
    try {
        console.log('Checking if user exists with data:', data); // Log request details
        const response = await axios.post(`${API_URL}/check-exists`, data);
        console.log('API Response:', response.data); // Log response data
        return response.data;
    } catch (error: any) {
        console.error('API Error Data:', error.response?.data); // Log error response data
        console.error('Fetch Error:', error); // Log full error
        throw new Error(error.response?.data?.error || 'Failed to check user existence');
    }
};

// for Admin
export const getAllUsersForAdmin = async (token: string) => {
    try {
        console.log("Fetching all orders for admin...");
        const response = await fetch("https://nongtoybackend-rby6pw6h.b4a.run/api/v1/user/admin/users", {
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

  export const createUserForAdmin = async (token: string, userData: object) => {
    try {
        console.log("Creating user for admin...");

        const response = await fetch("https://nongtoybackend-rby6pw6h.b4a.run/api/v1/user/admin/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // ส่ง token สำหรับการตรวจสอบสิทธิ์
            },
            body: JSON.stringify(userData), // ส่งข้อมูลผู้ใช้ใหม่
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create user for admin");
        }

        const data = await response.json();
        console.log("User created successfully:", data);
        return data;
    } catch (error) {
        console.error("Error creating user for admin:", error);
        throw error;
    }
};


  export const updateUserForAdmin = async (id: string, updates: any, token: string) => {
    try {
        console.log(`Updating user with ID: ${id}...`);
        const response = await fetch(`https://nongtoybackend-rby6pw6h.b4a.run/api/v1/user/admin/users/${id}`, {
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

export const deleteUserForAdmin = async (token: string, id: string) => {
    try {
        const response = await fetch(`https://nongtoybackend-rby6pw6h.b4a.run/api/v1/user/admin/users/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Response Status:", response.status);
        console.log("Response OK:", response.ok);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response:", errorData); // แสดงข้อมูลจาก API
            throw new Error("Failed to delete user");
        }

        const data = await response.json(); // รับข้อมูลเป็น JSON
        console.log("User deleted successfully:", data);
        return data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
  };
  
