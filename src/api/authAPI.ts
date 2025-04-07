/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = "http://localhost:3001/api/v1/auth";

const isEmail = (value: string): boolean => {
  // Regular Expression สำหรับตรวจสอบว่าเป็นอีเมลหรือไม่
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailPattern.test(value);
};

export const login = async (username: string, password: string) => {
  try {
    const body = isEmail(username)
      ? { email: username, password }
      : { username, password };

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Login API Response:", data); // ✅ Debug

    if (!response.ok) {
      throw new Error(data.message || "Invalid username or passwords");
    }

    // ตรวจสอบสถานะว่าเป็น banned หรือไม่
    const status = data.data?.status?.toLowerCase();
    if (status === "banned") {
      throw new Error("Your account has been banned. Please contact support.");
    }

    localStorage.setItem("user", JSON.stringify(data.data)); // เก็บข้อมูล user
    localStorage.setItem("token", data.token); // เก็บ token

    console.log("Stored user in localStorage:", localStorage.getItem("user"));
    console.log("Stored token in localStorage:", localStorage.getItem("token"));

    return data; // ✅ ต้องแน่ใจว่า data มี user
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// http://localhost:3001/api/v1/auth/about
export const getUser = async (token: string) => {
  try {
    const response = await fetch("http://localhost:3001/api/v1/auth/about", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ส่ง token สำหรับการตรวจสอบสิทธิ์
      },
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

export const checkTokenValidity = async (token: string) => {
  if (!token || token === "null") {
    throw new Error("Token is missing");
  }

  try {
    const response = await fetch(`${API_URL}/check-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // ส่ง token สำหรับการตรวจสอบสิทธิ์
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to check token validity");
    }

    console.log("Token validity response:", data); // ✅ Debug
    return data; // ส่งข้อมูลกลับ
  } catch (error) {
    console.error("Error checking token validity:", error);
    throw error;
  }
};