"use client";
import { ArtToy } from "@/mainstore"; // ✅ นำเข้า interface ArtToy
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductDetailsSection from "../components/ProductDetailsSection";
import QRCodeSection from "../components/QRCodeSection";
import { getUserData } from "@/utils/localStorageUtils";
import { IoIosAddCircle } from "react-icons/io";
import { createOrder } from "@/api/orderAPI";
import { useRouter } from "next/navigation";

export default function Payment() {
  const aboutRef = useRef<HTMLDivElement>(null!);
  const partnerRef = useRef<HTMLDivElement>(null!);
  const contactRef = useRef<HTMLDivElement>(null!);
  const [artToyData, setArtToyData] = useState<ArtToy | null>(null);
  const [shippingFee, setShippingCost] = useState(50);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const userData = getUserData();
  const fname = userData?.firstName;
  const lname = userData?.lastName;
  const phone = userData?.phoneNumber;
  const address = userData?.address;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const router = useRouter();

  const handleAddressSelect = (addr: any) => {
    setSelectedAddress(addr);
    handleClosePopUp();
  };

  const handleOpenPopUp = () => {
    setIsModalOpen(true);
  };

  const handleClosePopUp = () => {
    setIsModalOpen(false);
  };

  const handleShippingChange = (cost: number) => {
    setShippingCost(cost);
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const CancelButton = () => {
    router.back();
  };

  const handleConfirmOrder = async () => {
    if (!artToyData || !userData) {
      alert("ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    const orderData = {
      name: artToyData.name,
      size: artToyData.size,
      material: artToyData.material,
      painting: artToyData.painting,
      assembly: artToyData.assembly,
      quantity: artToyData.quantity,
      price: artToyData.price,
      shipping: shippingFee,
      total: artToyData.price + shippingFee,
      address: selectedAddress || userData.address[0],
      payment: paymentProof,
      imageUrl: artToyData.imageUrl,
    };

    try {
      //   await createOrder(userData.token, orderData)
      alert("Order completed!");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error creating order");
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

  // artToyData ลง localStorage ทันทีที่มีการเปลี่ยนแปลง
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
            <ProductDetailsSection {...artToyData} shippingFee={shippingFee} />
          ) : (
            <p>Loading...</p>
          )}

          <form action="">
            <section className="w-full h-full grid lg:grid-cols-2 lg:gird-rows-1 gird-rows-2 grid-cols-1 gap-4">
              <section className="w-full h-full flex flex-col gap-3">
                <div className="bg-[#202133] border border-[#202133] rounded-xl p-4">
                  <h2 className="mb-1 text-[16px] font-semibold">Address</h2>
                  {address && address.length > 0 ? (
                    <div
                      className="w-full h-30 py-2 bg-[#202133] border border-[#828399] rounded-lg place-items-start font-thin text-xs leading-5 cursor-pointer hover:bg-[#0578AB] px-2"
                      onClick={handleOpenPopUp}
                    >
                      <p>
                        <strong className="text-[14px]">
                          {fname} {lname}
                        </strong>
                      </p>
                      <p className="text-left text-[14px]">
                        {selectedAddress
                          ? `${selectedAddress.detail} ${selectedAddress.subdistrict} ${selectedAddress.district} ${selectedAddress.province} ${selectedAddress.postalCode}`
                          : `${address[0].detail} ${address[0].subdistrict} ${address[0].district} ${address[0].province} ${address[0].postalCode}`}
                      </p>
                      <p className="text-[14px]">{phone}</p>
                    </div>
                  ) : (
                    <a
                      className="w-full h-[40px] gap-1 py-2 border border-[#828399] rounded-lg flex justify-center items-center leading-5 cursor-pointer hover:bg-[#0578AB] px-2"
                      href="/editProfile"
                    >
                      <IoIosAddCircle className="text-white text-xl" />
                      <p className="text-white">Add Address</p>
                    </a>
                  )}
                </div>
                <div className="bg-[#202133] border border-[#202133] rounded-xl p-4">
                  <h2 className="mb-1 text-[16px] font-semibold">
                    Shipping Option
                  </h2>
                  <div className="flex flex-col gap-2">
                    <div
                      className={`flex items-center border ${
                        shippingFee === 50
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
                        checked={shippingFee === 50}
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
                      className={`flex items-center border ${
                        shippingFee === 70
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
                        checked={shippingFee === 70}
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
            <button
              className="w-full sm:w-1/2 bg-[#51536D] h-[40px]"
              onClick={CancelButton}
            >
              Cancel
            </button>

            <button
              className="w-full sm:w-1/2 h-[40px]"
              onClick={handleConfirmOrder}
            >
              Confirm
            </button>
          </div>
        </div>
      </main>
      <Footer />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className=" bg-[#202133] border border-[#202133] rounded-xl p-4">
            <div className="flex justify-between">
              <h2>Select Address</h2>
              <button onClick={handleClosePopUp}>X</button>
            </div>
            <div className="flex flex-col gap-4 my-4">
              {address.map((addr: any, index: number) => (
                <div
                  key={index}
                  className="w-full h-30 py-2 bg-[#202133] border border-[#828399] rounded-lg place-items-start font-thin text-xs leading-5 cursor-pointer hover:bg-[#0578AB] px-2"
                  onClick={() => handleAddressSelect(addr)}
                >
                  <p>
                    <strong className="text-[14px]">
                      {fname} {lname}
                    </strong>
                  </p>
                  <p className="text-left text-[14px]">
                    {addr.detail} {addr.subdistrict} {addr.district}{" "}
                    {addr.province} {addr.postalCode}
                  </p>
                  <p className="text-[14px]">{phone}</p>
                </div>
              ))}

              <a
                className="w-full h-[40px] gap-1 py-2 border border-[#828399] rounded-lg flex justify-center items-center leading-5 cursor-pointer bg-[#0CACF3] hover:bg-[#0578AB] px-2"
                href="/editProfile"
              >
                <p className="text-white">Edit Address</p>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
