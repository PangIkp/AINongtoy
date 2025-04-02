'use client';
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { IoIosAddCircle } from "react-icons/io";
import { Loader } from "lucide-react"; // Import Loader
import { updateUserProfile, updateUserAddresses, getUserById } from '../../api/userAPI';
import { getUserData, setUserData } from '../../utils/localStorageUtils';
import Swal from "sweetalert2";

interface Province {
    id: number;
    name_en: string;
    amphure: Amphure[];
}

interface Amphure {
    id: number;
    name_en: string;
    tambon: Tambon[];
}

interface Tambon {
    id: number;
    name_en: string;
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
    const phoneRegex = /^0\d{9}$/;

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });

    const validateInput = (field: string, value: string) => {
        if (field === 'firstName' || field === 'lastName') {
            if (!nameRegex.test(value)) {
                return 'Alphabetic, 4-40 chars.';
            }
        } else if (field === 'phoneNumber') {
            if (!phoneRegex.test(value)) {
                return 'Phone: 10 digits, start with 0.';
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
                title: 'Validation Error',
                text: 'Please correct the highlighted fields.',
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
                    title: 'Success',
                    text: 'Profile updated successfully!',
                    timer: 1500,
                    showConfirmButton: false,
                    willClose: () => {
                        window.location.reload();
                    },
                });
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Failed to update profile',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'User ID is missing',
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

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const newResults = [...results];
        newResults[index].provinceId = e.target.value;
        newResults[index].amphureId = null;
        newResults[index].tambonId = null;
        newResults[index].zipCode = null;
        setResults(newResults);
    };

    const handleAmphureChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const newResults = [...results];
        newResults[index].amphureId = e.target.value;
        newResults[index].tambonId = null;
        newResults[index].zipCode = null;
        setResults(newResults);
    };

    const handleTambonChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const newResults = [...results];
        newResults[index].tambonId = e.target.value;
        const province = data?.find((province) => province.id === Number(newResults[index].provinceId));
        const amphure = province?.amphure.find((amphure) => amphure.id === Number(newResults[index].amphureId));
        const tambon = amphure?.tambon.find((tambon) => tambon.id === Number(e.target.value));
        newResults[index].zipCode = tambon?.zip_code || null;
        setResults(newResults);
    };

    const handleZipCodeChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const newResults = [...results];
        newResults[index].zipCode = e.target.value;
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
            title: 'Are you sure?',
            text: "Do you really want to delete this address?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            reverseButtons: true
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
                        title: 'Success',
                        text: 'Address deleted successfully!',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                } catch (error: any) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message || 'Failed to delete address',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'User ID is missing',
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
                title: 'Warning',
                text: 'Please fill out all address fields completely.',
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
                    title: 'Success',
                    text: 'Addresses updated successfully!',
                    timer: 1500,
                    showConfirmButton: false,
                    willClose: () => {
                        window.location.reload();
                    }
                });
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Failed to update addresses',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'User ID is missing',
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

        setAddressFormsCount(prevCount => (prevCount < 3 ? prevCount + 1 : prevCount));
        setAddresses(prevAddresses => [...prevAddresses, newAddress]);
        setResults(prevResults => [...prevResults, { provinceId: null, amphureId: null, tambonId: null, zipCode: null }]);
        setCharCount(prevCharCount => [...prevCharCount, 0]);
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

        console.log('results', results);
        console.log('addresses', addresses);
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
                        title: 'Error',
                        text: response.message || 'Failed to fetch user data',
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }
            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Failed to fetch user data',
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
        fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => {
                console.error('Error:', error);
            });

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

        console.log('results', results);
        console.log('addresses', addresses);

    }, [addresses.length, data]); // useEffect will run when addresses.length or data changes

    return (
        <div>
            <Navbar scrollToSection={scrollToSection} aboutRef={aboutRef} partnerRef={partnerRef} contactRef={contactRef} />

            {isLoading ? ( // Show loader while loading
                <div className="flex justify-center items-center h-screen">
                    <Loader className="animate-spin text-[#0CACF3]" size={50} />
                </div>
            ) : (
                <>
                    <div className='w-full place-content-center place-items-center h-[100px] mt-[5rem] bg-black'>
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
                                            <button className='bg-[#51536D] border border-[#51536D] text-gray-300 font-normal text-xs py-1 px-3' onClick={handleCancelEdit}>Cancel</button>
                                            <button className='bg-background border border-white font-normal text-xs py-1 px-3' onClick={handleSaveUserdata}>Save</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <form action="#information" method="post" className='grid grid-cols-1 sm:grid-cols-2 sm:gap-y-6  gap-x-8'>
                                    <label htmlFor="username">
                                        <p>Username</p>
                                        <input
                                            type="text"
                                            id="username"
                                            value={username || ''}
                                            readOnly disabled
                                            className='bg-[#51536D] border-transparent' />
                                        <p className="text-xs my-1 text-yellow-500 h-4"></p>
                                    </label>
                                    <label htmlFor="email">
                                        <p>Email address</p>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email || ''}
                                            readOnly disabled
                                            className='bg-[#51536D] border-transparent' />
                                        <p className="text-xs my-1 text-yellow-500 h-4"></p>
                                    </label>
                                    <label htmlFor="fname">
                                        <p>First Name</p>
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
                                        <p>Last Name</p>
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
                            <div>
                                <div className='flex justify-between'>
                                    <h1 className='text-xl font-semibold'>
                                        Address
                                    </h1>
                                    <div className='place-aitems-end place-content-center'>
                                        {!isEditingAddress ? (
                                            <button
                                                className={`bg-background border border-white font-normal text-xs py-1 px-3 ${addressFormsCount <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={() => setIsEditingAddress(true)}
                                                disabled={addressFormsCount <= 0}
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    className="bg-background border border-white font-normal text-xs py-1 px-3"
                                                    onClick={handleCancelEditAddress}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="bg-background border border-white font-normal text-xs py-1 px-3"
                                                    onClick={handleSaveAddresses}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        )
                                        }
                                    </div>
                                </div>
                                <hr className='border border-white mt-2 mb-10 ' />

                                {Array.from({ length: addressFormsCount }).map((_, index) => (
                                    <div key={index}>
                                        {results[index] && (
                                            <div>
                                                <div className='flex justify-between my-4'>
                                                    <p>{index === 0 ? 'Address Form' : `Address Form ${index + 1}`}</p>
                                                    <div className='place-aitems-end place-content-center'>
                                                        <button
                                                            className={`bg-background border border-white font-normal text-xs py-1 px-3 ${!isEditingAddress ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            onClick={() => isEditingAddress && handleDeleteAddress(index)}
                                                            disabled={!isEditingAddress}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>

                                                <form
                                                    action="#address"
                                                    method="post"
                                                    className='grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8'>
                                                    <div>
                                                        <label htmlFor="province_id" className='hidden'>
                                                            <p>Province</p>
                                                        </label>
                                                        <select
                                                            id="province_id"
                                                            value={results[index]?.provinceId || ''}
                                                            onChange={(e) => handleProvinceChange(e, index)}
                                                            disabled={!isEditingAddress}
                                                            className={`${!isEditingAddress ? 'bg-[#51536D] border-transparent' : ''} ${!results[index]?.provinceId ? 'text-[#9ca3af]' : ''}`}
                                                        >
                                                            <option value="" label="Province" />
                                                            {data?.map((province) => (
                                                                <option key={province.id} value={province.id}>
                                                                    {province.name_en}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="amphure_id" className='hidden'>
                                                            <p>District</p>
                                                        </label>
                                                        <select
                                                            id="amphure_id"
                                                            value={results[index]?.amphureId || ''}
                                                            onChange={(e) => handleAmphureChange(e, index)}
                                                            disabled={!isEditingAddress}
                                                            className={`${!isEditingAddress ? 'bg-[#51536D] border-transparent' : ''} ${!results[index]?.amphureId ? 'text-[#9ca3af]' : ''}`}
                                                        >
                                                            <option value="" label="District" />
                                                            {data?.find((province) => province.id === Number(results[index]?.provinceId))?.amphure.map((amphure) => (
                                                                <option key={amphure.id} value={amphure.id}>
                                                                    {amphure.name_en}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="tambon_id" className='hidden'>
                                                            <p>Subdistrict</p>
                                                        </label>
                                                        <select
                                                            id="tambon_id"
                                                            value={results[index]?.tambonId || ''}
                                                            onChange={(e) => handleTambonChange(e, index)}
                                                            disabled={!isEditingAddress}
                                                            className={`${!isEditingAddress ? 'bg-[#51536D] border-transparent ' : ''} ${!results[index]?.tambonId ? 'text-[#9ca3af]' : ''}`}
                                                        >
                                                            <option value="" label="Subdistrict" />
                                                            {data?.find((province) => province.id === Number(results[index]?.provinceId))?.amphure.find((amphure) => amphure.id === Number(results[index]?.amphureId))?.tambon.map((tambon) => (
                                                                <option key={tambon.id} value={tambon.id}>
                                                                    {tambon.name_en}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="zip_code" className='hidden'>
                                                            <p>Postal Code</p>
                                                        </label>
                                                        <select
                                                            id="zip_code"
                                                            value={results[index]?.zipCode || ''}
                                                            onChange={(e) => handleZipCodeChange(e, index)}
                                                            disabled={!isEditingAddress}
                                                            className={`${!isEditingAddress ? 'bg-[#51536D] border-transparent' : ''} ${!results[index]?.zipCode ? 'text-[#9ca3af]' : ''}`}
                                                        >
                                                            <option value="" label="Postal Code" />
                                                            {Array.from(
                                                                new Set(
                                                                    data?.find((province) => province.id === Number(results[index]?.provinceId))
                                                                        ?.amphure.find((amphure) => amphure.id === Number(results[index]?.amphureId))
                                                                        ?.tambon.map((tambon) => tambon.zip_code)
                                                                )
                                                            ).map((zip_code) => (
                                                                <option key={zip_code} value={zip_code}>
                                                                    {zip_code}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <label htmlFor="address" className='col-span-1 sm:col-span-2 relative'>
                                                        <textarea
                                                            className={`resize-none border-transparent  ${!isEditingAddress ? 'bg-[#51536D]' : ''}`}
                                                            placeholder='Address Detail such as House number, Apartment name, Condo, Village name '
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
                                            <hr className='my-10 opacity-50' />
                                        )}
                                    </div>
                                ))}
                                {addressFormsCount < 3 && (
                                    <button aria-hidden='true' onClick={handleAddAddressForm} className='flex justify-center items-center gap-1 h-[40px] w-full mt-5'>
                                        <IoIosAddCircle className='text-white text-2xl' />
                                        <p className='text-white'>Add Address</p>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <Footer />
                </>)}
        </div>
    );
}