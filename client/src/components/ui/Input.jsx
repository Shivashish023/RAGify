function Label({ children, htmlFor, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={`mb-2 block text-sm font-medium text-ink ${className}`}>
      {children}
    </label>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-border-strong bg-surface px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-brand focus:ring-4 focus:ring-brand/10 ${className}`}
      {...props}
    />
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label ? <Label>{label}</Label> : null}
      {children}
    </div>
  );
}

export { Label, Input, Field };
