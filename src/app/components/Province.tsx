import React from 'react';

const provinces = [
    "Amnat Charoen", "Ang Thong", "Bangkok", "Bueng Kan", "Buri Ram", "Chachoengsao",
    "Chai Nat", "Chaiyaphum", "Chanthaburi", "Chiang Mai", "Chiang Rai", "Chon Buri",
    "Chumphon", "Kalasin", "Kamphaeng Phet", "Kanchanaburi", "Khon Kaen", "Krabi",
    "Lampang", "Lamphun", "Loei", "Lop Buri", "Mae Hong Son", "Maha Sarakham",
    "Mukdahan", "Nakhon Nayok", "Nakhon Pathom", "Nakhon Phanom", "Nakhon Ratchasima",
    "Nakhon Sawan", "Nakhon Si Thammarat", "Nan", "Narathiwat", "Nong Bua Lam Phu",
    "Nong Khai", "Nonthaburi", "Pathum Thani", "Pattani", "Phang Nga", "Phatthalung",
    "Phayao", "Phetchabun", "Phetchaburi", "Phichit", "Phitsanulok", "Phrae", "Phuket",
    "Prachin Buri", "Prachuap Khiri Khan", "Ranong", "Ratchaburi", "Rayong", "Roi Et",
    "Sa Kaeo", "Sakon Nakhon", "Samut Prakan", "Samut Sakhon", "Samut Songkhram",
    "Saraburi", "Satun", "Sing Buri", "Sisaket", "Songkhla", "Sukhothai", "Suphan Buri",
    "Surat Thani", "Surin", "Tak", "Trang", "Trat", "Ubon Ratchathani", "Udon Thani",
    "Uthai Thani", "Uttaradit", "Yala", "Yasothon"
].sort();

const Province = () => {
    return (
        <label htmlFor="province">
            <p className='hidden'>Province</p>
            <select className='text-[#9F9F9F]'>
                <option value="" selected>Province</option>
                {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                ))}
            </select>
        </label>
    );
};

export default Province;