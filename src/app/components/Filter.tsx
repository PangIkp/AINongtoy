import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Replicate from "replicate"; // ใช้ Replicate API

const replicate = new Replicate({
  auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN, // ใช้ API Token จาก Replicate
});

const filtersData = [
  {
    category: "Character Style",
    options: ["Sci-Fi", "Fantasy", "Cute", "Horror", "Cyberpunk", "Steampunk", "Animal"],
  },
  {
    category: "Color",
    options: ["Pastel", "Monochrome", "Dark & Gothic", "Vintage", "Earth Tone", "Rainbow"],
  },
];

export default function Filter() {
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: boolean }>({});
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(filtersData.map(({ category }) => [category, true]))
  );
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  const clearFilters = () => {
    setSelectedFilters({});
    setImageUrl(null);
  };

  // ✅ สร้าง Prompt จากฟิลเตอร์ที่เลือก
  const generatePrompt = () => {
    const selected = Object.keys(selectedFilters).filter((key) => selectedFilters[key]);
    if (selected.length === 0) return "A creative art toy"; // Default

    const characterStyle = selected.find((s) =>
      filtersData[0].options.includes(s)
    );
    const colorStyle = selected.find((s) => filtersData[1].options.includes(s));

    return `A ${characterStyle || "stylish"} character in ${colorStyle || "vibrant"} style, highly detailed, masterpiece, trending on ArtStation`;
  };

  const generateImage = async () => {
    setLoading(true);
    const prompt = generatePrompt();
  
    try {
      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Authorization": `Token ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: "prompthero/openjourney-v4",
          input: { prompt: prompt, width: 1024, height: 1024, num_inference_steps: 50 },
        }),
      });
  
      // 🔹 แปลง response เป็น JSON
      const result = await response.json();
  
      console.log("API Response:", result); // ✅ ตรวจสอบค่าที่ได้จาก API
  
      // 🔹 ตรวจสอบว่า result มีข้อมูลหรือไม่
      if (result && result.output && result.output.length > 0) {
        setImageUrl(result.output[0]); // ✅ ใช้ result.output[0] เพื่อดึง URL ของภาพ
      } else {
        console.error("No image URL found in response");
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="w-64 bg-[#07081C] text-white pt-6 rounded-lg pr-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[25px] font-semibold">Filters</h2>
        <button onClick={clearFilters} className="text-[14px] font-semibold">
          Clear
        </button>
      </div>
      <hr className="border-gray-600 mb-3" />

      {/* Filter Categories */}
      {filtersData.map(({ category, options }) => (
        <div key={category} className="mb-3">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleCategory(category)}>
            <h3 className="text-lg font-semibold">{category}</h3>
            {openCategories[category] ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </div>
          {openCategories[category] && (
            <div className="mt-2 space-y-1">
              {options.map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!selectedFilters[option]}
                    onChange={() => toggleFilter(option)}
                    className="w-4 h-5 border border-gray-500 bg-transparent rounded-sm"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* ปุ่ม Generate */}
      {/* <button
        onClick={generateImage}
        className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button> */}

      {/* แสดงภาพที่สร้าง */}
      {/* {imageUrl && (
        <div className="mt-6">
          <img src={imageUrl} alt="Generated Art Toy" className="w-full rounded-lg" />
        </div>
      )} */}
    </div>
  );
}
