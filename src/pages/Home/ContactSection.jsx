import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

const channels = [
  {
    icon: <FaWhatsapp size={18} />,
    label: "WhatsApp Us",
    href: "https://wa.me/2347064191600",
  },
  {
    icon: <FaInstagram size={18} />,
    label: "@boviccollection",
    href: "https://instagram.com/boviccollection",
  },
  {
    icon: <FaFacebookF size={18} />,
    label: "Facebook",
    href: "https://facebook.com/ajibadeboluwa",
  },
  {
    icon: <Phone size={18} />,
    label: "080 6845 7238",
    href: "tel:08068457238",
  },
];

const ContactSection = () => {
  return (
    <div className="bg-[#0D0D1A] py-20 px-6 md:px-10 border-t border-purple-900/20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-br from-purple-900/30 to-[#1A1A2E] border border-purple-700/30 rounded-3xl px-8 md:px-14 py-14 text-center"
        >
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-purple-700/15 blur-3xl pointer-events-none" />

          {/* Label */}
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
            Get in Touch
          </p>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
            Ready to Shop?
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Let's Talk Style.
            </span>
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-md mx-auto">
            Reach us directly on WhatsApp or find us on Instagram for new
            arrivals, exclusive deals, and order placements.
          </p>

          {/* Channel buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {channels.map((channel, index) => (
              <motion.a
                key={index}
                href={channel.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-purple-900/40 border border-white/10 hover:border-purple-500/50 text-white text-sm font-medium px-5 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5"
              >
                {channel.icon}
                {channel.label}
              </motion.a>
            ))}
          </div>

          {/* Primary phone */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Primary Contact
            </p>
            <a
              href="https://wa.me/2347064191600"
              target="_blank"
              rel="noreferrer"
              className="text-white text-2xl font-black hover:text-amber-400 transition-colors duration-200"
            >
              +234 706 419 1600
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactSection;