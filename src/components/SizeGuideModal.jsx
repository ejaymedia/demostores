import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = ["Shoes", "Clothing", "Kids"];

const shoesSizes = [
  { size: "36", uk: "3.5", eu: "36", us: "5" },
  { size: "37", uk: "4", eu: "37", us: "6" },
  { size: "38", uk: "5", eu: "38", us: "7" },
  { size: "39", uk: "6", eu: "39", us: "7.5" },
  { size: "40", uk: "6.5", eu: "40", us: "8" },
  { size: "41", uk: "7", eu: "41", us: "8.5" },
  { size: "42", uk: "8", eu: "42", us: "9" },
  { size: "43", uk: "9", eu: "43", us: "10" },
  { size: "44", uk: "10", eu: "44", us: "11" },
  { size: "45", uk: "11", eu: "45", us: "12" },
];

const clothingSizes = [
  { size: "XS", chest: "32–34\"", waist: "26–28\"", hip: "34–36\"" },
  { size: "S", chest: "35–37\"", waist: "29–31\"", hip: "37–39\"" },
  { size: "M", chest: "38–40\"", waist: "32–34\"", hip: "40–42\"" },
  { size: "L", chest: "41–43\"", waist: "35–37\"", hip: "43–45\"" },
  { size: "XL", chest: "44–46\"", waist: "38–40\"", hip: "46–48\"" },
  { size: "XXL", chest: "47–49\"", waist: "41–43\"", hip: "49–51\"" },
];

const kidsSizes = [
  { size: "2–3Y", height: "92–98cm", chest: "53–55cm", waist: "51–52cm" },
  { size: "4–5Y", height: "104–110cm", chest: "57–59cm", waist: "53–54cm" },
  { size: "6–7Y", height: "116–122cm", chest: "61–63cm", waist: "55–57cm" },
  { size: "8–9Y", height: "128–134cm", chest: "65–68cm", waist: "58–60cm" },
  { size: "10–11Y", height: "140–146cm", chest: "71–74cm", waist: "62–64cm" },
  { size: "12–13Y", height: "152–158cm", chest: "77–80cm", waist: "65–67cm" },
];

const thClass =
  "text-left text-xs font-bold uppercase tracking-wider text-gray-500 py-3 px-4 bg-gray-50 border-b border-gray-100";
const tdClass =
  "text-sm text-gray-700 py-3 px-4 border-b border-gray-50";
const trClass = "hover:bg-gray-50/60 transition-colors duration-100";

const SizeGuideModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("Shoes");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25 }}
            className="relative bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-gray-900 font-bold text-lg">
                  Size Guide
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  Find your perfect fit
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 transition-colors duration-200 p-1"
                aria-label="Close size guide"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-6 pt-3 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all duration-200 border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-current text-current"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                  style={
                    activeTab === tab ? { color: "var(--brand-1)", borderColor: "var(--brand-1)" } : {}
                  }
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1">

              {/* Shoes Tab */}
              {activeTab === "Shoes" && (
                <div>
                  <p className="text-xs text-gray-400 px-6 py-3 border-b border-gray-50">
                    All measurements in standard international sizing.
                  </p>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className={thClass}>Size</th>
                        <th className={thClass}>UK</th>
                        <th className={thClass}>EU</th>
                        <th className={thClass}>US</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shoesSizes.map((row) => (
                        <tr key={row.size} className={trClass}>
                          <td className={`${tdClass} font-semibold text-gray-900`}>
                            {row.size}
                          </td>
                          <td className={tdClass}>{row.uk}</td>
                          <td className={tdClass}>{row.eu}</td>
                          <td className={tdClass}>{row.us}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Clothing Tab */}
              {activeTab === "Clothing" && (
                <div>
                  <p className="text-xs text-gray-400 px-6 py-3 border-b border-gray-50">
                    Measurements are in inches. For the best fit, measure over
                    your undergarments.
                  </p>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className={thClass}>Size</th>
                        <th className={thClass}>Chest</th>
                        <th className={thClass}>Waist</th>
                        <th className={thClass}>Hip</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clothingSizes.map((row) => (
                        <tr key={row.size} className={trClass}>
                          <td className={`${tdClass} font-semibold text-gray-900`}>
                            {row.size}
                          </td>
                          <td className={tdClass}>{row.chest}</td>
                          <td className={tdClass}>{row.waist}</td>
                          <td className={tdClass}>{row.hip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Kids Tab */}
              {activeTab === "Kids" && (
                <div>
                  <p className="text-xs text-gray-400 px-6 py-3 border-b border-gray-50">
                    Kids sizing is based on age and height. Measurements are in
                    centimetres.
                  </p>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className={thClass}>Age</th>
                        <th className={thClass}>Height</th>
                        <th className={thClass}>Chest</th>
                        <th className={thClass}>Waist</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kidsSizes.map((row) => (
                        <tr key={row.size} className={trClass}>
                          <td className={`${tdClass} font-semibold text-gray-900`}>
                            {row.size}
                          </td>
                          <td className={tdClass}>{row.height}</td>
                          <td className={tdClass}>{row.chest}</td>
                          <td className={tdClass}>{row.waist}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer note */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400 text-center">
                Not sure about your size?{" "}
                <a
                  href="https://wa.me"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline"
                  style={{ color: "var(--brand-1)" }}
                >
                  Chat with us on WhatsApp
                </a>{" "}
                and we'll help you find the perfect fit.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SizeGuideModal;