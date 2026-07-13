"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Modal } from "antd";
import dayjs from "dayjs";
import {
  CalendarClock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User2,
  UserCircle2,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../i18n";

interface UserModalProps {
  isVisible: boolean;
  user: any | null;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ isVisible, user, onClose }) => {
  const { t } = useTranslation();

  if (!user) return null;

  const addressList = Array.isArray(user.address) ? user.address : [];
  const displayName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.username ||
    "-";

  const infoItems = [
    {
      label: t("userM.email"),
      value: user.email || "-",
      icon: Mail,
    },
    {
      label: t("userM.username"),
      value: user.username || "-",
      icon: UserCircle2,
    },
    {
      label: t("userM.phone"),
      value: user.phoneNumber || "-",
      icon: Phone,
    },
    {
      label: t("userM.created_at"),
      value: user.createdAt
        ? dayjs(user.createdAt).format("DD/MM/YYYY HH:mm")
        : "-",
      icon: CalendarClock,
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
      className="user-detail-modal"
      styles={{
        content: {
          padding: 0,
          overflow: "hidden",
          background:
            "linear-gradient(155deg, rgba(10,21,46,0.98), rgba(5,10,22,0.96))",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 120px rgba(0,0,0,0.45)",
        },
        body: {
          padding: 0,
        },
        header: {
          display: "none",
        },
      }}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(103,223,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_28%)]" />

        <div className="relative border-b border-white/10 px-6 pb-6 pt-7 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#67dfff]/20 bg-[#0b1b3e]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-[#88ebff]">
            <User2 size={14} />
            {t("userM.details")}
          </div>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                {displayName}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#aebddb]">
                {t("userM.detail_description")}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70">
                  {t("userM.user_id")}: {user._id}
                </span>
                <span className="inline-flex items-center rounded-full border border-[#67dfff]/20 bg-[#0b1b3e]/70 px-3 py-1.5 text-xs font-medium text-[#88ebff]">
                  {t(`userM.roles.${user.role}`)}
                </span>
                <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
                  {t(`userM.statuses.${user.status}`)}
                </span>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 lg:w-[260px]">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-[#67dfff]/20 bg-[#0d1733] p-3 text-[#88ebff]">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {t("userM.account_overview")}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {t("userM.account_summary")}
                  </p>
                </div>
              </div>
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

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr,1.15fr]">
            <section className="rounded-[24px] border border-white/10 bg-[#091224]/88 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-[#0d1733] p-3 text-[#88ebff]">
                  <UserCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {t("userM.profile_section")}
                  </h3>
                  <p className="text-sm text-white/55">
                    {t("userM.profile_section_description")}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    {t("userM.first_name")}
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {user.firstName || "-"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    {t("userM.last_name")}
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {user.lastName || "-"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-white/10 bg-[#091224]/88 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-[#0d1733] p-3 text-[#88ebff]">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {t("userM.address")}
                  </h3>
                  <p className="text-sm text-white/55">
                    {t("userM.address_section_description")}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {addressList.length > 0 ? (
                  addressList.map((address: any, index: number) => (
                    <div
                      key={`${address.postalCode ?? "address"}-${index}`}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-[#88ebff]">
                        {t("userM.address_n", { n: index + 1 })}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white/80">
                        {[address.detail, address.subdistrict, address.district, address.province]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      <p className="mt-2 text-sm text-white/55">
                        {address.postalCode || "-"}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-6 text-sm text-white/50">
                    {t("userM.no_address")}
                  </div>
                )}
              </div>
            </section>
          </div>

        </div>
      </div>
    </Modal>
  );
};

export default UserModal;
