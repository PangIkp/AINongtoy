"use client";
import React, { useState, useRef } from 'react';

interface QRCodeSectionProps {
    setPaymentImage: React.Dispatch<React.SetStateAction<string | null>>;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ setPaymentImage }) => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                console.log("Base64 String:", base64String);
                setUploadedImage(base64String);
                setPaymentImage(base64String);
            };
            reader.readAsDataURL(file);
        }
        // if (file) {
        //     const imageUrl = URL.createObjectURL(file); 
        //     console.log("Uploaded Image URL:", imageUrl);
        //     setUploadedImage(imageUrl);
        // }
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleDeleteImage = () => {
        setUploadedImage(null); // Clear the uploaded image state
        setPaymentImage(null); // Clear the payment image state
    };
    return (
        <section className='bg-[#202133] border border-[#202133] rounded-xl w-full flex flex-col gap-4 h-full sm:flex-row justify-center'>
            <div className='flex flex-col gap-2 items-center p-4 w-full justify-center h-full'>
                <p className='text-sm'>Scan QR Code</p>
                <img className='w-[200px] h-[200px] object-fill rounded-xl' src="/Images/AINongtoy/Qr_code.png" alt="QR Code" />
                <div className='flex gap-2 text-sm'>
                    <p>Account :</p>
                    <p>Nongtoy</p>
                </div>
            </div>

            <div className='flex flex-col gap-2 items-center p-4 w-full justify-center'>
                <p className='text-sm'>Upload QR Code</p>
                {!uploadedImage && (
                    <div className='flex justify-center items-center w-[200px] h-[200px] outline-2 outline-dashed rounded-xl'>
                        <label className="upload-btn text-sm">
                            Upload File
                            <input ref={fileInputRef} type="file" accept="image/*" name="qrCode" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>
                )}
                {uploadedImage && (
                    <div className='relative w-[200px] h-[200px] place-content-center place-items-center'>
                        <img className='w-full h-full object-fill rounded-xl cursor-pointer' src={uploadedImage} alt="Uploaded QR Code" onClick={handleImageClick} />
                        <button className='absolute top-2 right-2 text-white bg-red-500 text-sm font-medium' onClick={handleDeleteImage} >
                            X
                        </button>
                        <label htmlFor="upload" className='hidden'>a</label>
                        <input ref={fileInputRef} type="file" id='upload' accept="image/*" name="qrCode" onChange={handleImageUpload} className="hidden" />
                    </div>
                )}
                <div className='flex gap-2 text-[#202133] text-sm'>
                    <p>Account :</p>
                    <p>Nongtoy</p>
                </div>
            </div>
        </section>
    );
};

export default QRCodeSection;