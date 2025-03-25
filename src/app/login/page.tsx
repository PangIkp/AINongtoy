"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import { login } from "@/api/authAPI";
import PasswordInput from "../components/PasswordInput";
import Swal from "sweetalert2";
import Cookies from "js-cookie"; // เพิ่มการ import js-cookie
import CryptoJS from "crypto-js"; // เพิ่มการ import crypto-js

const SECRET_KEY = "yoo5PAkafiWAnVhr1Ug30anOtcqU12nZgQBkl0w65KsYBzH7"; // ใช้ key สำหรับเข้ารหัสข้อมูล Cookies

interface LoginResponse {
  token: string;
  username: string;
  firstName: string;
  lastName: string;
}

const Login = () => {
  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null); // State สำหรับ firstName
  const [lastName, setLastName] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false); // State สำหรับ "Remember me"

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

    // โหลดข้อมูลจาก Cookies และถอดรหัส
    const encryptedUsername = Cookies.get("username");
    const encryptedPassword = Cookies.get("password");

    if (encryptedUsername) {
      const decryptedUsername = CryptoJS.AES.decrypt(encryptedUsername, SECRET_KEY).toString(CryptoJS.enc.Utf8);
      setUsername(decryptedUsername);
      setRememberMe(true); // ตั้งค่า Remember me เป็น true หากมีข้อมูลใน Cookies
    }

    if (encryptedPassword) {
      const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY).toString(CryptoJS.enc.Utf8);
      setPassword(decryptedPassword);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setUsernameError(!username ? "Username is required" : "");
      setPasswordError(!password ? "Password is required" : "");
      Swal.fire({
        icon: 'warning',
        title: 'Please fill in all fields',
        text: 'Username and Password are required',
      });
      return;
    }

    try {
      const data = await login(username, password); // เรียก API จาก authService
      console.log("Login successful:", data);

      if (data.token) {
        // เก็บข้อมูลทั้งหมดใน localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("firstname", data.firstName);  // เก็บ firstName
        localStorage.setItem("lastname", data.lastName);    // เก็บ lastName
        setUser(data.username);
        setFirstName(data.firstName); // อัปเดตค่า firstName ใน state
        setLastName(data.lastName);   // อัปเดตค่า lastName ใน state
        setIsLoggedIn(true);
      }

      // หากเลือก "Remember me" ให้เข้ารหัสและบันทึกข้อมูลลงใน Cookies
      if (rememberMe) {
        const encryptedUsername = CryptoJS.AES.encrypt(username, SECRET_KEY).toString();
        const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();

        Cookies.set("username", encryptedUsername, { expires: 30 });
        Cookies.set("password", encryptedPassword, { expires: 30 });
      } else {
        // หากไม่ได้เลือก "Remember me" ให้ลบ Cookies
        Cookies.remove("username");
        Cookies.remove("password");
      }

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Your credentials have been saved.",
      });

    } catch (error: any) {
      console.error("Login error:", error.message);
      setPasswordError("Invalid username or password");
      Swal.fire({
        icon: 'warning',
        title: 'Login Failed',
        text: 'Invalid username or password',
      });
    }
  };


  useEffect(() => {
    // หากผู้ใช้ล็อกอินสำเร็จ ให้ไปหน้า Home
    if (isLoggedIn) {
      window.location.href = "/"; // ✅ Redirect ไปหน้า Home
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

          <Image
            src="/Images/AINongtoy/mainbg.png"
            alt="mainbg"
            fill
            className="object-cover"
            priority
          />
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
                  <a href="#" className="text-[#0AACF0]">
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
              {/* <div className="mt-4 h-[40px] text-[14px] font-thin text-red-300">
                <p>{usernameError}</p>
                <p>{passwordError}</p>
              </div> */}

              {/* แสดงข้อมูลผู้ใช้เมื่อล็อกอินสำเร็จ */}

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
