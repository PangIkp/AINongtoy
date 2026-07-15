/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  getAllOrdersForAdmin,
  deleteOrderByAdmin,
} from "@/api/orderAPI";
import { Table, Dropdown } from "antd";
import {
  CreditCard,
  Ellipsis,
  Eye,
  Edit,
  Loader,
  Package,
  Sparkles,
  Trash,
  Truck,
} from "lucide-react";
import { ColumnType } from "antd/es/table";
import dayjs from "dayjs";
import OrderModal from "../components/OrderModal";
import OrderEditModal from "../components/OrderEditModal";
import Swal from "sweetalert2";
import "../../i18n";
import { useTranslation } from "react-i18next";
import AdminDataPanel from "../components/AdminDataPanel";

export default function OrderManagement() {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [editOrder, setEditOrder] = useState<any | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  interface OrderColumnType extends ColumnType<any> {
    width?: number;
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const fetchAdminOrders = async (authToken: string) => {
    try {
      const data = await getAllOrdersForAdmin(authToken);
      setOrders(data.data || []);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminOrders(token);
    }
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!token) return;

    const confirmResult = await Swal.fire({
      title: t("orderM.deleteConfirmTitle"),
      text: t("orderM.deleteConfirmText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: t("orderM.cancelButton"),
      confirmButtonText: t("orderM.deleteConfirmButton"),
      reverseButtons: true,
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await deleteOrderByAdmin(token, id);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
      Swal.fire(
        t("orderM.deleteSuccessTitle"),
        t("orderM.deleteSuccess"),
        "success"
      );
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire(
        t("orderM.deleteErrorTitle"),
        t("orderM.deleteError"),
        "error"
      );
    }
  };

  const filteredOrders = orders.filter((order) =>
    `${order?._id ?? ""} ${order?.name ?? ""} ${order?.user?.firstName ?? ""} ${order?.user?.lastName ?? ""}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleEdit = (order: any) => {
    setEditOrder(order);
    setIsEditModalVisible(true);
  };

  const handleOrderUpdated = (updatedOrder: any) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
    setEditOrder(updatedOrder);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setEditOrder(null);
  };

  const columns: OrderColumnType[] = [
    {
      title: t("orderM.columns.orderId"),
      dataIndex: "_id",
      key: "_id",
      width: 240,
    },
    {
      title: t("orderM.columns.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      render: (text: string) => dayjs(text).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: t("orderM.columns.customer"),
      dataIndex: "user",
      key: "user",
      width: 200,
      render: (user: any) => `${user?.firstName ?? "-"} ${user?.lastName ?? ""}`,
    },
    {
      title: t("orderM.columns.name"),
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string) =>
        name === "Unnamed Art Toy" ? t("orderModal.unnamedArtToy") : name,
      sorter: (a, b) => String(a?.name ?? "").localeCompare(String(b?.name ?? "")),
    },
    {
      title: t("orderM.columns.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      width: 110,
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: t("orderM.columns.total"),
      dataIndex: "total",
      key: "total",
      width: 140,
      sorter: (a, b) => a.total - b.total,
      render: (text: number) => Number(text ?? 0).toLocaleString(),
    },
    {
      title: t("orderM.columns.paymentStatus"),
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 150,
      render: (value: string) => t(`orderM.paymentStatus.${String(value).toLowerCase()}`),
      sorter: (a, b) =>
        String(a?.paymentStatus ?? "").localeCompare(String(b?.paymentStatus ?? "")),
    },
    {
      title: t("orderM.columns.status"),
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (value: string) => t(`orderM.status.${String(value).toLowerCase()}`),
      sorter: (a, b) => String(a?.status ?? "").localeCompare(String(b?.status ?? "")),
    },
    {
      title: t("orderM.columns.actions"),
      key: "actions",
      width: 140,
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            className: "custom-menu",
            items: [
              {
                key: "view",
                label: (
                  <div className="menu-item-content">
                    <Eye size={16} />
                    <span className="ml-2">{t("orderM.actions.view")}</span>
                  </div>
                ),
                onClick: () => handleViewOrder(record),
              },
              {
                key: "edit",
                label: (
                  <div className="menu-item-content">
                    <Edit size={16} />
                    <span className="ml-2">{t("orderM.actions.edit")}</span>
                  </div>
                ),
                onClick: () => handleEdit(record),
              },
              {
                key: "delete",
                label: (
                  <div className="menu-item-content">
                    <Trash size={16} />
                    <span className="ml-2">{t("orderM.actions.delete")}</span>
                  </div>
                ),
                danger: true,
                onClick: () => handleDelete(record._id),
              },
            ],
          }}
        >
          <Ellipsis className="cursor-pointer" />
        </Dropdown>
      ),
    },
  ];

  const paidOrders = orders.filter((order) => order.paymentStatus === "Paid").length;
  const refundedOrders = orders.filter(
    (order) => order.paymentStatus === "Refunded"
  ).length;
  const shippedOrders = orders.filter((order) => order.status === "Shipped").length;
  const tableScrollY = "calc(100vh - 29rem)";
  const orderStats = [
    {
      label: t("orderM.stats.totalOrders"),
      value: orders.length,
      icon: Package,
    },
    {
      label: t("orderM.stats.paidOrders"),
      value: paidOrders,
      icon: CreditCard,
    },
    {
      label: t("orderM.stats.shippedOrders"),
      value: shippedOrders,
      icon: Truck,
    },
    {
      label: t("orderM.stats.refunds"),
      value: refundedOrders,
      icon: Sparkles,
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(34,49,100,0.35),rgba(20,20,20,1)_32%,rgba(12,12,12,1)_100%)] text-white">
      <Sidebar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
      <div
        className={`h-screen overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-[184px]"}`}
      >
        {isLoading ? (
          <div className="flex h-full items-center justify-center px-6">
            <Loader className="animate-spin text-[#0CACF3]" size={48} />
          </div>
        ) : (
          <div className="flex h-full flex-col overflow-hidden px-6 pb-6 pt-8">
            <section className="border-b border-white/10 pb-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#67dfff]/20 bg-[#0b1b3e]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-[#88ebff]">
                    <Sparkles size={14} />
                    Admin Workspace
                  </div>
                  <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                    {t("orderM.title")}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#aebddb] sm:text-base">
                    {t("orderM.description")}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {orderStats.map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl border border-white/10 bg-[#0D1733] p-2.5">
                          <Icon size={18} className="text-[#76e3ff]" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-white">{value}</p>
                          <p className="text-xs text-white/60">{label}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <AdminDataPanel
              toolbar={
                <input
                  type="text"
                  placeholder={t("orderM.searchPlaceholder")}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="admin-search-field w-full sm:w-[320px]"
                />
              }
            >
              <div className="overflow-hidden rounded-[22px] bg-[#091224]/88">
                <Table
                  columns={columns}
                  dataSource={filteredOrders}
                  rowKey="_id"
                  pagination={{ pageSize: 10 }}
                  className="custom-table h-full"
                  rowClassName={() => "custom-hover-row"}
                  tableLayout="fixed"
                  scroll={{ x: "max-content", y: tableScrollY }}
                />
              </div>
            </AdminDataPanel>
          </div>
        )}
      </div>

      <OrderModal
        isVisible={isModalVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
      />

      <OrderEditModal
        isVisible={isEditModalVisible}
        order={editOrder}
        token={token}
        onClose={handleCloseEditModal}
        onOrderUpdated={handleOrderUpdated}
      />
    </div>
  );
}
