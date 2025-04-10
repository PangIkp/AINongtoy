"use client";
import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
import { checkUserExists, updateUserProfile } from "../../api/userAPI"; // Import ฟังก์ชันใหม่
import PasswordInput from "../components/PasswordInput"; // Import PasswordInput component
import emailjs from "emailjs-com"; // Import EmailJS
import { Loader } from "lucide-react"; // Import Loader
import { useTranslation } from "react-i18next";
import "../../i18n";

const ForgotPassword = () => {
    const { t } = useTranslation(); // ใช้ useTranslation

    const aboutRef = useRef<HTMLDivElement>(null!);
    const partnerRef = useRef<HTMLDivElement>(null!);
    const contactRef = useRef<HTMLDivElement>(null!);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [userId, setUserId] = useState<string | null>(null); // เก็บ _id ของผู้ใช้
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSendingOtp, setIsSendingOtp] = useState(false); // สถานะสำหรับแสดง Loader
    const [isEmailSent, setIsEmailSent] = useState(false); // ตรวจสอบว่าอีเมลถูกส่งแล้วหรือไม่
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false); // Stop loading after timeout
        }, 0); // Adjust the timeout duration as needed

        return () => clearTimeout(timer); // Cleanup the timer
    }, []);

    const isValidEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z][^\s@]*@[a-zA-Z]{2,}(\.[a-zA-Z]{2,}){1,2}$/;
        return emailRegex.test(email);
    };

    const isValidPassword = (password: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
        return passwordRegex.test(password);
    };

    const sendEmail = async (email: string, otp: string) => {
        if (!email) {
            console.error("Recipient email is empty.");
            Swal.fire({
                icon: "warning",
                title: t("forgotPassword.warningTitle"),
                text: t("forgotPassword.emailEmpty"),
            });
            return;
        }

        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        const formattedTime = currentDate.toLocaleTimeString("th-TH");

        const templateParams = {
            to_email: email, // Ensure this matches the variable in your EmailJS template
            otp: otp,
            date: formattedDate,
            time: formattedTime,
        };

        try {
            await emailjs.send(
                "service_0n3cshx", // Replace with your EmailJS Service ID
                "template_ch0n7mf", // Replace with your EmailJS Template ID
                templateParams,
                "e319Tvcr3ubaWTQj6" // Replace with your EmailJS User ID
            );
            Swal.fire({
                icon: "success",
                title: t("forgotPassword.successTitle"),
                text: t("forgotPassword.otpSent"),
            });
        } catch (error) {
            console.error("Error sending email:", error);
            Swal.fire({
                icon: "error",
                title: t("forgotPassword.errorTitle"),
                text: t("forgotPassword.otpSendFailed"),
            });
        }
    };

    const sendOtp = async () => {
        if (!email) {
            Swal.fire({
                icon: "warning",
                title: t("forgotPassword.warningTitle"),
                text: t("forgotPassword.enterEmail"),
            });
            return;
        }

        if (!isValidEmail(email)) {
            Swal.fire({
                icon: "warning",
                title: t("forgotPassword.warningTitle"),
                text: t("forgotPassword.invalidEmailFormat"),
            });
            return;
        }

        setIsSendingOtp(true);

        try {
            // ตรวจสอบว่าอีเมลมีอยู่ในระบบหรือไม่
            const { exists } = await checkUserExists({ email });

            if (!exists.email.exists) {
                Swal.fire({
                    icon: "warning",
                    title: t("forgotPassword.warningTitle"),
                    text: t("forgotPassword.invalidEmail"),
                });
                return;
            }

            setUserId(exists.email._id);

            // สร้าง OTP
            const generated = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOtp(generated);

            // ส่ง OTP ผ่าน EmailJS
            await sendEmail(email, generated);
            console.log("OTP sent to email:", generated);

            // หากส่ง OTP สำเร็จ ให้เปลี่ยนสถานะ
            setIsEmailSent(true);
            Swal.fire({
                icon: "success",
                title: t("forgotPassword.successTitle"),
                text: t("forgotPassword.otpSent"),
            });
        } catch (error) {
            console.error("Error checking email existence or sending OTP:", error);
            Swal.fire({
                icon: "error",
                title: t("forgotPassword.errorTitle"),
                text: t("forgotPassword.otpSendFailed"),
            });
        } finally {
            setIsSendingOtp(false); // หยุดแสดง Loader
        }
    };

    const verifyOtp = () => {
        if (!otp) {
            Swal.fire({
                icon: "warning",
                title: t("forgotPassword.warningTitle"),
                text: t("forgotPassword.otpEmpty"),
            });
            return;
        }
        if (otp === generatedOtp) {
            setIsOtpVerified(true);
            setGeneratedOtp(""); // ลบ OTP ทิ้งหลังจากยืนยันสำเร็จ
            Swal.fire({
                icon: "success",
                title: t("forgotPassword.successTitle"),
                text: t("forgotPassword.otpVerified"),
            });
        } else {
            Swal.fire({
                icon: "warning",
                title: t("forgotPassword.warningTitle"),
                text: t("forgotPassword.invalidOtp"),
            });
        }
    };

    const resetPassword = async () => {
        if (!userId) {
            Swal.fire({
                icon: "warning",
                title: t("forgotPassword.warningTitle"),
                text: t("forgotPassword.userNotFound"),
            });
            window.location.href = "/login";
            return;
        }

        if (!newPassword || !confirmPassword) {
            Swal.fire({
                icon: "warning",
                title: t("forgotPassword.warningTitle"),
                text: t("forgotPassword.fillAllFields"),
            });
            return;
        }

        if (!isValidPassword(newPassword)) {
            Swal.fire({
                icon: "warning",
                title: t("forgotPassword.warningTitle"),
                text: t("forgotPassword.invalidPassword"),
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: "warning",
                title: t("forgotPassword.warningTitle"),
                text: t("forgotPassword.passwordsDoNotMatch"),
            });
            return;
        }

        try {
            // ใช้ API updateUserProfile เพื่ออัปเดตรหัสผ่าน
            await updateUserProfile(userId, { password: newPassword });
            Swal.fire({
                icon: "success",
                title: t("forgotPassword.successTitle"),
                text: t("forgotPassword.passwordResetSuccess"),
            });
            window.location.href = "/login";
        } catch (error) {
            console.error("Error resetting password:", error);
            Swal.fire({
                icon: "error",
                title: t("forgotPassword.errorTitle"),
                text: t("forgotPassword.resetPasswordFailed"),
            });
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

    return (
        <div>
            <Navbar scrollToSection={scrollToSection} aboutRef={aboutRef} partnerRef={partnerRef} contactRef={contactRef} />
            <div className="w-full h-[90vh] mt-[5rem]">
                <div className="relative w-full h-full flex items-center justify-center">
                    <img src="/Images/AINongtoy/mainbg.png" alt="" className="w-full h-full object-cover" />
                    <div className="absolute max-w-[375px] w-full p-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <Loader className="animate-spin text-[#0CACF3]" size={50} />
                            </div>
                        ) :
                            <div>
                                <h1 className="text-4xl font-semibold mb-3">{t("forgotPassword.title")}</h1>
                                {!isOtpVerified ? (
                                    <>
                                        <p className="font-extralight">
                                            {isEmailSent
                                                ? t("forgotPassword.enterOtp")
                                                : t("forgotPassword.enterEmail")}
                                        </p>
                                        {!isEmailSent ? (
                                            // แสดงส่วนกรอกอีเมลและปุ่มส่ง OTP
                                            <>
                                                <form className="flex flex-col justify-between gap-4 w-full h-[70%] pt-5">
                                                    <input
                                                        className="block mb-2"
                                                        type="email"
                                                        placeholder={t("forgotPassword.emailPlaceholder")}
                                                        maxLength={100}
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="h-10 w-full text-sm flex items-center justify-center gap-2"
                                                        onClick={() => {
                                                            sendOtp();
                                                        }}
                                                    >
                                                        {isSendingOtp ? <Loader className="animate-spin text-[#0CACF3]" size={20} /> : t("forgotPassword.sendOtpButton")}
                                                    </button>
                                                </form>

                                                <div>
                                                    {email && !isValidEmail(email) ? (
                                                        <p className="text-yellow-500 text-sm mt-4">{t("forgotPassword.invalidEmailFormat")}</p>
                                                    ) : (
                                                        <p className="text-transparent text-sm mt-4">{t("forgotPassword.invalidEmailFormat")}</p>
                                                    )}
                                                </div>

                                            </>
                                        ) : (
                                            // แสดงส่วนกรอก OTP และปุ่ม Verify
                                            <>
                                                <form className="flex flex-col justify-between gap-4 w-full h-[70%] pt-5">
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
                                                        {t("forgotPassword.verifyOtpButton")}
                                                    </button>
                                                </form>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <p className="font-extralight">{t("forgotPassword.enterNewPassword")}</p>
                                        <form className="flex flex-col justify-between gap-4 w-full h-[70%] pt-5">
                                            <PasswordInput
                                                id="newPassword"
                                                name="newPassword"
                                                label={t("forgotPassword.newPasswordLabel")}
                                                placeholder={t("forgotPassword.newPasswordPlaceholder")}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                            <PasswordInput
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                label={t("forgotPassword.confirmPasswordLabel")}
                                                placeholder={t("forgotPassword.confirmPasswordPlaceholder")}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="h-[40px] mt-2"
                                                onClick={resetPassword}
                                            >
                                                {t("forgotPassword.resetPasswordButton")}
                                            </button>
                                        </form>

                                        <div>
                                            {newPassword && confirmPassword && newPassword !== confirmPassword ? (
                                                <p className="text-yellow-500 text-sm mt-4 h-[60px]">{t("forgotPassword.passwordsDoNotMatch")}</p>
                                            ) : newPassword && !isValidPassword(newPassword) ? (
                                                <p className="text-yellow-500 text-sm mt-4 h-[60px]">
                                                    {t("forgotPassword.invalidPassword")}
                                                </p>
                                            ) : (
                                                <p className="text-transparent text-sm mt-4 h-[60px]">
                                                    {t("forgotPassword.invalidPassword")}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        /* Stop loading */}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPassword;