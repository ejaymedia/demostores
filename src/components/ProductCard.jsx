import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Badge from "./Badge";

const ProductCard = ({ product, index = 0 }) => {
  const navigate = useNavigate();

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : null;
  const moneySaved = hasDiscount ? product.price - product.sale_price : null;

  const formatPrice = (amount) =>
    `₦${amount.toLocaleString("en-NG")}`;

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const message = `Hi, I'm interested in *${product.name}* (${
      product.gender.charAt(0).toUpperCase() + product.gender.slice(1)
    } · ${product.category}). Please let me know the availability.`;
    window.open(
      `https://wa.me/${
        import.meta.env.VITE_WHATSAPP_NUMBER || "2340000000000"
      }?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-gray-200/60 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && <Badge type="onSale" />}
          {product.is_new_arrival && !hasDiscount && (
            <Badge type="newArrival" />
          )}
          {product.is_hot_deal && !hasDiscount && !product.is_new_arrival && (
            <Badge type="hotDeal" />
          )}
          {!product.in_stock && <Badge type="inactive" />}
        </div>

        {/* Discount percent bubble */}
        {hasDiscount && (
          <div
            className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shadow-md"
            style={{ background: "var(--brand-1)" }}
          >
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-1"
          style={{ color: "var(--brand-1)" }}
        >
          {product.tag} · {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}
        </p>
        <h3 className="text-gray-900 text-sm font-semibold mb-1 leading-snug line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Price */}
        <div className="mb-4">
          {hasDiscount ? (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-red-500 text-xs font-bold">
                  -{discountPercent}%
                </span>
              </div>
              <span
                className="text-base font-black"
                style={{ color: "var(--brand-1)" }}
              >
                {formatPrice(product.sale_price)}
              </span>
              <span className="text-green-600 text-xs font-medium">
                You save {formatPrice(moneySaved)}!
              </span>
            </div>
          ) : (
            <span
              className="text-base font-black"
              style={{ color: "var(--brand-1)" }}
            >
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Order Button */}
        <button
          onClick={handleWhatsApp}
          className="w-full text-white text-xs font-semibold py-2.5 rounded-full transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: "var(--brand-1)" }}
        >
          Order on WhatsApp
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;