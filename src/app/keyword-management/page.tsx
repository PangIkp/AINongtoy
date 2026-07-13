/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  getKeywordsForAdmin,
  deleteKeywordForAdmin,
} from "@/api/keywordAPI";
import { Table, Dropdown } from "antd";
import {
  Ellipsis,
  Eye,
  Edit,
  Loader,
  Palette,
  Plus,
  Sparkles,
  Tags,
  Trash,
  UserRound,
} from "lucide-react";
import { ColumnType } from "antd/es/table";
import dayjs from "dayjs";
import KeywordModal from "../components/KeywordModal";
import KeywordForm from "../components/KeywordForm";
import KeywordEditModal from "../components/KeywordEditModal";
import Swal from "sweetalert2";
import AdminDataPanel from "../components/AdminDataPanel";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function KeywordManagement() {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [token, setToken] = useState<string>("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editKeyword, setEditKeyword] = useState<any | null>(null);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<any | null>(null);

  interface KeywordColumnType extends ColumnType<any> {
    width?: number;
  }

  const fetchAdminKeywords = async (authToken: string) => {
    try {
      const data = await getKeywordsForAdmin(authToken);
      setKeywords(data.data || []);
    } catch (error) {
      console.error("Error fetching admin keywords:", error);
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
      fetchAdminKeywords(token);
    }
  }, [token]);

  const handleCreate = () => {
    setIsFormVisible((prev) => !prev);
  };

  const handleKeywordCreated = (createdKeyword: any) => {
    if (!createdKeyword?._id) {
      if (token) fetchAdminKeywords(token);
      return;
    }
    setKeywords((prev) => [createdKeyword, ...prev]);
  };

  const handleKeywordUpdated = (updatedKeyword: any) => {
    setKeywords((prev) =>
      prev.map((keyword) =>
        keyword._id === updatedKeyword._id ? updatedKeyword : keyword
      )
    );
    setEditKeyword(updatedKeyword);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;

    const confirmResult = await Swal.fire({
      title: t("keywordManagement.confirmDeleteTitle"),
      text: t("keywordManagement.confirmDeleteText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("keywordManagement.confirmDeleteConfirm"),
      reverseButtons: true,
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await deleteKeywordForAdmin(token, id);
      setKeywords((prev) => prev.filter((keyword) => keyword._id !== id));
      Swal.fire(
        t("keywordManagement.deleteSuccessTitle"),
        t("keywordManagement.deleteSuccessText"),
        "success"
      );
    } catch (error) {
      console.error("Error deleting keyword:", error);
      Swal.fire(
        t("keywordManagement.deleteErrorTitle"),
        t("keywordManagement.deleteErrorText"),
        "error"
      );
    }
  };

  const filteredKeywords = keywords.filter((keyword) =>
    `${keyword?._id ?? ""} ${keyword?.name ?? ""} ${keyword?.type ?? ""}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const handleViewKeyword = (keyword: any) => {
    setSelectedKeyword(keyword);
    setIsModalVisible(true);
  };

  const handleEdit = (keyword: any) => {
    setEditKeyword(keyword);
    setIsEditModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedKeyword(null);
    setIsFormVisible(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setEditKeyword(null);
  };

  const columns: KeywordColumnType[] = [
    {
      title: t("keywordManagement.columns.keywordId"),
      dataIndex: "_id",
      key: "_id",
      width: 240,
    },
    {
      title: t("keywordManagement.columns.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      render: (text: string) => dayjs(text).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: t("keywordManagement.columns.updatedAt"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 170,
      render: (text: string) => dayjs(text).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
    },
    {
      title: t("keywordManagement.columns.createdBy"),
      dataIndex: "createdBy",
      key: "createdBy",
      width: 200,
      render: (createdBy: any) =>
        createdBy ? `${createdBy.firstName} ${createdBy.lastName}` : "-",
      sorter: (a, b) =>
        String(a?.createdBy?.firstName ?? "").localeCompare(
          String(b?.createdBy?.firstName ?? "")
        ),
    },
    {
      title: t("keywordManagement.columns.name"),
      dataIndex: "name",
      key: "name",
      width: 220,
      sorter: (a, b) => String(a?.name ?? "").localeCompare(String(b?.name ?? "")),
    },
    {
      title: t("keywordManagement.columns.type"),
      dataIndex: "type",
      key: "type",
      width: 140,
      render: (type: string) =>
        t(`keywordManagement.select.${String(type || "").toLowerCase()}`),
      sorter: (a, b) => String(a?.type ?? "").localeCompare(String(b?.type ?? "")),
    },
    {
      title: t("keywordManagement.columns.actions"),
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
                    <span className="ml-2">{t("keywordManagement.actions.view")}</span>
                  </div>
                ),
                onClick: () => handleViewKeyword(record),
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
      ),
    },
  ];

  const colorKeywords = keywords.filter((keyword) => keyword.type === "Color").length;
  const characterKeywords = keywords.filter(
    (keyword) => keyword.type === "Character"
  ).length;
  const keywordStats = [
    {
      label: t("keywordManagement.stats.total"),
      value: keywords.length,
      icon: Tags,
    },
    {
      label: t("keywordManagement.stats.colors"),
      value: colorKeywords,
      icon: Palette,
    },
    {
      label: t("keywordManagement.stats.characters"),
      value: characterKeywords,
      icon: UserRound,
    },
  ];
  const tableScrollY = "calc(100vh - 25rem)";

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
                    {t("keywordManagement.title")}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#aebddb] sm:text-base">
                    {t("keywordManagement.description")}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {keywordStats.map(({ label, value, icon: Icon }) => (
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
                    placeholder={t("keywordManagement.searchPlaceholder")}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="admin-search-field w-full sm:w-[320px]"
                  />

                  <button
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#0AACF0]/35 bg-[#0b1d3d] px-5 text-sm font-semibold text-[#89ebff] transition hover:bg-[#11305a]"
                    onClick={handleCreate}
                  >
                    <Plus className="h-4 w-4" />
                    {t("keywordManagement.createKeyword")}
                  </button>
                </>
              }
            >
              <div className="overflow-hidden rounded-[22px] bg-[#091224]/88">
                <Table
                  columns={columns}
                  dataSource={filteredKeywords}
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

      <KeywordModal
        isVisible={isModalVisible}
        keyword={selectedKeyword}
        onClose={handleCloseModal}
      />

      <KeywordForm
        isFormVisible={isFormVisible}
        handleCloseModal={handleCloseModal}
        token={token}
        onKeywordCreated={handleKeywordCreated}
      />

      <KeywordEditModal
        isVisible={isEditModalVisible}
        keyword={editKeyword}
        token={token}
        onClose={handleCloseEditModal}
        onKeywordUpdated={handleKeywordUpdated}
      />
    </div>
  );
}
