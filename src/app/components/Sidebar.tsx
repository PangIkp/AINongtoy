"use client";
import { useState } from "react";
import Link from "next/link"; 
import { Users, Inbox, ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar({ setIsCollapsed, isCollapsed } : { setIsCollapsed: any; isCollapsed: any }) {
    const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed);
    };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-[#2F2F2F] text-white p-4 pt-6 flex flex-col items-center transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-30"
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
        {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
      </button>

      <nav className="space-y-4 mt-8">
        <SidebarItem icon={<Users size={20} />} label="Users" to="/user-management" isCollapsed={isCollapsed} />
        <SidebarItem icon={<Inbox size={20} />} label="Orders" to="/order-management" isCollapsed={isCollapsed} />
      </nav>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  to,
  isCollapsed,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  isCollapsed: boolean;
}) {
  return (
    <Link href={to}>
      <div className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-[#525152]">
        {icon}
        {!isCollapsed && <span>{label}</span>} {/* Hide label when collapsed */}
      </div>
    </Link>
  );
}
