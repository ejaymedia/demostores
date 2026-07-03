const items = [
  "Unisex Wears",
  "Sneakers",
  "Slides",
  "Hand & Shoulder Bags",
  "High Heels",
  "Beddings",
  "Bovic Collections",
];

const Marquee = () => {
  return (
    <div className="overflow-hidden bg-purple-950/20 border-y border-purple-900/20 py-3">
      <div className="flex animate-[marquee_18s_linear_infinite] whitespace-nowrap w-max">
        {/* Render twice for seamless loop */}
        {[...items, ...items].map((item, index) => (
          <span key={index} className="inline-flex items-center gap-4 mx-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {item}
            </span>
            <span className="text-amber-400 text-base">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;