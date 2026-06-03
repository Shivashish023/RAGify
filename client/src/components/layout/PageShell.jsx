function PageShell({ children, variant = "default" }) {
  const bgClass = variant === "chat" ? "mesh-bg-chat" : "mesh-bg";

  return (
    <div className={`relative min-h-screen text-ink overflow-hidden ${bgClass}`}>
      {/* Ambient background glow points */}
      <div className="pointer-events-none absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand/8 blur-[120px] animate-pulse-soft" aria-hidden />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/6 blur-[120px]" style={{ animationDuration: "4s" }} aria-hidden />
      
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-60" aria-hidden />
      <main className="relative z-10">{children}</main>
    </div>
  );
}

export default PageShell;
