const SectionHeader = ({ label, title, description, center = false }) => {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      {label && (
        <p
          className={`text-xs font-bold uppercase tracking-widest mb-3 ${
            center ? "text-center" : ""
          }`}
          style={{ color: "var(--brand-1)" }}
        >
          {label}
        </p>
      )}
      <h2
        className={`text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-3 ${
          center ? "text-center" : ""
        }`}
      >
        {title}
      </h2>
      {center && (
        <div
          className="w-16 h-1 rounded-full mx-auto mb-4"
          style={{
            background: "linear-gradient(90deg, var(--brand-1), var(--brand-2))",
          }}
        />
      )}
      {description && (
        <p
          className={`text-gray-500 text-base leading-relaxed max-w-xl ${
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