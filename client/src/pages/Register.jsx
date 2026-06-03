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
      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-5xl gap-12 px-5 py-12 lg:grid-cols-2 lg:items-center">
        <PageHeader
          className="mb-0"
          eyebrow="Onboarding"
          title="Create tenant workspace"
          description="Register your organization, build your custom knowledge repository, and deploy a customer chatbot in seconds."
        />

        <div className="relative animate-fade-up stagger-2">
          {/* Ambient Glow */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-brand to-accent opacity-20 blur-lg" />

          <Card className="relative overflow-hidden border border-white/10 bg-slate-900/40">
            <CardBody>
              <h2 className="font-display text-2xl font-semibold text-white">Company registration</h2>
              <p className="mt-1 text-sm text-ink-muted">You will be the primary administrator.</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <Field label="Organization Name">
                  <Input
                    type="text"
                    name="organizationName"
                    value={form.organizationName}
                    onChange={handleChange}
                    placeholder="e.g., Acme Corporation"
                    required
                  />
                </Field>

                <Field label="Admin Name">
                  <Input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </Field>

                <Field label="Admin Email Address">
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@company.com"
                    required
                  />
                </Field>

                <Field label="Workspace Password">
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    minLength={8}
                    required
                  />
                </Field>

                {error ? <Alert>{error}</Alert> : null}

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Provisioning..." : "Provision Workspace"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-ink-muted">
                Already registered?{" "}
                <Link to="/login" className="font-semibold text-brand-glow hover:text-white transition-colors duration-200">
                  Sign in
                </Link>
              </p>
            </CardBody>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}

export default Register;
