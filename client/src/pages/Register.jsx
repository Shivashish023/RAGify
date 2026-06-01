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
      <section className="mx-auto grid min-h-[calc(100vh-65px)] max-w-6xl gap-10 px-5 py-12 lg:grid-cols-2 lg:items-center">
        <PageHeader
          className="mb-0"
          eyebrow="Get started"
          title="Register your company"
          description="Create your organization, admin account, and a public chatbot URL in one step."
        />

        <Card className="animate-fade-up stagger-2">
          <CardBody>
            <h2 className="font-display text-2xl font-semibold text-ink">Company registration</h2>
            <p className="mt-2 text-sm text-ink-muted">You will be the admin for this workspace.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Field label="Company name">
                <Input
                  type="text"
                  name="organizationName"
                  value={form.organizationName}
                  onChange={handleChange}
                  placeholder="Acme Shoes"
                  required
                />
              </Field>

              <Field label="Your name">
                <Input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Shiva"
                  required
                />
              </Field>

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
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />
              </Field>

              {error ? <Alert>{error}</Alert> : null}

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Creating workspace..." : "Create workspace"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-muted">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-brand hover:text-brand-dark">
                Sign in
              </Link>
            </p>
          </CardBody>
        </Card>
      </section>
    </PageShell>
  );
}

export default Register;
