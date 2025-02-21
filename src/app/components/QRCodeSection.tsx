import React, { useState, useRef } from 'react';

const QRCodeSection: React.FC = () => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleDeleteImage = () => {
        setUploadedImage(null);
    };

    return (
        <section className='bg-[#202133] border border-[#202133] rounded-xl w-full md:w-1/2 p-4 flex flex-col gap-4 h-full sm:flex-row justify-center'>
            <div className='flex flex-col gap-2 items-center p-4 w-full md:w-1/2 justify-center'>
                <p className='text-sm'>Scan QR Code</p>
                <img className='w-full max-h-[200px] min-h-[200px] object-contain rounded-xl' src="/Images/AINongtoy/Qr_code.png" alt="QR Code" />
                <div className='flex gap-2 text-sm'>
                    <p>Account :</p>
                    <p>Nongtoy</p>
                </div>
            </div>

            <div className='flex flex-col gap-2 items-center p-4 w-full md:w-1/2 justify-center'>
                <p className='text-sm'>Upload QR Code</p>
                {!uploadedImage && (
                    <div className='flex justify-center items-center w-full h-full'>
                        <label className="upload-btn text-sm">
                            Upload File
                            <input ref={fileInputRef} type="file" accept="image/*" name="qrCode" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>
                )}
                {uploadedImage && (
                    <div className='relative w-full h-full'>
                        <img className='w-full max-h-[200px] min-h-[200px]  object-contain rounded-xl cursor-pointer' src={uploadedImage} alt="Uploaded QR Code" onClick={handleImageClick} />
                        <button className='absolute top-3 right-2 text-white bg-red-500 text-sm font-medium' onClick={handleDeleteImage}>
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