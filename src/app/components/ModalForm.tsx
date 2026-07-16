"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { CircleAlert, Loader2, ShieldPlus, UserPlus, X } from "lucide-react";
import { createUserForAdmin } from "@/api/userAPI";
import Swal from "sweetalert2";
import "../../i18n";
import { useTranslation } from "react-i18next";

interface ModalFormProps {
  isFormVisible: boolean;
  handleCloseModal: () => void;
  token: string;
  onUserCreated: (user: any) => void;
}

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  phoneNumber: "",
  role: "user",
  password: "",
};

const emailRegex = /^[a-zA-Z][^\s@]*@[a-zA-Z]{2,}(\.[a-zA-Z]{2,}){1,2}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
const nameRegex = /^[a-zA-Z]{2,40}$/;
const phoneRegex = /^0[1-9]\d{8}$/;
const usernameRegex =
  /^[a-zA-Z](?=[a-zA-Z0-9._]{3,39}$)(?!.*[.].*[.])(?!.*[_].*[_])[a-zA-Z0-9._]*$/;

const ModalForm: React.FC<ModalFormProps> = ({
  isFormVisible,
  handleCloseModal,
  token,
  onUserCreated,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialFormData);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isFormVisible) {
      setFormData(initialFormData);
      setConfirmPassword("");
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isFormVisible]);

  if (!isFormVisible) return null;

  const validateField = (name: string, value: string) => {
    if (!value.trim()) return t("mForm.required");

    switch (name) {
      case "firstName":
      case "lastName":
        return nameRegex.test(value) ? "" : t("mForm.name_rule");
      case "email":
        return emailRegex.test(value) ? "" : t("mForm.email_rule");
      case "username":
        return usernameRegex.test(value) ? "" : t("mForm.username_rule");
      case "phoneNumber":
        return phoneRegex.test(value) ? "" : t("mForm.phone_rule");
      case "password":
        return passwordRegex.test(value) ? "" : t("mForm.password_rule");
      default:
        return "";
    }
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    (
      Object.keys(formData) as Array<keyof typeof formData>
    ).forEach((key) => {
      if (key === "role") return;
      const error = validateField(key, formData[key]);
      if (error) {
        nextErrors[key] = error;
      }
    });

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = t("mForm.required");
    } else if (formData.password !== confirmPassword) {
      nextErrors.confirmPassword = t("mForm.password_mismatch");
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
      ...(name === "password" && confirmPassword
        ? {
            confirmPassword:
              value === confirmPassword ? "" : t("mForm.password_mismatch"),
          }
        : {}),
    }));
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors((prev) => ({
      ...prev,
      confirmPassword:
        !value.trim()
          ? t("mForm.required")
          : formData.password === value
            ? ""
            : t("mForm.password_mismatch"),
    }));
  };

  const extractCreatedUser = (response: any) =>
    response?.data ?? response?.user ?? response?.createdUser ?? response;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "warning",
        title: t("mForm.error"),
        text: t("mForm.validation_error"),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const createdUser = await createUserForAdmin(token, formData);
      const nextUser = extractCreatedUser(createdUser);

      onUserCreated(nextUser);

      await Swal.fire({
        icon: "success",
        title: t("mForm.success"),
        text: t("mForm.user_created"),
      });

      handleCloseModal();
    } catch {
      Swal.fire({
        icon: "error",
        title: t("mForm.error"),
        text: t("mForm.creation_failed"),
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
          onClick={handleCloseModal}
          className="absolute right-5 top-5 z-10 rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label={t("mForm.close")}
        >
          <X size={18} />
        </button>

        <div className="relative grid lg:grid-cols-[0.9fr,1.1fr]">
          <div className="border-b border-white/10 p-7 lg:border-b-0 lg:border-r">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#67dfff]/20 bg-[#0b1b3e]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-[#88ebff]">
              <ShieldPlus size={14} />
              Admin Access
            </div>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">
              {t("mForm.title")}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-[#aebddb]">
              {t("mForm.description")}
            </p>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-[#67dfff]/20 bg-[#0d1733] p-3 text-[#88ebff]">
                  <UserPlus size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {t("mForm.tip_title")}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {t("mForm.tip_description")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#facc15]/20 bg-[#facc15]/10 p-4 text-sm text-[#fde68a]">
              <CircleAlert size={18} className="mt-0.5 shrink-0" />
              <p>{t("mForm.password_hint")}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="text-sm font-medium text-white/80">
                  {t("mForm.first_name")}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder={t("mForm.first_name")}
                />
                <p className={errorClassName}>{errors.firstName || " "}</p>
              </div>

              <div>
                <label htmlFor="lastName" className="text-sm font-medium text-white/80">
                  {t("mForm.last_name")}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder={t("mForm.last_name")}
                />
                <p className={errorClassName}>{errors.lastName || " "}</p>
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-white/80">
                  {t("mForm.email")}
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
                  {t("mForm.username")}
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
                  {t("mForm.phone_number")}
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
                  {t("mForm.role")}
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="user">{t("mForm.roles.user")}</option>
                  <option value="admin">{t("mForm.roles.admin")}</option>
                </select>
                <p className={errorClassName}> </p>
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-white/80">
                  {t("mForm.password")}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="••••••••"
                />
                <p className={errorClassName}>{errors.password || " "}</p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-white/80"
                >
                  {t("mForm.confirm_password")}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={inputClassName}
                  placeholder="••••••••"
                />
                <p className={errorClassName}>{errors.confirmPassword || " "}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-5 text-sm font-medium text-white/60 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                {t("mForm.close")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#67dfff]/40 bg-[linear-gradient(135deg,#0CACF3,#67dfff)] px-6 text-sm font-semibold text-[#03111f] shadow-[0_14px_32px_rgba(12,172,243,0.28)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
                {isSubmitting ? t("mForm.submitting") : t("mForm.submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
