import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const GenderCard = ({ gender, image, label, description, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onClick={() => navigate(`/shop/${gender}`)}
      className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[3/4] bg-gray-100"
    >
      {/* Image */}
      <img
        src={image}
        alt={label}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">
          {description}
        </p>
        <h3 className="text-white text-2xl font-black mb-3">{label}</h3>
        <div
          className="inline-flex items-center gap-2 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 group-hover:gap-3"
          style={{ background: "var(--brand-1)" }}
        >
          Shop {label}
          <ArrowRight size={13} />
        </div>
      </div>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{ background: "var(--brand-1)" }}
      />
    </motion.div>
  );
};

export default GenderCard;