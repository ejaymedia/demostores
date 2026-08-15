import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Navbar, Footer, BackToTop } from "../../components/index";
import { useSite } from "../../context/SiteContext";

const faqs = [
  {
    category: "Orders & Payment",
    items: [
      {
        q: "How do I place an order?",
        a: "Simply find the product you love, select your size and colour, then click 'Order on WhatsApp'. You'll be redirected to WhatsApp with your order details pre-filled. Our team will confirm availability and payment details.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept bank transfers, USSD payments, and cash on delivery in select areas. Our team will provide full payment details once you place your order via WhatsApp.",
      },
      {
        q: "Can I order multiple items at once?",
        a: "Yes! You can order multiple items. Simply reach out to us on WhatsApp with the details of all the items you want, and we'll process everything together.",
      },
      {
        q: "How long does it take to confirm my order?",
        a: "We typically confirm orders within 30 minutes to 2 hours during business hours (9am–8pm, Monday to Saturday). Orders placed outside these hours will be confirmed the next morning.",
      },
    ],
  },
  {
    category: "Delivery",
    items: [
      {
        q: "Do you deliver nationwide?",
        a: "Yes, we deliver to all states across Nigeria. Delivery fees and timelines vary depending on your location. Lagos deliveries typically take 1–2 business days, while other states take 2–5 business days.",
      },
      {
        q: "How much does delivery cost?",
        a: "Delivery costs depend on your location and the size of your order. Our team will provide the exact delivery fee when you place your order on WhatsApp.",
      },
      {
        q: "Can I track my order?",
        a: "Yes! Once your order is dispatched, we'll send you a tracking number via WhatsApp so you can monitor your delivery in real time.",
      },
      {
        q: "Do you offer same-day delivery?",
        a: "Same-day delivery is available in select areas for orders placed before 12pm. Contact us on WhatsApp to confirm if same-day delivery is available for your location.",
      },
    ],
  },
  {
    category: "Products & Sizing",
    items: [
      {
        q: "How do I know which size to order?",
        a: "Each product page has a Size Guide button that shows detailed size charts for Shoes, Clothing, and Kids items. If you're still unsure, reach out to us on WhatsApp and we'll help you find the perfect fit.",
      },
      {
        q: "Are your products authentic?",
        a: "Absolutely. Every item we sell is 100% authentic. We hand-select and quality-check all products before listing them. We do not sell replicas or counterfeit items.",
      },
      {
        q: "What if a product is out of stock?",
        a: "If a product is marked as out of stock, you can still reach out to us on WhatsApp to ask about restocking timelines. We frequently restock popular items.",
      },
      {
        q: "Do the product photos show the exact item I'll receive?",
        a: "Yes — all product photos show the actual items we have in stock. Colours may appear slightly different depending on your screen settings.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 7 days of delivery for items that are unworn, unwashed, and in their original condition with tags attached. Contact us on WhatsApp to initiate a return.",
      },
      {
        q: "Can I exchange an item for a different size?",
        a: "Yes! If the size doesn't fit, we'll happily exchange it for the right size subject to availability. Reach out to us on WhatsApp within 7 days of receiving your order.",
      },
      {
        q: "Who pays for return shipping?",
        a: "For size exchanges, we cover the cost of the replacement shipping. For other returns, the customer is responsible for return shipping costs unless the item was damaged or incorrect.",
      },
      {
        q: "What if I receive a damaged or wrong item?",
        a: "We're sorry if that happens! Please contact us on WhatsApp immediately with photos of the issue. We'll resolve it quickly — either with a replacement or full refund.",
      },
    ],
  },
];

const FAQItem = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-gray-50"
      >
        <span className="text-gray-900 text-sm font-semibold leading-snug">
          {item.q}
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-400 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-50">
              <p className="text-gray-500 text-sm leading-relaxed pt-4">
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const { siteSettings } = useSite();
  const [activeCategory, setActiveCategory] = useState("All");

  const allCategories = ["All", ...faqs.map((f) => f.category)];

  const visibleFaqs =
    activeCategory === "All"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <div
        className="pt-24 pb-16 px-4 sm:px-6 lg:px-10 text-center relative overflow-hidden"
        style={{ background: "var(--brand-1)" }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3">
            Help Center
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Frequently Asked
            <br />
            Questions
          </h1>
          {siteSettings.business_name && (
            <p className="text-white/70 text-base max-w-md mx-auto leading-relaxed">
              Everything you need to know about shopping with{" "}
              {siteSettings.business_name}. Can't find the answer? Reach us
              on WhatsApp.
            </p>
          )}
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${
                activeCategory === cat
                  ? "text-white border-current"
                  : "bg-transparent text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900"
              }`}
              style={
                activeCategory === cat
                  ? {
                      background: "var(--brand-1)",
                      borderColor: "var(--brand-1)",
                    }
                  : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Categories */}
        <div className="flex flex-col gap-10">
          {visibleFaqs.map((section, sIndex) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sIndex * 0.08 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "var(--brand-1)" }}
              >
                {section.category}
              </h2>
              <div className="flex flex-col gap-3">
                {section.items.map((item, iIndex) => (
                  <FAQItem key={iIndex} item={item} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still have questions CTA */}
        {siteSettings.whatsapp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 text-center rounded-3xl p-10 relative overflow-hidden"
            style={{ background: "var(--brand-1)" }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="relative z-10">
              <p className="text-white text-xl font-black mb-2">
                Still have questions?
              </p>
              <p className="text-white/70 text-sm mb-6">
                Our team is available on WhatsApp to help you with anything.
              </p>
              <a
                href={`https://wa.me/${siteSettings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white text-sm font-bold px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ color: "var(--brand-1)" }}
              >
                💬 Chat with us on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default FAQ;