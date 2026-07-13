"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { CircleAlert, Loader2, ShieldCheck, SquarePen, X } from "lucide-react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { updateUserForAdmin } from "@/api/userAPI";
import "../../i18n";

interface UserEditModalProps {
  isVisible: boolean;
  user: any | null;
  token: string;
  onClose: () => void;
  onUserUpdated: (user: any) => void;
}

const emailRegex = /^[a-zA-Z][^\s@]*@[a-zA-Z]{2,}(\.[a-zA-Z]{2,}){1,2}$/;
const nameRegex = /^[a-zA-Z]{2,40}$/;
const phoneRegex = /^0[1-9]\d{8}$/;
const usernameRegex =
  /^[a-zA-Z](?=[a-zA-Z0-9._]{3,39}$)(?!.*[.].*[.])(?!.*[_].*[_])[a-zA-Z0-9._]*$/;

const UserEditModal: React.FC<UserEditModalProps> = ({
  isVisible,
  user,
  token,
  onClose,
  onUserUpdated,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phoneNumber: "",
    role: "user",
    status: "active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isVisible && user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        username: user.username || "",
        phoneNumber: user.phoneNumber || "",
        role: user.role || "user",
        status: user.status || "active",
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isVisible, user]);

  if (!isVisible || !user) return null;

  const validateField = (name: string, value: string) => {
    if (!value.trim()) return t("userM.required");

    switch (name) {
      case "firstName":
      case "lastName":
        return nameRegex.test(value) ? "" : t("userM.name_rule");
      case "email":
        return emailRegex.test(value) ? "" : t("userM.email_rule");
      case "username":
        return usernameRegex.test(value) ? "" : t("userM.username_rule");
      case "phoneNumber":
        return phoneRegex.test(value) ? "" : t("userM.phone_rule");
      default:
        return "";
    }
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
      if (key === "role" || key === "status") return;
      const error = validateField(key, formData[key]);
      if (error) {
        nextErrors[key] = error;
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]:
        name === "role" || name === "status" ? "" : validateField(name, value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!validateForm()) {
      Swal.fire({
        icon: "warning",
        title: t("userM.error_title"),
        text: t("userM.validation_error"),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await updateUserForAdmin(user._id, formData, token);
      const updatedUser = { ...user, ...formData };
      onUserUpdated(updatedUser);

      await Swal.fire({
        title: t("userM.update_success_title"),
        text: t("userM.update_success_message"),
        icon: "success",
        confirmButtonText: t("userM.ok_button"),
      });

      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      await Swal.fire({
        title: t("userM.update_error_title"),
        text: t("userM.update_error_message"),
        icon: "error",
        confirmButtonText: t("userM.ok_button"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#67dfff]/60 focus:bg-[#0b1f42]";
  const errorClassName = "mt-2 min-h-5 text-xs text-[#ffb4b4]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(155deg,rgba(10,21,46,0.98),rgba(5,10,22,0.96))] shadow-[0_32px_120px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(103,223,255,0.2),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_30%)]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label={t("userM.close")}
        >
          <X size={18} />
        </button>

        <div className="relative grid lg:grid-cols-[0.9fr,1.1fr]">
          <div className="border-b border-white/10 p-7 lg:border-b-0 lg:border-r">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#67dfff]/20 bg-[#0b1b3e]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-[#88ebff]">
              <ShieldCheck size={14} />
              Admin Access
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">
              {t("userM.edit_title")}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-[#aebddb]">
              {t("userM.edit_description")}
            </p>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-[#67dfff]/20 bg-[#0d1733] p-3 text-[#88ebff]">
                  <SquarePen size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {t("userM.edit_tip_title")}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {t("userM.edit_tip_description")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#facc15]/20 bg-[#facc15]/10 p-4 text-sm text-[#fde68a]">
              <CircleAlert size={18} className="mt-0.5 shrink-0" />
              <p>{t("userM.edit_hint")}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="text-sm font-medium text-white/80">
                  {t("userM.first_name")}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder={t("userM.first_name")}
                />
                <p className={errorClassName}>{errors.firstName || " "}</p>
              </div>

              <div>
                <label htmlFor="lastName" className="text-sm font-medium text-white/80">
                  {t("userM.last_name")}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder={t("userM.last_name")}
                />
                <p className={errorClassName}>{errors.lastName || " "}</p>
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-white/80">
                  {t("userM.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="name@example.com"
                />
                <p className={errorClassName}>{errors.email || " "}</p>
              </div>

              <div>
                <label htmlFor="username" className="text-sm font-medium text-white/80">
                  {t("userM.username")}
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="username_01"
                />
                <p className={errorClassName}>{errors.username || " "}</p>
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-white/80"
                >
                  {t("userM.phone")}
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="08XXXXXXXX"
                />
                <p className={errorClassName}>{errors.phoneNumber || " "}</p>
              </div>

              <div>
                <label htmlFor="role" className="text-sm font-medium text-white/80">
                  {t("userM.role")}
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="user">{t("userM.roles.user")}</option>
                  <option value="admin">{t("userM.roles.admin")}</option>
                </select>
                <p className={errorClassName}> </p>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="status" className="text-sm font-medium text-white/80">
                  {t("userM.status")}
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="active">{t("userM.statuses.active")}</option>
                  <option value="banned">{t("userM.statuses.banned")}</option>
                </select>
                <p className={errorClassName}> </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-5 text-sm font-medium text-white/60 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                {t("userM.cancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#67dfff]/40 bg-[linear-gradient(135deg,#0CACF3,#67dfff)] px-6 text-sm font-semibold text-[#03111f] shadow-[0_14px_32px_rgba(12,172,243,0.28)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
                {isSubmitting ? t("userM.updating") : t("userM.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
