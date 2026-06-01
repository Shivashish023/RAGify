function Alert({ children, variant = "error" }) {
  const styles = {
    error: "border-danger/20 bg-danger-bg text-danger",
    success: "border-success/20 bg-success-bg text-success",
    info: "border-brand/20 bg-brand-light text-brand-dark",
  };

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles[variant]}`}>
      {children}
    </div>
  );
}

export default Alert;
