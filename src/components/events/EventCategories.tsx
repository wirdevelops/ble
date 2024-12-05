import { motion } from 'framer-motion';

interface EventCategoriesProps {
  categories: {
    id: string;
    name: string;
    icon: string;
    count: number;
  }[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function EventCategories({
  categories,
  selectedCategory,
  onSelectCategory,
}: EventCategoriesProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(selectedCategory === category.name ? null : category.name)}
          className={`bg-surface border ${
            selectedCategory === category.name
              ? 'border-primary text-primary'
              : 'border-border text-text hover:border-primary/50'
          } rounded-xl p-4 text-center transition-colors`}
        >
          <div
            className={`w-12 h-12 mx-auto rounded-xl ${
              selectedCategory === category.name ? 'bg-primary/10' : 'bg-primary/5'
            } flex items-center justify-center text-2xl mb-3`}
          >
            {category.icon}
          </div>
          <h3 className="font-medium">{category.name}</h3>
          <p className="text-sm text-text/60 mt-1">{category.count} events</p>
        </motion.button>
      ))}
    </div>
  );
}
