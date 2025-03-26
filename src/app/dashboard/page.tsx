"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="text-white bg-[#212121] flex">
            {/* Pass isCollapsed and setIsCollapsed to Sidebar */}
            <Sidebar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />

            {/* Content area with dynamic margin-left */}
            <div
                className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
                    isCollapsed ? "ml-16" : "ml-[130px]"
                }`}
            >
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

                <div className="grid grid-cols-5 gap-4 mb-8">
                    <Card title="Total orders" value="120" />
                    <Card title="Total order amount" value="120,000 ฿" />
                    <Card title="Avg. order value" value="1,000 ฿" />
                    <Card title="Order quantity" value="24" />
                    <Card title="Returns" value="0" />
                </div>
            </div>
        </div>
    );
}

function Card({ title, value }: { title: string; value: string }) {
    return (
        <div className="bg-[#2F2F2F] rounded-lg w-full">
            <div className="bg-[#0AACF0] h-1 rounded-t-lg"></div> {/* Blue bar */}
            <div className="p-4">
                <p className="text-sm text-[#B8B8B8]">{title}</p>
                <p className="text-xl font-semibold">{value}</p>
            </div>
        </div>
    );
}
