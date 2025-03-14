'use client';
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { IoIosAddCircle } from "react-icons/io";
import { updateUserProfile, updateUserAddresses } from '../../api/userAPI';
import { getUserData, setUserData } from '../../utils/localStorageUtils';

interface Province { // interface ที่เก็บข้อมูลของจังหวัด
    id: number;
    name_th: string;
    name_en: string;
    amphure: Amphure[];
}

interface Amphure { // interface ที่เก็บข้อมูลของอำเภอ
    id: number;
    name_th: string;
    name_en: string;
    tambon: Tambon[];
}

interface Tambon { // interface ที่เก็บข้อมูลของตำบล
    id: number;
    name_th: string;
    name_en: string;
    zip_code: number;
}

interface Selected { // interface ที่เก็บข้อมูลที่เลือก
    province_id?: number;
    amphure_id?: number;
    tambon_id?: number;
    zip_code?: number;
}

interface AddressFormProps {
    addressData?: any;
    provinces: Province[];
    selected: Selected;
    setSelected: React.Dispatch<React.SetStateAction<Selected>>;
    addressDetail: string;
    setAddressDetail: React.Dispatch<React.SetStateAction<string>>;
    charCount: number;
    setCharCount: React.Dispatch<React.SetStateAction<number>>;
}

