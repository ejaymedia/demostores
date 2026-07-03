const SectionHeader = ({ label, title, description, center = false }) => {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      <p
        className={`text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 ${
          center ? "text-center" : ""
        }`}
      >
        {label}
      </p>
      <h2
        className={`text-3xl md:text-4xl font-black text-white leading-tight mb-4 ${
          center ? "text-center" : ""
        }`}
      >
        {title}
      </h2>
      {center && (
        <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4" />
      )}
      {description && (
        <p
          className={`text-gray-400 text-base leading-relaxed max-w-xl ${
            center ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;