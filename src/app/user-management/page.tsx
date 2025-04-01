"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAllUsersForAdmin } from "@/api/userAPI";
import UserModal from "../components/UserModal";
import { Table, Input, Form, Button } from "antd";
import { Ellipsis, Eye, Edit, Trash } from "lucide-react";
import { ColumnType } from "antd/es/table";
import dayjs from "dayjs";

export default function UserManagement() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [searchText, setSearchText] = useState("");
  const [editUser, setEditUser] = useState<any | null>(null);

  const [form] = Form.useForm();

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
        const data = await getAllUsersForAdmin(token);
        setUsers(data.data || []);
      } catch (error) {
        console.error("Error fetching admin users:", error);
      }
    };
    if (token) {
      fetchAdminOrders();
    }
  }, [token]);

  const filteredUsers = users.filter((user) =>
    user._id.toLowerCase().includes(searchText.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchText.toLowerCase()) 
  );
  

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  interface EditableColumnType extends ColumnType<any> {
    editable?: boolean;
  }

//    const handleSave = async (values: any) => {
//       if (!token) return;
  
//       try {
//         const updatedOrder = { ...editUser, ...values }; // รวมค่าที่แก้ไขเข้ากับข้อมูลเก่า
//         await updateUserByAdmin(token, updatedUser._id, values);
  
//         setUsers((prevUsers) =>
//             prevUsers.map((user) =>
//             user._id === updatedUser._id ? updatedUser : order
//           )
//         );
  
//         setEditUser(null);
//         setEditingKey(null); // ออกจากโหมดแก้ไข
//       } catch (error) {
//         console.error("Error updating user:", error);
//       }
//     };
    
  const columns: EditableColumnType[] = [
    {
      title: "User ID",
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
      title: "Name",
      key: "name",
      render: (_, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
      sorter: (a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.username.localeCompare(b.username),
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span>{text}</span>,
    },

    {
      title: "Phone number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => <span>{text}</span>,
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text) => <span>{text}</span>,
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => <div></div>,
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
        <h1 className="text-3xl font-bold mb-4">Users</h1>
        <Input.Search
          placeholder="Search User ID"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300, marginBottom: 16 }}
        />

        <Form form={form} component={false}>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="_id"
            pagination={{ pageSize: 10 }} // การแบ่งหน้า
            className="custom-table"
            rowClassName={() => "custom-hover-row"}
          />
        </Form>
      </div>

      <UserModal
        isVisible={isModalVisible}
        user={selectedUser}
        onClose={handleCloseModal}
      />
    </div>
  );
}
