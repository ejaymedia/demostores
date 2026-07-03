const Badge = ({ type }) => {
  const styles = {
    hotDeal: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    inStock: "bg-green-500/15 text-green-400 border border-green-500/30",
    inactive: "bg-red-500/15 text-red-400 border border-red-500/30",
  };

  const labels = {
    hotDeal: "🔥 Hot Deal",
    inStock: "✓ In Stock",
    inactive: "Out of Stock",
  };

  return (
    <span
      className={`inline-block text-xs font-semibold px-3 py-1 rounded-full tracking-wide ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
};

export default Badge;