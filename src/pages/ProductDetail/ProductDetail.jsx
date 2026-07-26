import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Truck, ShieldCheck, RefreshCw, Ruler } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  Navbar,
  Footer,
  Badge,
  ProductCard,
  BackToTop,
  SizeGuideModal,
} from "../../components/index";
import { products } from "../../data/products";
import { useSite } from "../../context/SiteContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { siteSettings } = useSite();

  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const formatPrice = (amount) => `₦${amount.toLocaleString("en-NG")}`;

  if (!product) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-24">
          <span className="text-6xl mb-4">🔍</span>
          <h2 className="text-gray-900 text-2xl font-black mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            This product does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/shop/men")}
            className="text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 hover:opacity-90"
            style={{ background: "var(--brand-1)" }}
          >
            Back to Shop
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const hasDiscount =
    product.sale_price && product.sale_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.sale_price) / product.price) * 100
      )
    : null;
  const moneySaved = hasDiscount ? product.price - product.sale_price : null;

  const related = products
    .filter(
      (p) =>
        p.gender === product.gender &&
        p.category === product.category &&
        p.id !== product.id
    )
    .slice(0, 4);

  const handleWhatsApp = () => {
    const sizeText = selectedSize ? `Size: ${selectedSize}` : "Size: Not selected";
    const colorText = selectedColor
      ? `Colour: ${selectedColor}`
      : "Colour: Not selected";
    const priceText = hasDiscount
      ? `Price: ${formatPrice(product.sale_price)} (${discountPercent}% off)`
      : `Price: ${formatPrice(product.price)}`;
    const message = `Hi, I'm interested in *${product.name}*.\n${sizeText}\n${colorText}\n${priceText}\nPlease confirm availability.`;
    window.open(
      `https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  const trustBadges = [
    { icon: <Truck size={15} />, label: "Fast Delivery" },
    { icon: <ShieldCheck size={15} />, label: "100% Authentic" },
    { icon: <RefreshCw size={15} />, label: "Easy Returns" },
  ];

  // Use same image repeated for thumbnails until real images come from Supabase
  const images = [
    product.image_url,
    product.image_url,
    product.image_url,
    product.image_url,
  ];

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-24 pb-20">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 flex-wrap">
          <Link
            to="/"
            className="hover:text-gray-700 transition-colors duration-200"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            to={`/shop/${product.gender}`}
            className="hover:text-gray-700 transition-colors duration-200 capitalize"
          >
            {product.gender}
          </Link>
          <span>/</span>
          <Link
            to={`/shop/${product.gender}`}
            className="hover:text-gray-700 transition-colors duration-200 capitalize"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-700">{product.name}</span>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 text-sm font-medium transition-colors duration-200 mb-10"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20">

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square mb-3 border border-gray-100">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {hasDiscount && <Badge type="onSale" />}
                {product.is_new_arrival && !hasDiscount && (
                  <Badge type="newArrival" />
                )}
                {product.is_hot_deal && (
                  <Badge type="hotDeal" />
                )}
                {!product.in_stock && <Badge type="inactive" />}
              </div>
              {/* Discount bubble */}
              {hasDiscount && (
                <div
                  className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg"
                  style={{ background: "var(--brand-1)" }}
                >
                  -{discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`rounded-xl overflow-hidden aspect-square border-2 transition-all duration-200 ${
                    selectedImage === i
                      ? "border-current opacity-100"
                      : "border-transparent opacity-50 hover:opacity-80"
                  }`}
                  style={
                    selectedImage === i
                      ? { borderColor: "var(--brand-1)" }
                      : {}
                  }
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            {/* Tag */}
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "var(--brand-1)" }}
            >
              {product.tag} ·{" "}
              {product.gender.charAt(0).toUpperCase() +
                product.gender.slice(1)}
            </p>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-3">
              {product.name}
            </h1>

            {/* Price */}
            <div
              className={`inline-flex flex-col gap-1 p-4 rounded-2xl mb-6 border ${
                hasDiscount
                  ? "bg-red-50 border-red-100"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              {hasDiscount ? (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      -{discountPercent}% OFF
                    </span>
                  </div>
                  <span
                    className="text-3xl font-black"
                    style={{ color: "var(--brand-1)" }}
                  >
                    {formatPrice(product.sale_price)}
                  </span>
                  <span className="text-green-600 text-sm font-semibold">
                    🎉 You save {formatPrice(moneySaved)}!
                  </span>
                </>
              ) : (
                <span
                  className="text-3xl font-black"
                  style={{ color: "var(--brand-1)" }}
                >
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Sizes */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-900 text-sm font-bold">
                  Select Size
                </p>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200 hover:opacity-80"
                  style={{ color: "var(--brand-1)" }}
                >
                  <Ruler size={13} />
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${
                      selectedSize === size
                        ? "text-white border-current"
                        : "bg-transparent text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900"
                    }`}
                    style={
                      selectedSize === size
                        ? {
                            background: "var(--brand-1)",
                            borderColor: "var(--brand-1)",
                          }
                        : {}
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <p className="text-gray-900 text-sm font-bold mb-3">
                Select Colour
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${
                      selectedColor === color
                        ? "text-white border-current"
                        : "bg-transparent text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900"
                    }`}
                    style={
                      selectedColor === color
                        ? {
                            background: "var(--brand-1)",
                            borderColor: "var(--brand-1)",
                          }
                        : {}
                    }
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsApp}
              className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 mb-4 text-sm"
            >
              <FaWhatsapp size={18} />
              Order on WhatsApp
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {trustBadges.map((badge, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-xl p-3 text-center"
                >
                  <span style={{ color: "var(--brand-1)" }}>
                    {badge.icon}
                  </span>
                  <span className="text-gray-500 text-xs font-medium leading-snug">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <div className="border-t border-gray-100 pt-14 mb-10">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--brand-1)" }}
              >
                You May Also Like
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                Related Products
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {related.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating WhatsApp — mobile only */}
      <div className="fixed bottom-6 left-4 right-4 z-40 flex justify-center lg:hidden">
        <button
          onClick={handleWhatsApp}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-green-900/20 transition-all duration-200 hover:-translate-y-0.5 text-sm"
        >
          <FaWhatsapp size={18} />
          Order on WhatsApp
        </button>
      </div>

      <Footer />
      <BackToTop />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  );
};

export default ProductDetail;