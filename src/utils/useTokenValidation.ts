import { useEffect } from "react";
import { checkTokenValidity } from "../api/authAPI";
import { getUserData } from "./localStorageUtils";

export const useTokenValidation = () => {
  useEffect(() => {
    const excludedPaths = ["/", "/login", "/arttoy"]; // เส้นทางที่ไม่ต้องการให้ทำงาน
    const currentPath = window.location.pathname;

    if (excludedPaths.includes(currentPath)) {
      return;
    }

    const token = localStorage.getItem("token"); // ดึง token จาก localStorage
    const parsedUser = getUserData(); // ดึงข้อมูลผู้ใช้

    const validateToken = async () => {
      if (!token || !parsedUser) {
        console.error("Token or user data is missing");
        window.location.href = "/login"; // เปลี่ยนเส้นทางไปหน้า Login
        return;
      }

      try {
        const result = await checkTokenValidity(token);
        console.log("Token is valid:", result);

        // ตั้ง Timeout เพื่อตรวจสอบ Token อีกครั้งเมื่อใกล้หมดอายุ
        setTimeout(() => {
          validateToken();
        }, result.expiresIn * 1000); // ตรวจสอบอีกครั้ง
      } catch (error: any) {
        console.error("Token validation failed:", error.message);
        handleLogout(); // ออกจากระบบเมื่อ Token หมดอายุ
      }
    };

    const handleLogout = async () => {
      // เรียก API logout
      await fetch("/api/logout", { method: "POST" });

      // ลบข้อมูลที่เก็บไว้ใน localStorage และ sessionStorage
      localStorage.clear();
      sessionStorage.clear();

      // รีเฟรชไปที่หน้า Login
      window.location.href = "/login";
    };

    validateToken(); // เรียก validateToken ครั้งแรก
  }, []); // ทำงานครั้งเดียวเมื่อ Component ถูก mount
};