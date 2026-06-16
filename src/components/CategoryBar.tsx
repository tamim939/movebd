import { CATEGORIES, Category } from '../types';

interface CategoryBarProps {
  activeCategory: Category;
  onSelect: (category: Category) => void;
}

export default function CategoryBar({ activeCategory, onSelect }: CategoryBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-4 no-scrollbar">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`shrink-0 rounded-full px-5 py-2 text-xs font-bold transition-all ${
            activeCategory === category
              ? "bg-red-600 text-white shadow-md shadow-red-200"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
