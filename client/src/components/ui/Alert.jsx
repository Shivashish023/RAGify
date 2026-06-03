function Alert({ children, variant = "error" }) {
  const styles = {
    error: "border-danger/30 bg-danger-bg/50 text-danger",
    success: "border-success/30 bg-success-bg/50 text-success",
    info: "border-brand/30 bg-brand-light/50 text-white",
  };

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles[variant]}`}>
      {children}
    </div>
  );
}

export default Alert;
