/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  getAllUsersForAdmin,
  updateUserForAdmin,
  deleteUserForAdmin,
} from "@/api/userAPI";
import { Table, Dropdown, Input, Form, Select } from "antd";
import { Ellipsis, Eye, Edit, Trash, Loader, Plus } from "lucide-react"; // เพิ่ม Loader
import { ColumnType } from "antd/es/table";
import { Button } from "antd";
import dayjs from "dayjs";
import UserModal from "../components/UserModal";
import Swal from "sweetalert2";
import ModalForm from "../components/ModalForm";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function UserManagement() {
  const { t } = useTranslation(); // ใช้ useTranslation เพื่อเรียกฟังก์ชัน t
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [token, setToken] = useState<string>("");
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // เพิ่ม state สำหรับการโหลด
  const isEditing = (record: any) => record && record._id === editingKey;
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  interface EditableColumnType extends ColumnType<any> {
    editable?: boolean;
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken); // ถ้ามี token ให้เซ็ต
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
      } finally {
        setIsLoading(false); // โหลดเสร็จ
      }
    };
    if (token) {
      fetchAdminUsers();
    }
  }, [token]);

  const handleCreate = () => {
    setIsFormVisible(!isFormVisible); // สลับการแสดงฟอร์ม
  };

  const handleDelete = async (id: string) => {
    if (!token) return;

    const result = await Swal.fire({
      title: t("userM.confirm_delete_title"),
      text: t("userM.confirm_delete_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("userM.confirm_delete_button"),
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteUserForAdmin(token, id);
        // Update UI by removing the user from the state
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        Swal.fire(t("userM.deleted_title"), t("userM.deleted_message"), "success");
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire(t("userM.error_title"), t("userM.delete_failed"), "error");
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user._id} ${user.firstName} ${user.lastName} ${user.email} ${user.username}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
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
                  defaultValue={record.firstName} // แสดงชื่อที่เก็บไว้
                  onChange={(e) => {
                    record.firstName = e.target.value;
                  }}
                  placeholder="First Name"
                />
                <Input
                  defaultValue={record.lastName} // แสดงนามสกุลที่เก็บไว้
                  onChange={(e) => {
                    record.lastName = e.target.value;
                  }}
                  placeholder="Last Name"
                />
              </div>
            ) : dataIndex === "status" ? (
              <Select>
                <Select.Option value="active">{t("userM.statuses.active")}</Select.Option> {/* ใช้การแปล */}
                <Select.Option value="banned">{t("userM.statuses.banned")}</Select.Option> {/* ใช้การแปล */}
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
      const updatedUser = { ...editUser, ...values }; // Combine edited values with the existing user data
      const response = await updateUserForAdmin(
        updatedUser._id,
        updatedUser,
        token
      ); // Send updated data to the API

      // Check the API response
      if (response) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          )
        );
        setEditUser(null);
        setEditingKey(null); // Exit edit mode

        // Show success message
        await Swal.fire({
          title: t("userM.update_success_title"),
          text: t("userM.update_success_message"),
          icon: "success",
          confirmButtonText: t("userM.ok_button"),
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);

      // Show error message
      await Swal.fire({
        title: t("userM.update_error_title"),
        text: t("userM.update_error_message"),
        icon: "error",
        confirmButtonText: t("userM.ok_button"),
      });
    }
  };

  const columns: EditableColumnType[] = [
    {
      title: t("userM.user_id"), // ใช้ t() เพื่อแปลข้อความ
      dataIndex: "_id",
      key: "_id",
    },

    {
      title: t("userM.created_at"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },

    {
      title: t("userM.first_name"),
      dataIndex: "firstName",
      key: "firstName",
      editable: true,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },

    {
      title: t("userM.last_name"),
      dataIndex: "lastName",
      key: "lastName",
      editable: true,
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },

    {
      title: t("userM.username"),
      dataIndex: "username",
      key: "username",
      editable: true,
      sorter: (a, b) => a.username.localeCompare(b.username),
    },

    {
      title: t("userM.email"),
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },

    {
      title: t("userM.phone"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      editable: true,
    },

    {
      title: t("userM.role"),
      dataIndex: "role",
      key: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
    },

    {
      title: t("userM.status"),
      dataIndex: "status",
      key: "status",
      editable: true,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: t("userM.actions"),
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
              {t("userM.save")} {/* แปลข้อความ Save */}
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
              {t("userM.cancel")} {/* แปลข้อความ Cancel */}
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
                      <span className="ml-2">{t("userM.view")}</span>{" "}
                    </div>
                  ),
                  onClick: () => handleViewUser(record),
                },
                {
                  key: "edit",
                  label: (
                    <div className="menu-item-content">
                      <Edit size={16} />
                      <span className="ml-2">{t("userM.edit")}</span>{" "}
                    </div>
                  ),
                  onClick: () => handleEdit(record),
                },
                {
                  key: "delete",
                  label: (
                    <div className="menu-item-content">
                      <Trash size={16} />
                      <span className="ml-2">{t("userM.delete")}</span>{" "}
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
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
    setIsFormVisible(false);
  };

  return (
    <div className="text-white bg-[#212121] h-screen overflow-x-auto">
      <Sidebar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
      <div
        className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-[140px]"
          }`}
      >
        <h1 className="text-3xl font-bold mb-4">{t("userM.users")}</h1>
        {isLoading ? ( // แสดง Loader ระหว่างโหลด
          <div className="flex justify-center items-center h-[80vh]">
            <Loader className="animate-spin text-[#0CACF3]" size={48} />
          </div>
        ) : (
          <>
            <div className="flex justify-between w-full">
              <Input.Search
                placeholder={t("userM.search_user_id")}
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300, marginBottom: 16 }}
              />

              <button
                className="text-[14px] h-8 flex items-center gap-2"
                onClick={handleCreate}
              >
                <Plus className="h-4 w-4" />
                {t("userM.create_user")}
              </button>
            </div>

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
          </>
        )}
      </div>

      <UserModal
        isVisible={isModalVisible}
        user={selectedUser}
        onClose={handleCloseModal}
      />

      <ModalForm
        isFormVisible={isFormVisible}
        handleCloseModal={handleCloseModal}
        token={token}
      />
    </div>
  );
}
