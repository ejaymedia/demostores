import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  Users,
  Heart,
  Star,
  MessageCircle,
} from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { Navbar, Footer, BackToTop } from "../../components/index";
import { useSite } from "../../context/SiteContext";

const values = [
  {
    icon: <ShieldCheck size={22} />,
    title: "Authenticity First",
    description:
      "Every product we sell is 100% genuine. We hand-select and quality-check every item before it goes on sale.",
  },
  {
    icon: <Heart size={22} />,
    title: "Customer Love",
    description:
      "Our customers are at the heart of everything we do. We go the extra mile to make every shopping experience seamless and enjoyable.",
  },
  {
    icon: <Star size={22} />,
    title: "Style for Everyone",
    description:
      "Fashion is for everyone. We curate collections for Men, Women, and Kids so the whole family can look their best.",
  },
  {
    icon: <Truck size={22} />,
    title: "Reliable Delivery",
    description:
      "We deliver nationwide across Nigeria with speed, care, and real-time tracking so you always know where your order is.",
  },
  {
    icon: <Users size={22} />,
    title: "Community Focused",
    description:
      "We're proud to serve Nigerian communities with premium fashion at prices that make sense for everyday people.",
  },
  {
    icon: <MessageCircle size={22} />,
    title: "Always Accessible",
    description:
      "Got a question? We're always a WhatsApp message away. Fast responses, honest answers, no runaround.",
  },
];

const stats = [
  { value: "500+", label: "Happy Customers" },
  { value: "3", label: "Collections" },
  { value: "100%", label: "Authentic Products" },
  { value: "🇳🇬", label: "Nationwide Delivery" },
];

const About = () => {
  const { siteSettings } = useSite();
  const navigate = useNavigate();

  // Logo component — responsive, no text beside it
  const AboutLogo = () => {
    if (!siteSettings.logo_url) {
      return (
        <span className="text-white text-2xl font-black">
          {siteSettings.business_name}
        </span>
      );
    }
    return (
      <img
        src={siteSettings.logo_url}
        alt={siteSettings.business_name}
        className="h-16 w-auto object-contain mx-auto"
        style={{ maxWidth: "200px", maxHeight: "64px" }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <div
        className="pt-24 pb-20 px-4 sm:px-6 lg:px-10 text-center relative overflow-hidden"
        style={{ background: "var(--brand-1)" }}
      >
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3">
            Our Story
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            About{" "}
            <span className="text-white/80">
              {siteSettings.business_name}
            </span>
          </h1>
          <p className="text-white/70 text-base max-w-xl mx-auto leading-relaxed">
            {siteSettings.tagline}
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-12 border-b border-gray-100">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div
                className="text-3xl sm:text-4xl font-black mb-1"
                style={{ color: "var(--brand-1)" }}
              >
                {stat.value}
              </div>
              <div className="text-gray-400 text-xs font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Story section */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-b border-gray-100">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "var(--brand-1)" }}
            >
              Who We Are
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6">
              Fashion Made
              <br />
              Accessible
            </h2>
            <div className="flex flex-col gap-4 text-gray-500 text-sm leading-relaxed">
              <p>
                {siteSettings.business_name} was born from a simple belief —
                that everyone deserves access to quality fashion without
                compromise. We started as a small operation with a big dream:
                to bring premium clothing, shoes, bags, and accessories to
                everyday Nigerians at fair prices.
              </p>
              <p>
                What sets us apart is our commitment to authenticity. In a
                market flooded with counterfeits, we hand-select every single
                product we carry. If it doesn't meet our standards, it doesn't
                make it to our store.
              </p>
              <p>
                Today, we serve hundreds of happy customers across Nigeria,
                delivering everything from everyday basics to statement pieces
                — for Men, Women, and Kids. And we're just getting started.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div
              className="rounded-3xl p-10 text-center relative overflow-hidden"
              style={{ background: "var(--brand-1)" }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 70%, white 1px, transparent 1px), radial-gradient(circle at 70% 30%, white 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />
              <div className="relative z-10">
                <div className="mb-5 flex items-center justify-center">
                  <AboutLogo />
                </div>
                <h3 className="text-white text-xl font-black mb-2">
                  {siteSettings.business_name}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">
                  {siteSettings.tagline}
                </p>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={15} />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
                    aria-label="Facebook"
                  >
                    <FaFacebookF size={15} />
                  </a>
                  <a
                    href={`https://wa.me/${siteSettings.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp size={15} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="py-16 border-b border-gray-100">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "var(--brand-1)" }}
            >
              What We Stand For
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Our Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white"
                  style={{ background: "var(--brand-1)" }}
                >
                  {value.icon}
                </div>
                <h3 className="text-gray-900 text-sm font-bold mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "var(--brand-1)" }}
            >
              Get in Touch
            </p>
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              Ready to Shop?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Browse our collections and find your perfect style. Got
              questions? We're always a WhatsApp message away.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate("/shop/men")}
                className="w-full sm:w-auto text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 text-sm"
                style={{ background: "var(--brand-1)" }}
              >
                Browse Collections
              </button>
              <a
                href={`https://wa.me/${siteSettings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 text-sm"
              >
                <FaWhatsapp size={16} />
                Chat on WhatsApp
              </a>
            </div>

            {/* Contact details */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm">
              {siteSettings.phone && (
                <a
                  href={`tel:${siteSettings.phone}`}
                  className="text-gray-400 hover:text-gray-700 transition-colors duration-200"
                >
                  📞 {siteSettings.phone}
                </a>
              )}
              {siteSettings.email && (
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="text-gray-400 hover:text-gray-700 transition-colors duration-200"
                >
                  ✉️ {siteSettings.email}
                </a>
              )}
              {siteSettings.address && (
                <span className="text-gray-400">
                  📍 {siteSettings.address}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default About;