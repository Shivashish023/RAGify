import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import PageShell from "../components/layout/PageShell";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "admin@ragify.dev",
    password: "password123",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <Navbar />
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#307d89]">
            Secure access
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#121923]">
            Sign in to your RAGify workspace.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#52616f]">
            This starter login uses the Node API and stores a mock token locally.
            It gives you the app flow now, while keeping room for real JWT auth next.
          </p>
        </div>

        <div className="rounded-lg border border-[#dce3ea] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-[#121923]">Login</h2>
            <p className="mt-2 text-sm text-[#6b7886]">
              Use the prefilled demo credentials to enter the dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-[#243241]">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-[#cfd8e3] px-4 py-3 text-sm outline-none transition focus:border-[#145c72] focus:ring-4 focus:ring-[#145c72]/10"
                placeholder="admin@company.com"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[#243241]">Password</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-[#cfd8e3] px-4 py-3 text-sm outline-none transition focus:border-[#145c72] focus:ring-4 focus:ring-[#145c72]/10"
                placeholder="Enter your password"
                required
              />
            </label>

            {error && (
              <div className="rounded-lg border border-[#f0c8c8] bg-[#fff5f5] px-4 py-3 text-sm text-[#a33a3a]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#145c72] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#104a5c] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6b7886]">
            Back to{" "}
            <Link to="/" className="font-semibold text-[#145c72]">
              landing page
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}

export default Login;
