const BASE = import.meta.env.BASE_URL;

export const products = [
  // ── SNEAKERS ──────────────────────────────────────────
  {
    id: "1",
    name: "Air Trainer Pro",
    category: "sneakers",
    gender: "Unisex",
    description:
      "High-fashion sneakers built for the streets. Lightweight, bold design with premium cushioning for all-day comfort. Perfect for casual outings and streetwear fits.",
    image: `${BASE}categories/sneakers.jpg`,
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
    colors: ["Black", "White", "Red"],
    hotDeal: true,
    inStock: true,
    tag: "Footwear",
  },
  {
    id: "2",
    name: "Classic Runner",
    category: "sneakers",
    gender: "Unisex",
    description:
      "Clean, minimal runner silhouette that pairs effortlessly with any outfit. Durable sole and breathable upper make these a wardrobe staple.",
    image: `${BASE}categories/sneakers.jpg`,
    sizes: ["38", "39", "40", "41", "42", "43"],
    colors: ["White", "Grey"],
    hotDeal: false,
    inStock: true,
    tag: "Footwear",
  },

  // ── UNISEX WEARS ───────────────────────────────────────
  {
    id: "3",
    name: "GG Tracksuit",
    category: "wears",
    gender: "Unisex",
    description:
      "Premium designer-inspired tracksuit with signature monogram print. Soft fabric, relaxed fit, and a sleek silhouette that works from the gym to the streets.",
    image: `${BASE}categories/wears.jpg`,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black/Gold", "Navy/White"],
    hotDeal: true,
    inStock: true,
    tag: "Clothing",
  },
  {
    id: "4",
    name: "Oversized Tee",
    category: "wears",
    gender: "Unisex",
    description:
      "Heavyweight oversized tee with a dropped shoulder cut. Made from 100% cotton for a premium feel. Available in multiple colorways.",
    image: `${BASE}categories/wears.jpg`,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Beige"],
    hotDeal: false,
    inStock: true,
    tag: "Clothing",
  },

  // ── SLIDES ─────────────────────────────────────────────
  {
    id: "5",
    name: "Classic Slides",
    category: "slides",
    gender: "Unisex",
    description:
      "Minimalist pool slides with a thick cushioned sole for maximum comfort. Wear indoors or outdoors — these go with everything.",
    image: `${BASE}categories/slides.jpg`,
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    colors: ["Black", "White", "Brown"],
    hotDeal: false,
    inStock: true,
    tag: "Footwear",
  },
  {
    id: "6",
    name: "Designer Band Slides",
    category: "slides",
    gender: "Unisex",
    description:
      "Luxury-inspired slides with a wide logo band upper. Padded footbed and slip-resistant base. A statement piece for relaxed days.",
    image: `${BASE}categories/slides.jpg`,
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Black/Gold", "White/Silver"],
    hotDeal: true,
    inStock: true,
    tag: "Footwear",
  },

  // ── BAGS ───────────────────────────────────────────────
  {
    id: "7",
    name: "LV Shoulder Bag",
    category: "bags",
    gender: "Women",
    description:
      "Designer-inspired shoulder bag with iconic monogram canvas. Spacious interior with zip closure, adjustable strap, and gold-tone hardware.",
    image: `${BASE}categories/bags.jpg`,
    sizes: ["One Size"],
    colors: ["Brown/Gold", "Black/Silver"],
    hotDeal: true,
    inStock: true,
    tag: "Bags",
  },
  {
    id: "8",
    name: "Mini Hand Bag",
    category: "bags",
    gender: "Women",
    description:
      "Compact structured handbag perfect for evenings out. Top handle with detachable crossbody strap. Fits your essentials in style.",
    image: `${BASE}categories/bags.jpg`,
    sizes: ["One Size"],
    colors: ["Black", "Nude", "Red"],
    hotDeal: false,
    inStock: true,
    tag: "Bags",
  },

  // ── HIGH HEELS ─────────────────────────────────────────
  {
    id: "9",
    name: "Red Sole Stilettos",
    category: "heels",
    gender: "Women",
    description:
      "Iconic pointed-toe stilettos with a signature red sole. Sky-high heel with ankle strap for secure fit. Turn every entrance into a statement.",
    image: `${BASE}categories/heels.jpg`,
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["Black", "Nude", "Red"],
    hotDeal: true,
    inStock: true,
    tag: "Footwear",
  },
  {
    id: "10",
    name: "Block Heel Mules",
    category: "heels",
    gender: "Women",
    description:
      "Comfortable block heel mules with an open toe design. Easy slip-on style that pairs perfectly with dresses, trousers, or jeans.",
    image: `${BASE}categories/heels.jpg`,
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: ["White", "Black", "Camel"],
    hotDeal: false,
    inStock: true,
    tag: "Footwear",
  },

  // ── BEDDINGS ───────────────────────────────────────────
  {
    id: "11",
    name: "Denim Bedding Set",
    category: "beddings",
    gender: "Unisex",
    description:
      "Luxury denim-finish bedding set with duvet cover, two pillowcases, and fitted sheet. Soft to touch, easy to wash, and stylish in any bedroom.",
    image: `${BASE}categories/beddings.jpg`,
    sizes: ["Single", "Double", "King"],
    colors: ["Blue Denim", "Grey Denim"],
    hotDeal: true,
    inStock: true,
    tag: "Home",
  },
  {
    id: "12",
    name: "Royal Velvet Set",
    category: "beddings",
    gender: "Unisex",
    description:
      "Plush velvet bedding set for the ultimate luxury sleep experience. Complete set includes duvet cover, pillowcases, and bed runner.",
    image: `${BASE}categories/beddings.jpg`,
    sizes: ["Double", "King"],
    colors: ["Burgundy", "Navy", "Emerald"],
    hotDeal: false,
    inStock: true,
    tag: "Home",
  },
];