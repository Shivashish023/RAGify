import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import PageShell from "../components/layout/PageShell";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import { Field, Input } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
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
      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-5xl gap-12 px-5 py-12 lg:grid-cols-2 lg:items-center">
        <PageHeader
          className="mb-0 lg:mb-0"
          eyebrow="Authentication"
          title="Sign in to your console"
          description="Access your tenant dashboard, upload new files to your vector index, and retrieve integration keys."
        />

        <div className="relative animate-fade-up stagger-2">
          {/* Ambient Glow */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-brand to-accent opacity-20 blur-lg" />
          
          <Card className="relative overflow-hidden border border-white/10 bg-slate-900/40">
            <CardBody>
              <h2 className="font-display text-2xl font-semibold text-white">Login</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Enter your administrative credentials to continue.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <Field label="Email Address">
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@company.com"
                    required
                  />
                </Field>

                <Field label="Security Password">
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your security password"
                    required
                  />
                </Field>

                {error ? <Alert>{error}</Alert> : null}

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Verifying..." : "Sign In to Workspace"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-ink-muted">
                Need a new workspace?{" "}
                <Link to="/register" className="font-semibold text-brand-glow hover:text-white transition-colors duration-200">
                  Register organization
                </Link>
              </p>
            </CardBody>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}

export default Login;
