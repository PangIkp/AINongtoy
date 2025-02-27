"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import PasswordInput from "../components/PasswordInput";
import axios from "axios";

const Signup = () => {
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/v1/user/"); // Ensure this endpoint exists
        setUserCount(response.data.count); // Assume the response returns { count: number }
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUserCount();
  }, []);

  //   Handle form submission
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic client-side validation
    if (formData.password !== formData.confirmpassword) {
      setError("Passwords do not match");
      return;
    }
    console.log("test")
    try {
      const newUser = {
        id: userCount + 1, // Generate unique ID
        ...formData, // Spread the form data
      };

      console.log("test2")
      const response = await axios.post(
        "http://localhost:3001/api/v1/user/",
        newUser
      );

      console.log("test3")
      setSuccess(response.data.message);

      // Optionally, redirect to login after successful registration
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error("❌ Error:", err.message);
      setError(err.message);
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
      <div className="w-full sm:h-[90vh] h-[925px] mt-[5rem]">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src="/Images/AINongtoy/mainbg.png"
            alt="mainbg"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute max-w-[600px] w-full p-5 sm:p-20 ">
            <div>
              <h1 className="text-4xl font-semibold mb-3">Create an account</h1>
              <p className="font-extralight">
                Already have an account ?{" "}
                <a href="/login" className="hover:text-[#0AACF0] underline">
                  Log in
                </a>
              </p>
            </div>
            <div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-between gap-5 w-full h-[70%] pt-5"
              >
                <div className="grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-5">
                  <label htmlFor="firstName">
                    <p>First name</p>
                    <input
                      type="text"
                      name="firstName"
                      minLength={4}
                      maxLength={20}
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </label>
                  <label htmlFor="lastName">
                    <p>Last name</p>
                    <input
                      type="text"
                      name="lastName"
                      minLength={4}
                      maxLength={20}
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </label>
                </div>

                <div className="grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-5">
                  <label htmlFor="username">
                    <p>Username</p>
                    <input
                      type="text"
                      name="username"
                      minLength={4}
                      maxLength={20}
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </label>
                  <label htmlFor="phoneNumber">
                    <p>Phone number</p>
                    <input
                      type="text"
                      name="phoneNumber"
                      minLength={10}
                      maxLength={10}
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </label>
                </div>

                <label htmlFor="email">
                  <p>Email</p>
                  <input
                    type="email"
                    name="email"
                    minLength={5}
                    maxLength={50}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </label>

                <div className="grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-x-5 gap-5">
                  <PasswordInput
                    id="password"
                    name="password"
                    label="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <PasswordInput
                    id="cpassword"
                    name="confirmpassword"
                    label="Confirm password"
                    value={formData.confirmpassword}
                    onChange={handleChange}
                  />
                </div>

                <button className="h-[40px]" type="submit">
                  Sign Up
                </button>

                {error && (
                  <div className="text-red-400 rounded mb-4">{error}</div>
                )}

                {success && (
                  <div className="w-[480px] text-green-400 rounded mb-4">
                    {success}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
