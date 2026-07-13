/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  getAllUsersForAdmin,
  deleteUserForAdmin,
} from "@/api/userAPI";
import { Table, Dropdown } from "antd";
import {
  Ellipsis,
  Eye,
  Edit,
  Trash,
  Loader,
  Plus,
  ShieldCheck,
  Sparkles,
  UserRound,
  UserX,
} from "lucide-react";
import { ColumnType } from "antd/es/table";
import dayjs from "dayjs";
import UserModal from "../components/UserModal";
import Swal from "sweetalert2";
import ModalForm from "../components/ModalForm";
import UserEditModal from "../components/UserEditModal";
import AdminDataPanel from "../components/AdminDataPanel";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function UserManagement() {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [token, setToken] = useState<string>("");
  const [editUser, setEditUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const fetchAdminUsers = async (authToken: string) => {
    try {
      const data = await getAllUsersForAdmin(authToken);
      setUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching admin users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  interface UserColumnType extends ColumnType<any> {
    width?: number;
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken); // ถ้ามี token ให้เซ็ต
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchAdminUsers(token);
    }
  }, [token]);

  const handleCreate = () => {
    setIsFormVisible(!isFormVisible); // สลับการแสดงฟอร์ม
  };

  const handleUserCreated = (createdUser: any) => {
    if (!createdUser?._id) {
      if (token) {
        fetchAdminUsers(token);
      }
      return;
    }

    setUsers((prevUsers) => [createdUser, ...prevUsers]);
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
    setIsEditModalVisible(true);
  };

  const handleUserUpdated = (updatedUser: any) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      )
    );
    setEditUser(updatedUser);
  };

  const columns: UserColumnType[] = [
    {
      title: t("userM.user_id"), // ใช้ t() เพื่อแปลข้อความ
      dataIndex: "_id",
      key: "_id",
      width: 240,
    },

    {
      title: t("userM.created_at"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      render: (text: string) => dayjs(text).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },

    {
      title: t("userM.first_name"),
      dataIndex: "firstName",
      key: "firstName",
      width: 160,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },

    {
      title: t("userM.last_name"),
      dataIndex: "lastName",
      key: "lastName",
      width: 160,
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },

    {
      title: t("userM.username"),
      dataIndex: "username",
      key: "username",
      width: 180,
      sorter: (a, b) => a.username.localeCompare(b.username),
    },

    {
      title: t("userM.email"),
      dataIndex: "email",
      key: "email",
      width: 240,
      sorter: (a, b) => a.email.localeCompare(b.email),
    },

    {
      title: t("userM.phone"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 160,
    },

    {
      title: t("userM.role"),
      dataIndex: "role",
      key: "role",
      width: 120,
      sorter: (a, b) => a.role.localeCompare(b.role),
    },

    {
      title: t("userM.status"),
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (value: string) => t(`userM.statuses.${value}`),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: t("userM.actions"),
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
      ),
    },
  ];

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

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setEditUser(null);
  };

  const totalUsers = users.length;
  const adminCount = users.filter((user) => user.role === "admin").length;
  const bannedCount = users.filter((user) => user.status === "banned").length;
  const tableScrollY = "calc(100vh - 25rem)";
  const userStats = [
    {
      label: t("userM.users"),
      value: totalUsers,
      icon: UserRound,
    },
    {
      label: t("userM.role"),
      value: adminCount,
      icon: ShieldCheck,
    },
    {
      label: t("userM.status"),
      value: bannedCount,
      icon: UserX,
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(34,49,100,0.35),rgba(20,20,20,1)_32%,rgba(12,12,12,1)_100%)] text-white">
      <Sidebar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
      <div
        className={`h-screen overflow-hidden transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-[140px]"}`}
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
                    {t("userM.users")}
                  </h1>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {userStats.map(({ label, value, icon: Icon }) => (
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
                <>
                  <input
                    type="text"
                    placeholder={t("userM.search_user_id")}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="admin-search-field w-full sm:w-[320px]"
                  />

                  <button
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#0AACF0]/35 bg-[#0b1d3d] px-5 text-sm font-semibold text-[#89ebff] transition hover:bg-[#11305a]"
                    onClick={handleCreate}
                  >
                    <Plus className="h-4 w-4" />
                    {t("userM.create_user")}
                  </button>
                </>
              }
            >
              <div className="overflow-hidden rounded-[22px] bg-[#091224]/88">
                <Table
                  columns={columns}
                  dataSource={filteredUsers}
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

      <UserModal
        isVisible={isModalVisible}
        user={selectedUser}
        onClose={handleCloseModal}
      />

      <ModalForm
        isFormVisible={isFormVisible}
        handleCloseModal={handleCloseModal}
        token={token}
        onUserCreated={handleUserCreated}
      />

      <UserEditModal
        isVisible={isEditModalVisible}
        user={editUser}
        token={token}
        onClose={handleCloseEditModal}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
}
