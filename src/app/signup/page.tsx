/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import axios from "axios";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";
import { API_V1_URL } from "@/api/baseUrl";
import { checkUserExists } from "../../api/userAPI";
import { Loader, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../i18n";

const EMAILJS_SERVICE_ID = "service_i9d8089";
const EMAILJS_TEMPLATE_ID = "template_ubnzds7";
const EMAILJS_PUBLIC_KEY = "TMP5T0OL8X3jkzeBb";

const Signup = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const emailRegex = /^[a-zA-Z][^\s@]*@[a-zA-Z]{2,}(\.[a-zA-Z]{2,}){1,2}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
  const nameRegex = /^[a-zA-Z]{4,40}$/;
  const phoneRegex = /^0[1-9]\d{8}$/;
  const usernameRegex =
    /^[a-zA-Z](?=[a-zA-Z0-9._]{3,39}$)(?!.*[.].*[.])(?!.*[_].*[_])[a-zA-Z0-9._]*$/;

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get(`${API_V1_URL}/user/`);
        setUserCount(response.data.count);
      } catch (error) {
        console.error("Error fetching user count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "firstName":
        return value && !nameRegex.test(value) ? t("signup.firstNameError") : null;
      case "lastName":
        return value && !nameRegex.test(value) ? t("signup.lastNameError") : null;
      case "username":
        return value && !usernameRegex.test(value)
          ? t("signup.usernameError")
          : null;
      case "phoneNumber":
        return value && !phoneRegex.test(value)
          ? t("signup.phoneNumberError")
          : null;
      case "email":
        return value && !emailRegex.test(value) ? t("signup.emailError") : null;
      case "password":
        return value && !passwordRegex.test(value)
          ? t("signup.passwordError")
          : null;
      case "confirmpassword":
        return value && value !== formData.password
          ? t("signup.confirmPasswordError")
          : null;
      default:
        return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
      ...(name === "password" && formData.confirmpassword
        ? {
            confirmpassword:
              formData.confirmpassword !== value
                ? t("signup.confirmPasswordError")
                : null,
          }
        : {}),
    }));
  };

  const sendOtp = async (email: string) => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: t("signup.warningTitle"),
        text: t("signup.warningText"),
      });
      return false;
    }

    const nextOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(nextOtp);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = currentDate.toLocaleTimeString("th-TH");

    const templateParams = {
      to_email: email,
      otp: nextOtp,
      date: formattedDate,
      time: formattedTime,
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      Swal.fire({
        icon: "success",
        title: t("signup.otpSentTitle"),
        text: t("signup.otpSentText"),
      });

      setIsEmailSent(true);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      Swal.fire({
        icon: "error",
        title: t("signup.errorTitle"),
        text: t("signup.errorText"),
      });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.username ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.password ||
      !formData.confirmpassword
    ) {
      Swal.fire({
        icon: "warning",
        title: t("signup.warningTitle"),
        text: t("signup.fillRequiredFields"),
      });
      return;
    }

    if (Object.values(errors).some((error) => error !== null)) {
      Swal.fire({
        icon: "warning",
        title: t("signup.warningTitle"),
        text: t("signup.fixErrors"),
      });
      return;
    }

    setLoading(true);

    try {
      const { exists } = await checkUserExists({
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      });

      if (exists.username.exists) {
        Swal.fire({
          icon: "warning",
          title: t("signup.warningTitle"),
          text: t("signup.usernameExists"),
        });
        return;
      }

      if (exists.email.exists) {
        Swal.fire({
          icon: "warning",
          title: t("signup.warningTitle"),
          text: t("signup.emailExists"),
        });
        return;
      }

      if (exists.phoneNumber.exists) {
        Swal.fire({
          icon: "warning",
          title: t("signup.warningTitle"),
          text: t("signup.phoneExists"),
        });
        return;
      }

      await sendOtp(formData.email);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const char = value.slice(-1);
    const nextOtp = otp.padEnd(6, " ").split("");
    nextOtp[index] = char || " ";
    const normalizedOtp = nextOtp.join("").replace(/\s+$/g, "");
    setOtp(normalizedOtp);

    if (char && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      Swal.fire({
        icon: "warning",
        title: t("signup.warningTitle"),
        text: t("signup.otpEmpty"),
      });
      return;
    }

    if (otp !== generatedOtp) {
      Swal.fire({
        icon: "warning",
        title: t("signup.warningTitle"),
        text: t("signup.invalidOtp"),
      });
      return;
    }

    setGeneratedOtp("");
    setLoading(true);

    try {
      const newUser = {
        id: userCount + 1,
        ...formData,
      };

      const response = await axios.post(`${API_V1_URL}/user/`, newUser);

      Swal.fire({
        icon: "success",
        title: t("signup.successTitle"),
        text: response.data.message || t("signup.registeredSuccessfully"),
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/login");
    } catch (err: any) {
      console.error("Error:", err.response?.data?.message || err.message);

      if (err.response?.data?.errors) {
        Swal.fire({
          icon: "error",
          title: t("signup.errorTitle"),
          text: err.response.data.errors.join(", "),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: t("signup.errorTitle"),
          text: err.response?.data?.message || t("signup.genericError"),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const otpDigits = Array.from({ length: 6 }, (_, index) => otp[index] || "");
  const inputClassName =
    "mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#67dfff]/45 focus:bg-[#102247]";
  const errorTextClassName = "mt-2 min-h-5 text-xs text-[#f6c676]";

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar
        scrollToSection={scrollToSection}
        aboutRef={aboutRef}
        partnerRef={partnerRef}
        contactRef={contactRef}
      />

      <main className="relative overflow-hidden pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(36,56,122,0.34),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(12,172,243,0.12),transparent_28%)]" />

        <div className="relative mx-auto flex min-h-[calc(100svh-6rem)] max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex w-full justify-center py-24">
              <Loader className="animate-spin text-[#0CACF3]" size={48} />
            </div>
          ) : (
            <section className="mx-auto w-full max-w-[720px] rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,38,0.96),rgba(7,12,25,0.98))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)] backdrop-blur sm:p-8">
              {!isEmailSent ? (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <h1 className="text-4xl font-semibold tracking-tight text-white">
                      {t("signup.createAccount")}
                    </h1>
                    <Link
                      href="/login"
                      className="hidden h-11 items-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white sm:inline-flex"
                    >
                      {t("signup.login")}
                    </Link>
                  </div>

                  <p className="mt-3 text-sm text-white/58">
                    {t("signup.alreadyHaveAccount")}{" "}
                    <Link
                      href="/login"
                      className="font-medium text-[#88ebff] transition hover:text-white"
                    >
                      {t("signup.login")}
                    </Link>
                  </p>

                  <form onSubmit={handleSubmit} className="mt-8">
                    <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="text-sm font-medium text-white/80">
                          {t("signup.firstName")} <span className="text-[#ff8b8b]">*</span>
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          name="firstName"
                          maxLength={40}
                          value={formData.firstName}
                          onChange={handleChange}
                          className={inputClassName}
                        />
                        <p className={errorTextClassName}>{errors.firstName || " "}</p>
                      </div>

                      <div>
                        <label htmlFor="lastName" className="text-sm font-medium text-white/80">
                          {t("signup.lastName")} <span className="text-[#ff8b8b]">*</span>
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          name="lastName"
                          maxLength={40}
                          value={formData.lastName}
                          onChange={handleChange}
                          className={inputClassName}
                        />
                        <p className={errorTextClassName}>{errors.lastName || " "}</p>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="email" className="text-sm font-medium text-white/80">
                          {t("signup.email")} <span className="text-[#ff8b8b]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClassName}
                          />
                          <Mail
                            size={16}
                            className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-white/30"
                          />
                        </div>
                        <p className={errorTextClassName}>{errors.email || " "}</p>
                      </div>

                      <div>
                        <label htmlFor="username" className="text-sm font-medium text-white/80">
                          {t("signup.username")} <span className="text-[#ff8b8b]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="username"
                            type="text"
                            name="username"
                            maxLength={40}
                            value={formData.username}
                            onChange={handleChange}
                            className={inputClassName}
                          />
                          <UserRound
                            size={16}
                            className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-white/30"
                          />
                        </div>
                        <p className={errorTextClassName}>{errors.username || " "}</p>
                      </div>

                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="text-sm font-medium text-white/80"
                        >
                          {t("signup.phoneNumber")} <span className="text-[#ff8b8b]">*</span>
                        </label>
                        <input
                          id="phoneNumber"
                          type="text"
                          name="phoneNumber"
                          maxLength={10}
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className={inputClassName}
                        />
                        <p className={errorTextClassName}>{errors.phoneNumber || " "}</p>
                      </div>

                      <div>
                        <label htmlFor="password" className="text-sm font-medium text-white/80">
                          {t("signup.passwordLabel")} <span className="text-[#ff8b8b]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={inputClassName}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 bg-transparent p-0 text-xs font-semibold uppercase tracking-[0.18em] text-white/45 hover:text-[#88ebff]"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                        <p className={errorTextClassName}>{errors.password || " "}</p>
                      </div>

                      <div>
                        <label
                          htmlFor="confirmpassword"
                          className="text-sm font-medium text-white/80"
                        >
                          {t("signup.confirmPasswordLabel")}{" "}
                          <span className="text-[#ff8b8b]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="confirmpassword"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmpassword"
                            value={formData.confirmpassword}
                            onChange={handleChange}
                            className={inputClassName}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 bg-transparent p-0 text-xs font-semibold uppercase tracking-[0.18em] text-white/45 hover:text-[#88ebff]"
                          >
                            {showConfirmPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                        <p className={errorTextClassName}>
                          {errors.confirmpassword || " "}
                        </p>
                      </div>
                    </div>

                    <button
                      className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#67dfff]/40 bg-[linear-gradient(135deg,#0CACF3,#67dfff)] px-6 text-sm font-semibold text-[#03111f] shadow-[0_14px_32px_rgba(12,172,243,0.28)] transition hover:-translate-y-0.5 hover:brightness-105"
                      type="submit"
                    >
                      <Mail size={18} />
                      {t("signup.signUpButton")}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h1 className="text-4xl font-semibold tracking-tight text-white">
                        {t("signup.verifyEmail")}
                      </h1>
                      <p className="mt-3 text-sm text-white/58">
                        {t("signup.enterOtp")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => sendOtp(formData.email)}
                      className="hidden h-11 items-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white sm:inline-flex"
                    >
                      {t("forgotPassword.resendOtpButton")}
                    </button>
                  </div>

                  <div className="mt-8 grid grid-cols-6 gap-2 sm:gap-3">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          otpInputRefs.current[index] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="h-14 rounded-2xl border border-white/10 bg-[#0f1f42] text-center text-xl font-semibold text-white outline-none transition focus:border-[#67dfff]/50"
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#67dfff]/40 bg-[linear-gradient(135deg,#0CACF3,#67dfff)] px-6 text-sm font-semibold text-[#03111f] shadow-[0_14px_32px_rgba(12,172,243,0.28)] transition hover:-translate-y-0.5 hover:brightness-105"
                    onClick={verifyOtp}
                  >
                    <ShieldCheck size={18} />
                    {t("signup.verifyOtpButton")}
                  </button>
                </>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Signup;
