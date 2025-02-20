import { useState, useEffect } from "react";
import { useMainStore } from "@/mainstore";
import { useSearchParams } from "next/navigation";

const Config = () => {
  const [size, setSize] = useState("Medium");
  const [material, setMaterial] = useState("PLA");
  const [painting, setPainting] = useState("Hand-painting");
  const [assembly, setAssembly] = useState("Fixed Pose");
  const [quantity, setQuantity] = useState(3);
  const pricePerUnit = 500; // ปรับราคาได้ตามต้องการ
  const searchParams = useSearchParams();
  const imageUrl =
    searchParams.get("image") || "/Images/AINongtoy/WhiteMiku.png";

  const { artToyData, setArtToyData } = useMainStore();

  // สร้าง state สำหรับชื่อ Art Toy
  const [artToyName, setArtToyNameLocal] = useState(() => {
    // return localStorage.getItem("artToyName") || artToyData.name;
    return artToyData.name;
  });

  // useEffect(() => {
  //   localStorage.setItem("artToyName", artToyName);
  // }, [artToyName]);
  const [isEditing, setIsEditing] = useState(false);

  const totalPrice = quantity * pricePerUnit;

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArtToyNameLocal(event.target.value);
  };

  // ✅ กด Enter หรือคลิกนอก input เพื่อบันทึกค่าใน Zustand
  const handleBlurOrEnter = (
    event:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    if ("key" in event && event.key !== "Enter") return; // เช็คว่าเป็น Key Event และต้องเป็น Enter เท่านั้น

    setIsEditing(false);
    setArtToyData({name : artToyName}); // ✅ อัปเดต Zustand
  };

  return (
    <div className="w-full h-full text-white">
      <div className="md:block lg:flex gap-10">
        {/* Left - Image */}
        <div className="md:w-full lg:w-1/2">
          <img
            src={imageUrl}
            alt="Selected Art Toy"
            className="rounded-lg w-full"
          />
          <div className="mt-8 mb-6 p-2 w-full rounded-lg border border-gray-500">
            <div className="flex justify-between">
              {isEditing ? (
                <input
                  type="text"
                  value={artToyName}
                  onChange={handleNameChange}
                  onBlur={handleBlurOrEnter}
                  onKeyDown={handleBlurOrEnter}
                  autoFocus
                  className="bg-transparent border border-gray-400 rounded px-2 py-1 w-full text-white"
                />
              ) : (
                <p className="font-semibold">{artToyName}</p>
              )}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[13px] p-0 bg-transparent hover:bg-transparent font-medium text-gray-400 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            <p className="text-sm text-gray-400">{artToyData.prompt}</p>
          </div>
        </div>

        {/* Right - Configurations */}
        <div className="w-full">
          {/* Size */}
          <h3 className="font-semibold mb-1">Size</h3>
          <div className="flex justify-between gap-2">
            {["Small", "Medium", "Large"].map((s) => (
              <button
                key={s}
                className={`px-4 w-full text-[14px] py-2 bg-transparent rounded-lg border hover:border-[#63A3C0] hover:bg-transparent ${
                  size === s ? "border-[#0CACF3]" : "border-gray-600"
                }`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Material */}
          <h3 className="font-semibold mt-4 mb-1">Material</h3>
          <div className="flex justify-between gap-2">
            {["PLA", "Resin", "PVC", "Metal"].map((m) => (
              <button
                key={m}
                className={`px-4 w-full text-[14px] py-2 bg-transparent rounded-lg border hover:border-[#63A3C0] hover:bg-transparent ${
                  material === m ? "border-[#0CACF3]" : "border-gray-600"
                }`}
                onClick={() => setMaterial(m)}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Painting */}
          <h3 className="font-semibold mt-4 mb-1">Painting</h3>
          <div className="flex justify-between gap-2">
            {["Hand-painting", "Airbrush", "Pad Printing"].map((p) => (
              <button
                key={p}
                className={`px-4 w-full text-[14px] py-2 bg-transparent rounded-lg border hover:border-[#63A3C0] hover:bg-transparent ${
                  painting === p ? "border-[#0CACF3]" : "border-gray-600"
                }`}
                onClick={() => setPainting(p)}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Assembly */}
          <h3 className="font-semibold mt-4 mb-1">Assembly</h3>
          <div className="flex justify-between gap-2">
            {["Fixed Pose", "Articulated Joints", "Magnet Joints"].map((a) => (
              <button
                key={a}
                className={`px-4 w-full text-[14px] py-2 bg-transparent rounded-lg border hover:border-[#63A3C0] hover:bg-transparent ${
                  assembly === a ? "border-[#0CACF3]" : "border-gray-600"
                }`}
                onClick={() => setAssembly(a)}
              >
                {a}
              </button>
            ))}
          </div>

          {/* Quantity */}
          <h3 className="font-semibold mt-4 mb-1">Quantity</h3>
          <div className="flex items-center justify-between">
            <div className="space-x-4">
              <button
                className="px-3 py-1 bg-transparent hover:bg-transparent border border-gray-700 rounded-lg"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="">{quantity}</span>
              <button
                className="px-3 py-1 bg-transparent hover:bg-transparent border border-gray-600  rounded-lg"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>

            <p className="font-semibold">
              Total price : {totalPrice.toLocaleString()} Baht
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4 gap-4">
            <button className="w-full py-2 bg-[#51536D] hover:bg-[#3E4058] rounded-lg">
              Save
            </button>
            <button className="w-full">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Config;
