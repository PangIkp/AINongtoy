"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import emailjs from "emailjs-com";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    fName: "",
    lName: "",
    email: "",
    phone: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const validateField = (name: keyof typeof formData, value: string) => {
    if (value.trim() === "") {
      return "";
    }

    switch (name) {
      case "fName":
        return /^[a-zA-Zก-ฮะ-ูเ-์]+$/.test(value) ? "" : t("validation.firstName");
      case "lName":
        return /^[a-zA-Zก-ฮะ-ูเ-์]+$/.test(value) ? "" : t("validation.lastName");
      case "email":
        return /^[a-zA-Z][^\s@]*@[a-zA-Z]{2,}(\.[a-zA-Z]{2,}){1,2}$/.test(value)
          ? ""
          : t("validation.email");
      case "phone":
        return /^0\d{2}-\d{3}-\d{4}$/.test(value) ? "" : t("validation.phone");
      default:
        return "";
    }
  };

  const validateForm = () => {
    let valid = true;
    const nextErrors = {
      fName: "",
      lName: "",
      email: "",
      phone: "",
    };

    (Object.keys(formData) as Array<keyof typeof formData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      nextErrors[field] = error;
      if (error) {
        valid = false;
      }
    });

    setErrors(nextErrors);
    return valid;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "phone") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
        .slice(0, 12);
    }

    setFormData((current) => ({
      ...current,
      [name]: formattedValue,
    }));
    setErrors((current) => ({
      ...current,
      [name]: validateField(name as keyof typeof formData, formattedValue),
    }));
    setSuccessMessage("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    emailjs
      .sendForm(
        "service_g1z0gpm",
        "template_avfxlaa",
        e.target as HTMLFormElement,
        "VzQC9poepjolu-W_1",
      )
      .then(() => {
        setFormData({ fName: "", lName: "", email: "", phone: "" });
        setSuccessMessage(t("form.success"));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const isFormValid =
    Object.values(errors).every((error) => error === "") &&
    Object.values(formData).every((value) => value.trim() !== "");

  const fields: Array<{
    id: keyof typeof formData;
    type: string;
    label: string;
    minLength: number;
    maxLength: number;
  }> = [
    { id: "fName", type: "text", label: t("form.firstName"), minLength: 4, maxLength: 30 },
    { id: "lName", type: "text", label: t("form.lastName"), minLength: 4, maxLength: 30 },
    { id: "email", type: "email", label: t("form.email"), minLength: 5, maxLength: 50 },
    { id: "phone", type: "text", label: t("form.phone"), minLength: 12, maxLength: 12 },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#5ad7ff]">
          {t("contact.title")}
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
          {t("contact.subtitle")}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#b6c2da]">
          Tell us what you want to build. We can discuss concept direction, material choices,
          and production feasibility.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 rounded-[30px] border border-white/10 bg-[#08101f]/88 p-6 sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.slice(0, 2).map((field) => (
            <label
              key={field.id}
              htmlFor={field.id}
              className="block text-sm font-medium text-[#dbe7ff]"
            >
              <span>{field.label}</span>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                autoComplete={field.id === "email" ? "email" : field.id === "phone" ? "tel" : "name"}
                minLength={field.minLength}
                maxLength={field.maxLength}
                value={formData[field.id]}
                onChange={handleChange}
                required
                className="mt-2 block w-full rounded-2xl border border-white/10 bg-[#0d1830] px-4 py-3 text-sm !text-white caret-[#5ad7ff] placeholder:text-[#7f8ba3] focus:border-[#5ad7ff] focus:ring-2 focus:ring-[#5ad7ff]/30"
              />
              <span className="mt-2 block min-h-5 text-xs text-[#ffbf7e]">{errors[field.id]}</span>
            </label>
          ))}
        </div>

        {fields.slice(2).map((field) => (
          <label
            key={field.id}
            htmlFor={field.id}
            className="block text-sm font-medium text-[#dbe7ff]"
          >
            <span>{field.label}</span>
            <input
              id={field.id}
              name={field.id}
              type={field.type}
              autoComplete={field.id === "email" ? "email" : "tel"}
              minLength={field.minLength}
              maxLength={field.maxLength}
              value={formData[field.id]}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-2xl border border-white/10 bg-[#0d1830] px-4 py-3 text-sm !text-white caret-[#5ad7ff] placeholder:text-[#7f8ba3] focus:border-[#5ad7ff] focus:ring-2 focus:ring-[#5ad7ff]/30"
            />
            <span className="mt-2 block min-h-5 text-xs text-[#ffbf7e]">{errors[field.id]}</span>
          </label>
        ))}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={!isFormValid}
            className="inline-flex items-center justify-center rounded-full bg-[#5ad7ff] px-6 py-3 text-sm font-semibold text-[#05111f] transition hover:bg-[#82e2ff] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("form.submit")}
          </button>
          <span className="min-h-5 text-sm text-[#86efac]">{successMessage}</span>
        </div>
      </form>
    </div>
  );
}
