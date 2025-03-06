// ส่วนนี้เป็นการนำเข้าโมดูลและคอมโพเนนต์ที่จำเป็น
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { IoIosAddCircle } from "react-icons/io";

// กำหนด interface สำหรับข้อมูลจังหวัด อำเภอ ตำบล และข้อมูลที่ถูกเลือก
interface Province {
    id: number;
    name_th: string;
    name_en: string;
    amphure: Amphure[];
}

interface Amphure {
    id: number;
    name_th: string;
    name_en: string;
    tambon: Tambon[];
}

interface Tambon {
    id: number;
    name_th: string;
    name_en: string;
    zip_code: number;
}

interface Selected {
    province_id?: number;
    amphure_id?: number;
    tambon_id?: number;
    zip_code?: number;
}

// กำหนด interface สำหรับ props ของคอมโพเนนต์ DropdownList
interface DropdownListProps {
    label: string;
    id: keyof Selected;
    list: any[];
    child?: string;
    childsId?: (keyof Selected)[];
    setChilds?: React.Dispatch<React.SetStateAction<any[]>>[];
    placeholder?: string;
    disabled?: boolean;
}

// ฟังก์ชันหลักของคอมโพเนนต์ EditProfile
export default function EditProfile() {
    // การใช้ useRef เพื่อสร้าง reference สำหรับการเลื่อนหน้าไปยังส่วนต่างๆ
    const aboutRef = useRef<HTMLDivElement>(null!);
    const partnerRef = useRef<HTMLDivElement>(null!);
    const contactRef = useRef<HTMLDivElement>(null!);

    // ฟังก์ชันสำหรับเลื่อนหน้าไปยังส่วนที่ต้องการ
    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // การใช้ useState เพื่อสร้าง state สำหรับการนับจำนวนตัวอักษรและรายละเอียดที่อยู่
    const [charCount, setCharCount] = useState(0);
    const [addressDetail, setAddressDetail] = useState("");

    // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงใน textarea
    const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        if (value.length <= 500) {
            setCharCount(value.length);
            setAddressDetail(value);
        }
    };

    // การใช้ useState เพื่อสร้าง state สำหรับข้อมูลจังหวัด อำเภอ ตำบล รหัสไปรษณีย์ และข้อมูลที่ถูกเลือก
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [amphures, setAmphures] = useState<Amphure[]>([]);
    const [tambons, setTambons] = useState<Tambon[]>([]);
    const [postalCodes, setPostalCodes] = useState<number[]>([]);
    const [selected, setSelected] = useState<Selected>({
        province_id: undefined,
        amphure_id: undefined,
        tambon_id: undefined,
        zip_code: undefined
    });
    const [isFormValid, setIsFormValid] = useState(false);

    // การใช้ useEffect เพื่อดึงข้อมูลจังหวัดจาก API เมื่อคอมโพเนนต์ถูกสร้างขึ้น
    useEffect(() => {
        fetch("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json")
            .then((response) => response.json())
            .then((result) => {
                setProvinces(result);
            });
    }, []);

    // การใช้ useEffect เพื่อเช็คความถูกต้องของฟอร์มเมื่อข้อมูลที่ถูกเลือกเปลี่ยนแปลง
    useEffect(() => {
        const { province_id, amphure_id, tambon_id, zip_code } = selected;
        setIsFormValid(!!province_id && !!amphure_id && !!tambon_id && !!zip_code);
    }, [selected]);

    // ฟังก์ชันสำหรับเช็คความถูกต้องของ dropdown
    const isDropdownValid = (value: number | undefined) => {
        return value !== undefined && value !== 0;
    };

    // ฟังก์ชันสำหรับลบข้อมูลที่ถูกเลือก
    const handleDelete = () => {
        setSelected({
            province_id: undefined,
            amphure_id: undefined,
            tambon_id: undefined,
            zip_code: undefined
        });
        setAmphures([]);
        setTambons([]);
        setPostalCodes([]);
        setAddressDetail("");
        setCharCount(0);
    };

    // คอมโพเนนต์ DropdownList สำหรับสร้าง dropdown list
    const DropdownList: React.FC<DropdownListProps> = ({ label, id, list, child, childsId = [], setChilds = [], placeholder, disabled }) => {
        const onChangeHandle = (event: React.ChangeEvent<HTMLSelectElement>) => {
            const value = parseInt(event.target.value);
            setSelected((prev: Selected) => ({ ...prev, [id]: value }));

            if (child) {
                const parent = list.find((item) => item.id === value);
                const childs = parent ? parent[child] : [];
                childsId.forEach((childId, index) => {
                    setSelected((prev: Selected) => ({ ...prev, [childId]: undefined }));
                });
                setChilds.forEach((setChild, index) => {
                    setChild(childs);
                });
            } else if (id === "tambon_id") {
                const tambon = list.find((item) => item.id === value);
                setSelected((prev: Selected) => ({ ...prev, zip_code: tambon ? tambon.zip_code : undefined }));
                setPostalCodes(tambon ? [tambon.zip_code] : []);
            }
        };

        return (
            <>
                <label htmlFor={id.toString()}>{label}</label>
                <select
                    id={id.toString()}
                    value={selected[id] !== undefined ? selected[id] : ''}
                    onChange={onChangeHandle}
                    className={isDropdownValid(selected[id]) ? 'select-selected' : 'select-default'}
                    disabled={disabled}
                >
                    <option value="" label={placeholder || "Select ..."} />
                    {list &&
                        list.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                                label={item.name_en}
                            />
                        ))}
                </select>
            </>
        );
    };

    // การคืนค่า JSX ที่จะถูกแสดงผลในหน้าเว็บ
    return (
        <div>
            <Navbar scrollToSection={scrollToSection} aboutRef={aboutRef} partnerRef={partnerRef} contactRef={contactRef} />
            <div className='w-full place-content-center place-items-center h-[235px] mt-[5rem] bg-black'>
                <h1 className='text-4xl font-semibold mb-3'>My Profile</h1>
            </div>
            <div className='w-full place-items-center'>
                <div className='w-full max-w-[980px] px-4 py-20 flex flex-col gap-12'>
                    <div className='flex justify-between border-b border-white pb-6'>
                        <p className='text-xl font-semibold'>Information</p>
                        <div className='place-aitems-end place-content-center'>
                            <button className='bg-background border border-white font-normal text-xs py-1 px-3' onClick={() => alert('Button clicked!')}>Edit</button>
                        </div>
                    </div>

                    <div>
                        <form action="#information" method="post" className='grid grid-cols-2 gap-y-10 gap-x-8'>
                            <label htmlFor="username">
                                <p>Username</p>
                                <input type="text" id="username" />
                            </label>
                            <label htmlFor="email">
                                <p>Email address</p>
                                <input type="email" id="email" />
                            </label>
                            <label htmlFor="fname">
                                <p>First Name</p>
                                <input type="text" id="fname" />
                            </label>
                            <label htmlFor="lname">
                                <p>Last Name</p>
                                <input type="text" id="lname" />
                            </label>
                            <label htmlFor="phone">
                                <p>Phone Number</p>
                                <input type="tel" id="phone" />
                            </label>
                        </form>
                    </div>

                    <div className='flex justify-between border-b border-white pb-6'>
                        <div className='flex justify-center items-center'>
                            <p className='text-xl font-semibold'>Address</p>

                            <button className='bg-[#07081C] hover:bg-[#07081C] hover:text-white rounded-full' onClick={() => alert('Button clicked!')}>
                                <IoIosAddCircle className='w-[20px] h-[20px] hover:text-[#0AACF0]' /><p className='hidden'>+</p>
                            </button>
                        </div>

                        <div className='flex justify-center items-center gap-2'>
                            <button className='bg-background border border-white font-normal text-xs py-1 px-3' onClick={() => alert('Button clicked!')}>Edit</button>
                            <button className='bg-[#51536D] border border-[#51536D] text-gray-300 font-normal text-xs py-1 px-3' onClick={handleDelete}>Delete</button>
                        </div>
                    </div>

                    <div>
                        <form action="#address" method="post" className='grid grid-cols-2 gap-y-10 gap-x-8'>
                            <div>
                                <DropdownList
                                    label=""
                                    id="province_id"
                                    list={provinces}
                                    child="amphure"
                                    childsId={["amphure_id", "tambon_id"]}
                                    setChilds={[setAmphures, setTambons]}
                                    placeholder="Province"
                                />
                            </div>

                            <div>
                                <DropdownList
                                    label=""
                                    id="amphure_id"
                                    list={amphures}
                                    child="tambon"
                                    childsId={["tambon_id"]}
                                    setChilds={[setTambons]}
                                    placeholder="District"
                                    disabled={!isDropdownValid(selected.province_id)}
                                />
                            </div>
                            <div>
                                <DropdownList
                                    label=""
                                    id="tambon_id"
                                    list={tambons}
                                    placeholder="Subdistrict"
                                    disabled={!isDropdownValid(selected.amphure_id)}
                                />
                            </div>
                            <div>
                                <DropdownList
                                    label=""
                                    id="zip_code"
                                    list={postalCodes ? postalCodes.map((code) => ({ id: code, name_en: code.toString() })) : []}
                                    placeholder="Postal code"
                                    disabled={!isDropdownValid(selected.tambon_id)}
                                />
                            </div>
                            <label htmlFor="address" className='col-span-2 relative'>
                                <p className='hidden'>Address</p>
                                <textarea
                                    className='resize-none'
                                    placeholder='Address Detail such as House number, Apartment name, Condo, Village name '
                                    rows={4}
                                    maxLength={500}
                                    onChange={handleTextareaChange}
                                    value={addressDetail}
                                ></textarea>
                                <span className='absolute bottom-3 right-2 text-xs text-gray-500'>{charCount}/500</span>
                            </label>
                        </form>
                    </div>

                    <button className='h-[50px]' disabled={!isFormValid}>Save</button>
                </div>
            </div>
            <Footer />
        </div>
    );
}