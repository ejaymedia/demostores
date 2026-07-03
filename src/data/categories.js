const BASE = import.meta.env.BASE_URL;

export const categories = [
  {
    id: "sneakers",
    name: "Sneakers",
    description: "Trendy & Comfy",
    image: `${BASE}categories/sneakers.jpg`,
    icon: "👟",
  },
  {
    id: "wears",
    name: "Unisex Wears",
    description: "Men & Women",
    image: `${BASE}categories/wears.jpg`,
    icon: "👗",
  },
  {
    id: "slides",
    name: "Slides",
    description: "Casual Everyday",
    image: `${BASE}categories/slides.jpg`,
    icon: "🩴",
  },
  {
    id: "bags",
    name: "Hand & Shoulder Bags",
    description: "Designer Picks",
    image: `${BASE}categories/bags.jpg`,
    icon: "👜",
  },
  {
    id: "heels",
    name: "High Heels",
    description: "Elegant Styles",
    image: `${BASE}categories/heels.jpg`,
    icon: "👠",
  },
  {
    id: "beddings",
    name: "Beddings",
    description: "Luxury Comfort",
    image: `${BASE}categories/beddings.jpg`,
    icon: "🛏️",
  },
];