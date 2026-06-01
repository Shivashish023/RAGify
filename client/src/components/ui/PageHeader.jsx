function Eyebrow({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-glow">{children}</p>
  );
}

function PageHeader({ eyebrow, title, description, children, className = "" }) {
  return (
    <div className={`mb-10 animate-fade-up ${className}`}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">{description}</p>
      ) : null}
      {children}
    </div>
  );
}

export { PageHeader, Eyebrow };
