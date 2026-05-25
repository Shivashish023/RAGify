import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-[#dce3ea] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#145c72] text-sm font-bold text-white">
            R
          </span>
          <span className="text-lg font-semibold tracking-tight">RAGify</span>
        </Link>

        <nav className="flex items-center gap-3 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hidden px-3 py-2 text-[#52616f] sm:inline-block ${isActive ? "text-[#145c72]" : ""}`
            }
          >
            Home
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-2 text-[#52616f] ${isActive ? "text-[#145c72]" : ""}`
                }
              >
                Dashboard
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-[#cfd8e3] px-4 py-2 text-[#243241] transition hover:border-[#145c72] hover:text-[#145c72]"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-[#145c72] px-4 py-2 text-white shadow-sm transition hover:bg-[#104a5c]"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
