import { motion } from "framer-motion";
import { SectionHeader } from "../../components/index";
import {
  ShieldCheck,
  Truck,
  MessageCircle,
  Users,
  Tag,
  RefreshCw,
} from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={22} />,
    title: "100% Authentic",
    description:
      "Every item is hand-selected and quality-checked before it reaches you. No fakes, no compromises.",
  },
  {
    icon: <Truck size={22} />,
    title: "Nationwide Delivery",
    description:
      "We deliver to your doorstep anywhere in Nigeria — fast, safe, and handled with care.",
  },
  {
    icon: <MessageCircle size={22} />,
    title: "Easy WhatsApp Orders",
    description:
      "Place your order with a simple WhatsApp message. We respond fast and guide you every step of the way.",
  },
  {
    icon: <Users size={22} />,
    title: "Men, Women & Kids",
    description:
      "Carefully curated collections for the whole family — from everyday basics to statement pieces.",
  },
  {
    icon: <Tag size={22} />,
    title: "Best Prices",
    description:
      "Premium fashion doesn't have to break the bank. We offer the best prices on quality fashion in Nigeria.",
  },
  {
    icon: <RefreshCw size={22} />,
    title: "Easy Returns",
    description:
      "Not satisfied? We make returns and exchanges as hassle-free as possible for every customer.",
  },
];

const FeaturesSection = () => {
  return (
    <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SectionHeader
            label="Why Shop With Us"
            title="The Difference You'll Feel"
            description="Here is what makes shopping with us stand out from the rest."
            center
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white"
                style={{ background: "var(--brand-1)" }}
              >
                {feature.icon}
              </div>
              <h3 className="text-gray-900 text-sm font-bold mb-2">
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