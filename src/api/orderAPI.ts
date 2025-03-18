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
  
