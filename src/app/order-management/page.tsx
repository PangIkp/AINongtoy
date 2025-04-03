"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  getAllOrdersForAdmin,
  deleteOrderByAdmin,
  updateOrderByAdmin,
} from "@/api/orderAPI";
import { Table, Dropdown, Menu, Input, Form, Select } from "antd";
import { Ellipsis, Eye, Edit, Trash, Loader } from "lucide-react";
import { ColumnType } from "antd/es/table";
import { Button } from "antd";
import dayjs from "dayjs";
import OrderModal from "../components/OrderModal";
import Swal from "sweetalert2";

export default function OrderManagement() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [editOrder, setEditOrder] = useState<any | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const isEditing = (record: any) => record && record._id === editingKey;
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  interface EditableColumnType extends ColumnType<any> {
    editable?: boolean;
  }

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
      } finally {
        setIsLoading(false); // โหลดเสร็จ
      }
    };
    if (token) {
      fetchAdminOrders();
    }
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!token) return;

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      reverseButtons: true,
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await deleteOrderByAdmin(token, id);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
      Swal.fire("Deleted!", "The order has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire("Error!", "Failed to delete the order.", "error");
    }
  };

  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleEdit = (order: any) => {
    setEditOrder(order);
    setEditingKey(order._id); // ตั้งค่า `_id` ของแถวที่กำลังแก้ไข
    form.setFieldsValue(order); // กำหนดค่าลงในฟอร์ม
  };

  const EditableCell: React.FC<any> = ({
    editable,
    children,
    dataIndex,
    record,
    ...restProps
  }) => {
    const editing = isEditing(record);
    return (
      <td {...restProps}>
        {editable && editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please enter ${dataIndex}`,
              },
            ]}
          >
            {dataIndex === "status" ? (
              <Select>
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Processing">Processing</Select.Option>
                <Select.Option value="Shipped">Shipped</Select.Option>
                <Select.Option value="Delivered">Delivered</Select.Option>
                <Select.Option value="Cancelled">Cancelled</Select.Option>{" "}
                {/* Fixed the duplicate value */}
              </Select>
            ) : dataIndex === "paymentStatus" ? (
              <Select>
                <Select.Option value="Unpaid">Unpaid</Select.Option>
                <Select.Option value="Paid">Paid</Select.Option>
                <Select.Option value="Refunded">Refunded</Select.Option>
              </Select>
            ) : (
              <Input />
            )}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const handleSave = async (values: any) => {
    if (!token) return;

    try {
      const updatedOrder = { ...editOrder, ...values }; // รวมค่าที่แก้ไขเข้ากับข้อมูลเก่า
      await updateOrderByAdmin(token, updatedOrder._id, values);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );

      setEditOrder(null);
      setEditingKey(null); // ออกจากโหมดแก้ไข

      Swal.fire("Success!", "The order has been updated successfully.", "success");
    } catch (error) {
      console.error("Error updating order:", error);
      Swal.fire("Error!", "Failed to update the order.", "error");
    }
  };

  const columns: EditableColumnType[] = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: <div className="flex items-center gap-2">Created at</div>,
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Customer",
      dataIndex: "user",
      key: "user",
    },
    {
      title: <div className="flex items-center gap-2">Name</div>,
      dataIndex: "name",
      key: "name",
      editable: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      editable: true,
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      editable: true,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Confirmation",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      editable: true,
      sorter: (a, b) => a.paymentStatus.localeCompare(b.paymentStatus),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      editable: true,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => {
        const editing = isEditing(record);
        return editing ? (
          <div className="flex gap-2">
            <Button
              style={{
                color: "#B5E89D",
                backgroundColor: "transparent",
                borderColor: "transparent",
              }}
              onClick={() => form.submit()}
            >
              Save
            </Button>
            <Button
              style={{
                color: "#FFA4A4",
              }}
              type="link"
              danger
              onClick={() => {
                setEditOrder(null);
                setEditingKey(null);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Dropdown
            menu={{
              className: "custom-menu",
              items: [
                {
                  key: "view",
                  label: (
                    <div className="menu-item-content">
                      <Eye size={16} />
                      <span className="ml-2">View</span>{" "}
                      {/* Add a margin-left to create space between the icon and text */}
                    </div>
                  ),
                  onClick: () => handleViewOrder(record),
                },
                {
                  key: "edit",
                  label: (
                    <div className="menu-item-content">
                      <Edit size={16} />
                      <span className="ml-2">Edit</span>{" "}
                      {/* Add a margin-left to create space between the icon and text */}
                    </div>
                  ),
                  onClick: () => handleEdit(record),
                },
                {
                  key: "delete",
                  label: (
                    <div className="menu-item-content">
                      <Trash size={16} />
                      <span className="ml-2">Delete</span>{" "}
                      {/* Add a margin-left to create space between the icon and text */}
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
        );
      },
    },
  ];

  const mergedColumns: ColumnType<any>[] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title as string, // Ensure title is of type string
        key: col.key,
      }),
    };
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  return (
    <div className="text-white bg-[#212121] h-screen overflow-hidden">
      <Sidebar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
      <div
        className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-[140px]"
          }`}
      >
        <h1 className="text-3xl font-bold mb-4">Orders</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-[80vh]">
            <Loader className="animate-spin text-[#0CACF3]" size={48} />
          </div>
        ) : (
          <>
            <Input.Search
              placeholder="Search Order ID"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300, marginBottom: 16 }}
            />

            <Form form={form} component={false} onFinish={handleSave}>
              <Table
                components={{ body: { cell: EditableCell } }}
                columns={mergedColumns}
                dataSource={filteredOrders}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                className="custom-table"
                rowClassName={() => "custom-hover-row"}
              />
            </Form>
          </>
        )}
      </div>

      <OrderModal
        isVisible={isModalVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
      />
    </div>
  );
}