const AddressForm: React.FC<AddressFormProps> = ({ // สร้าง component ที่เก็บข้อมูลที่เลือกของที่อยู่ 
    addressData,
    provinces,
    selected,
    setSelected,
    addressDetail,
    setAddressDetail,
    charCount,
    setCharCount
}) => {
    const [amphures, setAmphures] = useState<Amphure[]>([]); // สร้าง state ที่เก็บข้อมูลของอำเภอ
    const [tambons, setTambons] = useState<Tambon[]>([]); // สร้าง state ที่เก็บข้อมูลของตำบล
    const [postalCodes, setPostalCodes] = useState<number[]>([]); // สร้าง state ที่เก็บข้อมูลของรหัสไปรษณีย์

    useEffect(() => { // ใช้ useEffect เพื่อเช็คว่ามีข้อมูลที่อยู่หรือไม่ ถ้ามีให้เก็บข้อมูลที่อยู่ลง state ที่สร้างไว้
        if (addressData && provinces.length > 0) { // ถ้ามีข้อมูลที่อยู่ และมีข้อมูลของจังหวัด
            const province = provinces.find(province => province.name_en === addressData.province_id); // ให้ province เก็บข้อมูลของจังหวัดที่เลือก
            const amphure = province?.amphure.find(amphure => amphure.name_en === addressData.amphure_id); // ให้ amphure เก็บข้อมูลของอำเภอที่เลือก
            const tambon = amphure?.tambon.find(tambon => tambon.name_en === addressData.tambon_id); // ให้ tambon เก็บข้อมูลของตำบลที่เลือก

            setSelected({ // ให้ setSelected เก็บข้อมูลที่เลือก
                province_id: province?.id,
                amphure_id: amphure?.id,
                tambon_id: tambon?.id,
                zip_code: tambon?.zip_code
            });

            setAmphures(province?.amphure || []);
            setTambons(amphure?.tambon || []);
            setPostalCodes(tambon ? [tambon.zip_code] : []);
            setAddressDetail(addressData.addressDetail || "");
            setCharCount(addressData.addressDetail ? addressData.addressDetail.length : 0);
        }
    }, [addressData, provinces]);

    const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        if (value.length <= 200) {
            setCharCount(value.length);
            setAddressDetail(value);
        }
    };

    const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceId = parseInt(event.target.value);
        const province = provinces.find(p => p.id === provinceId);
        setSelected(prev => ({ ...prev, province_id: provinceId, amphure_id: undefined, tambon_id: undefined, zip_code: undefined }));
        setAmphures(province ? province.amphure : []);
        setTambons([]);
        setPostalCodes([]);
    };

    const handleAmphureChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const amphureId = parseInt(event.target.value);
        const amphure = amphures.find(a => a.id === amphureId);
        setSelected(prev => ({ ...prev, amphure_id: amphureId, tambon_id: undefined, zip_code: undefined }));
        setTambons(amphure ? amphure.tambon : []);
        setPostalCodes([]);
    };

    const handleTambonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const tambonId = parseInt(event.target.value);
        const tambon = tambons.find(t => t.id === tambonId);
        setSelected(prev => ({ ...prev, tambon_id: tambonId, zip_code: tambon ? tambon.zip_code : undefined }));
        setPostalCodes(tambon ? [tambon.zip_code] : []);
    };

    return (
        <div>
            <form action="#address" method="post" className='grid grid-cols-2 gap-y-10 gap-x-8'>
                <div>
                    <label htmlFor="province_id">Province</label>
                    <select
                        id="province_id"
                        value={selected.province_id || ''}
                        onChange={handleProvinceChange}
                        className={selected.province_id ? 'select-selected' : 'select-default'}>
                        <option value="" label="Province" />
                        {provinces.map(province => (
                            <option key={province.id} value={province.id} label={province.name_en} />
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="amphure_id">District</label>
                    <select
                        id="amphure_id"
                        value={selected.amphure_id || ''}
                        onChange={handleAmphureChange}
                        className={selected.amphure_id ? 'select-selected' : 'select-default'}>
                        <option value="" label="District" />
                        {amphures.map(amphure => (
                            <option key={amphure.id} value={amphure.id} label={amphure.name_en} />
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="tambon_id">Subdistrict</label>
                    <select
                        id="tambon_id"
                        value={selected.tambon_id || ''}
                        onChange={handleTambonChange}
                        className={selected.tambon_id ? 'select-selected' : 'select-default'}>
                        <option value="" label="Subdistrict" />
                        {tambons.map(tambon => (
                            <option key={tambon.id} value={tambon.id} label={tambon.name_en} />
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="zip_code">Postal Code</label>
                    <select
                        id="zip_code"
                        value={selected.zip_code || ''}
                        className={selected.zip_code ? 'select-selected' : 'select-default'}
                    >
                        <option value="" label="Postal Code" />
                        {postalCodes.map(code => (
                            <option key={code} value={code} label={code.toString()} />
                        ))}
                    </select>
                </div>

                <label htmlFor="address" className='col-span-2 relative'>
                    <p className='hidden'>Address</p>
                    <textarea
                        className='resize-none border-transparent'
                        placeholder='Address Detail such as House number, Apartment name, Condo, Village name '
                        rows={4}
                        maxLength={200}
                        onChange={handleTextareaChange}
                        value={addressDetail}
                    ></textarea>
                    <span className='absolute bottom-3 right-2 text-xs text-gray-500'>{charCount}/200</span>
                </label>
            </form>
        </div>
    );
};

export default function EditProfile() {

    // navbar
    const aboutRef = useRef<HTMLDivElement>(null!);
    const partnerRef = useRef<HTMLDivElement>(null!);
    const contactRef = useRef<HTMLDivElement>(null!);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // information form
    const [username, setUsername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

    const [originalFirstName, setOriginalFirstName] = useState<string | null>(null); // สร้าง state ที่เก็บข้อมูลชื่อ
    const [originalLastName, setOriginalLastName] = useState<string | null>(null); // สร้าง state ที่เก็บข้อมูลนามสกุล
    const [originalPhone, setOriginalPhone] = useState<string | null>(null); // สร้าง state ที่เก็บข้อมูลเบอร์โทรศัพท์

    const [isEditing, setIsEditing] = useState(false); // สร้าง state ที่เก็บข้อมูลการแก้ไข
    const [userId, setUserId] = useState<string | null>(null); // สร้าง state ที่เก็บข้อมูลของ user ID

    const [addressFormsData, setAddressFormsData] = useState<any[]>([]); // สร้าง state ที่เก็บข้อมูลที่อยู่
    const [addressFormsCount, setAddressFormsCount] = useState(1); // สร้าง state ที่เก็บข้อมูลจำนวนที่อยู่

    // address form
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [selected, setSelected] = useState<Selected>({
        province_id: undefined,
        amphure_id: undefined,
        tambon_id: undefined,
        zip_code: undefined
    });

    const [charCount, setCharCount] = useState(0);
    const [addressDetail, setAddressDetail] = useState("");

    const fetchUserData = () => {
        const parsedUser = getUserData();
        if (parsedUser) {
            setUserId(parsedUser._id);
            setUsername(parsedUser.username);
            setEmail(parsedUser.email);
            setFirstName(parsedUser.firstName);
            setLastName(parsedUser.lastName);
            setPhoneNumber(parsedUser.phoneNumber);

            setOriginalFirstName(parsedUser.firstName);
            setOriginalLastName(parsedUser.lastName);
            setOriginalPhone(parsedUser.phoneNumber);

            setAddressFormsData(parsedUser.address || []);

            if (parsedUser.address && parsedUser.address.length > 0) {
                setAddressFormsCount(parsedUser.address.length);
                parsedUser.address.forEach((address: any, index: number) => {
                    setAddressForm(index, address);
                });

                const firstAddress = parsedUser.address[0];
                console.log('First Address:', firstAddress);
                setSelected({
                    province_id: firstAddress.province_id,
                    amphure_id: firstAddress.amphure_id,
                    tambon_id: firstAddress.tambon_id,
                    zip_code: firstAddress.postalCode
                });
                setAddressDetail(firstAddress.detail || "");
                setCharCount(firstAddress.detail ? firstAddress.detail.length : 0);
            }
        }
    };

    const setAddressForm = (index: number, address: any) => {
        const mappedAddress = {
            province_id: address.province,
            amphure_id: address.district,
            tambon_id: address.subdistrict,
            zip_code: address.postalCode,
            addressDetail: address.detail
        };

        console.log('Mapped Address:', mappedAddress);

        setAddressFormsData(prevData => {
            const newData = [...prevData];
            newData[index] = mappedAddress;
            return newData;
        });
    };

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json")
            .then((response) => response.json())
            .then((result) => {
                setProvinces(result);
            });
    }, []);

    useEffect(() => {
        fetchUserData();
    }, []);


    const handleSave = async () => {
        const userData = {
            firstName,
            lastName,
            phoneNumber
        };

        if (userId) {
            try {
                const result = await updateUserProfile(userId, userData);
                const user = getUserData();
                if (user) {
                    const updatedUser = { ...user, ...userData };
                    setUserData(updatedUser);
                }
                setIsEditing(false);
                alert('Profile updated successfully');
                window.location.reload();
            } catch (error: any) {
                console.error('Error:', error);
                alert(error.message || 'Failed to update profile');
            }
        } else {
            alert('User ID is missing');
        }
    };

    const handleSaveAddresses = async () => {
        if (!userId) {
            alert('User ID is missing');
            return;
        }

        const addressData = addressFormsData.map((address) => ({
            detail: address.addressDetail,
            province: address.province_id,
            district: address.amphure_id,
            subdistrict: address.tambon_id,
            postalCode: address.zip_code,
        }));

        try {
            const response = await updateUserAddresses(userId, addressData);
            alert('Addresses saved successfully');
        } catch (error) {
            console.error('Error saving addresses:', error);
            alert('Failed to save addresses');
        }
    };

    const handleAddAddressForm = () => {
        setAddressFormsCount(prevCount => (prevCount < 3 ? prevCount + 1 : prevCount));
    };

    return (
        <div>
            <Navbar scrollToSection={scrollToSection} aboutRef={aboutRef} partnerRef={partnerRef} contactRef={contactRef} />
            <div className='w-full place-content-center place-items-center h-[235px] mt-[5rem] bg-black'>
                <h1 className='text-4xl font-semibold mb-3'>My Profile</h1>
            </div>
            <div className='w-full place-items-center'>
                <div className='w-full max-w-[980px] px-4 py-20 flex flex-col gap-12'>
                    <div className='flex justify-between border-b border-white pb-2'>
                        <p className='text-xl font-semibold'>Information</p>
                        <div className='place-aitems-end place-content-center'>
                            {!isEditing ? (
                                <button className='bg-background border border-white font-normal text-xs py-1 px-3' onClick={() => setIsEditing(true)}>Edit</button>
                            ) : (
                                <div className='flex gap-2'>
                                    <button className='bg-[#51536D] border border-[#51536D] text-gray-300 font-normal text-xs py-1 px-3' onClick={() => setIsEditing(false)}>Cancel</button>
                                    <button className='bg-background border border-white font-normal text-xs py-1 px-3' onClick={handleSave}>Save</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <form action="#information" method="post" className='grid grid-cols-2 gap-y-10 gap-x-8'>
                            <label htmlFor="username">
                                <p>Username</p>
                                <input
                                    type="text"
                                    id="username"
                                    value={username || ''}
                                    readOnly disabled
                                    className='bg-[#51536D] border-transparent' />
                            </label>
                            <label htmlFor="email">
                                <p>Email address</p>
                                <input
                                    type="email"
                                    id="email"
                                    value={email || ''}
                                    readOnly disabled
                                    className='bg-[#51536D] border-transparent' />
                            </label>
                            <label htmlFor="fname">
                                <p>First Name</p>
                                <input
                                    type="text"
                                    id="fname"
                                    pattern='[A-Za-z]'
                                    value={firstName || ''}
                                    readOnly={!isEditing}
                                    disabled={!isEditing}
                                    className={!isEditing ? 'bg-[#51536D] border-transparent' : ''}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </label>
                            <label htmlFor="lname">
                                <p>Last Name</p>
                                <input
                                    type="text"
                                    id="lname"
                                    pattern='[A-Za-z]'
                                    value={lastName || ''}
                                    readOnly={!isEditing}
                                    disabled={!isEditing}
                                    className={!isEditing ? 'bg-[#51536D] border-transparent' : ''}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </label>
                            <label htmlFor="phone">
                                <p>Phone Number</p>
                                <input
                                    type="tel"
                                    id="phone"
                                    minLength={10}
                                    maxLength={10}
                                    pattern="[0-9]"
                                    value={phoneNumber || ''}
                                    readOnly={!isEditing}
                                    disabled={!isEditing}
                                    className={!isEditing ? 'bg-[#51536D] border-transparent' : ''}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </label>
                        </form>
                    </div>

                    {Array.from({ length: addressFormsCount }).map((_, index) => (
                        <div key={index}>
                            <div className='flex justify-between'>
                                <div className='flex'>
                                    <h1 className='text-xl font-semibold'>
                                        Address {index === 0 ? '' : index + 1}
                                    </h1>
                                    {index === 0 && addressFormsCount < 3 && (
                                        <button aria-hidden='true' onClick={handleAddAddressForm} className='col-span-2 flex justify-center items-center gap-1 bg-transparent hover:bg-transparent'>
                                            <IoIosAddCircle className='w-[20px] h-[20px] hover:text-[#0AACF0]' />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <hr className='border border-white mb-10 mt-2 ' />
                            <AddressForm
                                addressData={addressFormsData[index]}
                                provinces={provinces}
                                selected={selected}
                                setSelected={setSelected}
                                addressDetail={addressDetail}
                                setAddressDetail={setAddressDetail}
                                charCount={charCount}
                                setCharCount={setCharCount}
                            />
                        </div>
                    ))}

                    <button className='h-[40px]' onClick={handleSaveAddresses}>
                        Save
                    </button>

                </div>
            </div>
            <Footer />
        </div>
    );
}