/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  PieChart,
  Pie,
} from "recharts";
import { useState, useEffect } from "react";
import { Loader } from "lucide-react"; // เพิ่มการ import
import Sidebar from "../components/Sidebar";
import { getAllOrdersForAdmin } from "@/api/orderAPI";

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [refunds, setRefunds] = useState(0);
  const [selectedChart, setSelectedChart] = useState("Material");
  const [isLoading, setIsLoading] = useState(true); // เพิ่มสถานะ isLoading

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
      } finally {
        setIsLoading(false); // โหลดเสร็จ
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

  // กราฟแผนภูมิวงกลม
  const COLORS = ["#A3E4FF", "#0AACF0", "#37438F", "#0578AB"];

  const materialData = orders.reduce((acc: any[], order: any) => {
    if (order.material) {
      // ตรวจสอบว่า materials มีค่า
      const existingMaterial = acc.find((item) => item.name === order.material);

      if (existingMaterial) {
        existingMaterial.value += 1; // นับจำนวนครั้งที่เจอวัสดุ
      } else {
        acc.push({ name: order.material, value: 1 });
      }
    }
    return acc;
  }, []);

  const assemblyData = orders.reduce((acc: any[], order: any) => {
    if (order.assembly) {
      const existingAssembly = acc.find((item) => item.name === order.assembly);

      if (existingAssembly) {
        existingAssembly.value += 1;
      } else {
        acc.push({ name: order.assembly, value: 1 });
      }
    }
    return acc;
  }, []);

  const paintingData = orders.reduce((acc: any[], order: any) => {
    if (order.painting) {
      const existingPainting = acc.find((item) => item.name === order.painting);

      if (existingPainting) {
        existingPainting.value += 1;
      } else {
        acc.push({ name: order.painting, value: 1 });
      }
    }
    return acc;
  }, []);

  const dataToDisplay =
    selectedChart === "Material"
      ? materialData
      : selectedChart === "Assembly"
        ? assemblyData
        : paintingData;

  const ChartLineData = orders
    .filter((order) => order.paymentStatus === "Paid") // กรองเฉพาะคำสั่งซื้อที่ชำระเงินแล้ว
    .reduce((acc: any[], order: any) => {
      const date = new Date(order.createdAt).toLocaleDateString(); // เก็บวันที่ในรูปแบบที่ง่ายต่อการแสดง
      const existingEntry = acc.find((entry) => entry.date === date);

      if (existingEntry) {
        existingEntry.totalQuantity += order.quantity; // เพิ่มจำนวนสินค้าของวันนั้น
      } else {
        acc.push({ date, totalQuantity: order.quantity }); // ถ้ายังไม่มีข้อมูลในวันนั้น ให้เริ่มนับสินค้าจำนวนที่สั่ง
      }

      return acc;
    }, []);


  return (
    <div className="text-white bg-[#212121] h-screen overflow-x-auto">
      <Sidebar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />

      <div
        className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-[155px]"
          }`}
      >
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-[80vh]">
            <Loader className="animate-spin text-[#0CACF3]" size={48} />
          </div>
        ) : (
          <>
            {/* แสดงค่าที่ดึงจาก API */}
            <div className="grid sm:grid-cols-5 gap-4 mb-8 ">
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

            <div className="mb-8 flex sm:flex-row flex-col items-center justify-between space-x-4">
              {/* BarChart */}
              <div className="sm:w-1/3 w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
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
              <div className="sm:w-2/3 w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartLineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 14 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend
                      formatter={() => "Total orders"} // เปลี่ยนชื่อ Legend
                    />
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

            <div className="mb-8 flex sm:flex-row flex-col items-center justify-between space-x-4">
              <div className="sm:w-1/4 w-full p-4">
                {/* Dropdown สำหรับเลือกแผนภูมิ */}
                <select
                  style={{
                    backgroundColor: "#2F2F2F",
                    color: "white",
                    width: "50%",
                    margin: "0 auto",
                    display: "block",
                    border: "1px solid #5B5B5B",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                  className="mb-4 p-2 border rounded"
                  value={selectedChart}
                  onChange={(e) => setSelectedChart(e.target.value)}
                >
                  <option value="Material">Material</option>
                  <option value="Assembly">Assembly</option>
                  <option value="Painting">Painting</option>
                </select>

                <div className="flex flex-col items-center justify-center">
                  {/* Heading above the chart */}
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Tooltip
                        formatter={(value, name) => [`${value} orders`, name]}
                      />

                      <Pie
                        data={dataToDisplay} // ใช้ข้อมูลที่เลือกมาแสดง
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {dataToDisplay.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>

                      <Legend
                        payload={dataToDisplay.map((entry, index) => ({
                          value: entry.name,
                          type: "circle",
                          color: COLORS[index % COLORS.length],
                        }))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <h2 className="text-[16px] font-medium mb-4">
                    {selectedChart} Orders Overview
                  </h2>
                </div>
              </div>

              <div className="sm:w-3/4 w-full p-4">
                <div className="flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={ChartLineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 14 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend
                        formatter={() => "Total Quantity"} // เปลี่ยนชื่อ Legend
                      />
                      <Line
                        type="monotone"
                        dataKey="totalQuantity" // ใช้ totalQuantity เป็น dataKey
                        stroke="#0AACF0"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </>
        )}
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
