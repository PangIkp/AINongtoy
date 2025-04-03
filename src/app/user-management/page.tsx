"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  getAllUsersForAdmin,
  updateUserForAdmin,
} from "@/api/userAPI";
import { Table, Dropdown, Menu, Input, Form, Select } from "antd";
import { Ellipsis, Eye, Edit, Trash } from "lucide-react";
import { ColumnType } from "antd/es/table";
import { Button } from "antd";
import dayjs from "dayjs";
import UserModal from "../components/UserModal";

export default function UserManagement() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const isEditing = (record: any) => record && record._id === editingKey;
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

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
    const fetchAdminUsers = async () => {
      if (!token) return;
      try {
        const data = await getAllUsersForAdmin(token);
        setUsers(data.data || []);
      } catch (error) {
        console.error("Error fetching admin users:", error);
      }
    };
    if (token) {
      fetchAdminUsers();
    }
  }, [token]);

//   const handleDelete = async (id: string) => {
//     if (!token) return;
//     try {
//       await deleteOrderForAdmin(token, id);
//       setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   };

  const filteredUsers = users.filter((user) =>
    user._id.toLowerCase().includes(searchText.toLowerCase()) &&
    user.firstName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleEdit = (user: any) => {
    setEditUser(user);
    setEditingKey(user._id); // ตั้งค่า `_id` ของแถวที่กำลังแก้ไข
    form.setFieldsValue(user); // กำหนดค่าลงในฟอร์ม
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
            {dataIndex === "fullName" ? (
              <div className="flex gap-2">
                <Input
                  defaultValue={record.firstName}  // แสดงชื่อที่เก็บไว้
                  onChange={(e) => {
                    record.firstName = e.target.value;
                  }}
                  placeholder="First Name"
                />
                <Input
                  defaultValue={record.lastName}  // แสดงนามสกุลที่เก็บไว้
                  onChange={(e) => {
                    record.lastName = e.target.value;
                  }}
                  placeholder="Last Name"
                />
              </div>
            ) : dataIndex === "status" ? (
              <Select>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
                <Select.Option value="Banned">Banned</Select.Option>
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
      const updatedUser = { ...editUser, ...values }; // รวมค่าที่แก้ไขเข้ากับข้อมูลเก่า
      const response = await updateUserForAdmin(updatedUser._id, updatedUser, token); // ส่งข้อมูลทั้งหมดที่ต้องการอัปเดต
  
      // ตรวจสอบการตอบกลับจาก API
      if (response) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          )
        );
        setEditUser(null);
        setEditingKey(null); // ออกจากโหมดแก้ไข
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  

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
        title: <div className="flex items-center gap-2">First name</div>,
        dataIndex: "firstName",
        key: "firstName",
        editable: true,
        sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      },

      {
        title: <div className="flex items-center gap-2">Last name</div>,
        dataIndex: "lastName",
        key: "lastName",
        editable: true,
        sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      },
 
      
      {
        title: <div className="flex items-center gap-2">Username</div>,
        dataIndex: "username",
        key: "username",
        editable: true,
        sorter: (a, b) => a.username.localeCompare(b.username),
      },

      {
        title: <div className="flex items-center gap-2">Email</div>,
        dataIndex: "email",
        key: "email",
        sorter: (a, b) => a.email.localeCompare(b.email),
      },

      {
        title: <div className="flex items-center gap-2">Phone</div>,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        editable: true,
      },

      {
        title: <div className="flex items-center gap-2">Role</div>,
        dataIndex: "role",
        key: "role",
        sorter: (a, b) => a.role.localeCompare(b.role),
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
                setEditUser(null);
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
                    </div>
                  ),
                  onClick: () => handleViewUser(record),
                },
                {
                  key: "edit",
                  label: (
                    <div className="menu-item-content">
                      <Edit size={16} />
                      <span className="ml-2">Edit</span>{" "}
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
                    </div>
                  ),
                  danger: true,
                //   onClick: () => handleDelete(record._id),
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
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  return (
        <div className="text-white bg-[#212121] h-screen overflow-x-auto">
      <Sidebar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
      <div
        className={`flex-1 p-6 transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-[140px]"
        }`}
      >
        <h1 className="text-3xl font-bold mb-4">Users</h1>
        <Input.Search
          placeholder="Search User ID"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300, marginBottom: 16 }}
        />
        <Form form={form} component={false} onFinish={handleSave}>
          <Table
            components={{ body: { cell: EditableCell } }}
            columns={mergedColumns}
            dataSource={filteredUsers}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
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
