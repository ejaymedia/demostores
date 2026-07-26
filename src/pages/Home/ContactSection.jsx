import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { useSite } from "../../context/SiteContext";

const ContactSection = () => {
  const { siteSettings } = useSite();

  const channels = [
    {
      icon: <FaWhatsapp size={18} />,
      label: "WhatsApp Us",
      href: `https://wa.me/${siteSettings.whatsapp}`,
      color: "#16a34a",
      bg: "bg-green-50 hover:bg-green-100 border-green-200",
      text: "text-green-700",
    },
    {
      icon: <FaInstagram size={18} />,
      label: "Instagram",
      href: "https://instagram.com",
      color: "#c026d3",
      bg: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      text: "text-purple-700",
    },
    {
      icon: <FaFacebookF size={18} />,
      label: "Facebook",
      href: "https://facebook.com",
      color: "#1d4ed8",
      bg: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      text: "text-blue-700",
    },
  ];

  const contactDetails = [
    {
      icon: <Phone size={16} />,
      label: "Phone / WhatsApp",
      value: siteSettings.phone,
      href: `tel:${siteSettings.phone}`,
    },
    {
      icon: <Mail size={16} />,
      label: "Email",
      value: siteSettings.email,
      href: `mailto:${siteSettings.email}`,
    },
    {
      icon: <MapPin size={16} />,
      label: "Address",
      value: siteSettings.address,
      href: null,
    },
  ];

  return (
    <div className="bg-white py-20 px-4 sm:px-6 lg:px-10 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-14 text-center"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-1), var(--brand-2))",
          }}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative z-10">
            {/* Label */}
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">
              Get in Touch
            </p>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
              Ready to Shop?
              <br />
              Let's Talk Style.
            </h2>

            {/* Description */}
            <p className="text-white/70 text-base leading-relaxed mb-10 max-w-md mx-auto">
              Reach us directly on WhatsApp or find us on social media for new
              arrivals, exclusive deals, and order placements.
            </p>

            {/* Social channels */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {channels.map((channel, index) => (
                <motion.a
                  key={index}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 bg-white text-gray-800 text-sm font-semibold px-5 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span style={{ color: channel.color }}>{channel.icon}</span>
                  {channel.label}
                </motion.a>
              ))}
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {contactDetails.map((detail, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4"
                >
                  <div className="flex items-center justify-center gap-2 text-white/60 text-xs uppercase tracking-wider mb-2">
                    {detail.icon}
                    {detail.label}
                  </div>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="text-white font-semibold text-sm hover:text-white/80 transition-colors duration-200 break-all"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <p className="text-white font-semibold text-sm">
                      {detail.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactSection;