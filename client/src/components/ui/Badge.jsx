const variants = {
  success: "bg-success-bg/60 border border-success/30 text-success",
  warning: "bg-accent-soft/60 border border-accent/30 text-accent",
  neutral: "bg-brand-light/60 border border-brand/30 text-white",
  danger: "bg-danger-bg/60 border border-danger/30 text-danger",
};

function Badge({ children, variant = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
