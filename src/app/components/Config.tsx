"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useMainStore } from "@/mainstore";
import { useSearchParams, useRouter } from "next/navigation";
import { createArtToy, getArtToys, updateArtToy } from "@/api/arttoyAPI";
import { getUser } from "@/api/authAPI";
import Swal from "sweetalert2";
import {
  Boxes,
  Loader,
  Palette,
  PencilLine,
  ReceiptText,
  Ruler,
  Wrench,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../i18n";

const Config = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("Unnamed Art Toy");
  const [size, setSize] = useState("Small");
  const [material, setMaterial] = useState("PLA");
  const [painting, setPainting] = useState("Hand-painting");
  const [assembly, setAssembly] = useState("Fixed Pose");
  const [quantity, setQuantity] = useState(1);
  const [fetchId, setFetchId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const pricePerUnit = 500;
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("image") || "/Images/AINongtoy/WhiteMiku.png";

  const { setArtToyData } = useMainStore();
  const router = useRouter();

  const [isNew, setIsNew] = useState(true);
  const price = quantity * pricePerUnit;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: t("error.notLoggedIn"),
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
      setIsLoading(false);
      return;
    }

    const fetchArtToyData = async () => {
      try {
        setIsLoading(true);
        const user = await getUser(token);
        const userId = user.data._id;

        const artToys = await getArtToys(token);
        const userArtToys = artToys.filter(
          (toy: any) => toy.user === userId && toy.imageUrl === imageUrl
        );

        if (userArtToys.length > 0) {
          setIsNew(false);
          setName(userArtToys[0].name);
          setSize(userArtToys[0].size);
          setMaterial(userArtToys[0].material);
          setPainting(userArtToys[0].painting);
          setAssembly(userArtToys[0].assembly);
          setQuantity(userArtToys[0].quantity);
          setFetchId(userArtToys[0]._id);
        }
      } catch (error: any) {
        Swal.fire({
          title: t("Swal.config.error.fetchFailed"),
          text: error.message || t("Swal.config.error.defaultMessage"),
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtToyData();
  }, [imageUrl, t]);

  const handleBlurOrEnter = (
    event:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    if ("key" in event && event.key !== "Enter") return;
    setIsEditing(false);
  };

  const handleSave = async () => {
    const updatedArtToy = {
      name,
      size,
      material,
      painting,
      assembly,
      quantity,
      price,
      imageUrl,
    };

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: t("Swal.config.error.notLoggedIn"),
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      if (isNew) {
        await createArtToy(updatedArtToy, token);
      } else {
        await updateArtToy(fetchId, updatedArtToy, token);
      }

      setArtToyData(updatedArtToy);

      Swal.fire({
        title: t("Swal.config.success.title"),
        text: t("Swal.config.success.saved"),
        icon: "success",
        confirmButtonText: t("Swal.config.success.ok"),
      });
    } catch (error: any) {
      Swal.fire({
        title: t("Swal.config.error.title"),
        text: error.message || t("Swal.config.error.defaultMessage"),
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleCheckout = () => {
    const artToyData = {
      name,
      size,
      material,
      painting,
      assembly,
      quantity,
      price,
      imageUrl,
    };

    setArtToyData(artToyData);
    localStorage.setItem("artToyData", JSON.stringify(artToyData));
    router.push("/payment");
  };

  const optionSections = [
    {
      title: t("artToy.size"),
      value: size,
      setValue: setSize,
      icon: Ruler,
      options: ["Small", "Medium", "Large"],
      optionLabel: (option: string) => t(`artToy.sizeOptions.${option}`),
    },
    {
      title: t("artToy.material"),
      value: material,
      setValue: setMaterial,
      icon: Boxes,
      options: ["PLA", "Resin", "PVC", "Metal"],
      optionLabel: (option: string) => t(`artToy.materialOptions.${option}`),
    },
    {
      title: t("artToy.painting"),
      value: painting,
      setValue: setPainting,
      icon: Palette,
      options: ["Hand-painting", "Airbrush", "Pad Printing"],
      optionLabel: (option: string) => t(`artToy.paintingOptions.${option}`),
    },
    {
      title: t("artToy.assembly"),
      value: assembly,
      setValue: setAssembly,
      icon: Wrench,
      options: ["Fixed Pose", "Articulated Joints", "Magnet Joints"],
      optionLabel: (option: string) => t(`artToy.assemblyOptions.${option}`),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-[32px] border border-white/10 bg-white/5">
        <Loader className="animate-spin text-[#0CACF3]" size={50} />
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.95),rgba(11,18,40,0.95))] shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
      <div className="grid gap-0 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="border-b border-white/10 p-6 xl:border-b-0 xl:border-r xl:p-8">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#091224]">
            <img
              src={imageUrl}
              alt={t("artToy.selectedAlt")}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.24em] text-[#7ee7ff]">Identity</p>
                {isEditing ? (
                  <input
                    aria-hidden="true"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    onBlur={handleBlurOrEnter}
                    onKeyDown={handleBlurOrEnter}
                    autoFocus
                    className="mt-3 w-full rounded-xl border border-white/15 bg-[#0b1734] px-4 py-3 text-lg font-semibold text-white outline-none"
                  />
                ) : (
                  <p className="mt-3 break-words text-2xl font-semibold text-white">
                    {name === "Unnamed Art Toy" ? t(`artToy.names.${name}`) : name}
                  </p>
                )}
                <p className="mt-3 text-sm leading-7 text-white/65">{t("artToy.prompts.customizeName")}</p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  <PencilLine size={14} />
                  {t("artToy.button.edit")}
                </button>
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#0b1734] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">{t("artToy.quantity")}</p>
                <p className="mt-2 text-lg font-semibold text-white">{quantity}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0b1734] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Unit Price</p>
                <p className="mt-2 text-lg font-semibold text-white">{pricePerUnit.toLocaleString()} ฿</p>
              </div>
              <div className="min-w-0 rounded-2xl border border-[#0AACF0]/30 bg-[linear-gradient(180deg,rgba(12,172,243,0.16),rgba(11,23,52,0.95))] p-4">
                <div className="rounded-xl border border-[#0AACF0]/20 bg-[#0b1d3d] p-2.5 w-fit">
                  <ReceiptText size={16} className="text-[#9defff]" />
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-[#9defff] sm:text-xs">
                  {t("artToy.totalPrice")}
                </p>
                <p className="mt-2 text-lg font-semibold text-white">{price.toLocaleString()} ฿</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 p-6 xl:p-8">
          <div className="border-b border-white/10 pb-6">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]">
              Production Setup
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{t("material.title")}</h2>
            <p className="mt-3 text-sm leading-7 text-[#aebddb]">
              Finalize build size, material, finish, and assembly before sending this concept into checkout.
            </p>
          </div>

          <div className="grid gap-6">
            {optionSections.map(({ title, value, setValue, icon: Icon, options, optionLabel }) => (
              <div key={title} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl border border-white/10 bg-[#0D1733] p-2.5">
                    <Icon size={16} className="text-[#76e3ff]" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{title}</p>
                    <p className="text-sm text-white/55">Choose one option</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {options.map((option) => {
                    const isActive = value === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        className={`rounded-2xl border px-4 py-4 text-left text-sm font-medium transition ${
                          isActive
                            ? "border-[#0AACF0]/40 bg-[rgba(12,172,243,0.14)] text-white"
                            : "border-white/10 bg-[#0b1328] text-white/75 hover:border-white/20 hover:bg-white/10 hover:text-white"
                        }`}
                        onClick={() => setValue(option)}
                      >
                        {optionLabel(option)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-base font-semibold text-white">{t("artToy.quantity")}</p>
              <p className="mt-1 text-sm text-white/55">Adjust how many units you want to prepare.</p>

              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1328] p-2">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg font-semibold text-white transition hover:bg-white/10"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <span className="min-w-12 text-center text-lg font-semibold text-white">{quantity}</span>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg font-semibold text-white transition hover:bg-white/10"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="min-w-0 rounded-2xl border border-white/10 bg-[#0b1734] px-5 py-4">
                  <p className="break-words text-[11px] uppercase tracking-[0.16em] text-white/45 sm:text-xs">
                    {t("artToy.totalPrice")}
                  </p>
                  <p className="mt-2 break-all text-2xl font-semibold text-white">{price.toLocaleString()} ฿</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white/80 transition hover:bg-white/10 sm:w-1/2"
              onClick={handleSave}
            >
              {t("artToy.button.save")}
            </button>
            <button
              type="button"
              className="h-12 w-full rounded-xl border border-[#0AACF0]/35 bg-[#0b1d3d] text-sm font-semibold text-[#89ebff] transition hover:bg-[#11305a] sm:w-1/2"
              onClick={handleCheckout}
            >
              {t("artToy.button.checkout")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Config;
