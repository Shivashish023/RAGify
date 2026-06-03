function Label({ children, htmlFor, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={`mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted ${className}`}>
      {children}
    </label>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full glass-input px-4 py-3 text-sm outline-none placeholder:text-ink-faint ${className}`}
      {...props}
    />
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label ? <Label>{label}</Label> : null}
      {children}
    </div>
  );
}

export { Label, Input, Field };
