import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      onClick={() => navigate(`/shop?category=${category.id}`)}
      className="group relative overflow-hidden rounded-2xl border border-purple-900/20 bg-[#1A1A2E] cursor-pointer hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1.5"
    >
      {/* Category Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] via-[#1A1A2E]/40 to-transparent" />
        {/* Icon */}
        <span className="absolute top-3 right-3 text-2xl">
          {category.icon}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white text-sm font-semibold mb-1">
          {category.name}
        </h3>
        <p className="text-gray-400 text-xs">{category.description}</p>
      </div>

      {/* Purple glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-radial-[ellipse_at_50%_0%] from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default CategoryCard;