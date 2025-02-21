import React from 'react';

const districts = [
    "Mueang", "Hang Dong", "Patong", "Bang Khen", "Bang Na", "Bang Phlat", "Bang Rak", "Bang Sue",
    "Bangkok Noi", "Bangkok Yai", "Chatuchak", "Chom Thong", "Din Daeng", "Don Mueang", "Dusit",
    "Huai Khwang", "Khan Na Yao", "Khlong Sam Wa", "Khlong San", "Khlong Toei", "Lak Si", "Lat Krabang",
    "Lat Phrao", "Min Buri", "Nong Chok", "Nong Khaem", "Pathum Wan", "Phasi Charoen", "Phaya Thai",
    "Phra Khanong", "Phra Nakhon", "Pom Prap Sattru Phai", "Prawet", "Rat Burana", "Ratchathewi",
    "Sai Mai", "Samphanthawong", "Saphan Sung", "Sathon", "Suan Luang", "Taling Chan", "Thawi Watthana",
    "Thon Buri", "Thung Khru", "Wang Thonglang", "Watthana", "Yan Nawa"
    // Add more districts as needed
];

const District = () => {
    return (
        <label htmlFor="district">
            <p className='hidden'>District</p>
            <select className='text-[#9F9F9F]'>
                <option value="" selected>District</option>
                {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                ))}
            </select>
        </label>
    );
};

export default District;