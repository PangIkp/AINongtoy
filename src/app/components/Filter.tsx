import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const filtersData = [
  {
    category: "Character Style",
    options: [
      "Sci-Fi",
      "Fantasy",
      "Cute",
      "Horror",
      "Cyberpunk",
      "Steampunk",
      "Animal",
    ],
  },
  {
    category: "Color",
    options: [
      "Pastel",
      "Monochrome",
      "Dark & Gothic",
      "Vintage",
      "Earth Tone",
      "Rainbow",
    ],
  },
];

export default function Filter() {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: boolean;
  }>({});
  const [openCategories, setOpenCategories] = useState<{
    [key: string]: boolean;
  }>(
    Object.fromEntries(filtersData.map(({ category }) => [category, true])) // ค่าเริ่มต้นเปิดทั้งหมด
  );

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({});
  };

  return (
    <div className="w-64 bg-[#07081C] text-white pt-6 rounded-lg pr-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[25px] font-semibold">Filters</h2>
        <button
          onClick={clearFilters}
          className="bg-transparent hover:bg-transparent text-[14px] font-semibold hover:text-white"
        >
          Clear
        </button>
      </div>
      <hr className="border-gray-600 mb-3" />

      {/* Filter Categories */}
      {filtersData.map(({ category, options }) => (
        <div key={category} className="mb-3">
          {/* Category Title */}
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleCategory(category)}
          >
            <h3 className="text-lg font-semibold">{category}</h3>
            {openCategories[category] ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronUp size={18} />
            )}
          </div>

          {/* Filter Options */}
          {openCategories[category] && (
            <div className="mt-2 space-y-1">
              {options.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={!!selectedFilters[option]}
                    onChange={() => toggleFilter(option)}
                    className="w-4 h-5 border border-gray-500 bg-transparent rounded-sm cursor-pointer focus:ring-0"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
