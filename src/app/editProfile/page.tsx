import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function EditProfile() {
    return (
        <div>
            <Navbar />
            <div className='w-full place-content-center place-items-center h-[235px] mt-[75px] bg-black'>
                <h1 className='text-4xl font-semibold mb-3'>My Profile</h1>
            </div>
            <div className='w-full place-items-center'>
                <div className='w-full  max-w-[980px] px-4 py-20 flex flex-col gap-12'>
                    <div className='flex justify-between border-b border-white pb-6'>
                        <p className='text-xl font-semibold'>Information</p>
                        <div className='place-aitems-end place-content-center'>
                            <button className='bg-background border border-white font-normal text-xs py-1 px-3'>Edit</button>
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
                        <div className='flex justify-center items-center gap-2'>
                            <p className='text-xl font-semibold'>Address</p>
                            <button className='bg-white text-black hover:text-white rounded-full page-content-center place-items-center'>
                                <p className='w-fit h-fit'>+</p>
                            </button>
                        </div>


                        <div className='flex justify-center items-center gap-2'>
                            <button className='bg-background border border-white font-normal text-xs py-1 px-3'>Edit</button>
                            <button className='bg-[#51536D] border border-white font-normal text-xs py-1 px-3'>Delete</button>
                        </div>
                    </div>

                    <div>
                        <form action="#address" method="post" className='grid grid-cols-2 gap-y-10 gap-x-8'>
                            <label htmlFor="province">
                                <p className='hidden'>Province</p>
                                <select className='text-[#9F9F9F]'>
                                    <option value="">Province</option>
                                    {/* Add options for provinces */}
                                </select>
                            </label>
                            <label htmlFor="district">
                                <p className='hidden'>District</p>
                                <select className='text-[#9F9F9F]'>
                                    <option value="">District</option>
                                    {/* Add options for districts */}
                                </select>
                            </label>
                            <label htmlFor="subdistrict">
                                <p className='hidden'>Subdistrict</p>
                                <select className='text-[#9F9F9F]'>
                                    <option value="">Subdistrict</option>
                                    {/* Add options for subdistricts */}
                                </select>
                            </label>
                            <label htmlFor="postalcode">
                                <p className='hidden'>Posta lcode</p>
                                <select className='text-[#9F9F9F]'>
                                    <option value="">Postal code</option>
                                    {/* Add options for subdistricts */}
                                </select>
                            </label>
                            <label htmlFor="address" className='col-span-2'>
                                <p className='hidden'>Address</p>
                                <textarea className='resize-none' placeholder='Address Detail such as House number, Apartment name, Condo, Village name ' rows={4}></textarea>
                            </label>
                        </form>
                    </div>

                    <button className='h-[50px]'>Save</button>
                </div>
            </div>
            <Footer />
        </div>
    )
}