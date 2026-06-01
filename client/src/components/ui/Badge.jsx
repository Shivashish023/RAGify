const variants = {
  success: "bg-success-bg text-success",
  warning: "bg-accent-soft text-accent",
  neutral: "bg-brand-light text-brand-dark",
  danger: "bg-danger-bg text-danger",
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
