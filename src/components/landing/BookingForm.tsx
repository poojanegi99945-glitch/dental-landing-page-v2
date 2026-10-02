/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type FormEvent } from "react";
import { Check, MessageCircle, Phone } from "lucide-react";
import { Btn, Field, inputCls, Segmented } from "./ui";
import { useLead, track } from "@/lib/lead";
import { clinic } from "@/lib/clinic-config";

export function BookingForm({ full, cta = "Request My Consultation" }: { full?: boolean; cta?: string }) {
  const { lead, submit, checkDone } = useLead();
  const [name, setName] = useState(lead.name);
  const [phone, setPhone] = useState(lead.phone);
  const [contact, setContact] = useState(lead.preferredContactMethod || "WhatsApp");
  const [time, setTime] = useState(lead.preferredAppointmentTime);
  const [err, setErr] = useState("");
  const [started, setStarted] = useState(false);
  const [busy, setBusy] = useState(false);

  const onStart = () => {
    if (!started) {
      setStarted(true);
      track("consultation_form_started");
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setErr("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").slice(-10)))
      return setErr("Please enter a valid 10-digit mobile number.");
    setErr("");
    setBusy(true);
    await submit({
      name: name.trim(),
      phone,
      preferredContactMethod: contact,
      preferredAppointmentTime: time,
    });
    setBusy(false);
    document.getElementById("success")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <form onSubmit={onSubmit} onFocus={onStart} noValidate className="space-y-4 text-foreground">
      <Field label="Full Name">
        <input
          className={inputCls}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />
      </Field>
      <Field label="Mobile Number">
        <input
          className={inputCls}
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          placeholder="10-digit mobile"
          required
        />
      </Field>
      <div>
        <span className="mb-1.5 block text-sm font-semibold text-foreground">
          Preferred contact
        </span>
        <Segmented
          name="Preferred contact"
          options={["Call", "WhatsApp"]}
          value={contact}
          onChange={setContact}
        />
      </div>
      {full && (
        <div>
          <span className="mb-1.5 block text-sm font-semibold text-foreground">
            Preferred appointment
          </span>
          <Segmented
            name="Preferred appointment"
            options={["Morning", "Afternoon", "Evening"]}
            value={time}
            onChange={setTime}
          />
        </div>
      )}
      {checkDone && (
        <p className="flex items-center gap-2 rounded-xl bg-aqua px-3 py-2 text-sm font-medium text-primary">
          <Check className="h-4 w-4 text-accent" /> Your Smile Check answers will be included with your request.
        </p>
      )}
      {err && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {err}
        </p>
      )}
      <Btn type="submit" disabled={busy} className="w-full min-h-12 text-sm">
        {busy ? "Sending…" : cta}
      </Btn>
      <p className="text-center text-xs text-muted-foreground">
        Your information will only be used to respond to your consultation request.
      </p>
    </form>
  );
}

export function SuccessState() {
  const { lead } = useLead();
  const first = lead.name.split(" ")[0];

  return (
    <div id="success" role="status" className="animate-rise text-center text-foreground">
      <svg viewBox="0 0 52 52" className="mx-auto h-16 w-16" aria-hidden>
        <circle cx="26" cy="26" r="24" className="fill-aqua" />
        <path
          d="M15 27l7 7 15-15"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw stroke-accent"
        />
      </svg>
      <p className="eyebrow mt-4 text-accent">Request received</p>
      <h3 className="mt-2 font-serif text-3xl text-primary">Appointment Request Received</h3>
      <p className="mt-3 text-muted-foreground text-sm">
        Thank you, {first}. Your consultation request has been sent to the clinic.
      </p>

      <div className="mt-6 rounded-2xl bg-cream p-5 text-left border border-border">
        <p className="font-semibold text-sm text-foreground">What happens next?</p>
        <p className="mt-1 text-xs text-muted-foreground">
          The clinic will contact you within {clinic.responseWindow} to confirm availability.
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
          {[
            ["Concern", lead.concern],
            ["Interest", lead.treatmentInterest],
            ["Timing", lead.treatmentTimeline],
            ["Preferred Contact", lead.preferredContactMethod],
          ]
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k}>
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-semibold text-primary">{v}</dd>
              </div>
            ))}
        </dl>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={clinic.whatsappHref}
          onClick={() => track("whatsapp_clicked")}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-primary/25 px-5 text-sm font-semibold text-primary hover:bg-secondary transition"
        >
          <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
        </a>
        <a
          href={clinic.phoneHref}
          onClick={() => track("phone_clicked")}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-primary/25 px-5 text-sm font-semibold text-primary hover:bg-secondary transition"
        >
          <Phone className="h-4 w-4" /> Call Clinic
        </a>
      </div>
    </div>
  );
}
