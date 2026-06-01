function PageShell({ children, variant = "default" }) {
  const bgClass = variant === "chat" ? "mesh-bg-chat" : "mesh-bg";

  return (
    <div className={`relative min-h-screen text-ink ${bgClass}`}>
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-40" aria-hidden />
      <main className="relative">{children}</main>
    </div>
  );
}

export default PageShell;
