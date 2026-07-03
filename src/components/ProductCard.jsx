import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Badge from "./Badge";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const message = `Hi, I'm interested in your *${product.name}* (${product.category}). Please let me know the price and availability.`;
    window.open(
      `https://wa.me/2347064191600?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group relative bg-[#1C1C2E] border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-purple-500/40 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C2E] via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.hotDeal && <Badge type="hotDeal" />}
          {!product.inStock && <Badge type="inactive" />}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">
          {product.tag}
        </p>
        <h3 className="text-white text-sm font-semibold mb-1 leading-snug">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-xs font-medium">
            DM for price
          </span>
          <button
            onClick={handleWhatsApp}
            className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Order Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;