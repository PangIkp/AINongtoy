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
        const maxPagesToShow = 20; // จำนวนหน้าสูงสุดที่จะแสดงใน Pagination
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

    // ถ้าจำนวนหน้ามีเพียงหน้าเดียว ไม่ต้องแสดง Pagination
    if (totalPages <= 1) {
        return null;
    }

    return (
        // เรนเดอร์ Pagination โดยมีปุ่มสำหรับเปลี่ยนหน้าและแสดงหมายเลขหน้า
        <section className='flex justify-center'>
            <div className='flex flex-wrap items-center justify-center gap-3'>
                {/* ปุ่มสำหรับไปหน้าก่อนหน้า */}
                <button
                    className='flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0A1129] hover:border-[#6fdfff] hover:bg-[#101a38] disabled:cursor-not-allowed disabled:opacity-40'
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
                        className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-medium transition ${
                            currentPage === page
                                ? 'border-[#0AACF0] bg-[#0AACF0] text-[#06111d] hover:bg-[#29c0ff]'
                                : 'border-white/10 bg-[#0A1129] text-white/80 hover:border-white/25 hover:bg-[#101a38]'
                        }`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
                {/* ปุ่มสำหรับไปหน้าถัดไป */}
                <button
                    className='flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0A1129] hover:border-[#6fdfff] hover:bg-[#101a38] disabled:cursor-not-allowed disabled:opacity-40'
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
