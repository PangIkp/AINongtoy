import React from 'react';

// ประกาศอินเตอร์เฟส PaginationProps เพื่อกำหนดประเภทของ props ที่คอมโพเนนต์ Pagination จะรับ
interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

// ประกาศคอมโพเนนต์ Pagination โดยใช้ React.FC และรับ props ตามที่กำหนดใน PaginationProps
const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    // ฟังก์ชัน handlePageChange ใช้เพื่อเปลี่ยนหน้าเมื่อผู้ใช้คลิกปุ่มเปลี่ยนหน้า
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    // ฟังก์ชัน getPageNumbers ใช้เพื่อคำนวณหมายเลขหน้าที่จะแสดงใน Pagination
    const getPageNumbers = () => {
        const maxPagesToShow = 5; // จำนวนหน้าสูงสุดที่จะแสดงใน Pagination
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = startPage + maxPagesToShow - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        // เรนเดอร์ Pagination โดยมีปุ่มสำหรับเปลี่ยนหน้าและแสดงหมายเลขหน้า
        <section className='place-content-center place-items-center'>
            <div className='flex gap-3'>
                {/* ปุ่มสำหรับไปหน้าก่อนหน้า */}
                <button
                    className='border border-background bg-background hover:bg-background hover:border hover:border-white place-content-center place-items-center p-2'
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <img className='w-[11px] h-[11px] object-contain' src="/Images/AINongtoy/ArrowLeft.png" alt="Previous" />
                    <p className='hidden'>Previous</p>
                </button>
                {/* แสดงหมายเลขหน้า */}
                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        className={`border border-background bg-background hover:bg-background hover:border hover:border-white ${currentPage === page ? 'bg-blue-400' : ''}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
                {/* ปุ่มสำหรับไปหน้าถัดไป */}
                <button
                    className='border border-background bg-background hover:bg-background hover:border hover:border-white place-content-center place-items-center p-2'
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <img className='w-[11px] h-[11px] object-contain' src="/Images/AINongtoy/ArrowRight.png" alt="Next" />
                    <p className='hidden'>Next</p>
                </button>
            </div>
        </section>
    );
};

export default Pagination;