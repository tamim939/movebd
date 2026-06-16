import { CATEGORIES, Category } from '../types';

interface CategoryBarProps {
  activeCategory: Category;
  onSelect: (category: Category) => void;
}

export default function CategoryBar({ activeCategory, onSelect }: CategoryBarProps) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-4 no-scrollbar">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`shrink-0 rounded-full px-6 py-2 text-xs font-semibold transition-all ${
            activeCategory === category
              ? "bg-red-600 text-white shadow-lg shadow-red-900/20"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
