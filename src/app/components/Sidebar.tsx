"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import Link from "next/link";
import {
  Users,
  Inbox,
  ChartBarBig,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useTokenValidation } from "@/utils/useTokenValidation";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function Sidebar({
  setIsCollapsed,
  isCollapsed,
}: {
  setIsCollapsed: any;
  isCollapsed: any;
}) {
  const { t, i18n } = useTranslation();
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };

  useTokenValidation();

  const navItems = [
    {
      icon: <Users size={18} />,
      label: t("Sidebar.Users"),
      to: "/user-management",
    },
    {
      icon: <Inbox size={18} />,
      label: t("Sidebar.Orders"),
      to: "/order-management",
    },
    {
      icon: <Sparkles size={18} />,
      label: t("Sidebar.Keywords"),
      to: "/keyword-management",
    },
    {
      icon: <ChartBarBig size={18} />,
      label: t("Sidebar.Dashboard"),
      to: "/dashboard",
    },
  ];

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const confirmLogout = () => {
    Swal.fire({
      title: t("Sidebar.Warning.LogOutTitle"),
      text: t("Sidebar.Warning.LogOutText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#51536D",
      confirmButtonText: t("Sidebar.Warning.Confirm"),
      cancelButtonText: t("Sidebar.Warning.Cancel"),
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-full py-4 text-white transition-all duration-300 ease-in-out ${isCollapsed ? "w-16 px-2" : "w-[184px] px-3"}`}
    >
      <div
        className={`relative flex h-full flex-col rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,20,42,0.96),rgba(7,13,27,0.94))] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur transition-all duration-300 ${isCollapsed ? "p-2" : "p-3"}`}
      >
        <button
          onClick={toggleSidebar}
          className={`absolute top-6 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#091224] text-[#cfe8ff] transition hover:border-[#67dfff]/40 hover:text-white ${isCollapsed ? "-right-2" : "-right-3"}`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className={`flex items-center overflow-hidden ${isCollapsed ? "justify-center" : "gap-3 px-1"}`}>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#67dfff]/20 bg-[#0c1b3d]">
            <img
              src="/Images/AINongtoy/BotLogo.png"
              alt="AI Design"
              className="h-7 w-7 object-contain"
            />
          </div>
          <div
            className={`overflow-hidden transition-all duration-200 ${isCollapsed ? "max-w-0 opacity-0" : "max-w-[116px] opacity-100"}`}
          >
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#7fe7ff]">
                Admin
              </p>
              <p className="mt-1 text-sm font-semibold text-white">NongToy</p>
            </div>
          </div>
        </div>

        {!isCollapsed ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
            <div className="grid grid-cols-2 gap-1">
              {(["en", "th"] as const).map((lang) => {
                const isActive = i18n.language === lang;
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => changeLanguage(lang)}
                    className={`h-9 rounded-xl px-0 text-xs font-semibold uppercase tracking-[0.18em] ${isActive
                        ? "border border-[#67dfff]/30 bg-[#0c1b3d] text-[#8becff]"
                        : "bg-transparent text-white/55 hover:bg-white/[0.05] hover:text-white"
                      }`}
                  >
                    {t(`Sidebar.LanguageSwitcher.${lang.toUpperCase()}`)}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <nav className="mt-6 flex flex-1 flex-col gap-2 text-[14px]">
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isCollapsed={isCollapsed}
            />
          ))}

          <div className="mt-auto pt-5">
            <div className="mb-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <button
              type="button"
              onClick={confirmLogout}
              title={isCollapsed ? t("Sidebar.Logout") : undefined}
              className={`group flex w-full items-center overflow-hidden rounded-2xl border py-3 text-left transition ${isCollapsed
                  ? "justify-center px-0 border-white/8 bg-transparent text-white/62 hover:border-[#ff8b8b]/16 hover:bg-[#2a1116]/42 hover:text-[#ffc2c2]"
                  : "gap-3 px-3 border-white/8 bg-transparent text-white/62 hover:border-[#ff8b8b]/16 hover:bg-[#2a1116]/42 hover:text-[#ffc2c2]"
                }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition">
                <LogOut size={18} />
              </span>
              <span
                className={`overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-200 ${isCollapsed ? "max-w-0 opacity-0" : "max-w-[112px] opacity-100"}`}
              >
                {t("Sidebar.Logout")}
              </span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  to,
  isCollapsed,
  onClick,
  labelClass = "",
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  isCollapsed: boolean;
  onClick?: () => void;
  labelClass?: string;
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(to);

  return (
    <Link
      href={to}
      title={isCollapsed ? label : undefined}
      className={`group flex items-center overflow-hidden rounded-2xl py-3 transition ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"} ${isActive
          ? "border border-[#67dfff]/20 bg-[linear-gradient(135deg,rgba(16,36,72,0.98),rgba(11,24,47,0.98))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          : "border border-transparent text-white/68 hover:border-white/8 hover:bg-white/[0.05] hover:text-white"
        }`}
      onClick={onClick}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${isActive ? "bg-[#0f2446] text-[#89ebff]" : "text-current group-hover:bg-white/[0.05]"}`}
      >
        {icon}
      </span>
      <span
        className={`truncate whitespace-nowrap text-sm font-medium transition-all duration-200 ${labelClass} ${isCollapsed ? "max-w-0 opacity-0" : "max-w-[124px] opacity-100"}`}
      >
        {label}
      </span>
    </Link>
  );
}
