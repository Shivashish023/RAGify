const variants = {
  primary:
    "bg-brand text-white shadow-[var(--shadow-soft)] hover:bg-brand-dark focus-visible:ring-brand/30",
  secondary:
    "border border-border-strong bg-surface text-ink hover:border-brand hover:text-brand focus-visible:ring-brand/20",
  ghost: "text-ink-muted hover:bg-brand-light/60 hover:text-brand",
  danger: "text-danger hover:bg-danger-bg",
};

const sizes = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
