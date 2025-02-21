import React from 'react';

const Subdistrict = () => {
    return (
        <label htmlFor="subdistrict">
            <p className='hidden'>Subdistrict</p>
            <select className='text-[#9F9F9F]'>
                <option value="" selected>Subdistrict</option>
                <option value="Suthep">Suthep</option>
                <option value="Nimmanhaemin">Nimmanhaemin</option>
                <option value="Kathu">Kathu</option>
                <option value="Bangkok Noi">Bangkok Noi</option>
                <option value="Bangkok Yai">Bangkok Yai</option>
                <option value="Chatuchak">Chatuchak</option>
                <option value="Dusit">Dusit</option>
                <option value="Lat Phrao">Lat Phrao</option>
                <option value="Phaya Thai">Phaya Thai</option>
                <option value="Ratchathewi">Ratchathewi</option>
                <option value="Sathon">Sathon</option>
                <option value="Thon Buri">Thon Buri</option>
                <option value="Wang Thonglang">Wang Thonglang</option>
                <option value="Yan Nawa">Yan Nawa</option>
                {/* Add more subdistricts as needed */}
            </select>
        </label>
    );
};

export default Subdistrict;