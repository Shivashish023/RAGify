import Alert from "../ui/Alert";
import Button from "../ui/Button";
import { Field, Input } from "../ui/Input";

export default function LeadForm({
  leadForm,
  onLeadChange,
  onSubmit,
  isStarting,
  error,
}) {
  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-sm space-y-6 py-6 animate-fade-up">
      <div className="text-center space-y-1.5">
        <h3 className="text-lg font-semibold text-white">Initialize support session</h3>
        <p className="text-xs text-ink-muted leading-relaxed">
          Please enter your name and email to connect with our document library assistant.
        </p>
      </div>
      
      <div className="space-y-4">
        <Field label="Your Name">
          <Input
            type="text"
            name="name"
            value={leadForm.name}
            onChange={onLeadChange}
            placeholder="John Doe"
            required
          />
        </Field>
        <Field label="Email Address">
          <Input
            type="email"
            name="email"
            value={leadForm.email}
            onChange={onLeadChange}
            placeholder="john@example.com"
            required
          />
        </Field>
      </div>

      {error ? <Alert>{error}</Alert> : null}
      
      <Button type="submit" className="w-full" size="lg" disabled={isStarting}>
        {isStarting ? "Initializing..." : "Start Conversation"}
      </Button>
    </form>
  );
}
