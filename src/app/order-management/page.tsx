"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAllOrdersForAdmin } from "@/api/orderAPI";
import { Table, Dropdown, Menu } from "antd";
import { Ellipsis, Eye, Edit, Trash } from "lucide-react";

export default function OrderManagement() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchAdminOrders = async () => {
      if (!token) return;
      try {
        const data = await getAllOrdersForAdmin(token);
        setOrders(data.data || []);
      } catch (error) {
        console.error("Error fetching admin orders:", error);
      }
    };

    if (token) {
      fetchAdminOrders();
    }
  }, [token]);

  const menu = (
    <Menu className="custom-menu">
      <Menu.Item key="view">
        <div className="menu-item-content">
          <Eye size={16} />
          <span>View</span>
        </div>
      </Menu.Item>
      <Menu.Item key="edit">
        <div className="menu-item-content">
          <Edit size={16} />
          <span>Edit</span>
        </div>
      </Menu.Item>
      <Menu.Item key="delete" danger>
        <div className="menu-item-content">
          <Trash size={16} />
          <span>Delete</span>
        </div>
      </Menu.Item>
    </Menu>
  );
  
  const columns = [
    { title: "Order ID", dataIndex: "_id", key: "_id" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
    { title: "Customer", dataIndex: "user", key: "user" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Qty", dataIndex: "quantity", key: "quantity" },
    { title: "Total", dataIndex: "total", key: "total" },
    { title: "Payment", key: "payment", render: () => "Unpaid" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Dropdown overlay={menu}>
          <Ellipsis className="cursor-pointer" />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="text-white bg-[#212121] h-screen overflow-hidden">
      <Sidebar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-[155px]"
        }`}
      >
        <h1 className="text-3xl font-bold mb-4">Orders</h1>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          className="custom-table"
          rowClassName={() => "custom-hover-row"} // เพิ่ม class ให้แถว
        />
      </div>
    </div>
  );
}
