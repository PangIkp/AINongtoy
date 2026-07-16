/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import Link from "next/link";
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { IoIosAddCircle } from "react-icons/io";
import { BadgeCheck, Home, Loader, MapPinned, Sparkles, UserRound } from "lucide-react"; // Import Loader
import { updateUserProfile, updateUserAddresses, getUserById } from '../../api/userAPI';
import { getUserData, setUserData } from '../../utils/localStorageUtils';
import Swal from "sweetalert2";
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import '../../i18n'; // Import i18n for translations

interface Province {
    id: number;
    name_en: string;
    name_th: string; // เพิ่ม name_th
    amphure: Amphure[];
}

interface Amphure {
    id: number;
    name_en: string;
    name_th: string; // เพิ่ม name_th
    tambon: Tambon[];
}

interface Tambon {
    id: number;
    name_en: string;
    name_th: string; // เพิ่ม name_th
    zip_code: number;
}

interface Result {
    provinceId: number | string | null;
    amphureId: number | string | null;
    tambonId: number | string | null;
    zipCode: number | string | null;
    detail?: string; // Add this line
}

interface Address {
    detail: string;
    province: string;
    district: string;
    subdistrict: string;
    postalCode: string;
}


export default function Page() {
    const { t, i18n } = useTranslation(); // เพิ่ม i18n เพื่อเช็คภาษา

    const getLabel = (name_en: string, name_th: string) => {
        return i18n.language === 'th' ? name_th : name_en; // แสดง name_th ถ้าภาษาเป็นไทย
    };

    // navbar
    const aboutRef = useRef<HTMLDivElement>(null!);
    const partnerRef = useRef<HTMLDivElement>(null!);
    const contactRef = useRef<HTMLDivElement>(null!);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // information
    const [isEditing, setIsEditing] = useState(false); // สร้าง state ที่เก็บค่าของการแก้ไข
    const UserData = getUserData(); // ดึงข้อมูลของผู้ใช้จาก localStorage
    const userID = UserData?._id; // ดึงค่า _id ของผู้ใช้
    const [initialUserData, setInitialUserData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });

    // สร้าง state ที่เก็บค่าของข้อมูลผู้ใช้
    const [username, setUsername] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [firstName, setFirstName] = useState<string | undefined>(undefined);
    const [lastName, setLastName] = useState<string | undefined>(undefined);
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
    const nameRegex = /^[a-zA-Z]{4,40}$/;
    const phoneRegex = /^0[1-9]\d{8}$/;

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });

    const validateInput = (field: string, value: string) => {
        if (field === 'firstName' || field === 'lastName') {
            if (!nameRegex.test(value)) {
                return t('editProfile.validation.name'); // ใช้การแปล
            }
        } else if (field === 'phoneNumber') {
            if (!phoneRegex.test(value)) {
                return t('editProfile.validation.phone'); // ใช้การแปล
            }
        }
        return '';
    };

    // สร้าง function ที่ใช้ในการเซฟข้อมูลผู้ใช้
    const handleSaveUserdata = async () => {
        // Validate inputs
        const firstNameError = validateInput('firstName', firstName || '');
        const lastNameError = validateInput('lastName', lastName || '');
        const phoneNumberError = validateInput('phoneNumber', phoneNumber || '');

        if (firstNameError || lastNameError || phoneNumberError) {
            setErrors({
                firstName: firstNameError,
                lastName: lastNameError,
                phoneNumber: phoneNumberError,
            });
            Swal.fire({
                icon: 'warning',
                title: t('editProfile.validation.title'), // ใช้การแปล
                text: t('editProfile.validation.correctFields'), // ใช้การแปล
                timer: 1500,
                showConfirmButton: false,
            });
            return;
        }

        const userData = {
            firstName,
            lastName,
            phoneNumber,
        };

        if (userID) {
            try {
                const result = await updateUserProfile(userID, userData);
                const user = getUserData();
                if (user) {
                    const updatedUser = { ...user, ...userData };
                    setUserData(updatedUser);
                }
                setIsEditing(false);
                Swal.fire({
                    icon: 'success',
                    title: t('editProfile.success.title'), // ใช้การแปล
                    text: t('editProfile.success.profileUpdated'), // ใช้การแปล
                    timer: 1500,
                    showConfirmButton: false,
                    willClose: () => {
                        window.location.reload();
                    },
                });
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: t('editProfile.error.title'), // ใช้การแปล
                    text: error.message || t('editProfile.error.profileUpdateFailed'), // ใช้การแปล
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: t('editProfile.error.title'), // ใช้การแปล
                text: t('editProfile.error.userIdMissing'), // ใช้การแปล
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    const handleCancelEdit = () => {
        setFirstName(initialUserData.firstName);
        setLastName(initialUserData.lastName);
        setPhoneNumber(initialUserData.phoneNumber);
        setErrors({
            firstName: '',
            lastName: '',
            phoneNumber: '',
        });
        setIsEditing(false);
    };

    // ==================================================================================================
    // address
    const [data, setData] = useState<Province[] | null>(null);
    const [isEditingAddress, setIsEditingAddress] = useState(false); // สร้าง state ที่เก็บค่าของการแก้ไขที่อยู่
    const [addressFormsCount, setAddressFormsCount] = useState(0); // สร้าง state ที่เก็บค่าของจำนวนฟอร์มที่อยู่
    const [charCount, setCharCount] = useState<number[]>(Array(addressFormsCount).fill(0)); // สร้าง state ที่เก็บค่าของจำนวนตัวอักษรที่พิมพ์ได้ในฟอร์มที่อยู่

    const [results, setResults] = useState<Result[]>([]); // สร้าง state ที่เก็บค่าของผลลัพธ์ที่ได้จากการค้นหา ที่เป็น object ที่มี key ดังนี้ provinceId, amphureId, tambonId, zipCode
    const [addresses, setAddresses] = useState<Address[]>([]); // เก็บ array ของที่อยู่ ที่เป็น object ที่มี key ดังนี้ detail, province, district, subdistrict, postalCode

    // สร้าง function ที่ใช้ในการเพิ่มฟอร์มที่อยู่

    const handleProvinceChange = (selectedOption: { value: string } | null, index: number) => {
        const newResults = [...results];
        newResults[index].provinceId = selectedOption?.value || null;
        newResults[index].amphureId = null;
        newResults[index].tambonId = null;
        newResults[index].zipCode = null;
        setResults(newResults);
    };

    const handleAmphureChange = (selectedOption: { value: string } | null, index: number) => {
        const newResults = [...results];
        newResults[index].amphureId = selectedOption?.value || null;
        newResults[index].tambonId = null;
        newResults[index].zipCode = null;
        setResults(newResults);
    };

    const handleTambonChange = (selectedOption: { value: string } | null, index: number) => {
        const newResults = [...results];
        newResults[index].tambonId = selectedOption?.value || null;

        const province = data?.find((province) => province.id === Number(newResults[index].provinceId));
        const amphure = province?.amphure.find((amphure) => amphure.id === Number(newResults[index].amphureId));
        const tambon = amphure?.tambon.find((tambon) => tambon.id === Number(selectedOption?.value));
        newResults[index].zipCode = tambon?.zip_code || null;

        setResults(newResults);
    };

    const handleZipCodeChange = (selectedOption: { value: string } | null, index: number) => {
        const newResults = [...results];
        newResults[index].zipCode = selectedOption?.value || null;
        setResults(newResults);
    };

    const handleAddressDetailChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        const newResults = [...results];
        newResults[index].detail = e.target.value;
        setResults(newResults);

        const newCharCount = [...charCount];
        newCharCount[index] = e.target.value.length;
        setCharCount(newCharCount);
    };

    const handleDeleteAddress = async (index: number) => {
        const addressToDelete = addresses[index];
        const isEmptyAddress = !addressToDelete.detail && !addressToDelete.province && !addressToDelete.district && !addressToDelete.subdistrict && !addressToDelete.postalCode;

        const result = await Swal.fire({
            title: t('editProfile.address.confirmDeleteTitle'), // ใช้การแปล
            text: t('editProfile.address.confirmDeleteText'), // ใช้การแปล
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t('editProfile.address.confirmDeleteConfirm'), // ใช้การแปล
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            const updatedAddresses = addresses.filter((_, i) => i !== index);
            setAddresses(updatedAddresses);
            setIsEditingAddress(false);

            if (isEmptyAddress) {
                return;
            }

            if (userID) {
                try {
                    const result = await updateUserAddresses(userID, updatedAddresses);
                    const user = getUserData();
                    if (user) {
                        const updatedUser = { ...user, address: updatedAddresses };
                        setUserData(updatedUser);
                    }
                    Swal.fire({
                        icon: 'success',
                        title: t('editProfile.address.deleteSuccessTitle'), // ใช้การแปล
                        text: t('editProfile.address.deleteSuccessText'), // ใช้การแปล
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } catch (error: any) {
                    Swal.fire({
                        icon: 'error',
                        title: t('editProfile.address.deleteErrorTitle'), // ใช้การแปล
                        text: error.message || t('editProfile.address.deleteErrorText'), // ใช้การแปล
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: t('editProfile.error.title'), // ใช้การแปล
                    text: t('editProfile.error.userIdMissing'), // ใช้การแปล
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        }
    };

    const handleSaveAddresses = async () => {
        // Update addresses state with current form values
        const updatedAddresses = addresses.map((address, index) => ({
            ...address,
            detail: results[index]?.detail || '',
            province: data?.find((province) => province.id === Number(results[index]?.provinceId))?.name_en || '',
            district: data?.find((province) => province.id === Number(results[index]?.provinceId))?.amphure.find((amphure) => amphure.id === Number(results[index]?.amphureId))?.name_en || '',
            subdistrict: data?.find((province) => province.id === Number(results[index]?.provinceId))?.amphure.find((amphure) => amphure.id === Number(results[index]?.amphureId))?.tambon.find((tambon) => tambon.id === Number(results[index]?.tambonId))?.name_en || '',
            postalCode: results[index]?.zipCode?.toString() || ''
        }));

        // Filter out empty addresses
        const nonEmptyAddresses = updatedAddresses.filter(address =>
            address.detail || address.province || address.district || address.subdistrict || address.postalCode
        );

        // Check for incomplete addresses
        const incompleteAddress = nonEmptyAddresses.some(address =>
            !address.detail || !address.province || !address.district || !address.subdistrict || !address.postalCode
        );

        if (incompleteAddress) {
            Swal.fire({
                icon: 'warning',
                title: t('editProfile.address.warningTitle'), // ใช้การแปล
                text: t('editProfile.address.warningText'), // ใช้การแปล
                timer: 1500,
                showConfirmButton: false,
            });
            return;
        }

        setAddresses(nonEmptyAddresses);

        if (userID) {
            try {
                const result = await updateUserAddresses(userID, nonEmptyAddresses);
                const user = getUserData();
                if (user) {
                    const updatedUser = { ...user, address: nonEmptyAddresses };
                    setUserData(updatedUser);
                }
                setIsEditingAddress(false);
                Swal.fire({
                    icon: 'success',
                    title: t('editProfile.address.updateSuccessTitle'), // ใช้การแปล
                    text: t('editProfile.address.updateSuccessText'), // ใช้การแปล
                    timer: 1500,
                    showConfirmButton: false,
                    willClose: () => {
                        window.location.reload();
                    }
                });
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: t('editProfile.address.updateErrorTitle'), // ใช้การแปล
                    text: error.message || t('editProfile.address.updateErrorText'), // ใช้การแปล
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: t('editProfile.error.title'), // ใช้การแปล
                text: t('editProfile.error.userIdMissing'), // ใช้การแปล
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    const handleAddAddressForm = () => {
        const newAddress: Address = {
            detail: '',
            province: '',
            district: '',
            subdistrict: '',
            postalCode: '',
        };

        const newResult: Result = {
            provinceId: null,
            amphureId: null,
            tambonId: null,
            zipCode: null,
            detail: '', // Ensure this matches the updated structure
        };

        setAddressFormsCount((prevCount) => (prevCount < 3 ? prevCount + 1 : prevCount));
        setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
        setResults((prevResults) => [...prevResults, newResult]);
        setCharCount((prevCharCount) => [...prevCharCount, 0]);
    };

    const handleCancelEditAddress = () => {
        const newResults: Result[] = [];
        const newCharCount: number[] = [];

        addresses.forEach(address => {
            const province = data?.find((province: Province) => province.name_en === address.province);
            if (province) {
                const amphure = province.amphure.find((amphure: Amphure) => amphure.name_en === address.district);
                if (amphure) {
                    const tambon = amphure.tambon.find((tambon: Tambon) => tambon.name_en === address.subdistrict);
                    if (tambon) {
                        const zipCode = tambon.zip_code === parseInt(address.postalCode) ? tambon.zip_code : null;
                        newResults.push({
                            provinceId: province.id,
                            amphureId: amphure.id,
                            tambonId: tambon.id,
                            zipCode: zipCode,
                            detail: address.detail // Add this line
                        });
                        newCharCount.push(address.detail.length);
                    } else {
                        newResults.push({
                            provinceId: province.id,
                            amphureId: amphure.id,
                            tambonId: null,
                            zipCode: null,
                            detail: address.detail // Add this line
                        });
                        newCharCount.push(address.detail.length);
                    }
                } else {
                    newResults.push({
                        provinceId: province.id,
                        amphureId: null,
                        tambonId: null,
                        zipCode: null,
                        detail: address.detail // Add this line
                    });
                    newCharCount.push(address.detail.length);
                }
            } else {
                newResults.push({
                    provinceId: null,
                    amphureId: null,
                    tambonId: null,
                    zipCode: null,
                    detail: address.detail // Add this line
                });
                newCharCount.push(address.detail.length);
            }
        });

        setResults(newResults);
        setCharCount(newCharCount);
        setAddressFormsCount(addresses.length);
        setIsEditingAddress(false);
    };

    // สร้าง function ที่ใช้ในการดึงข้อมูลผู้ใช้ และ ที่อยู่ของผู้ใช้
    const fetchUserData = async () => {
        if (userID) {
            try {
                const response = await getUserById(userID);
                if (response.success && response.data) {
                    setUsername(response.data.username);
                    setEmail(response.data.email);
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                    setPhoneNumber(response.data.phoneNumber);
                    setAddresses(response.data.address);

                    // ตั้งค่าข้อมูลเริ่มต้นของผู้ใช้
                    setInitialUserData({
                        firstName: response.data.firstName,
                        lastName: response.data.lastName,
                        phoneNumber: response.data.phoneNumber
                    });

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: t('editProfile.error.title'), // ใช้การแปล
                        text: response.message || t('editProfile.error.fetchUserDataFailed'), // ใช้การแปล
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: t('editProfile.error.title'), // ใช้การแปล
                    text: error.message || t('editProfile.error.fetchUserDataFailed'), // ใช้การแปล
                    timer: 1500,
                    showConfirmButton: false,
                });
            } finally {
                setIsLoading(false); // Set loading to false after data is fetched
            }
        }
    };

    const [isLoading, setIsLoading] = useState(true); // State to track loading status

    // ใช้ useEffect ในการดึงข้อมูลผู้ใช้ และที่อยู่ของผู้ใช้เมื่อเปิดหน้าเว็บ เมื่อเปิดหน้าเว็บ
    useEffect(() => {
        setIsLoading(true); // Set loading to true when component mounts

        const provinceDataSources = [
            'https://raw.githubusercontent.com/kongvut/thai-province-data/master/api/v1/province_with_amphure_tambon.json',
            'https://cdn.jsdelivr.net/gh/kongvut/thai-province-data@master/api/v1/province_with_amphure_tambon.json',
        ];

        const fetchProvinceData = async () => {
            for (const source of provinceDataSources) {
                try {
                    const response = await fetch(source);
                    if (!response.ok) {
                        continue;
                    }
                    const provinceData = await response.json();
                    setData(provinceData);
                    return;
                } catch {
                    // Try next mirror
                }
            }

            console.error('Error: failed to fetch province data from all sources.');
        };

        fetchProvinceData();

        fetchUserData();
    }, []);

    // สร้าง function หาค่า id ของจังหวัด อำเภอ ตำบล และรหัสไปรษณีย์ จากข้อมูลที่ได้จากการค้นหา
    useEffect(() => {
        if (!data) {
            return;
        }

        const newResults: Result[] = [];
        const newCharCount: number[] = [];

        addresses.forEach(address => {
            const province = data.find((province: Province) => province.name_en === address.province);
            if (province) {
                const amphure = province.amphure.find((amphure: Amphure) => amphure.name_en === address.district);
                if (amphure) {
                    const tambon = amphure.tambon.find((tambon: Tambon) => tambon.name_en === address.subdistrict);
                    if (tambon) {
                        const zipCode = tambon.zip_code === parseInt(address.postalCode) ? tambon.zip_code : null;
                        newResults.push({
                            provinceId: province.id,
                            amphureId: amphure.id,
                            tambonId: tambon.id,
                            zipCode: zipCode,
                            detail: address.detail // Add this line
                        });
                        newCharCount.push(address.detail.length);
                    } else {
                        newResults.push({
                            provinceId: province.id,
                            amphureId: amphure.id,
                            tambonId: null,
                            zipCode: null,
                            detail: address.detail // Add this line
                        });
                        newCharCount.push(address.detail.length);
                    }
                } else {
                    newResults.push({
                        provinceId: province.id,
                        amphureId: null,
                        tambonId: null,
                        zipCode: null,
                        detail: address.detail // Add this line
                    });
                    newCharCount.push(address.detail.length);
                }
            } else {
                newResults.push({
                    provinceId: null,
                    amphureId: null,
                    tambonId: null,
                    zipCode: null,
                    detail: address.detail // Add this line
                });
                newCharCount.push(address.detail.length);
            }
        });

        setResults(newResults);
        setCharCount(newCharCount);
        setAddressFormsCount(addresses.length);
    }, [addresses.length, data]); // useEffect will run when addresses.length or data changes

    const profileStats = [
        {
            label: t('editProfile.information.firstName'),
            value: firstName || '-',
            icon: UserRound,
        },
        {
            label: t('editProfile.address.title'),
            value: addresses.length,
            icon: MapPinned,
        },
    ];

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(28,44,92,0.82),rgba(7,13,31,1)_42%,rgba(5,8,22,1)_100%)] text-white">
            <Navbar scrollToSection={scrollToSection} aboutRef={aboutRef} partnerRef={partnerRef} contactRef={contactRef} />

            {isLoading ? ( // Show loader while loading
                <div className="flex justify-center items-center h-screen">
                    <Loader className="animate-spin text-[#0CACF3]" size={50} />
                </div>
            ) : (
                <>
                    <section className="border-b border-white/10 pt-24">
                        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5 px-4 py-10 sm:px-6 lg:px-8">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#67dfff]/20 bg-[#0b1b3e]/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-[#88ebff]">
                                <Sparkles size={14} />
                                Account Settings
                            </div>
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                                <div>
                                    <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                                        {t('editProfile.information.title')}
                                    </h1>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#aebddb] sm:text-base">
                                        Update your profile details, keep contact information current, and manage saved shipping addresses from one place.
                                    </p>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2 lg:ml-auto">
                                    {profileStats.map(({ label, value, icon: Icon }) => (
                                        <div
                                            key={label}
                                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-xl border border-white/10 bg-[#0D1733] p-2.5">
                                                    <Icon size={18} className="text-[#76e3ff]" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-semibold text-white">{value}</p>
                                                    <p className="text-xs text-white/60">{label}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className='mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8'>
                        <div className='flex flex-col gap-8'>
                            <section className="flex flex-wrap gap-3">
                                <Link
                                    className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/72 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                                    href="/profile"
                                >
                                    Back To Profile
                                </Link>
                            </section>

                            <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.95),rgba(11,18,40,0.95))] shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
                                <div className='flex flex-col gap-4 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8'>
                                    <div>
                                        <p className='text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]'>
                                            Profile Information
                                        </p>
                                        <h2 className='mt-2 text-2xl font-semibold text-white sm:text-3xl'>{t('editProfile.information.title')}</h2>
                                    </div>
                                    <div className='place-aitems-end place-content-center'>
                                    {!isEditing ? (
                                        <button className='h-11 rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-medium text-white hover:bg-white/10' onClick={() => setIsEditing(true)}>
                                            {t('editProfile.information.edit')}
                                        </button>
                                    ) : (
                                        <div className='flex gap-2'>
                                            <button className='h-11 rounded-xl border border-white/10 bg-[#51536D] px-5 text-sm font-medium text-gray-200' onClick={handleCancelEdit}>
                                                {t('editProfile.information.cancel')}
                                            </button>
                                            <button className='h-11 rounded-xl border border-[#0AACF0]/35 bg-[#0b1d3d] px-5 text-sm font-medium text-[#89ebff] hover:bg-[#11305a]' onClick={handleSaveUserdata}>
                                                {t('editProfile.information.save')}
                                            </button>
                                        </div>
                                    )}
                                    </div>
                                </div>

                                <div className='px-6 py-6 sm:px-8 sm:py-8'>
                                <form action="#information" method="post" className='grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 sm:gap-y-6'>
                                    <label htmlFor="username">
                                        <p className='mb-1.5 text-sm font-medium text-white/82'>{t('editProfile.information.username')}</p>
                                        <input
                                            type="text"
                                            id="username"
                                            value={username || ''}
                                            readOnly disabled
                                            className='bg-[#51536D] border-transparent text-black/95' />
                                        <p className="text-xs my-1 text-yellow-500 h-4"></p>
                                    </label>
                                    <label htmlFor="email">
                                        <p className='mb-1.5 text-sm font-medium text-white/82'>{t('editProfile.information.email')}</p>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email || ''}
                                            readOnly disabled
                                            className='bg-[#51536D] border-transparent text-black/95' />
                                        <p className="text-xs my-1 text-yellow-500 h-4"></p>
                                    </label>
                                    <label htmlFor="fname">
                                        <p className='mb-1.5 text-sm font-medium text-white/82'>{t('editProfile.information.firstName')}</p>
                                        <input
                                            type="text"
                                            id="fname"
                                            pattern="[A-Za-z]"
                                            value={firstName || ''}
                                            readOnly={!isEditing}
                                            disabled={!isEditing}
                                            className={!isEditing ? 'bg-[#51536D] border-transparent' : ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFirstName(value);
                                                setErrors((prev) => ({ ...prev, firstName: validateInput('firstName', value) }));
                                            }}
                                        />
                                        <p className="text-xs my-1 text-yellow-500 h-4">{errors.firstName}</p>
                                    </label>

                                    <label htmlFor="lname">
                                        <p className='mb-1.5 text-sm font-medium text-white/82'>{t('editProfile.information.lastName')}</p>
                                        <input
                                            type="text"
                                            id="lname"
                                            pattern="[A-Za-z]"
                                            value={lastName || ''}
                                            readOnly={!isEditing}
                                            disabled={!isEditing}
                                            className={!isEditing ? 'bg-[#51536D] border-transparent' : ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setLastName(value);
                                                setErrors((prev) => ({ ...prev, lastName: validateInput('lastName', value) }));
                                            }}
                                        />
                                        <p className="text-xs my-1 text-yellow-500 h-4">{errors.lastName}</p>
                                    </label>

                                    <label htmlFor="phone">
                                        <p className='mb-1.5 text-sm font-medium text-white/82'>{t('editProfile.information.phone')}</p>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={phoneNumber || ''}
                                            readOnly={!isEditing}
                                            disabled={!isEditing}
                                            className={!isEditing ? 'bg-[#51536D] border-transparent' : ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setPhoneNumber(value);
                                                setErrors((prev) => ({ ...prev, phoneNumber: validateInput('phoneNumber', value) }));
                                            }}
                                        />
                                        <p className="text-xs my-1 text-yellow-500 h-4">{errors.phoneNumber}</p>
                                    </label>

                                </form>
                                </div>
                            </section>

                            <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,31,64,0.95),rgba(11,18,40,0.95))] shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
                                <div className='flex flex-col gap-4 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8'>
                                    <div className='flex items-center gap-3'>
                                        <div className='rounded-xl border border-white/10 bg-[#0D1733] p-2.5'>
                                            <Home size={18} className='text-[#76e3ff]' />
                                        </div>
                                        <div>
                                            <p className='text-xs font-medium uppercase tracking-[0.28em] text-[#7ee7ff]'>Shipping Addresses</p>
                                            <h1 className='mt-2 text-2xl font-semibold text-white sm:text-3xl'>
                                        {t('editProfile.address.title')}
                                    </h1>
                                        </div>
                                    </div>
                                    <div className='place-aitems-end place-content-center'>
                                        {!isEditingAddress ? (
                                            <button
                                                className={`h-11 rounded-xl border border-white/15 bg-white/5 px-5 text-sm font-medium text-white ${addressFormsCount <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
                                                onClick={() => setIsEditingAddress(true)}
                                                disabled={addressFormsCount <= 0}
                                            >
                                                {t('editProfile.address.edit')}
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    className="h-11 rounded-xl border border-white/10 bg-[#51536D] px-5 text-sm font-medium text-gray-200"
                                                    onClick={handleCancelEditAddress}
                                                >
                                                    {t('editProfile.address.cancel')}
                                                </button>
                                                <button
                                                    className="h-11 rounded-xl border border-[#0AACF0]/35 bg-[#0b1d3d] px-5 text-sm font-medium text-[#89ebff] hover:bg-[#11305a]"
                                                    onClick={handleSaveAddresses}
                                                >
                                                    {t('editProfile.address.save')}
                                                </button>
                                            </div>
                                        )
                                        }
                                    </div>
                                </div>

                                <div className='px-6 py-6 sm:px-8 sm:py-8'>
                                {Array.from({ length: addressFormsCount }).map((_, index) => (
                                    <div key={index}>
                                        {results[index] && (
                                            <div className='rounded-[28px] border border-white/10 bg-[#0d1736] p-5 sm:p-6'>
                                                <div className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                                                    <div className='flex items-center gap-3'>
                                                        <div className='rounded-xl border border-white/10 bg-white/5 p-2.5'>
                                                            <BadgeCheck size={16} className='text-[#7ee7ff]' />
                                                        </div>
                                                        <p className='text-lg font-semibold text-white'>{index === 0 ? t('editProfile.address.form') : `${t('editProfile.address.form')} ${index + 1}`}</p>
                                                    </div>
                                                    <div className='place-aitems-end place-content-center'>
                                                        <button
                                                            className={`h-10 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-medium text-white/80 ${!isEditingAddress ? 'opacity-50 cursor-not-allowed' : 'hover:border-red-400/35 hover:bg-red-400/15 hover:text-white'}`}
                                                            onClick={() => isEditingAddress && handleDeleteAddress(index)}
                                                            disabled={!isEditingAddress}
                                                        >
                                                            {t('editProfile.address.delete')}
                                                        </button>
                                                    </div>
                                                </div>

                                                <form
                                                    action="#address"
                                                    method="post"
                                                    className='grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2'>
                                                    <div>
                                                        <label htmlFor="province_id" className='hidden'>
                                                            <p>Province</p>
                                                        </label>
                                                        <Select
                                                            id="province_id"
                                                            value={
                                                                results[index]?.provinceId
                                                                    ? {
                                                                        value: results[index]?.provinceId.toString(),
                                                                        label: getLabel(
                                                                            data?.find((province) => province.id === Number(results[index]?.provinceId))?.name_en || '',
                                                                            data?.find((province) => province.id === Number(results[index]?.provinceId))?.name_th || ''
                                                                        ),
                                                                    }
                                                                    : null
                                                            }
                                                            onChange={(selectedOption) =>
                                                                handleProvinceChange(selectedOption, index)
                                                            }
                                                            options={data?.map((province) => ({
                                                                value: province.id.toString(),
                                                                label: getLabel(province.name_en, province.name_th), // ใช้ getLabel
                                                            }))}
                                                            isDisabled={!isEditingAddress}
                                                            isClearable
                                                            classNamePrefix="react-select"
                                                            placeholder={t('editProfile.address.provincePlaceholder')}
                                                            filterOption={(option, inputValue) =>
                                                                option.label.toLowerCase().startsWith(inputValue.toLowerCase())
                                                            }
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    backgroundColor: !isEditingAddress ? '#51536D' : 'white',
                                                                    borderColor: !isEditingAddress ? 'transparent' : base.borderColor,
                                                                    input: {
                                                                        boxShadow: 'none',
                                                                    },

                                                                }),
                                                                placeholder: (base) => ({
                                                                    ...base,
                                                                    color: '#9ca3af',
                                                                }),
                                                                menu: (base) => ({
                                                                    ...base,
                                                                    color: '#000',
                                                                }),
                                                                singleValue: (base) => ({
                                                                    ...base,
                                                                    color: !isEditingAddress ? '#000' : '#333', // ปรับสีข้อความที่เลือก
                                                                }),
                                                                dropdownIndicator: (base) => ({
                                                                    ...base,
                                                                    color: !isEditingAddress ? '#000' : '#cccccc', // สีของลูกศร dropdown
                                                                }),
                                                                indicatorSeparator: (base) => ({
                                                                    ...base,
                                                                    backgroundColor: !isEditingAddress ? '#000' : '#cccccc', // สีของขีด | ใกล้ dropdown
                                                                }),
                                                            }}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="amphure_id" className='hidden'>
                                                            <p>District</p>
                                                        </label>
                                                        <Select
                                                            id="amphure_id"
                                                            value={
                                                                results[index]?.amphureId
                                                                    ? {
                                                                        value: results[index]?.amphureId.toString(),
                                                                        label: getLabel(
                                                                            data?.find((province) => province.id === Number(results[index]?.provinceId))
                                                                                ?.amphure.find((amphure) => amphure.id === Number(results[index]?.amphureId))?.name_en || '',
                                                                            data?.find((province) => province.id === Number(results[index]?.provinceId))
                                                                                ?.amphure.find((amphure) => amphure.id === Number(results[index]?.amphureId))?.name_th || ''
                                                                        ),
                                                                    }
                                                                    : null
                                                            }
                                                            onChange={(selectedOption) =>
                                                                handleAmphureChange(selectedOption, index)
                                                            }
                                                            options={data
                                                                ?.find((province) => province.id === Number(results[index]?.provinceId))
                                                                ?.amphure.map((amphure) => ({
                                                                    value: amphure.id.toString(),
                                                                    label: getLabel(amphure.name_en, amphure.name_th), // ใช้ getLabel
                                                                }))}
                                                            isDisabled={!isEditingAddress}
                                                            isClearable
                                                            classNamePrefix="react-select"
                                                            placeholder={t('editProfile.address.districtPlaceholder')}
                                                            filterOption={(option, inputValue) =>
                                                                option.label.toLowerCase().startsWith(inputValue.toLowerCase())
                                                            }
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    backgroundColor: !isEditingAddress ? '#51536D' : 'white',
                                                                    borderColor: !isEditingAddress ? 'transparent' : base.borderColor,
                                                                    input: {
                                                                        boxShadow: 'none',
                                                                    },
                                                                }),
                                                                placeholder: (base) => ({
                                                                    ...base,
                                                                    color: '#9ca3af',
                                                                }),
                                                                menu: (base) => ({
                                                                    ...base,
                                                                    color: '#000',
                                                                }),
                                                                singleValue: (base) => ({
                                                                    ...base,
                                                                    color: !isEditingAddress ? '#000' : '#333', // ปรับสีข้อความที่เลือก
                                                                }),
                                                                dropdownIndicator: (base) => ({
                                                                    ...base,
                                                                    color: !isEditingAddress ? '#000' : '#cccccc', // สีของลูกศร dropdown
                                                                }),
                                                                indicatorSeparator: (base) => ({
                                                                    ...base,
                                                                    backgroundColor: !isEditingAddress ? '#000' : '#cccccc', // สีของขีด | ใกล้ dropdown
                                                                }),
                                                            }}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="tambon_id" className='hidden'>
                                                            <p>Subdistrict</p>
                                                        </label>
                                                        <Select
                                                            id="tambon_id"
                                                            value={
                                                                results[index]?.tambonId
                                                                    ? {
                                                                        value: results[index]?.tambonId.toString(),
                                                                        label: getLabel(
                                                                            data?.find((province) => province.id === Number(results[index]?.provinceId))
                                                                                ?.amphure.find((amphure) => amphure.id === Number(results[index]?.amphureId))
                                                                                ?.tambon.find((tambon) => tambon.id === Number(results[index]?.tambonId))?.name_en || '',
                                                                            data?.find((province) => province.id === Number(results[index]?.provinceId))
                                                                                ?.amphure.find((amphure) => amphure.id === Number(results[index]?.amphureId))
                                                                                ?.tambon.find((tambon) => tambon.id === Number(results[index]?.tambonId))?.name_th || ''
                                                                        ),
                                                                    }
                                                                    : null
                                                            }
                                                            onChange={(selectedOption) =>
                                                                handleTambonChange(selectedOption, index)
                                                            }
                                                            options={data
                                                                ?.find((province) => province.id === Number(results[index]?.provinceId))
                                                                ?.amphure.find((amphure) => amphure.id === Number(results[index]?.amphureId))
                                                                ?.tambon.map((tambon) => ({
                                                                    value: tambon.id.toString(),
                                                                    label: getLabel(tambon.name_en, tambon.name_th), // ใช้ getLabel
                                                                }))}
                                                            isDisabled={!isEditingAddress}
                                                            isClearable
                                                            classNamePrefix="react-select"
                                                            placeholder={t('editProfile.address.subdistrictPlaceholder')}
                                                            filterOption={(option, inputValue) =>
                                                                option.label.toLowerCase().startsWith(inputValue.toLowerCase())
                                                            }
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    backgroundColor: !isEditingAddress ? '#51536D' : 'white',
                                                                    borderColor: !isEditingAddress ? 'transparent' : base.borderColor,
                                                                    input: {
                                                                        boxShadow: 'none',
                                                                    },
                                                                }),
                                                                placeholder: (base) => ({
                                                                    ...base,
                                                                    color: '#9ca3af',
                                                                }),
                                                                menu: (base) => ({
                                                                    ...base,
                                                                    color: '#000',
                                                                }),
                                                                singleValue: (base) => ({
                                                                    ...base,
                                                                    color: !isEditingAddress ? '#000' : '#333', // ปรับสีข้อความที่เลือก
                                                                }),
                                                                dropdownIndicator: (base) => ({
                                                                    ...base,
                                                                    color: !isEditingAddress ? '#000' : '#cccccc', // สีของลูกศร dropdown
                                                                }),
                                                                indicatorSeparator: (base) => ({
                                                                    ...base,
                                                                    backgroundColor: !isEditingAddress ? '#000' : '#cccccc', // สีของขีด | ใกล้ dropdown
                                                                }),
                                                            }}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="zip_code" className='hidden'>
                                                            <p>Postal Code</p>
                                                        </label>
                                                        <Select
                                                            id="zip_code"
                                                            value={
                                                                results[index]?.zipCode
                                                                    ? { value: results[index]?.zipCode.toString(), label: results[index]?.zipCode.toString() }
                                                                    : null
                                                            }
                                                            onChange={(selectedOption) =>
                                                                handleZipCodeChange(selectedOption, index)
                                                            }
                                                            options={Array.from(
                                                                new Set(
                                                                    data
                                                                        ?.find((province) => province.id === Number(results[index]?.provinceId))
                                                                        ?.amphure.find((amphure) => amphure.id === Number(results[index]?.amphureId))
                                                                        ?.tambon.map((tambon) => tambon.zip_code)
                                                                )
                                                            ).map((zip_code) => ({
                                                                value: zip_code.toString(),
                                                                label: zip_code.toString(),
                                                            }))}
                                                            isDisabled={!isEditingAddress}
                                                            isClearable
                                                            classNamePrefix="react-select"
                                                            placeholder={t('editProfile.address.postalCodePlaceholder')}
                                                            filterOption={(option, inputValue) =>
                                                                option.label.toLowerCase().startsWith(inputValue.toLowerCase())
                                                            }
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    backgroundColor: !isEditingAddress ? '#51536D' : 'white',
                                                                    borderColor: !isEditingAddress ? 'transparent' : base.borderColor,
                                                                    input: {
                                                                        boxShadow: 'none',
                                                                    },
                                                                }),
                                                                placeholder: (base) => ({
                                                                    ...base,
                                                                    color: '#9ca3af',
                                                                }),
                                                                menu: (base) => ({
                                                                    ...base,
                                                                    color: '#000',
                                                                }),
                                                                singleValue: (base) => ({
                                                                    ...base,
                                                                    color: !isEditingAddress ? '#000' : '#333', // ปรับสีข้อความที่เลือก
                                                                }),
                                                                dropdownIndicator: (base) => ({
                                                                    ...base,
                                                                    color: !isEditingAddress ? '#000' : '#cccccc', // สีของลูกศร dropdown
                                                                }),
                                                                indicatorSeparator: (base) => ({
                                                                    ...base,
                                                                    backgroundColor: !isEditingAddress ? '#000' : '#cccccc', // สีของขีด | ใกล้ dropdown
                                                                }),

                                                            }}
                                                        />
                                                    </div>

                                                    <label htmlFor="address" className='col-span-1 sm:col-span-2 relative'>
                                                        <textarea
                                                            className={`resize-none border-transparent  ${!isEditingAddress ? 'bg-[#51536D]' : 'text-[#333333]'}`}
                                                            placeholder={t('editProfile.address.detailPlaceholder')}
                                                            rows={4}
                                                            maxLength={200}
                                                            value={results[index]?.detail || ''}
                                                            onChange={(e) => handleAddressDetailChange(e, index)}
                                                            readOnly={!isEditingAddress}
                                                            disabled={!isEditingAddress}
                                                        ></textarea>
                                                        <span className='absolute bottom-3 right-2 text-xs text-gray-500'>{charCount[index]}/200</span>
                                                    </label>
                                                </form>
                                            </div>
                                        )}
                                        {index < addressFormsCount - 1 && (
                                            <div className='my-6' />
                                        )}
                                    </div>
                                ))}
                                {addressFormsCount < 3 && (
                                    <button aria-hidden='true' onClick={handleAddAddressForm} className='mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] transition hover:border-[#7ee7ff]/35 hover:bg-white/[0.05]'>
                                        <IoIosAddCircle className='text-white text-2xl' />
                                        <p className='text-white'>{t('editProfile.address.add')}</p>
                                    </button>
                                )}
                                </div>
                            </section>
                        </div>
                    </div>
                </>)}
        </div>
    );
}
