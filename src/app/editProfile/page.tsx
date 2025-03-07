'use client';
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { IoIosAddCircle } from "react-icons/io";
import { updateUserProfile } from '../../api/userAPI';
import { getUserData, setUserData } from '../../utils/localStorageUtils';
import AddressForm from '../components/AddressForm';

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

export default function EditProfile() {
    const aboutRef = useRef<HTMLDivElement>(null!);
    const partnerRef = useRef<HTMLDivElement>(null!);
    const contactRef = useRef<HTMLDivElement>(null!);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const [charCount, setCharCount] = useState(0);
    const [addressDetail, setAddressDetail] = useState("");

    const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        if (value.length <= 500) {
            setCharCount(value.length);
            setAddressDetail(value);
        }
    };

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

    const [username, setUsername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

    const [originalFirstName, setOriginalFirstName] = useState<string | null>(null);
    const [originalLastName, setOriginalLastName] = useState<string | null>(null);
    const [originalPhone, setOriginalPhone] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [userId, setUserId] = useState<string | null>(null); // Add this state to store the user id

    const fetchUserData = () => {
        const parsedUser = getUserData();
        if (parsedUser) {
            console.log('Parsed User:', parsedUser); // Log parsed user data
            console.log('User ID:', parsedUser._id); // Log the user id
            setUserId(parsedUser._id); // Update this line to store the user id
            setUsername(parsedUser.username);
            setEmail(parsedUser.email);
            setFirstName(parsedUser.firstName);
            setLastName(parsedUser.lastName);
            setPhoneNumber(parsedUser.phoneNumber);

            setOriginalFirstName(parsedUser.firstName);
            setOriginalLastName(parsedUser.lastName);
            setOriginalPhone(parsedUser.phoneNumber);
        }
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

    useEffect(() => {
        const { province_id, amphure_id, tambon_id, zip_code } = selected;
        setIsFormValid(!!province_id && !!amphure_id && !!tambon_id && !!zip_code);
    }, [selected]);

    const isDropdownValid = (value: number | undefined) => {
        return value !== undefined && value !== 0;
    };

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

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFirstName(originalFirstName);
        setLastName(originalLastName);
        setPhoneNumber(originalPhone);
        setIsEditing(false);
    };

    const handleSave = async () => {
        const userData = {
            firstName,
            lastName,
            phoneNumber
        };

        console.log('User Data save:', userData); // Log user data
        console.log('User ID save:', userId); // Log user ID

        if (userId) { // Ensure userId is not null
            try {
                const result = await updateUserProfile(userId, userData);
                console.log('Update Result:', result); // Log the result

                const user = getUserData();
                if (user) {
                    const updatedUser = { ...user, ...userData };
                    setUserData(updatedUser);
                }

                console.log('Local Storage User:', localStorage.getItem("user")); // Log the updated user data in localStorage

                setIsEditing(false);
                alert('Profile updated successfully');
            } catch (error: any) {
                console.error('Error:', error);
                alert(error.message || 'Failed to update profile');
            }
        } else {
            alert('User ID is missing');
        }
    };

    const [addressFormsCount, setAddressFormsCount] = useState(1);

    const handleAddAddressForm = () => {
        setAddressFormsCount(prevCount => (prevCount < 3 ? prevCount + 1 : prevCount));
    };

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
                            {!isEditing ? (
                                <button className='bg-background border border-white font-normal text-xs py-1 px-3' onClick={handleEdit}>Edit</button>
                            ) : (
                                <div className='flex gap-2'>
                                    <button className='bg-[#51536D] border border-[#51536D] text-gray-300 font-normal text-xs py-1 px-3' onClick={handleCancel}>Cancel</button>
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

                    <div className='flex justify-between'>
                        <div className='flex justify-center items-center'>
                            <p className='text-xl font-semibold'>Address</p>

                            <button className='bg-[#07081C] hover:bg-[#07081C] hover:text-white rounded-full' onClick={handleAddAddressForm}>
                                <IoIosAddCircle className='w-[20px] h-[20px] hover:text-[#0AACF0]' /><p className='hidden'>+</p>
                            </button>
                        </div>

                        <div className='flex justify-center items-center gap-2'>
                            <button className='bg-background border border-white font-normal text-xs py-1 px-3' onClick={() => alert('Button clicked!')}>Edit</button>
                            <button className='bg-[#51536D] border border-[#51536D] text-gray-300 font-normal text-xs py-1 px-3' onClick={handleDelete}>Delete</button>
                        </div>
                    </div>

                    {Array.from({ length: addressFormsCount }).map((_, index) => (
                        <AddressForm key={index} setIsFormValid={setIsFormValid} />
                    ))}
                    <button className='h-[50px] col-span-2'>Save</button>

                </div>
            </div>
            <Footer />
        </div>
    );
}