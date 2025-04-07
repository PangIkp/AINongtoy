/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { checkTokenValidity } from "../api/authAPI";
import { getUserData } from "./localStorageUtils";
import Swal from "sweetalert2";

export const useTokenValidation = () => {
  useEffect(() => {
    const excludedPaths = ["/", "/login", "/arttoy", "/signup", "/forgotpassword"]; // เพิ่ม "/signup" เข้าไปใน excludedPaths
    const currentPath = window.location.pathname;

    const token = localStorage.getItem("token"); // ดึง token จาก localStorage
    const parsedUser = getUserData(); // ดึงข้อมูลผู้ใช้

    // ตรวจสอบสถานะของผู้ใช้
    const userStatus = parsedUser?.status?.toLowerCase(); // แปลง status เป็นพิมพ์เล็ก

    if (userStatus === "banned") {
      Swal.fire({
        icon: "error",
        title: "Account Banned",
        text: "Your account has been banned. Please contact support.",
      }).then(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login"; // เปลี่ยนเส้นทางไปหน้า Login
      });
      return;
    }

    // ตรวจสอบว่าผู้ใช้เข้าไปที่หน้า /login และมี token กับข้อมูลผู้ใช้
    if (currentPath === "/login" && (token && parsedUser)) {
      window.location.href = "/"; // เปลี่ยนเส้นทางไปหน้า /
      return;
    }

    if (excludedPaths.includes(currentPath) && (!token || !parsedUser)) {
      return;
    }

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
      let isConfirmed = false;

      // Show Swal confirmation dialog with a 5-second timer
      const result = await Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        icon: "warning",
        allowOutsideClick: false, // คือคลิกข้างนอกไม่สามารถปิดได้
        allowEscapeKey: false, // ไม่สามารถปิดด้วยปุ่ม ESC ได้
        timer: 5000, // ตั้งเวลา 5 วินาที
        didOpen: () => {
          Swal.showLoading(); // แสดง loading ระหว่างรอ
        },
        willClose: () => {
          if (!isConfirmed) {
            isConfirmed = true; // ตั้งค่าเป็นจริงเมื่อเวลาหมด
          }
        },
      });

      if (result.isConfirmed || isConfirmed) {
        // If the user confirms or the timer expires, proceed with logout
        await fetch("/api/logout", { method: "POST" });

        // Clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Redirect to the login page
        window.location.href = "/login";
      } else {
        console.log("User canceled the logout process.");
      }
    };

    validateToken(); // เรียก validateToken ครั้งแรก
  }, []); // ทำงานครั้งเดียวเมื่อ Component ถูก mount
};