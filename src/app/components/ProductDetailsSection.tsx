import React from "react";

interface ProductDetailsProps {
  imageUrl: string;
  size: string;
  material: string;
  painting: string;
  assembly: string;
  quantity: number;
  totalPrice: number;
  shipingCost:number;
}

const ProductDetailsSection: React.FC<ProductDetailsProps> = ({
  imageUrl,
  size,
  material,
  painting,
  assembly,
  quantity,
  totalPrice,
  shipingCost,
}) => {
  return (
    <section className="w-full bg-[#202133] border border-[#202133] rounded-xl p-9 sm:h-[500px]">
      <div className="w-full h-full flex flex-col gap-5 sm:flex-row">
        <img
          className="w-full rounded-2xl"
          src={imageUrl}
          alt="Product Image"
        />
        <div className="flex flex-col w-full justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Product details</h2>
            <p className="text-[14px] font-medium">Size : {size}</p>
            <p className="text-[14px] font-medium">Material : {material}</p>
            <p className="text-[14px] font-medium">Painting : {painting}</p>
            <p className="text-[14px] font-medium">Assembly : {assembly}</p>
            <p className="text-[14px] font-medium">Quantity : {quantity}</p>
          </div>
          <hr className="border-t border-[#828399]"/>

          
          <div className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-[14px] font-medium">Price</h2>
            <p className="text-[14px] font-medium">{totalPrice.toLocaleString()} ฿</p>
          </div>

          <div className="flex justify-between">
            <h2 className="text-[14px] font-medium">Shipping Fee</h2>
            <p className="text-[14px] font-medium">{shipingCost} ฿</p>
          </div>

          <div className="flex justify-between">
            <h2 className="text-[16px] font-semibold">Total Price</h2>
            <p className="text-[16px] font-semibold">{(totalPrice + shipingCost).toLocaleString()} ฿</p>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsSection;
