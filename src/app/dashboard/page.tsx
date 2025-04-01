"use client";
import {
  LineChart,
  Line,
  CartesianGrid,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getAllOrdersForAdmin } from "@/api/orderAPI";

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [refunds, setRefunds] = useState(0);

  // ดึง Token จาก Local Storage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fetch ข้อมูลออเดอร์
  useEffect(() => {
    const fetchAdminOrders = async () => {
      if (!token) return;
      try {
        const data = await getAllOrdersForAdmin(token);
        setOrders(data.data || []);

        // คำนวณยอดรวมทั้งหมด
        const total = data.data
          ?.filter((order: any) => order.paymentStatus === "Paid")
          .reduce((sum: number, order: any) => sum + order.total, 0);
        setTotalAmount(total || 0);

        // คำนวณยอดรวมของจำนวนสินค้า
        const quantity = data.data
          ?.filter((order: any) => order.paymentStatus === "Paid")
          .reduce((sum: number, order: any) => sum + order.quantity, 0);
        setTotalQuantity(quantity || 0);

        // นับจำนวนการคืนเงิน
        const refundCount = data.data?.filter(
          (order: any) => order.paymentStatus === "Refunded"
        ).length;
        setRefunds(refundCount || 0);
      } catch (error) {
        console.error("Error fetching admin orders:", error);
      }
    };
    if (token) {
      fetchAdminOrders();
    }
  }, [token]);

  // การคำนวณจำนวนคำสั่งซื้อในแต่ละสถานะ
  const paidCount = orders.filter(
    (order) => order.paymentStatus === "Paid"
  ).length;
  const unpaidCount = orders.filter(
    (order) => order.paymentStatus === "Unpaid"
  ).length;
  const refundedCount = orders.filter(
    (order) => order.paymentStatus === "Refunded"
  ).length;
  const totalOrdersCount = orders.length;

  const chartLineData = orders.reduce((acc: any[], order: any) => {
    const date = new Date(order.createdAt).toLocaleDateString(); // เก็บวันที่ในรูปแบบที่ง่ายต่อการแสดง
    const existingEntry = acc.find((entry) => entry.date === date);
  
    if (existingEntry) {
      existingEntry.totalOrders += 1; // เพิ่มจำนวนคำสั่งซื้อในวันนั้น
    } else {
      acc.push({ date, totalOrders: 1 }); // ถ้ายังไม่มีข้อมูลในวันนั้น ให้เริ่มนับคำสั่งซื้อที่ 1
    }
  
    return acc;
  }, []);
  

  const chartData = [
    { name: "Paid", value: paidCount },
    { name: "Unpaid", value: unpaidCount },
    { name: "Refunded", value: refundedCount },
  ];

  const getColorForIndex = (index: number) => {
    const colors = ["#A3E4FF", "#0AACF0", "#37438F"];
    return colors[index % colors.length]; // วนรอบสี
  };

  return (
    <div className="text-white bg-[#212121] h-screen overflow-auto">
      <Sidebar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />

      <div
        className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-[155px]"
        }`}
      >
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        {/* แสดงค่าที่ดึงจาก API */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <Card title="Total Orders (Paid)" value={paidCount.toString()} />
          <Card
            title="Total Purchase Amount"
            value={`${totalAmount.toLocaleString()} ฿`}
          />
          <Card
            title="Avg. Order Value"
            value={`${Number(
              (totalAmount / (orders.length || 1)).toFixed(2)
            ).toLocaleString()} ฿`}
          />
          <Card title="Order Quantity" value={totalQuantity.toString()} />
          <Card title="Refunds" value={refunds.toString()} />
        </div>

        <div className="mb-8 flex justify-between space-x-4">
          {/* BarChart */}
          <div className="w-1/3">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                <YAxis tick={{ fontSize: 14 }} />
                <Tooltip />
                {/* ใช้ Cell เพื่อกำหนดสีแต่ละ Bar */}
                <Bar dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColorForIndex(index)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* LineChart */}
          <div className="w-2/3">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartLineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 14 }}/>
                <YAxis tick={{ fontSize: 14 }}/>
                <Tooltip    />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalOrders"
                  stroke="#0AACF0"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
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
