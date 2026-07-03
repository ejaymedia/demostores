import { motion } from "framer-motion";
import { SectionHeader } from "../../components/index";
import { ShieldCheck, Truck, Users } from "lucide-react";

const stats = [
  {
    icon: <ShieldCheck size={20} className="text-purple-400" />,
    value: "100%",
    label: "Authentic Products",
  },
  {
    icon: <Truck size={20} className="text-purple-400" />,
    value: "🇳🇬",
    label: "Nationwide Delivery",
  },
  {
    icon: <Users size={20} className="text-purple-400" />,
    value: "6+",
    label: "Product Categories",
  },
];

const AboutSection = () => {
  return (
    <div className="bg-[#0F0F1A] py-20 px-6 md:px-10 border-t border-purple-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <SectionHeader
              label="About Bovic"
              title={
                <>
                  Style for Every Story,
                  <br />
                  Budget for Everyone
                </>
              }
              description="We believe great fashion should never be out of reach. Bovic Collections brings you carefully selected pieces — from the streets to the runway — delivered with care across Nigeria."
            />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[#1A1A2E] border border-purple-900/20 rounded-2xl p-4 text-center"
                >
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <div className="text-white text-xl font-black mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-xs leading-snug">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex items-center justify-center"
          >
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border border-purple-700/30 animate-[spin_20s_linear_infinite]">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-purple-500" />
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-400" />
              </div>
              {/* Inner glow orb */}
              <div className="absolute inset-6 rounded-full bg-gradient-to-br from-purple-900/60 to-[#1A1A2E] border border-purple-700/20 flex flex-col items-center justify-center gap-2 shadow-2xl shadow-purple-900/30">
                <img
                  src={`${import.meta.env.BASE_URL}logo/logo.png`}
                  alt="Bovic Collections"
                  className="w-20 h-20 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span className="text-white font-black text-lg tracking-tight bg-gradient-to-r from-red-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent">
                  BC
                </span>
                <span className="text-gray-400 text-xs text-center px-4 leading-relaxed">
                  Fashion & Lifestyle
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AboutSection;