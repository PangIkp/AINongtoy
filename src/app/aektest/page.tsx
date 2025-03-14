'use client';
import React, { useEffect, useState } from 'react';
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
}

interface Address {
    detail: string;
    province: string;
    district: string;
    subdistrict: string;
    postalCode: string;
}

export default function Page() {
    const [data, setData] = useState<Province[] | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([
        {
            detail: "789 Central Ave",
            province: "Phuket",
            district: "Mueang Phuket",
            subdistrict: "Talat Yai",
            postalCode: "83000"
        },
        {
            detail: "987 Beach Rd",
            province: "Chon Buri",
            district: "Bang Lamung",
            subdistrict: "Nong Prue",
            postalCode: "20150"
        },
        {
            detail: "321 River Rd",
            province: "Chiang Rai",
            district: "Mueang Chiang Rai",
            subdistrict: "Wiang",
            postalCode: "57000"
        }
    ]);
    const [results, setResults] = useState<Result[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
            });
    }, []);

    const handleSearch = () => {
        if (!data) {
            setError('Data not loaded');
            return;
        }

        const newResults: Result[] = [];

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
                            zipCode: zipCode
                        });
                    } else {
                        setError('Subdistrict not found');
                        Swal.fire({
                            title: 'Error!',
                            text: 'Subdistrict not found',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                }
                else {
                    setError('District not found');
                    Swal.fire({
                        title: 'Error!',
                        text: 'District not found',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            }
            else {
                setError('Province not found');
                Swal.fire({
                    title: 'Error!',
                    text: 'Province not found',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        });

        setResults(newResults);
        setError('');
    };

    return (
        <div className='container'>
            <h1>Search Thai province data</h1>
            <button onClick={handleSearch}>Search</button>
            {data === null && <div>Loading...</div>}

            {error && <div className="error">{error}</div>}
            {results.map((result, index) => (
                <div key={index}>
                    <br />
                    <div>Province: {addresses[index].province}</div>
                    <div>District: {addresses[index].district}</div>
                    <div>Subdistrict: {addresses[index].subdistrict}</div>
                    <div>Postal Code: {addresses[index].postalCode}</div>
                    <div>Detail: {addresses[index].detail}</div>
                    <br />
                    <div>Province ID: {result.provinceId}</div>
                    <div>Amphure ID: {result.amphureId}</div>
                    <div>Tambon ID: {result.tambonId}</div>
                    <div>Zip Code: {result.zipCode}</div>
                    <br />
                </div>
            ))}
        </div>
    );
}