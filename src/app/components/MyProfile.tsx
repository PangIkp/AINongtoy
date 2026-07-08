"use client";

import React, { useEffect, useState } from "react";
import { getUserData } from "../../utils/localStorageUtils";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next"; // Import useTranslation
import '../../i18n'; // Import i18n for translations

interface MyProfileProps {
  followMessage?: string; // เพิ่ม props สำหรับข้อความ (ไม่บังคับ)
}

function MyProfile({ followMessage = "" }: MyProfileProps) {
  const { t } = useTranslation(); // Initialize useTranslation
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const parsedUser = getUserData();
    if (parsedUser) {
      setFirstName(parsedUser.firstName);
      setLastName(parsedUser.lastName);
      setEmail(parsedUser.email ?? null);
      setUsername(parsedUser.username ?? null);
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const confirmLogout = () => {
    Swal.fire({
      title: t('Swal.logout.title'), // Use translation key
      text: t('Swal.logout.text'), // Use translation key
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#51536D',
      confirmButtonText: t('Swal.logout.confirmButton'), // Use translation key
      cancelButtonText: t('Swal.logout.cancelButton'), // Use translation key
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  };

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(20,32,66,0.96),rgba(10,18,40,0.92))] shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
      <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-5">
          <div className="flex h-[78px] w-[78px] items-center justify-center rounded-[26px] border border-white/10 bg-[#0D1732] shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
            <img
              className="h-[44px] w-[44px] object-contain"
              src="/Images/AINongtoy/Profile.png"
              alt={t('profile.alt')}
            />
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#74dfff]">
                Collector Profile
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                {firstName} {lastName}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-white/65 sm:text-sm">
              {username && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  @{username}
                </span>
              )}
              {email && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  {email}
                </span>
              )}
            </div>

            <p className="max-w-2xl text-sm leading-7 text-[#afbdd8]">
              {followMessage}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a href="/editProfile">
            <button className="h-11 rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-medium text-white hover:bg-white/10">
              {t('profile.editProfile')}
            </button>
          </a>
          <button
            onClick={(e) => {
              e.preventDefault();
              confirmLogout();
            }}
            className="h-11 rounded-xl border border-red-400/35 bg-red-400/15 px-5 text-sm font-medium text-[#ffd7d7] hover:bg-red-400/22"
          >
            {t('profile.logout')}
          </button>
        </div>
      </div>
    </section>
  );
}

export default MyProfile;
