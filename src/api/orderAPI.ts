/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = "http://localhost:3001/api/v1/order";

export const createOrder = async (
  token: string,
  orderData: {
    name: string;
    size: string;
    material: string;
    painting: string;
    assembly: string;
    quantity: number;
    price: number;
    shipping: number;
    total: number;
    address: string;
    payment: string;
    imageUrl: string;
  }
) => {
  try {
    console.log("Sending order data:", orderData); 
    const res = await axios.post(API_URL, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Order response:", res.data); // ตรวจสอบค่าที่ได้กลับมา
    return res.data.data;
  } catch (error: any) {
    console.error("API Error:", error?.response?.data || error);
    throw error;
  }
};

export const getOrdersByUserId = async (token: string) => {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Orders Fetched:", res.data);
    return res.data;
  };

// ดึงคำสั่งซื้อโดยใช้ `orderId`
export const getOrderById = async (id: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ส่ง token สำหรับการตรวจสอบสิทธิ์
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch Order");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Order by ID:", error);
    throw error;
  }
};


// for admin
export const getAllOrdersForAdmin = async (token: string) => {
  try {
    console.log("Fetching all orders for admin...");
    const response = await fetch("http://localhost:3001/api/v1/order/admin/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ส่ง token สำหรับการตรวจสอบสิทธิ์
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch all orders for admin");
    }

    const data = await response.json();
    console.log("All Orders for Admin:", data);
    return data;
  } catch (error) {
    console.error("Error fetching all orders for admin:", error);
    throw error;
  }
};

export const deleteOrderByAdmin = async (token: string, id: string) => {
  try {
    console.log(`Deleting order with ID: ${id}...`);
    const response = await fetch(`http://localhost:3001/api/v1/order/admin/orders/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete order");
    }

    console.log("Order deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

export const updateOrderByAdmin = async (token: string, id: string, updateData: Record<string, any>) => {
  try {
    console.log(`Updating order with ID: ${id}...`);
    const res = await axios.patch(
      `http://localhost:3001/api/v1/order/admin/orders/${id}`,
      updateData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Order updated successfully:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Error updating order:", error?.response?.data || error);
    throw error;
  }
};
