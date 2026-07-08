"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { checkTokenValidity } from "../api/authAPI";
import { getUserData } from "./localStorageUtils";
import { getUserById } from "../api/userAPI";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

export const useTokenValidation = () => {
  const { t } = useTranslation(); // ใช้ useTranslation สำหรับการแปลภาษา

  useEffect(() => {
    const excludedPaths = ["/", "/login", "/arttoy", "/signup", "/forgotpassword"];
    const adminOnlyPaths = ["/dashboard", "/order-management", "/user-management"];
    const currentPath = window.location.pathname;

    const token = localStorage.getItem("token");
    const parsedUser = getUserData();
    const userId = parsedUser?._id;
    const userRole = parsedUser?.role?.toLowerCase();

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

    // Check if phoneNumber is "0000000000" and prompt for update
    if (currentPath !== "/editProfile" && parsedUser?.phoneNumber === "0000000000") {
      Swal.fire({
        title: t("useToken.updatePhoneNumber.title"), // ใช้ key จาก JSON
        text: t("useToken.updatePhoneNumber.text"), // ใช้ key จาก JSON
        icon: "info",
        confirmButtonText: t("useToken.updatePhoneNumber.confirmButton"), // ใช้ key จาก JSON
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/editProfile"; // Redirect to phone update page
        }
      });
    }

    const validateToken = async () => {
      if (!token || !parsedUser) {
        console.error(t("useToken.errors.tokenOrUserMissing")); // ใช้ key จาก JSON
        window.location.href = "/login";
        return;
      }

      try {
        const result = await checkTokenValidity(token);
        console.log(t("useToken.messages.tokenValid"), result); // ใช้ key จาก JSON

        setTimeout(() => {
          validateToken();
        }, result.expiresIn * 1000);
      } catch (error: any) {
        console.error(t("useToken.errors.tokenValidationFailed"), error.message); // ใช้ key จาก JSON
        handleLogout();
      }
    };

    const checkUserStatus = async () => {
      if (!userId) {
        console.error(t("useToken.errors.userIdMissing")); // ใช้ key จาก JSON
        return null;
      }
      try {
        const userData = await getUserById(userId);
        console.log(t("useToken.messages.userDataFetched"), userData); // ใช้ key จาก JSON
        console.log(t("useToken.messages.userStatus"), userData.data.status.toLowerCase()); // ใช้ key จาก JSON

        if (userData.data.status.toLowerCase() === "banned") {
          let isConfirmed = false;

          const result = await Swal.fire({
            title: t("useToken.accountBanned.title"), // ใช้ key จาก JSON
            text: t("useToken.accountBanned.text"), // ใช้ key จาก JSON
            icon: "error",
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
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/login";
          }
          return;
        }
      } catch (error: any) {
        console.error(t("useToken.errors.fetchingUserData"), error.message); // ใช้ key จาก JSON
        return;
      }
    };

    const handleLogout = async () => {
      let isConfirmed = false;

      const result = await Swal.fire({
        title: t("useToken.sessionExpired.title"), // ใช้ key จาก JSON
        text: t("useToken.sessionExpired.text"), // ใช้ key จาก JSON
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
        console.log(t("useToken.messages.logoutCanceled")); // ใช้ key จาก JSON
      }
    };

    checkUserStatus();
    validateToken();
  }, []);
};
