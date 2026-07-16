"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { CircleAlert, Loader2, ShieldCheck, Tags, X } from "lucide-react";
import { createKeywordForAdmin } from "@/api/keywordAPI";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import "../../i18n";

interface KeywordFormProps {
  isFormVisible: boolean;
  handleCloseModal: () => void;
  token: string;
  onKeywordCreated: (keyword: any) => void;
}

const KeywordForm: React.FC<KeywordFormProps> = ({
  isFormVisible,
  handleCloseModal,
  token,
  onKeywordCreated,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    type: "Color",
  });
  const [errors, setErrors] = useState({
    name: "",
    type: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isFormVisible) {
      setFormData({ name: "", type: "Color" });
      setErrors({ name: "", type: "" });
      setIsSubmitting(false);
    }
  }, [isFormVisible]);

  if (!isFormVisible) return null;

  const validateField = (name: string, value: string) => {
    if (!value.trim()) return t("keywordManagement.required");
    if (name === "name" && value.trim().length < 2) {
      return t("keywordManagement.nameRule");
    }
    return "";
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
    }));
  };

  const validateForm = () => {
    const nextErrors = {
      name: validateField("name", formData.name),
      type: formData.type.trim() ? "" : t("keywordManagement.required"),
    };
    setErrors(nextErrors);
    return !nextErrors.name && !nextErrors.type;
  };

  const extractCreatedKeyword = (response: any) =>
    response?.data ?? response?.keyword ?? response?.createdKeyword ?? response;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: "warning",
        title: t("keywordForm.errorTitle"),
        text: t("keywordManagement.validationError"),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const createdKeyword = await createKeywordForAdmin(token, formData);
      onKeywordCreated(extractCreatedKeyword(createdKeyword));
      await Swal.fire({
        icon: "success",
        title: t("keywordForm.successTitle"),
        text: t("keywordForm.successText"),
      });
      handleCloseModal();
    } catch (error) {
      console.error("Error creating keyword:", error);
      Swal.fire({
        icon: "error",
        title: t("keywordForm.errorTitle"),
        text: t("keywordForm.errorText"),
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
          aria-label={t("keywordManagement.close")}
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
              {t("keywordManagement.createTitle")}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-[#aebddb]">
              {t("keywordManagement.createDescription")}
            </p>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-[#67dfff]/20 bg-[#0d1733] p-3 text-[#88ebff]">
                  <Tags size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {t("keywordManagement.createTipTitle")}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {t("keywordManagement.createTipDescription")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#facc15]/20 bg-[#facc15]/10 p-4 text-sm text-[#fde68a]">
              <CircleAlert size={18} className="mt-0.5 shrink-0" />
              <p>{t("keywordManagement.createHint")}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="text-sm font-medium text-white/80">
                  {t("keywordForm.fields.name")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClassName}
                />
                <p className={errorClassName}>{errors.name || " "}</p>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="type" className="text-sm font-medium text-white/80">
                  {t("keywordForm.fields.type")}
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="Color">{t("keywordForm.fields.color")}</option>
                  <option value="Character">{t("keywordForm.fields.character")}</option>
                </select>
                <p className={errorClassName}>{errors.type || " "}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] px-5 text-sm font-medium text-white/60 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                {t("keywordManagement.close")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#67dfff]/40 bg-[linear-gradient(135deg,#0CACF3,#67dfff)] px-6 text-sm font-semibold text-[#03111f] shadow-[0_14px_32px_rgba(12,172,243,0.28)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
                {isSubmitting
                  ? t("keywordManagement.creating")
                  : t("keywordForm.fields.submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KeywordForm;
