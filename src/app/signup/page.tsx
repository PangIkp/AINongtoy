"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PasswordInput from "../components/PasswordInput";
import axios from "axios";
import Swal from "sweetalert2";
import { Loader } from "lucide-react"; // เพิ่มการ import Loader
import emailjs from "emailjs-com"; // เพิ่มการ import emailjs
import { checkUserExists } from "../../api/userAPI";

const Signup = () => {
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const router = useRouter();
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true); // เพิ่ม state สำหรับการโหลด
  const [errors, setErrors] = useState<Record<string, string | null>>({}); // ใช้เพื่อเก็บข้อความผิดพลาด
  const [isEmailSent, setIsEmailSent] = useState(false); // ใช้เพื่อเช็คว่าอีเมลถูกส่งไปแล้วหรือยัง
  const [otp, setOtp] = useState(""); // ใช้เพื่อเก็บ OTP ที่กรอกจากผู้ใช้
  const [generatedOtp, setGeneratedOtp] = useState(""); // ใช้เพื่อเก็บ OTP ที่สร้างขึ้น
  const [isOtpVerified, setIsOtpVerified] = useState(false); // ใช้เพื่อเช็คว่า OTP ถูกยืนยันแล้วหรือยัง

  // Validation rules
  const emailRegex = /^[a-zA-Z][^\s@]*@[a-zA-Z]{2,}(\.[a-zA-Z]{2,}){1,2}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
  const nameRegex = /^[a-zA-Z]{4,40}$/;
  const phoneRegex = /^0\d{9}$/;
  const usernameRegex = /^[a-zA-Z](?=[a-zA-Z0-9._]{3,39}$)(?!.*[.].*[.])(?!.*[_].*[_])[a-zA-Z0-9._]*$/;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update formData first
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validation logic
    const newErrors = { ...errors };

    if (name === "firstName") {
      newErrors.firstName =
        value && !nameRegex.test(value)
          ? "FirstName: Alphabetic, 4-40 chars."
          : null;
    }

    if (name === "lastName") {
      newErrors.lastName =
        value && !nameRegex.test(value)
          ? "LastName: Alphabetic, 4-40 chars."
          : null;
    }

    if (name === "username") {
      newErrors.username =
        value && !usernameRegex.test(value)
          ? "Username: 4-20 chars, start with letter, allow '.', '_', and numbers."
          : null;
    }

    if (name === "phoneNumber") {
      newErrors.phoneNumber =
        value && !phoneRegex.test(value)
          ? "Phone: 10 digits, start with 0."
          : null;
    }

    if (name === "email") {
      newErrors.email = value && !emailRegex.test(value) ? "Email: Invalid." : null;
    }

    if (name === "password") {
      newErrors.password =
        value && !passwordRegex.test(value)
          ? "Password: 6+ chars, include upper, lower, and a number."
          : null;
    }

    if (name === "confirmpassword") {
      newErrors.confirmpassword =
        value && value !== formData.password ? "Passwords: do not match." : null;
    }

    setErrors(newErrors);
  };

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/v1/user/");
        setUserCount(response.data.count);
      } catch (error) {
        console.error("Error fetching user count:", error);
      } finally {
        setLoading(false); // หยุดโหลด
      }
    };

    fetchUserCount();
  }, []);

  const sendOtp = async (email: string) => {
    if (!email) {
      console.error("Recipient email is empty.");
      Swal.fire("Warning", "Recipient email is empty. Please provide a valid email.", "warning");
      return;
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    setGeneratedOtp(generatedOtp);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = currentDate.toLocaleTimeString("th-TH");

    const templateParams = {
      to_email: email, // Ensure this matches the variable in your EmailJS template
      otp: generatedOtp,
      date: formattedDate,
      time: formattedTime,
    };

    try {
      await emailjs.send(
        "service_m5nbqms", // Replace with your EmailJS Service ID
        "template_3m72222", // Replace with your EmailJS Template ID
        templateParams,
        "1tQROI12k9EH9q4nT" // Replace with your EmailJS User ID
      );

      Swal.fire({
        icon: "success",
        title: "OTP Sent",
        text: "OTP has been sent to your email.",
      });

      setIsEmailSent(true); // Update the state to indicate the email was sent successfully
    } catch (error) {
      console.error("Error sending email:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send OTP. Please try again later.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า

    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบถ้วนหรือไม่
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.username ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.password ||
      !formData.confirmpassword
    ) {
      Swal.fire("Warning", "Please fill in all required fields.", "warning");
      return;
    }

    // ตรวจสอบว่ามีข้อผิดพลาดหรือไม่
    if (Object.values(errors).some((error) => error !== null)) {
      Swal.fire("Warning", "Please fix the errors in the form.", "warning");
      return;
    }

    setLoading(true); // เริ่มโหลดก่อนการตรวจสอบข้อมูลผู้ใช้
    try {
      // เช็คว่า username ซ้ำหรือไม่
      const { exists } = await checkUserExists({
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      });
      console.log("exists:", exists);
      if (exists.username.exists) {
        Swal.fire("Warning", "Username already exists.", "warning");
        return;
      }
      if (exists.email.exists) {
        Swal.fire("Warning", "Email already exists.", "warning");
        return;
      }
      if (exists.phoneNumber.exists) {
        Swal.fire("Warning", "Phone number already exists.", "warning");
        return;
      }

      // เรียกฟังก์ชันส่ง OTP
      await sendOtp(formData.email);
    } catch (err) {
      console.error("❌ Error:", err);
    } finally {
      setLoading(false); // หยุดโหลดหลังจากการดำเนินการเสร็จสิ้น
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // อนุญาตเฉพาะตัวเลข

    const newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join(""));

    // ย้ายไปยังช่องถัดไปถ้ากรอกครบ
    if (value && index < 5) {
      const nextInput = document.querySelectorAll<HTMLInputElement>("input[type='text']")[index + 1];
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelectorAll<HTMLInputElement>("input[type='text']")[index - 1];
      prevInput?.focus();
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      Swal.fire("Warning", "OTP cannot be empty", "warning");
      return;
    }

    if (otp === generatedOtp) {
      setIsOtpVerified(true);
      setGeneratedOtp(""); // ลบ OTP ทิ้งหลังจากยืนยันสำเร็จ

      // เพิ่มผู้ใช้ใหม่ในระบบ
      setLoading(true); // เริ่มโหลด
      try {
        const newUser = {
          id: userCount + 1,
          ...formData,
        };

        const response = await axios.post(
          "http://localhost:3001/api/v1/user/",
          newUser
        );

        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message || "Registered successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        router.push("/login");
      } catch (err: any) {
        console.error("❌ Error:", err.response?.data?.message || err.message);

        if (err.response?.data?.errors) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.response.data.errors.join(", "),
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              err.response?.data?.message ||
              "Something went wrong. Please try again.",
          });
        }
      } finally {
        setLoading(false); // หยุดโหลด
      }
    } else {
      Swal.fire("Warning", "Invalid OTP", "warning");
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
      <div className="w-full sm:h-[90vh] h-[1000px] mt-[5rem]">
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src="/Images/AINongtoy/mainbg.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute max-w-[600px] w-full p-5 sm:p-14 ">
            {loading ? ( // แสดง Loader ระหว่างโหลด
              <div className="flex justify-center items-center">
                <Loader className="animate-spin text-[#0CACF3]" size={48} />
              </div>
            ) : (
              <>
                {!isEmailSent ? (
                  <>
                    <h1 className="text-4xl font-semibold mb-3">Create an account</h1>
                    <p className="font-extralight">
                      Already have an account ?
                      <a href="/login" className="hover:text-[#0AACF0] underline">
                        Log in
                      </a>
                    </p>
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col w-full h-[70%] pt-5"
                    >
                      <div className="grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-x-5">
                        <label htmlFor="firstName">
                          <p>First name <span className="text-red-600">*</span> </p>
                          <input
                            type="text"
                            name="firstName"
                            maxLength={40}
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                          <p className="text-xs mt-1 text-yellow-500 h-4">{errors.firstName}</p>
                        </label>
                        <label htmlFor="lastName">
                          <p>Last name <span className="text-red-600">*</span> </p>
                          <input
                            type="text"
                            name="lastName"
                            maxLength={40}
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                          <p className="text-xs mt-1 text-yellow-500 h-4">{errors.lastName}</p>
                        </label>
                      </div>

                      <label htmlFor="email">
                        <p>Email <span className="text-red-600">*</span> </p>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <p className="text-xs mt-1 text-yellow-500 h-4">{errors.email}</p>
                      </label>

                      <div className="grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-x-5">
                        <label htmlFor="username">
                          <p>Username <span className="text-red-600">*</span> </p>
                          <input
                            type="text"
                            name="username"
                            maxLength={40}
                            value={formData.username}
                            onChange={handleChange}
                          />
                          <p className="text-xs mt-1 text-yellow-500 h-8">{errors.username}</p>
                        </label>
                        <label htmlFor="phoneNumber">
                          <p>Phone number <span className="text-red-600">*</span> </p>
                          <input
                            type="text"
                            name="phoneNumber"
                            maxLength={10}
                            value={formData.phoneNumber}
                            onChange={handleChange}
                          />
                          <p className="text-xs mt-1 text-yellow-500 h-4">{errors.phoneNumber}</p>
                        </label>
                      </div>

                      <div className="grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-x-5 ">
                        <div>
                          <PasswordInput
                            id="password"
                            name="password"
                            label="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                          <p className="text-xs my-1 text-yellow-500 h-8">{errors.password}</p>
                        </div>

                        <div>
                          <PasswordInput
                            id="cpassword"
                            name="confirmpassword"
                            label="Confirm password"
                            value={formData.confirmpassword}
                            onChange={handleChange}
                            required
                          />
                          <p className="text-xs my-1 text-yellow-500 h-4">{errors.confirmpassword}</p>
                        </div>
                      </div>
                      <button className="h-[40px]" type="submit">
                        Sign Up
                      </button>
                    </form>
                  </>
                ) : (
                  <form className="flex flex-col justify-between gap-4 w-full h-[70%] pt-5">
                    <h1 className="text-4xl font-semibold">Verify email</h1>
                    <p className="font-extralight">Enter the OTP sent to your email</p>
                    <div className="flex justify-around gap-2 mb-2">
                      <label htmlFor="otp" className="hidden">a</label>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <input
                          id="otp"
                          key={index}
                          type="text"
                          maxLength={1}
                          className="w-10 h-10 text-center border border-gray-300 rounded p-0 m-0 text-2xl"
                          value={otp[index] || ""}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        />
                      ))}
                    </div>
                    <button type="button" className="h-[40px]" onClick={verifyOtp}>
                      Verify OTP
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;