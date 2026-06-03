const variants = {
  primary:
    "bg-linear-to-r from-brand to-brand-glow text-white shadow-[var(--shadow-glow)] hover:brightness-110 hover:shadow-[0_0_22px_rgba(99,102,241,0.35)] active:scale-[0.98] focus-visible:ring-brand/30",
  secondary:
    "border border-border bg-surface-raised/40 backdrop-blur-md text-white hover:border-brand/60 hover:bg-brand/10 hover:text-white active:scale-[0.98] focus-visible:ring-brand/20",
  ghost: "text-ink-muted hover:bg-white/5 hover:text-white active:scale-[0.97]",
  danger: "text-danger border border-transparent hover:border-danger/20 hover:bg-danger-bg/20 active:scale-[0.98]",
};

const sizes = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-sm",
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
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
