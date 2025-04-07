/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';

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

interface AddressFormProps {
    setIsFormValid: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddressForm: React.FC<AddressFormProps> = ({ setIsFormValid }) => {
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
    const [charCount, setCharCount] = useState(0);
    const [addressDetail, setAddressDetail] = useState("");

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json")
            .then((response) => response.json())
            .then((result) => {
                setProvinces(result);
            });
    }, []);

    useEffect(() => {
        const { province_id, amphure_id, tambon_id, zip_code } = selected;
        setIsFormValid(!!province_id && !!amphure_id && !!tambon_id && !!zip_code);
    }, [selected, setIsFormValid]);

    const isDropdownValid = (value: number | undefined) => {
        return value !== undefined && value !== 0;
    };

    const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        if (value.length <= 500) {
            setCharCount(value.length);
            setAddressDetail(value);
        }
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
            <hr className='border border-white mb-10 ' />
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

    );
};

export default AddressForm;