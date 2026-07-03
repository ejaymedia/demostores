import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Truck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar, Footer, Badge, ProductCard } from "../../components/index";
import { products } from "../../data/products";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  if (!product) {
    return (
      <div className="bg-[#0F0F1A] min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-24">
          <span className="text-6xl mb-4">🔍</span>
          <h2 className="text-white text-2xl font-black mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            This product does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200"
          >
            Back to Shop
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleWhatsApp = () => {
    const sizeText = selectedSize ? `Size: ${selectedSize}` : "Size: Not selected";
    const colorText = selectedColor ? `Colour: ${selectedColor}` : "Colour: Not selected";
    const message = `Hi, I'm interested in your *${product.name}*.\n${sizeText}\n${colorText}\nPlease let me know the price and availability.`;
    window.open(
      `https://wa.me/2347064191600?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="bg-[#0F0F1A] min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-20">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          <Link
            to={`/shop?category=${product.category}`}
            className="hover:text-white transition-colors capitalize"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-300">{product.name}</span>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200 mb-10"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-3xl overflow-hidden bg-[#1A1A2E] border border-purple-900/20 aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/60 via-transparent to-transparent" />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.hotDeal && <Badge type="hotDeal" />}
                {product.inStock ? (
                  <Badge type="inStock" />
                ) : (
                  <Badge type="inactive" />
                )}
              </div>
            </div>

            {/* Thumbnail row — same image repeated for now */}
            <div className="grid grid-cols-4 gap-3 mt-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-xl overflow-hidden border aspect-square cursor-pointer transition-all duration-200 ${
                    i === 0
                      ? "border-purple-500"
                      : "border-purple-900/20 opacity-50 hover:opacity-100"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            {/* Tag + Name */}
            <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
              {product.tag}
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
              {product.name}
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              {product.category.charAt(0).toUpperCase() +
                product.category.slice(1)}{" "}
              · {product.gender}
            </p>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Sizes */}
            <div className="mb-6">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">
                Available Sizes
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-purple-700 text-white border-purple-600"
                        : "bg-transparent text-gray-400 border-white/10 hover:border-purple-500/40 hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">
                Colour
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${
                      selectedColor === color
                        ? "bg-purple-700 text-white border-purple-600"
                        : "bg-transparent text-gray-400 border-white/10 hover:border-purple-500/40 hover:text-white"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Price + CTA */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-white text-lg font-bold">
                DM for Price
              </span>
              <button
                onClick={handleWhatsApp}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5"
              >
                <MessageCircle size={18} />
                Order on WhatsApp
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
                <Truck size={16} className="text-purple-400 shrink-0" />
                <span className="text-gray-400 text-xs leading-snug">
                  Nationwide delivery available
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
                <ShieldCheck size={16} className="text-purple-400 shrink-0" />
                <span className="text-gray-400 text-xs leading-snug">
                  100% authentic products
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <div className="border-t border-purple-900/20 pt-14 mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
                You May Also Like
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                Related Products
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;