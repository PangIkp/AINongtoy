/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  getKeywordsForAdmin,
  updateKeywordForAdmin,
  deleteKeywordForAdmin,
} from "@/api/keywordAPI";
import { Table, Dropdown, Input, Form, Select } from "antd";
import { Ellipsis, Eye, Edit, Trash, Loader, Plus } from "lucide-react";
import { ColumnType } from "antd/es/table";
import { Button } from "antd";
import dayjs from "dayjs";
import KeywordModal from "../components/KeywordModal";
import Swal from "sweetalert2";
import KeywordForm from "../components/KeywordForm";
import { useTranslation } from "react-i18next"; // เพิ่มการนำเข้า
import "../../i18n"; // เพิ่มการนำเข้า

export default function KeywordManagement() {
  const { t } = useTranslation(); // ใช้ useTranslation

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [token, setToken] = useState<string>("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editKeyword, setEditKeyword] = useState<any | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const isEditing = (record: any) => record && record._id === editingKey;
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  interface EditableColumnType extends ColumnType<any> {
    editable?: boolean;
  }

  const fetchAdminKeywords = async () => {
    if (!token) return;
    try {
      const data = await getKeywordsForAdmin(token);
      setKeywords(data.data || []);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchAdminKeywords(); // Now it works fine here
    }
  }, [token]);

  const handleCreate = () => {
    setIsFormVisible(!isFormVisible); // สลับการแสดงฟอร์ม
  };

  const handleDelete = async (id: string) => {
    if (!token) return;

    const confirmResult = await Swal.fire({
      title: t("keywordManagement.confirmDeleteTitle"), // ใช้การแปล
      text: t("keywordManagement.confirmDeleteText"), // ใช้การแปล
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("keywordManagement.confirmDeleteConfirm"), // ใช้การแปล
      reverseButtons: true,
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await deleteKeywordForAdmin(token, id);
      setKeywords((prevKeywords) =>
        prevKeywords.filter((keyword) => keyword._id !== id)
      );
      Swal.fire(
        t("keywordManagement.deleteSuccessTitle"), // ใช้การแปล
        t("keywordManagement.deleteSuccessText"), // ใช้การแปล
        "success"
      );
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire(
        t("keywordManagement.deleteErrorTitle"), // ใช้การแปล
        t("keywordManagement.deleteErrorText"), // ใช้การแปล
        "error"
      );
    }
  };

  const filteredOrders = keywords.filter(
    (keyword) =>
      keyword._id.toLowerCase().includes(searchText.toLowerCase()) ||
      keyword.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleEdit = (keyword: any) => {
    setEditKeyword(keyword);
    setEditingKey(keyword._id); // ตั้งค่า `_id` ของแถวที่กำลังแก้ไข
    form.setFieldsValue(keyword); // กำหนดค่าลงในฟอร์ม
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
            {dataIndex === "type" ? (
              <Select>
                <Select.Option value="Color">{t("keywordManagement.select.color")}</Select.Option> {/* ใช้การแปล */}
                <Select.Option value="Character">{t("keywordManagement.select.character")}</Select.Option> {/* ใช้การแปล */}
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
      const updatedKeyword = { ...editKeyword, ...values }; // รวมค่าที่แก้ไขเข้ากับข้อมูลเก่า
      await updateKeywordForAdmin(token, updatedKeyword._id, values);

      setKeywords((prevKeywords) =>
        prevKeywords.map((keyword) =>
          keyword._id === updatedKeyword._id ? updatedKeyword : keyword
        )
      );

      setEditKeyword(null);
      setEditingKey(null); // ออกจากโหมดแก้ไข

      Swal.fire(
        t("keywordManagement.updateSuccessTitle"), // ใช้การแปล
        t("keywordManagement.updateSuccessText"), // ใช้การแปล
        "success"
      );
    } catch (error) {
      console.error("Error updating keyword :", error);
      Swal.fire(
        t("keywordManagement.updateErrorTitle"), // ใช้การแปล
        t("keywordManagement.updateErrorText"), // ใช้การแปล
        "error"
      );
    }
  };

  const columns: EditableColumnType[] = [
    {
      title: t("keywordManagement.columns.keywordId"), // ใช้การแปล
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: t("keywordManagement.columns.createdAt"), // ใช้การแปล
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },

    {
      title: t("keywordManagement.columns.updatedAt"), // ใช้การแปล
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
    },

    {
      title: t("keywordManagement.columns.createdBy"), // ใช้การแปล
      dataIndex: "createdBy",
      key: "createdBy",
      render: (createdBy: any) => (
        <span>
          {createdBy.firstName} {createdBy.lastName}
        </span>
      ), // แสดงชื่อเต็มของผู้สร้าง
      sorter: (a, b) =>
        a.createdBy.firstName.localeCompare(b.createdBy.firstName),
    },

    {
      title: t("keywordManagement.columns.name"), // ใช้การแปล
      dataIndex: "name",
      key: "name",
      editable: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },

    {
      title: t("keywordManagement.columns.type"), // ใช้การแปล
      dataIndex: "type",
      key: "type",
      editable: true,
      sorter: (a, b) => a.type.localeCompare(b.type),
    },

    {
      title: t("keywordManagement.columns.actions"), // ใช้การแปล
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
              {t("keywordManagement.actions.save")} {/* ใช้การแปล */}
            </Button>
            <Button
              style={{
                color: "#FFA4A4",
              }}
              type="link"
              danger
              onClick={() => {
                setEditKeyword(null);
                setEditingKey(null);
              }}
            >
              {t("keywordManagement.actions.cancel")} {/* ใช้การแปล */}
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
                      <span className="ml-2">{t("keywordManagement.actions.view")}</span>
                    </div>
                  ),
                  onClick: () => handleViewOrder(record),
                },
                {
                  key: "edit",
                  label: (
                    <div className="menu-item-content">
                      <Edit size={16} />
                      <span className="ml-2">{t("keywordManagement.actions.edit")}</span>
                    </div>
                  ),
                  onClick: () => handleEdit(record),
                },
                {
                  key: "delete",
                  label: (
                    <div className="menu-item-content">
                      <Trash size={16} />
                      <span className="ml-2">{t("keywordManagement.actions.delete")}</span>
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
  const [selectedKeyword, setSelectedKeyword] = useState<any | null>(null);

  const handleViewOrder = (order: any) => {
    setSelectedKeyword(order);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedKeyword(null);
    setIsFormVisible(false);
  };

  return (
    <div className="text-white bg-[#212121] h-screen overflow-x-auto">
      <Sidebar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
      <div
        className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-[140px]"
          }`}
      >
        <h1 className="text-3xl font-bold mb-4">{t("keywordManagement.title")}</h1> {/* ใช้การแปล */}
        {isLoading ? (
          <div className="flex justify-center items-center h-[80vh]">
            <Loader className="animate-spin text-[#0CACF3]" size={48} />
          </div>
        ) : (
          <>
            <div className="flex justify-between w-full">
              <Input.Search
                placeholder="Search Keyword ID"
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300, marginBottom: 16 }}
              />

              <button
                className="text-[14px] h-8 flex items-center gap-2"
                onClick={handleCreate}
              >
                <Plus className="h-4 w-4" />
                {t("keywordManagement.createKeyword")} {/* ใช้การแปล */}
              </button>
            </div>

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

      <KeywordModal
        isVisible={isModalVisible}
        keyword={selectedKeyword}
        onClose={handleCloseModal}
      />

      <KeywordForm
        isFormVisible={isFormVisible}
        handleCloseModal={handleCloseModal}
        token={token}
        fetchAdminKeywords={fetchAdminKeywords}
      />
    </div>
  );
}
