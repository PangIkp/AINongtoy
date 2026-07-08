/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { login, loginWithGoogle, loginWithFacebook } from "@/api/authAPI";
import PasswordInput from "../components/PasswordInput";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import { Loader } from "lucide-react"; // เพิ่มการ import Loader
dotenv.config();
import { useTranslation } from "react-i18next";
import "../../i18n";
import {
  getAuth,
  signInWithPopup,
  FacebookAuthProvider,
  getRedirectResult,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential,
} from "firebase/auth";
import { getFirebaseApp, hasFirebaseConfig } from "@/utils/firebase";
import { FcGoogle } from "react-icons/fc"; // เพิ่มการ import ไอคอน Google
import { FaFacebook } from "react-icons/fa"; // เพิ่มการ import ไอคอน Facebook

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "";
const firebaseReady = hasFirebaseConfig();

const getClientAuth = () => {
  if (typeof window === "undefined" || !firebaseReady) {
    return null;
  }

  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  return getAuth(app);
};

const Login = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // เพิ่ม state สำหรับการโหลด
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const { t } = useTranslation(); // ใช้ useTranslation
  const auth = getClientAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // ปิดการโหลดหลังจาก 0ms
    }, 0);

    return () => clearTimeout(timer); // ล้าง timer เมื่อ component ถูก unmount
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedFirstName = localStorage.getItem("firstname");
    const storedLastName = localStorage.getItem("lastname");

    if (storedUsername) {
      setUser(storedUsername);
    }
    if (storedFirstName) {
      setFirstName(storedFirstName);
    }
    if (storedLastName) {
      setLastName(storedLastName);
    }

    const encryptedUsername = Cookies.get("username");
    const encryptedPassword = Cookies.get("password");

    if (encryptedUsername) {
      const decryptedUsername = CryptoJS.AES.decrypt(
        encryptedUsername,
        SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);
      setUsername(decryptedUsername);
      setRememberMe(true);
    }

    if (encryptedPassword) {
      const decryptedPassword = CryptoJS.AES.decrypt(
        encryptedPassword,
        SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);
      setPassword(decryptedPassword);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire({
        icon: "warning",
        title: t("login.warningTitle"),
        text: t("login.warningText"),
      });
      return;
    }

    try {
      const data = await login(username, password);
      if (data.data.role === "admin") {
        window.location.href = "/user-management"; // เปลี่ยนเส้นทางไปที่หน้า user-management
      } else window.location.href = "/"; // เปลี่ยนเส้นทางไปที่หน้า home

      if (rememberMe) {
        const encryptedUsername = CryptoJS.AES.encrypt(
          username,
          SECRET_KEY
        ).toString();
        const encryptedPassword = CryptoJS.AES.encrypt(
          password,
          SECRET_KEY
        ).toString();

        Cookies.set("username", encryptedUsername, { expires: 30 });
        Cookies.set("password", encryptedPassword, { expires: 30 });
      } else {
        Cookies.remove("username");
        Cookies.remove("password");
      }
    } catch (error: any) {
      // ใช้ t เพื่อแปลข้อความ error.message
      const translatedMessage = t(
        `login.errors.${error.message}`,
        error.message
      );

      Swal.fire({
        icon: "error",
        title: String(t("login.errorTitle")), // แปลงเป็น string
        text: String(translatedMessage), // แปลงเป็น string
      });
    }
  };

  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Google Login Handler
  const handleGoogleLogin = async () => {
    if (!auth) {
      Swal.fire({
        icon: "warning",
        title: "Google Login Unavailable",
        text: "Firebase is not configured for this environment yet.",
      });
      return;
    }

    try {
      console.log("Starting Google Login");
      const result = await signInWithPopup(auth, new GoogleAuthProvider());

      const user = result.user;
      console.log("Login successful:", user);

      setGoogleUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
      });

      // After successful login, call loginWithGoogle to register or save data to the database
      const googleToken = await user.getIdToken(); // Get Google ID token

      // Call API to save data in the database
      if (user.email) {
        const displayName = user.displayName || "";
        const response = await loginWithGoogle({
          email: user.email,
          firstName: displayName.split(" ")[0] || "",
          lastName: displayName.split(" ")[1] || "",
        });
        console.log("Google login data saved:", response);
      } else {
        throw new Error("User email is null");
      }

      // After saving the data, you can redirect to another page
      window.location.href = "/";
    } catch (err) {
      console.error("Login failed:", err);
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: "An error occurred during Google login. Please try again.",
      });
    }
  };

  useEffect(() => {
    if (!auth) {
      return;
    }

    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        console.log("Google Redirect Result:", result);

        if (result) {
          const user = result.user;
          console.log("Google Login Successful");
          console.log("UID:", user.uid);
          console.log("Email:", user.email);
          console.log("Display Name:", user.displayName);
          setGoogleUser({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photo: user.photoURL,
          });
        } else {
          console.log("ℹNo redirect result found.");
        }
      } catch (error) {
        console.error("Error handling redirect result:", error);
      }
    };

    checkRedirectResult();
  }, [auth]); 

  const [googleUser, setGoogleUser] = useState<any>(null);

  // Facebook Login Handler
  const handleFacebookLogin = async () => {
    if (!auth) {
      Swal.fire({
        icon: "warning",
        title: "Facebook Login Unavailable",
        text: "Firebase is not configured for this environment yet.",
      });
      return;
    }

    try {
      console.log("🔐 Starting Facebook Login");
  
      // Perform login via Facebook
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Login successful:", user);
  
      // Handle user data (can be customized as needed)
      const facebookUser = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
      };
  
      // Send user data to the API for saving or registration
      if (user.email) {
        const displayName = user.displayName || "";
        const response = await loginWithFacebook({
          email: user.email,
          firstName: displayName.split(" ")[0] || "",
          lastName: displayName.split(" ")[1] || "",
        });
        console.log("Facebook login data saved:", response);
      } else {
        throw new Error("User email is null");
      }
  
      // After successfully saving the data, redirect to another page
      window.location.href = "/";
    } catch (err) {
      console.error("Login failed:", err);
      Swal.fire({
        icon: "error",
        title: "Facebook Login Failed",
        text: "An error occurred during Facebook login. Please try again.",
      });
    }
  };
  
  

  return (
    <div>
      <Navbar
        scrollToSection={scrollToSection}
        aboutRef={aboutRef}
        partnerRef={partnerRef}
        contactRef={contactRef}
      />
      <div className="w-full h-[90vh] mt-[5rem]">
        <div className="relative w-full h-full flex items-center justify-center">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader className="animate-spin text-[#0CACF3]" size={48} />
            </div>
          ) : (
            <>
              <img
                src="/Images/AINongtoy/mainbg.png"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute max-w-[375px] w-full p-4">
                <div>
                  <h1 className="text-4xl font-semibold mb-3">
                    {t("login.welcomeBack")}
                  </h1>
                  <p className="font-extralight">{t("login.enterDetails")}</p>
                </div>
                <div>
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col justify-between gap-4 w-full h-[70%] pt-5"
                  >
                    <label className="hidden" htmlFor="username">
                      <p>{t("login.username")}</p>
                    </label>
                    <input
                      className="block"
                      type="text"
                      id="username"
                      placeholder={t("login.username")}
                      maxLength={40}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />

                    <PasswordInput
                      id="password"
                      name="password"
                      placeholder={t("login.password")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex justify-between text-[13px]">
                      <label
                        htmlFor="remember"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div>
                          <input
                            className="scale-125 accent-black focus:ring-black"
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                          />
                        </div>
                        {t("login.rememberMe")}
                      </label>
                      <a href="/forgotpassword" className="text-[#0AACF0]">
                        {t("login.forgotPassword")}
                      </a>
                    </div>
                    <button type="submit" className="h-[40px]">
                      {t("login.loginButton")}
                    </button>
                    <div className="flex justify-center text-[13px]">
                      <p>
                        {t("login.notRegistered")}{" "}
                        <a href="/signup" className="text-[#0AACF0] underline">
                          {t("login.signUp")}
                        </a>
                      </p>
                    </div>

                    <div className="flex justify-between gap-2 text-white">
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={!firebaseReady}
                        className="h-[40px] bg-transparent border border-gray-400  hover:bg-gray-800 flex items-center justify-center gap-2 w-1/2 disabled:opacity-50"
                      >
                        <FcGoogle size={20} />
                        Google
                      </button>

                      <button
                        type="button"
                        onClick={handleFacebookLogin}
                        disabled={!firebaseReady}
                        className="h-[40px] bg-transparent border border-gray-400 hover:bg-blue-800 flex items-center justify-center gap-2 w-1/2 disabled:opacity-50"
                      >
                        <FaFacebook size={20} />
                        Facebook
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
