"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal } from "antd";
import dayjs from "dayjs";
import { CalendarClock, ShieldCheck, Tags, User2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../i18n";

interface KeywordModalProps {
  isVisible: boolean;
  keyword: any | null;
  onClose: () => void;
}

const KeywordModal: React.FC<KeywordModalProps> = ({
  isVisible,
  keyword,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!keyword) return null;

  const infoItems = [
    {
      label: t("keywordManagement.columns.createdAt"),
      value: keyword.createdAt
        ? dayjs(keyword.createdAt).format("DD/MM/YYYY HH:mm")
        : "-",
      icon: CalendarClock,
    },
    {
      label: t("keywordManagement.columns.updatedAt"),
      value: keyword.updatedAt
        ? dayjs(keyword.updatedAt).format("DD/MM/YYYY HH:mm")
        : "-",
      icon: CalendarClock,
    },
    {
      label: t("keywordManagement.columns.createdBy"),
      value: keyword.createdBy
        ? `${keyword.createdBy.firstName} ${keyword.createdBy.lastName}`
        : "-",
      icon: User2,
    },
    {
      label: t("keywordManagement.columns.type"),
      value: t(
        `keywordManagement.select.${String(keyword.type || "").toLowerCase()}`
      ),
      icon: Tags,
    },
  ];

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={920}
      centered
      destroyOnClose
      closeIcon={
        <span className="inline-flex rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white">
          <X size={18} />
        </span>
      }
      className="keyword-detail-modal"
      styles={{
        content: {
          padding: 0,
          overflow: "hidden",
          background:
            "linear-gradient(155deg, rgba(10,21,46,0.98), rgba(5,10,22,0.96))",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 120px rgba(0,0,0,0.45)",
        },
        body: { padding: 0 },
        header: { display: "none" },
      }}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(103,223,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_28%)]" />

        <div className="relative border-b border-white/10 px-6 pb-6 pt-7 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#67dfff]/20 bg-[#0b1b3e]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-[#88ebff]">
            <Tags size={14} />
            {t("keywordModal.title")}
          </div>

          <div className="mt-5">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              {keyword.name}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#aebddb]">
              {t("keywordModal.description")}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70">
                {t("keywordModal.keywordId")}: {keyword._id}
              </span>
              <span className="inline-flex items-center rounded-full border border-[#67dfff]/20 bg-[#0b1b3e]/70 px-3 py-1.5 text-xs font-medium text-[#88ebff]">
                {t(
                  `keywordManagement.select.${String(keyword.type || "").toLowerCase()}`
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="relative max-h-[70vh] overflow-y-auto px-6 py-6 sm:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            {infoItems.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-[22px] border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl border border-white/10 bg-[#0d1733] p-3 text-[#88ebff]">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                      {label}
                    </p>
                    <p className="mt-2 break-words text-sm font-medium text-white">
                      {value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="mt-6 rounded-[24px] border border-white/10 bg-[#091224]/88 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-[#67dfff]/20 bg-[#0d1733] p-3 text-[#88ebff]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  {t("keywordModal.summaryTitle")}
                </h3>
                <p className="mt-2 text-sm leading-7 text-white/60">
                  {t("keywordModal.summaryDescription")}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
};

export default KeywordModal;
