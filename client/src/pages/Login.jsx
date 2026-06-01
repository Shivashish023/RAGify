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
      <section className="mx-auto grid min-h-[calc(100vh-65px)] max-w-6xl gap-10 px-5 py-12 lg:grid-cols-2 lg:items-center">
        <PageHeader
          className="mb-0 lg:mb-0"
          eyebrow="Welcome back"
          title="Sign in to your workspace"
          description="Access your dashboard, manage documents, and copy your public chatbot link."
        />

        <Card className="animate-fade-up stagger-2">
          <CardBody>
            <h2 className="font-display text-2xl font-semibold text-ink">Login</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Use the admin credentials from your company registration.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Field label="Email">
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@company.com"
                  required
                />
              </Field>

              <Field label="Password">
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </Field>

              {error ? <Alert>{error}</Alert> : null}

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-muted">
              Need a workspace?{" "}
              <Link to="/register" className="font-semibold text-brand hover:text-brand-dark">
                Register your company
              </Link>
            </p>
          </CardBody>
        </Card>
      </section>
    </PageShell>
  );
}

export default Login;
