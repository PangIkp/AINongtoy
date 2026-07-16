"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import { checkUserExists, updateUserProfile } from "../../api/userAPI";
import emailjs from "emailjs-com";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../i18n";

const EMAILJS_SERVICE_ID = "service_i9d8089";
const EMAILJS_TEMPLATE_ID = "template_vyiab4s";
const EMAILJS_PUBLIC_KEY = "TMP5T0OL8X3jkzeBb";

const ForgotPassword = () => {
  const { t } = useTranslation();

  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const isValidEmail = (value: string) => {
    const emailRegex = /^[a-zA-Z][^\s@]*@[a-zA-Z]{2,}(\.[a-zA-Z]{2,}){1,2}$/;
    return emailRegex.test(value);
  };

  const isValidPassword = (value: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(value);
  };

  const emailError =
    email && !isValidEmail(email) ? t("forgotPassword.invalidEmailFormat") : "";
  const passwordError =
    newPassword && !isValidPassword(newPassword)
      ? t("forgotPassword.invalidPassword")
      : confirmPassword && newPassword !== confirmPassword
        ? t("forgotPassword.passwordsDoNotMatch")
        : "";

  const currentStep = isOtpVerified ? 3 : isEmailSent ? 2 : 1;

  const steps = useMemo(
    () => [
      {
        id: 1,
        label: t("forgotPassword.stepEmail"),
        icon: Mail,
      },
      {
        id: 2,
        label: t("forgotPassword.stepOtp"),
        icon: ShieldCheck,
      },
      {
        id: 3,
        label: t("forgotPassword.stepPassword"),
        icon: LockKeyhole,
      },
    ],
    [t]
  );

  const sendEmail = async (recipientEmail: string, otpCode: string) => {
    if (!recipientEmail) {
      Swal.fire({
        icon: "warning",
        title: t("forgotPassword.warningTitle"),
        text: t("forgotPassword.emailEmpty"),
      });
      return false;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = currentDate.toLocaleTimeString("th-TH");

    const templateParams = {
      to_email: recipientEmail,
      otp: otpCode,
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
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      Swal.fire({
        icon: "error",
        title: t("forgotPassword.errorTitle"),
        text: t("forgotPassword.otpSendFailed"),
      });
      return false;
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

      const generated = Math.floor(100000 + Math.random() * 900000).toString();
      const sent = await sendEmail(email, generated);

      if (!sent) return;

      setGeneratedOtp(generated);
      setIsEmailSent(true);
      setOtp("");

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
      setIsSendingOtp(false);
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
      setGeneratedOtp("");
      Swal.fire({
        icon: "success",
        title: t("forgotPassword.successTitle"),
        text: t("forgotPassword.otpVerified"),
      });
      return;
    }

    Swal.fire({
      icon: "warning",
      title: t("forgotPassword.warningTitle"),
      text: t("forgotPassword.invalidOtp"),
    });
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

    setIsResettingPassword(true);

    try {
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
    } finally {
      setIsResettingPassword(false);
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

  const otpDigits = Array.from({ length: 6 }, (_, index) => otp[index] || "");
  const cardInputClassName =
    "mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#67dfff]/45 focus:bg-[#102247]";

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
          {isLoading ? (
            <div className="flex w-full justify-center py-24">
              <Loader className="animate-spin text-[#0CACF3]" size={48} />
            </div>
          ) : (
            <div className="grid w-full gap-6 xl:grid-cols-[0.92fr,1.08fr]">
              <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,27,62,0.9),rgba(8,17,36,0.95))] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#67dfff]/20 bg-[#0b1b3e]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-[#88ebff]">
                  <Sparkles size={14} />
                  Secure Recovery
                </div>

                <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">
                  {t("forgotPassword.title")}
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#aebddb] sm:text-base">
                  {t("forgotPassword.description")}
                </p>

                <div className="mt-8 grid gap-4">
                  {steps.map(({ id, label, icon: Icon }) => {
                    const isDone = currentStep > id;
                    const isCurrent = currentStep === id;

                    return (
                      <div
                        key={id}
                        className={`rounded-[24px] border p-4 transition ${isCurrent
                            ? "border-[#67dfff]/30 bg-[#102247]"
                            : "border-white/10 bg-white/[0.04]"
                          }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${isDone || isCurrent
                                ? "border-[#67dfff]/30 bg-[#0d1f42] text-[#88ebff]"
                                : "border-white/10 bg-white/[0.04] text-white/55"
                              }`}
                          >
                            {isDone ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                                0{id}
                              </span>
                              {isCurrent ? (
                                <span className="rounded-full border border-[#67dfff]/20 bg-[#0b1b3e]/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#88ebff]">
                                  Active
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-2 text-base font-semibold text-white">
                              {label}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-white/58">
                              {id === 1
                                ? t("forgotPassword.emailHint")
                                : id === 2
                                  ? t("forgotPassword.otpHint")
                                  : t("forgotPassword.passwordHint")}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl border border-[#67dfff]/20 bg-[#0d1733] p-3 text-[#88ebff]">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {t("forgotPassword.helpTitle")}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/58">
                        {t("forgotPassword.helpDescription")}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,38,0.96),rgba(7,12,25,0.98))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)] backdrop-blur sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#88ebff]">
                      Step {currentStep} / 3
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                      {isOtpVerified
                        ? t("forgotPassword.enterNewPassword")
                        : isEmailSent
                          ? t("forgotPassword.enterOtp")
                          : t("forgotPassword.enterEmail")}
                    </h2>
                  </div>

                  <Link
                    href="/login"
                    className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                  >
                    <ArrowLeft size={16} />
                    {t("forgotPassword.backToLogin")}
                  </Link>
                </div>

                {!isOtpVerified ? (
                  !isEmailSent ? (
                    <div className="mt-8">
                      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-white/80"
                        >
                          {t("forgotPassword.emailPlaceholder")}
                        </label>
                        <input
                          id="email"
                          type="email"
                          placeholder={t("forgotPassword.emailPlaceholder")}
                          maxLength={100}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={cardInputClassName}
                        />
                        <p className="mt-3 min-h-5 text-sm text-[#f6c676]">
                          {emailError || " "}
                        </p>

                        <button
                          type="button"
                          className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#67dfff]/40 bg-[linear-gradient(135deg,#0CACF3,#67dfff)] px-6 text-sm font-semibold text-[#03111f] shadow-[0_14px_32px_rgba(12,172,243,0.28)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={sendOtp}
                          disabled={isSendingOtp}
                        >
                          {isSendingOtp ? (
                            <Loader size={18} className="animate-spin" />
                          ) : (
                            <Mail size={18} />
                          )}
                          {t("forgotPassword.sendOtpButton")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-8">
                      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-white">
                              {t("forgotPassword.otpSentTo")}
                            </p>
                            <p className="mt-2 break-all text-sm text-[#88ebff]">
                              {email}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={sendOtp}
                            disabled={isSendingOtp}
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white disabled:opacity-60"
                          >
                            {t("forgotPassword.resendOtpButton")}
                          </button>
                        </div>

                        <div className="mt-6 grid grid-cols-6 gap-2 sm:gap-3">
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
                          {t("forgotPassword.verifyOtpButton")}
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="mt-8">
                    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                      <div>
                        <label
                          htmlFor="newPassword"
                          className="text-sm font-medium text-white/80"
                        >
                          {t("forgotPassword.newPasswordLabel")}
                        </label>
                        <div className="relative">
                          <input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder={t("forgotPassword.newPasswordPlaceholder")}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={cardInputClassName}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 bg-transparent p-0 text-xs font-semibold uppercase tracking-[0.18em] text-white/45 hover:text-[#88ebff]"
                          >
                            {showNewPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>

                      <div className="mt-5">
                        <label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium text-white/80"
                        >
                          {t("forgotPassword.confirmPasswordLabel")}
                        </label>
                        <div className="relative">
                          <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t(
                              "forgotPassword.confirmPasswordPlaceholder"
                            )}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={cardInputClassName}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-4 top-1/2 mt-1 -translate-y-1/2 bg-transparent p-0 text-xs font-semibold uppercase tracking-[0.18em] text-white/45 hover:text-[#88ebff]"
                          >
                            {showConfirmPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>

                      <p className="mt-4 min-h-10 text-sm text-[#f6c676]">
                        {passwordError || " "}
                      </p>

                      <button
                        type="button"
                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#67dfff]/40 bg-[linear-gradient(135deg,#0CACF3,#67dfff)] px-6 text-sm font-semibold text-[#03111f] shadow-[0_14px_32px_rgba(12,172,243,0.28)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={resetPassword}
                        disabled={isResettingPassword}
                      >
                        {isResettingPassword ? (
                          <Loader size={18} className="animate-spin" />
                        ) : (
                          <KeyRound size={18} />
                        )}
                        {t("forgotPassword.resetPasswordButton")}
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
