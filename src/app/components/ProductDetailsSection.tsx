import React from "react";

interface ProductDetailsProps {
  imageUrl: string;
  size: string;
  material: string;
  painting: string;
  assembly: string;
  quantity: number;
  price: number;
  shipingCost: number;
}

const ProductDetailsSection: React.FC<ProductDetailsProps> = ({
  imageUrl,
  size,
  material,
  painting,
  assembly,
  quantity,
  price,
  shipingCost,
}) => {
  return (
    <div className="w-full h-full bg-[#202133] border border-[#202133] rounded-xl p-8">
      <div className="w-full h-full grid sm:grid-rows-1 sm:grid-cols-2 gap-5 grid-rows-2 grid-cols-1">
        <img
          className="w-full h-full rounded-2xl object-cover"
          src={imageUrl}
          alt="Product Image"
        />
        <div className="flex flex-col w-full justify-between">
          <div className="flex flex-col gap-7">
            <h2 className="text-2xl font-semibold">Product details</h2>
            <p className="text-[14px] font-medium">Size : {size}</p>
            <p className="text-[14px] font-medium">Material : {material}</p>
            <p className="text-[14px] font-medium">Painting : {painting}</p>
            <p className="text-[14px] font-medium">Assembly : {assembly}</p>
            <p className="text-[14px] font-medium">Quantity : {quantity}</p>
          </div>
          <hr className="border-t border-[#828399] my-4" />


          <div className="space-y-5">
            <div className="flex justify-between">
              <h2 className="text-[14px] font-medium">Price</h2>
              <p className="text-[14px] font-medium">{price.toLocaleString()} ฿</p>
            </div>

            <div className="flex justify-between">
              <h2 className="text-[14px] font-medium">Shipping Fee</h2>
              <p className="text-[14px] font-medium">{shipingCost} ฿</p>
            </div>

            <div className="flex justify-between">
              <h2 className="text-[16px] font-semibold">Total Price</h2>
              <p className="text-[16px] font-semibold">{(price + shipingCost).toLocaleString()} ฿</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSection;
