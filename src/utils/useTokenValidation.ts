import { useEffect } from "react";
import { checkTokenValidity } from "../api/authAPI";
import { getUserData } from "./localStorageUtils";
import Swal from "sweetalert2";

export const useTokenValidation = () => {
  useEffect(() => {
    const excludedPaths = ["/", "/login", "/arttoy", "/signup", "/forgotpassword"];
    const adminOnlyPaths = ["/dashboard", "/order-management", "/user-management"];
    const currentPath = window.location.pathname;

    const token = localStorage.getItem("token");
    const parsedUser = getUserData();

    const userStatus = parsedUser?.status?.toLowerCase();
    const userRole = parsedUser?.role?.toLowerCase();

    if (userStatus === "banned") {
      Swal.fire({
        icon: "error",
        title: "Account Banned",
        text: "Your account has been banned. Please contact support.",
      }).then(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      });
      return;
    }

    if (currentPath === "/login" && (token && parsedUser)) {
      window.location.href = "/";
      return;
    }

    if (excludedPaths.includes(currentPath) && (!token || !parsedUser)) {
      return;
    }

    // Redirect non-admin users from admin-only paths
    if (adminOnlyPaths.includes(currentPath) && userRole !== "admin") {
      window.location.href = "/";
      return;
    }

    const validateToken = async () => {
      if (!token || !parsedUser) {
        console.error("Token or user data is missing");
        window.location.href = "/login";
        return;
      }

      try {
        const result = await checkTokenValidity(token);
        console.log("Token is valid:", result);

        setTimeout(() => {
          validateToken();
        }, result.expiresIn * 1000);
      } catch (error: any) {
        console.error("Token validation failed:", error.message);
        handleLogout();
      }
    };

    const handleLogout = async () => {
      let isConfirmed = false;

      const result = await Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        timer: 5000,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {
          if (!isConfirmed) {
            isConfirmed = true;
          }
        },
      });

      if (result.isConfirmed || isConfirmed) {
        await fetch("/api/logout", { method: "POST" });

        localStorage.clear();
        sessionStorage.clear();

        window.location.href = "/login";
      } else {
        console.log("User canceled the logout process.");
      }
    };

    validateToken();
  }, []);
};