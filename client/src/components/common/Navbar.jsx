import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-brand-light text-brand"
      : "text-ink-muted hover:bg-white/80 hover:text-ink"
  }`;

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 glass-nav">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link to="/" className="group flex items-center gap-3">
          <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-linear-to-br from-brand to-brand-glow text-sm font-bold text-white shadow-[var(--shadow-soft)] transition group-hover:shadow-[var(--shadow-glow)]">
            <span className="font-display text-lg leading-none">R</span>
          </span>
          <span className="flex flex-col">
            <span className="font-display text-lg font-semibold leading-tight tracking-tight text-ink">
              RAGify
            </span>
            {isAuthenticated && user?.organizationName ? (
              <span className="text-xs text-ink-faint">{user.organizationName}</span>
            ) : (
              <span className="text-xs text-ink-faint">Knowledge-powered support</span>
            )}
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/documents" className={navLinkClass}>
                Documents
              </NavLink>
              <Button variant="ghost" size="sm" onClick={logout} className="ml-1">
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:bg-brand-dark"
              >
                Get started
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
