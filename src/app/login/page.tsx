"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { login } from "@/api/authAPI";
import PasswordInput from "../components/PasswordInput";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import { Loader } from "lucide-react"; // เพิ่มการ import Loader
dotenv.config();

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "";

const Login = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // เพิ่ม state สำหรับการโหลด
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

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
      const decryptedUsername = CryptoJS.AES.decrypt(encryptedUsername, SECRET_KEY).toString(CryptoJS.enc.Utf8);
      setUsername(decryptedUsername);
      setRememberMe(true);
    }

    if (encryptedPassword) {
      const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY).toString(CryptoJS.enc.Utf8);
      setPassword(decryptedPassword);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Please fill in all fields',
        text: 'Username and Password are required',
      });
      return;
    }

    try {
      const data = await login(username, password);
      console.log("Login successful:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("firstname", data.firstName);
        localStorage.setItem("lastname", data.lastName);
        setUser(data.username);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setIsLoggedIn(true);
      }

      if (rememberMe) {
        const encryptedUsername = CryptoJS.AES.encrypt(username, SECRET_KEY).toString();
        const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();

        Cookies.set("username", encryptedUsername, { expires: 30 });
        Cookies.set("password", encryptedPassword, { expires: 30 });
      } else {
        Cookies.remove("username");
        Cookies.remove("password");
      }

    } catch (error: any) {
      console.error("Login error:", error.message);
      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: error.message,
      });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      window.location.href = "/";
    }
  }, [isLoggedIn]);

  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
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
              <img src="/Images/AINongtoy/mainbg.png" alt="" className="w-full h-full object-cover" />
              <div className="absolute max-w-[375px] w-full p-4">
                <div>
                  <h1 className="text-4xl font-semibold mb-3">Welcome back</h1>
                  <p className="font-extralight">Please enter your details</p>
                </div>
                <div>
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col justify-between gap-4 w-full h-[70%] pt-5"
                  >
                    <label className="hidden" htmlFor="username">
                      <p>Username</p>
                    </label>
                    <input
                      className="block"
                      type="text"
                      id="username"
                      placeholder="Username"
                      maxLength={40}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />

                    <PasswordInput
                      id="password"
                      name="password"
                      placeholder="Password"
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

                        Remember&nbsp;me
                      </label>
                      <a href="/forgotpassword" className="text-[#0AACF0]">
                        Forgot password ?
                      </a>
                    </div>
                    <button type="submit" className="h-[40px]">
                      Login
                    </button>
                    <div className="flex justify-center text-[13px]">
                      <p>
                        Not registered yet ?{" "}
                        <a href="/signup" className="text-[#0AACF0] underline">
                          Sign up
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;