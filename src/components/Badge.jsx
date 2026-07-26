const Badge = ({ type }) => {
  const styles = {
    newArrival: "bg-blue-50 text-blue-600 border border-blue-200",
    hotDeal: "bg-amber-50 text-amber-600 border border-amber-200",
    onSale: "bg-red-50 text-red-600 border border-red-200",
    inStock: "bg-green-50 text-green-600 border border-green-200",
    inactive: "bg-gray-100 text-gray-500 border border-gray-200",
  };

  const labels = {
    newArrival: "🆕 New",
    hotDeal: "🔥 Hot Deal",
    onSale: "🏷️ Sale",
    inStock: "✓ In Stock",
    inactive: "Out of Stock",
  };

  if (!styles[type]) return null;

  return (
    <span
      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
};

export default Badge;