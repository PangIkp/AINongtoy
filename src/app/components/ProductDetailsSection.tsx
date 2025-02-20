import React from 'react';

interface ProductDetailsSectionProps {
    imageUrl: string;
    size: string;
    material: string;
    painting: string;
    assembly: string;
    quantity: number;
    price: number;
    shippingFee: number;
}

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({ imageUrl, size, material, painting, assembly, quantity, price, shippingFee }) => {
    return (
        <section className='w-full bg-[#202133] border border-[#202133] rounded-xl p-9 sm:h-[500px]'>
            <div className='w-full h-full flex flex-col gap-5 sm:flex-row'>
                <img className='h-full object-contain rounded-3xl' src={imageUrl} alt="Product Image" />
                <div className='flex flex-col gap-5 w-full justify-between'>
                    <div className='flex flex-col gap-7 pb-5'>
                        <h2 className='text-2xl font-semibold'>Product details</h2>
                        <p className='text-xs'>Size : {size}</p>
                        <p className='text-xs'>Material : {material}</p>
                        <p className='text-xs'>Painting : {painting}</p>
                        <p className='text-xs'>Assembly : {assembly}</p>
                        <p className='text-xs'>Quantity : {quantity}</p>
                    </div>
                    <hr />
                    <div className='flex justify-between'>
                        <div>
                            <p>Price</p>
                            <p>Shipping Fee</p>
                        </div>
                        <div className='text-right'>
                            <p>{price} ฿</p>
                            <p>{shippingFee} ฿</p>
                        </div>
                    </div>

                    <div className='flex justify-between'>
                        <h2 className='text-xl font-semibold'>Total Price</h2>
                        <p className='text-xl font-semibold'>{price + shippingFee} ฿</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetailsSection;