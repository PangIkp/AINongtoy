/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const { t, i18n } = useTranslation(); // ใช้ react-i18next
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang); // เปลี่ยนภาษา
  };

  useTokenValidation();

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
    <div
      className={`fixed top-0 z-50 left-0 h-full bg-[#2F2F2F] text-white p-4 pt-6 flex flex-col items-center transition-all duration-300 ease-in-out ${isCollapsed ? "w-16" : "w-[140px]"
        }`}
    >
      <img
        src="/Images/AINongtoy/BotLogo.png"
        alt="AI Design"
        className="w-10 mb-6"
      />

      {/* Toggle button to collapse or expand sidebar */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 left-full transform -translate-x-1/2 -translate-y-1/2 bg-[#2F2F2F] p-2 rounded-full text-white hover:bg-[#2F2F2F]"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
      {/* Language Switcher */}
      <div className="place-items-center place-content-center">
        <div className="mt-4 w-[55px]">
          <label htmlFor="language-select" className="hidden">
            {t("Sidebar.Language")} {/* เพิ่มข้อความแปลสำหรับชื่อภาษา */}
          </label>
          <select
            id="language-select"
            onChange={(e) => changeLanguage(e.target.value)}
            className="text-white bg-transparent border-transparent px-2 py-1 rounded hover:bg-[#787678] w-full"
            defaultValue={i18n.language} // ตั้งค่าภาษาเริ่มต้น
          >
            <option className="bg-[#212121]" value="en">EN</option>
            <option className="bg-[#212121]" value="th">TH</option>
          </select>
        </div>
      </div>

      <nav className="space-y-4 mt-8 text-[14px] flex flex-col justify-between h-full">
        <div className="flex-grow">
          <SidebarItem
            icon={<Users size={20} />}
            label={t("Sidebar.Users")}
            to="/user-management"
            isCollapsed={isCollapsed}
          />
          <SidebarItem
            icon={<Inbox size={20} />}
            label={t("Sidebar.Orders")}
            to="/order-management"
            isCollapsed={isCollapsed}
          />

          <SidebarItem
            icon={<Sparkles size={20} />}
            label="Keyword"
            to="/keyword-management"
            isCollapsed={isCollapsed}
          />

          <SidebarItem
            icon={<ChartBarBig size={20} />}
            label={t("Sidebar.Dashboard")}
            to="/dashboard"
            isCollapsed={isCollapsed}
          />
        </div>



        {/* Logout button */}
        <div
          onClick={confirmLogout}
          className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-[#525152] text-red-400"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-red-400">{t("Sidebar.Logout")}</span>}
        </div>
      </nav>
    </div>
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
      className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-[#525152] ${isActive ? "bg-[#787678]" : ""
        }`}
      onClick={onClick}
    >
      {icon}
      {!isCollapsed && <span className={labelClass}>{label}</span>}
    </Link>
  );
}
