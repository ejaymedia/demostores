import { motion } from "framer-motion";
import { SectionHeader } from "../../components/index";
import {
  ShieldCheck,
  Truck,
  Users,
  Tag,
} from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

const features = [
  {
    icon: <ShieldCheck size={22} className="text-purple-400" />,
    title: "Verified Authentic",
    description:
      "Every item is hand-selected and quality-checked before it reaches you. No fakes, no compromises.",
  },
  {
    icon: <Truck size={22} className="text-purple-400" />,
    title: "Nationwide Delivery",
    description:
      "We deliver to your doorstep anywhere in Nigeria — fast, safe, and with care.",
  },
  {
    icon: <FaWhatsapp size={22} className="text-purple-400" />,
    title: "Direct WhatsApp Orders",
    description:
      "Place your order with a simple WhatsApp message. We respond fast and guide you every step of the way.",
  },
  {
    icon: <Users size={22} className="text-purple-400" />,
    title: "His & Hers Collections",
    description:
      "Unisex and gender-specific styles for every taste — whether dressing casual or going all out.",
  },
  {
    icon: <Tag size={22} className="text-purple-400" />,
    title: "Competitive Pricing",
    description:
      "Premium style doesn't have to break the bank. We offer the best prices on quality fashion in Nigeria.",
  },
  {
    icon: <FaInstagram size={22} className="text-purple-400" />,
    title: "Follow on Instagram",
    description:
      "Stay updated with new arrivals and deals. Follow @boviccollection for daily style inspiration.",
  },
];

const FeaturesSection = () => {
  return (
    <div className="bg-[#0D0D1A] py-20 px-6 md:px-10 border-t border-purple-900/20">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Why Choose Us"
          title="The Bovic Advantage"
          description="Here is what makes shopping with us different from the rest."
          center
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon wrap */}
              <div className="w-11 h-11 rounded-xl bg-purple-900/30 border border-purple-700/30 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-white text-sm font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;