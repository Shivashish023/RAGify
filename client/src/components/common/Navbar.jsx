import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const navLinkClass = ({ isActive }) =>
  `rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-brand-light text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-brand/35"
      : "text-ink-muted hover:bg-white/5 hover:text-white"
  }`;

const mobileNavLinkClass = ({ isActive }) =>
  `w-full text-left rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200 block ${
    isActive
      ? "bg-brand-light text-white border border-brand/35"
      : "text-ink-muted hover:bg-white/5 hover:text-white"
  }`;

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 glass-nav">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        
        {/* Logo and branding */}
        <Link to="/" onClick={closeMobileMenu} className="group flex items-center gap-3">
          <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-linear-to-br from-brand to-brand-glow text-sm font-bold text-white shadow-[var(--shadow-soft)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow">
            <span className="font-display text-lg leading-none">R</span>
          </span>
          <span className="flex flex-col">
            <span className="font-display text-lg font-semibold leading-tight tracking-tight text-white group-hover:text-brand transition-colors duration-200">
              RAGify
            </span>
            {isAuthenticated && user?.organizationName ? (
              <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-glow">{user.organizationName}</span>
            ) : (
              <span className="text-[10px] uppercase tracking-wider font-semibold text-ink-faint">Knowledge chatbot</span>
            )}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
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
              <Button variant="ghost" size="sm" onClick={logout} className="ml-1 text-ink-muted hover:bg-white/5 hover:text-danger">
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
                className="rounded-xl bg-linear-to-r from-brand to-brand-glow hover:brightness-110 active:scale-95 duration-200 px-4.5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition-all"
              >
                Get started
              </NavLink>
            </>
          )}
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="inline-flex items-center justify-center rounded-xl p-2.5 text-ink-muted hover:bg-white/5 hover:text-white transition duration-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/20 bg-slate-950/95 backdrop-blur-lg px-5 py-6 space-y-4 animate-fade-up">
          <nav className="flex flex-col gap-2">
            <NavLink to="/" onClick={closeMobileMenu} className={mobileNavLinkClass} end>
              Home
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" onClick={closeMobileMenu} className={mobileNavLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/documents" onClick={closeMobileMenu} className={mobileNavLinkClass}>
                  Documents
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="w-full text-left rounded-xl px-4 py-3 text-base font-semibold text-danger hover:bg-danger-bg/25 transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={closeMobileMenu} className={mobileNavLinkClass}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={closeMobileMenu}
                  className="w-full text-center rounded-xl bg-linear-to-r from-brand to-brand-glow py-3 text-base font-semibold text-white shadow-glow"
                >
                  Get started
                </NavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
