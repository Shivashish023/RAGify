import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import PageShell from "../components/layout/PageShell";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    organizationName: "",
    name: "",
    email: "",
    password: "",
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
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account. Try again.");
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
            Create workspace
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#121923]">
            Register your company and get a chatbot link.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#52616f]">
            This creates your organization, your first admin account, and a
            public chatbot URL that customers can open later.
          </p>
        </div>

        <div className="rounded-lg border border-[#dce3ea] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-[#121923]">
              Company registration
            </h2>
            <p className="mt-2 text-sm text-[#6b7886]">
              You will become the admin for this organization.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-[#243241]">Company name</span>
              <input
                type="text"
                name="organizationName"
                value={form.organizationName}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-[#cfd8e3] px-4 py-3 text-sm outline-none transition focus:border-[#145c72] focus:ring-4 focus:ring-[#145c72]/10"
                placeholder="Acme Shoes"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-[#243241]">Your name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-[#cfd8e3] px-4 py-3 text-sm outline-none transition focus:border-[#145c72] focus:ring-4 focus:ring-[#145c72]/10"
                placeholder="Shiva"
                required
              />
            </label>

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
                placeholder="At least 8 characters"
                minLength={8}
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
              {isSubmitting ? "Creating workspace..." : "Create workspace"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6b7886]">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#145c72]">
              Login
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}

export default Register;
