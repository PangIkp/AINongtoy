/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { login, loginWithGoogle, loginWithFacebook } from "@/api/authAPI";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { Loader, LockKeyhole, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import {
  getAuth,
  signInWithPopup,
  FacebookAuthProvider,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";
import { getFirebaseApp, hasFirebaseConfig } from "@/utils/firebase";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

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
  const { t } = useTranslation();
  const auth = getClientAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    if (!auth) return;

    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);

        if (!result) return;

        const currentUser = result.user;
        setGoogleUser({
          uid: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName,
          photo: currentUser.photoURL,
        });
      } catch (error) {
        console.error("Error handling redirect result:", error);
      }
    };

    checkRedirectResult();
  }, [auth]);

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

    setIsSubmitting(true);

    try {
      const data = await login(username, password);

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

      window.location.href = data.data.role === "admin" ? "/user-management" : "/";
    } catch (error: any) {
      const translatedMessage = t(`login.errors.${error.message}`, error.message);

      Swal.fire({
        icon: "error",
        title: String(t("login.errorTitle")),
        text: String(translatedMessage),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const currentUser = result.user;

      setGoogleUser({
        uid: currentUser.uid,
        email: currentUser.email,
        name: currentUser.displayName,
        photo: currentUser.photoURL,
      });

      if (currentUser.email) {
        const displayName = currentUser.displayName || "";
        await loginWithGoogle({
          email: currentUser.email,
          firstName: displayName.split(" ")[0] || "",
          lastName: displayName.split(" ")[1] || "",
        });
      } else {
        throw new Error("User email is null");
      }

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
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;

      if (currentUser.email) {
        const displayName = currentUser.displayName || "";
        await loginWithFacebook({
          email: currentUser.email,
          firstName: displayName.split(" ")[0] || "",
          lastName: displayName.split(" ")[1] || "",
        });
      } else {
        throw new Error("User email is null");
      }

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

  const inputClassName =
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
            <section className="mx-auto w-full max-w-[560px] rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,38,0.96),rgba(7,12,25,0.98))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.42)] backdrop-blur sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-4xl font-semibold tracking-tight text-white">
                  {t("login.welcomeBack")}
                </h1>
                <Link
                  href="/signup"
                  className="hidden h-11 items-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white sm:inline-flex"
                >
                  {t("login.signUp")}
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="mt-8">
                  <div>
                    <label
                      htmlFor="username"
                      className="text-sm font-medium text-white/80"
                    >
                      {t("login.username")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        placeholder={t("login.username")}
                        maxLength={40}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={inputClassName}
                      />
                      <Mail
                        size={16}
                        className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-white/30"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-white/80"
                    >
                      {t("login.password")}
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("login.password")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <label
                      htmlFor="remember"
                      className="flex cursor-pointer items-center gap-3 text-sm text-white/72"
                    >
                      <input
                        className="h-4 w-4 rounded border-white/20 bg-transparent accent-[#0CACF3]"
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      {t("login.rememberMe")}
                    </label>

                    <Link
                      href="/forgotpassword"
                      className="text-sm font-medium text-[#88ebff] transition hover:text-white"
                    >
                      {t("login.forgotPassword")}
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#67dfff]/40 bg-[linear-gradient(135deg,#0CACF3,#67dfff)] px-6 text-sm font-semibold text-[#03111f] shadow-[0_14px_32px_rgba(12,172,243,0.28)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <LockKeyhole size={18} />
                    )}
                    {t("login.loginButton")}
                  </button>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                      {t("login.socialDivider")}
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={!firebaseReady}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/78 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FcGoogle size={20} />
                      Google
                    </button>

                    <button
                      type="button"
                      onClick={handleFacebookLogin}
                      disabled={!firebaseReady}
                      className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/78 transition hover:border-[#7fb4ff]/30 hover:bg-[#102247] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FaFacebookF size={18} className="text-[#7fb4ff]" />
                      Facebook
                    </button>
                  </div>

                  {!firebaseReady ? (
                    <p className="mt-4 text-sm text-[#f6c676]">
                      {t("login.socialDisabled")}
                    </p>
                  ) : null}
                </div>

                <p className="mt-5 text-center text-sm text-white/58">
                  {t("login.notRegistered")}{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-[#88ebff] transition hover:text-white"
                  >
                    {t("login.signUp")}
                  </Link>
                </p>

                {googleUser?.email ? (
                  <p className="mt-4 text-center text-xs text-white/35">
                    {googleUser.email}
                  </p>
                ) : null}
              </form>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;
