"use client";
import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Swal from "sweetalert2";

const ForgotPassword = () => {
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
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const sendOtp = () => {
        if (!email) {
            Swal.fire("Error", "Please enter your email", "error");
            return;
        }
        const generated = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(generated);
        Swal.fire("OTP Sent", `Your OTP is: ${generated}`, "success"); // Replace this with actual email sending logic
    };

    const verifyOtp = () => {
        if (!otp) {
            Swal.fire("Error", "OTP cannot be empty", "error");
            return;
        }
        if (otp === generatedOtp) {
            setIsOtpVerified(true);
            Swal.fire("Success", "OTP verified successfully", "success");
        } else {
            Swal.fire("Error", "Invalid OTP", "error");
        }
    };

    const resetPassword = () => {
        if (!newPassword || !confirmPassword) {
            Swal.fire("Error", "Please fill in all fields", "error");
            return;
        }
        if (newPassword !== confirmPassword) {
            Swal.fire("Error", "Passwords do not match", "error");
            return;
        }
        Swal.fire("Success", "Password reset successfully", "success");
        window.location.href = "/login";
        // Add logic to update the password in the backend
    };

    return (
        <div>
            <Navbar scrollToSection={scrollToSection} aboutRef={aboutRef} partnerRef={partnerRef} contactRef={contactRef} />
            <div className="w-full h-[90vh] mt-[5rem]">
                <div className="relative w-full h-full flex items-center justify-center">
                    <img src="/Images/AINongtoy/mainbg.png" alt="" className="w-full h-full object-cover" />
                    <div className="absolute max-w-[375px] w-full p-4">
                        <div>
                            <h1 className="text-4xl font-semibold mb-3">Forgot Password</h1>
                            {!isOtpVerified ? (
                                <>
                                    <p className="font-extralight">Enter your email to receive an OTP</p>
                                    <form className="flex flex-col justify-between gap-4 w-full h-[70%] pt-5">
                                        <div className="flex items-center justify-between gap-4">
                                            <input
                                                className="block"
                                                type="email"
                                                placeholder="Email"
                                                maxLength={100}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <button type="button" className="h-10 w-32 text-sm" onClick={sendOtp}>
                                                Send OTP
                                            </button>
                                        </div>

                                        <input
                                            className="block"
                                            type="text"
                                            placeholder="Enter OTP"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                        <button type="button" className="h-[40px]" onClick={verifyOtp}>
                                            Verify OTP
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <p className="font-extralight">Enter your new password</p>
                                    <form className="flex flex-col justify-between gap-4 w-full h-[70%] pt-5">
                                        <input
                                            className="block"
                                            type="password"
                                            placeholder="New Password"
                                            maxLength={100}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <input
                                            className="block"
                                            type="password"
                                            placeholder="Confirm New Password"
                                            maxLength={100}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="h-[40px]"
                                            onClick={resetPassword}
                                        >
                                            Reset Password
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPassword;