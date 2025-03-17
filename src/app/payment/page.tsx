"use client";
import { ArtToy } from "@/mainstore"; // ✅ นำเข้า interface ArtToy
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductDetailsSection from "../components/ProductDetailsSection";
import QRCodeSection from "../components/QRCodeSection";

export default function Payment() {
    const aboutRef = useRef<HTMLDivElement>(null!);
    const partnerRef = useRef<HTMLDivElement>(null!);
    const contactRef = useRef<HTMLDivElement>(null!);
    const [artToyData, setArtToyData] = useState<ArtToy | null>(null);
    const [shippingCost, setShippingCost] = useState(50);

    const handleShippingChange = (cost: number) => {
        setShippingCost(cost);
    };

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // ✅ ดึงข้อมูลจาก localStorage เมื่อโหลดหน้า Payment
    useEffect(() => {
        const storedData = localStorage.getItem("artToyData");
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                if (typeof parsedData === "object" && parsedData !== null) {
                    setArtToyData(parsedData);
                }
            } catch (error) {
                console.error("Error parsing artToyData from localStorage:", error);
            }
        }
    }, []);

    // ✅ บันทึกค่า artToyData ลง localStorage ทันทีที่มีการเปลี่ยนแปลง
    useEffect(() => {
        if (artToyData) {
            localStorage.setItem("artToyData", JSON.stringify(artToyData));
        }
    }, [artToyData]);
    return (
        <div>
            <Navbar
                scrollToSection={scrollToSection}
                aboutRef={aboutRef}
                partnerRef={partnerRef}
                contactRef={contactRef}
            />
            <main className="w-full my-[5rem] place-items-center">
                <div className="max-w-[1080px] w-full h-full pt-24 flex flex-col gap-7 p-3">
                    <header>
                        <h1 className="text-4xl font-semibold mb-4">Payment</h1>
                        <p className="font-thin">Review your order</p>
                    </header>

                    {/* ตรวจสอบว่ามีข้อมูลหรือไม่ก่อนแสดงผล */}
                    {artToyData ? (
                        <ProductDetailsSection {...artToyData} shipingCost={shippingCost} />
                    ) : (
                        <p>Loading...</p>
                    )}

                    <form action="">
                        <section className="w-full h-full grid lg:grid-cols-2 lg:gird-rows-1 gird-rows-2 grid-cols-1 gap-4">
                            <section className="w-full h-full flex flex-col gap-3">
                                <div className="bg-[#202133] border border-[#202133] rounded-xl p-4">
                                    <h2 className="mb-1 text-[16px] font-semibold">Address</h2>
                                    <button className="w-full py-2 bg-[#202133] border border-[#828399] rounded-lg place-items-start font-thin text-xs leading-5">
                                        <p>
                                            <strong className="text-[14px]">
                                                Mr.Aekkaphop Sreesunthorn
                                            </strong>
                                        </p>
                                        <p className="text-left text-[14px]">
                                            11/1 Sansuk Village, Soi Phatthana, Sawasdee Road, Sukjai,
                                            Jamsai, Bangkok 12345 Thailand
                                        </p>
                                        <p className="text-[14px]">0655759995</p>
                                    </button>
                                </div>
                                <div className="bg-[#202133] border border-[#202133] rounded-xl p-4">
                                    <h2 className="mb-1 text-[16px] font-semibold">
                                        Shipping Option
                                    </h2>
                                    <div className="flex flex-col gap-2">
                                        <div
                                            className={`flex items-center border ${shippingCost === 50
                                                ? "border-[#0578AB]"
                                                : "border-[#828399]"
                                                } rounded-lg gap-2 px-2 py-4 hover:bg-[#0578AB] cursor-pointer`}
                                            onClick={() => handleShippingChange(50)}
                                        >
                                            <input
                                                type="radio"
                                                name="shipping"
                                                value="standard"
                                                id="standard"
                                                checked={shippingCost === 50}
                                                onChange={() => handleShippingChange(50)}
                                                className="w-5 h-5 border-2 border-[#828399] rounded-full checked:bg-[#0578AB] checked:border-[#0578AB] cursor-pointer"
                                            />
                                            <label
                                                className="w-full text-[14px] flex justify-between cursor-pointer"
                                                htmlFor="standard"
                                            >
                                                <p>Standard Delivery (Delivery time 3 - 7 days)</p>
                                                <p>50 ฿</p>
                                            </label>
                                        </div>

                                        {/* EMS Delivery */}
                                        <div
                                            className={`flex items-center border ${shippingCost === 70
                                                ? "border-[#0578AB]"
                                                : "border-[#828399]"
                                                } rounded-lg gap-2 px-2 py-4 hover:bg-[#0578AB] cursor-pointer`}
                                            onClick={() => handleShippingChange(70)}
                                        >
                                            <input
                                                type="radio"
                                                name="shipping"
                                                value="ems"
                                                id="ems"
                                                checked={shippingCost === 70}
                                                onChange={() => handleShippingChange(70)}
                                                className="w-5 h-5 border-2 border-[#828399] rounded-full checked:bg-[#0578AB] checked:border-[#0578AB] cursor-pointer"
                                            />

                                            <label
                                                className="w-full text-[14px] flex justify-between cursor-pointer"
                                                htmlFor="ems"
                                            >
                                                <p>EMS Delivery ( Delivery time 1 - 2 days )</p>
                                                <p>70 ฿</p>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className="w-full h-full">
                                <QRCodeSection />
                            </section>

                        </section>
                    </form>
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <button className="w-full sm:w-1/2 bg-[#51536D] h-[40px]">
                            Cancel
                        </button>
                        <button className="w-full sm:w-1/2 h-[40px]">Confirm</button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
