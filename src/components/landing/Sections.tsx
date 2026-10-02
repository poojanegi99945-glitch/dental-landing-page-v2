/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  MapPin,
  MessageCircle,
  Phone,
  Clock,
  Star,
  Stethoscope,
  Award,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import doctorImg from "@/assets/doctor.jpg";
import { Btn, SectionHead } from "./ui";
import { BookingForm, SuccessState } from "./BookingForm";
import { useLead, track, scrollToId } from "@/lib/lead";
import { clinic } from "@/lib/clinic-config";
import { cn } from "@/lib/utils";

/**
 * Iconic Precision Dental Tooth Emblem & Brandmark
 */
export function DentalLogo({
  size = "md",
  light = false,
}: {
  size?: "sm" | "md" | "lg";
  light?: boolean;
}) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <div
      onClick={() => scrollToId("hero")}
      className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer select-none"
    >
      {/* Precision Dental Tooth Emblem */}
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105 shadow-xs",
          isSm ? "h-8 w-8" : isLg ? "h-11 w-11" : "h-10 w-10",
          light
            ? "bg-white/10 border border-white/20 text-white"
            : "bg-gradient-to-br from-[#123e4f] via-primary to-[#051c24] text-white border border-primary/20 shadow-primary/10"
        )}
      >
        <svg
          viewBox="0 0 40 40"
          className={cn(isSm ? "h-5 w-5" : isLg ? "h-7 w-7" : "h-6 w-6")}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Dental Clinic Tooth Logo"
        >
          <defs>
            <linearGradient id={`toothFill-${size}-${light ? "l" : "d"}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E6F5F8" />
            </linearGradient>
            <linearGradient id={`arcGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38E1F2" />
              <stop offset="100%" stopColor="#0EA5B7" />
            </linearGradient>
          </defs>

          {/* Anatomical Tooth with Crown and Dual Roots */}
          <path
            d="M12 7C8 8.4 5.5 12.2 5.5 16.8C5.5 23.2 9.5 29.2 13 34.5C13.8 35.8 15.6 35.8 16.5 34.2C17.8 31.8 19 28 19.8 25C20.2 28 21.4 31.8 22.7 34.2C23.6 35.8 25.4 35.8 26.2 34.5C29.7 29.2 33.7 23.2 33.7 16.8C33.7 12.2 31.2 8.4 27.2 7C23.4 5.6 21 8 19.8 8C18.6 8 16.2 5.6 12 7Z"
            fill={`url(#toothFill-${size}-${light ? "l" : "d"})`}
            stroke={light ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)"}
            strokeWidth="0.8"
          />

          {/* Gentle Smile Arc across anterior crown */}
          <path
            d="M10.5 18C13.8 22.8 25.4 22.8 28.7 18"
            stroke={`url(#arcGrad-${size})`}
            strokeWidth="2.6"
            strokeLinecap="round"
          />

          {/* Orthodontic Alignment Node / Diamond Sparkle */}
          <path
            d="M27.5 10.5L28.5 7.5L29.5 10.5L32.5 11.5L29.5 12.5L28.5 15.5L27.5 12.5L24.5 11.5L27.5 10.5Z"
            fill="#38E1F2"
          />
        </svg>
      </div>

      {/* Typography Brandmark */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-serif font-bold tracking-tight leading-none",
              isSm ? "text-base" : isLg ? "text-2xl" : "text-xl",
              light ? "text-white" : "text-primary"
            )}
          >
            {clinic.shortName}
          </span>
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase leading-none border",
              light
                ? "bg-white/10 text-white border-white/20"
                : "bg-accent/15 text-accent border-accent/25"
            )}
          >
            DENTAL
          </span>
        </div>
        <span
          className={cn(
            "text-[10px] font-medium tracking-wider uppercase leading-none mt-1",
            light ? "text-deep-muted" : "text-muted-foreground"
          )}
        >
          Orthodontics · Chennai
        </span>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        {/* Brand Dental Logo */}
        <DentalLogo />

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <a
            href={clinic.phoneHref}
            onClick={() => track("phone_clicked")}
            className="flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-foreground hover:bg-secondary transition border border-border/60 bg-card/60 shadow-2xs"
            aria-label={`Call ${clinic.phone}`}
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </div>
            <Phone className="h-3.5 w-3.5 text-accent" />
            <span className="font-sans text-xs font-semibold text-foreground tracking-tight">
              {clinic.phone}
            </span>
          </a>

          <Btn
            className="min-h-10 text-xs py-2 px-4 sm:px-5 shadow-xs"
            onClick={() => {
              track("hero_cta_click", { location: "header" });
              scrollToId("book");
            }}
          >
            Book Consultation
          </Btn>
        </div>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 md:grid-cols-[1.1fr_1fr] md:pb-24 md:pt-16">
        <div className="animate-rise">
          <p className="eyebrow text-accent font-bold">
            ORTHODONTIC CARE · {clinic.city.toUpperCase()}
          </p>
          <h1 className="mt-5 text-5xl leading-[1.02] text-primary md:text-7xl font-serif">
            Thinking about <br className="hidden sm:inline" />
            <em className="italic font-normal">straighter</em> teeth?
          </h1>
          <p className="mt-5 font-serif text-2xl text-foreground md:text-3xl leading-snug">
            Explore Braces &amp; Clear Aligners in {clinic.city}.
          </p>
          <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
            Understand which options may suit your teeth, lifestyle and budget with an orthodontist
            assessment.
          </p>
          <div className="mt-8 flex flex-col items-start gap-4">
            <Btn
              onClick={() => {
                track("hero_cta_click");
                scrollToId("concern");
              }}
            >
              Explore My Options <ArrowRight className="h-4 w-4" />
            </Btn>
            <button
              onClick={() => scrollToId("book")}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline cursor-pointer"
            >
              Already ready to speak with us?{" "}
              <span className="font-semibold text-primary">Book a consultation</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <img
            src={heroImg}
            alt="Smiling patient at modern orthodontic clinic"
            width={1200}
            height={1440}
            className="aspect-[5/6] w-full rounded-[2rem] object-cover shadow-soft"
          />
          <div className="absolute -bottom-6 left-4 right-4 rounded-2xl bg-card/95 p-4 shadow-soft backdrop-blur-md sm:left-auto sm:-left-8 sm:right-auto sm:w-64 border border-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              What would you like to improve?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Crooked teeth", "Gaps", "Crowding", "Bite concern"].map((t) => (
                <button
                  key={t}
                  onClick={() => scrollToId("concern")}
                  className="rounded-full bg-aqua px-3 py-1.5 text-xs font-semibold text-primary hover:bg-aqua-strong hover:text-white transition cursor-pointer"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustStrip() {
  const items = [
    { label: "ORTHODONTIST-LED CARE", sub: "Specialist Supervision" },
    { label: "10+ Years", sub: "Clinical Experience" },
    { label: "4.5", sub: "440 Google Reviews" },
    { label: "Anna Nagar", sub: "Chennai" },
  ];

  return (
    <div className="bg-deep text-deep-foreground border-b border-deep-line">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 py-6 text-sm md:grid-cols-4">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-aqua-strong">
              {idx === 0 && <Stethoscope className="h-4 w-4" />}
              {idx === 1 && <Award className="h-4 w-4" />}
              {idx === 2 && <Star className="h-4 w-4" />}
              {idx === 3 && <MapPin className="h-4 w-4" />}
            </div>
            <div>
              <p className="font-bold leading-tight text-white">{item.label}</p>
              <p className="text-xs text-deep-muted">{item.sub}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Offer() {
  const { submitted } = useLead();

  useEffect(() => {
    const el = document.getElementById("book");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        track("consultation_form_viewed");
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="book" className="bg-background px-5 py-20 md:py-28 border-b border-border/60">
      <SectionHead
        eyebrow="CLEAR OFFER"
        title={
          <>
            Know exactly what you're <br className="hidden sm:inline" /> booking
          </>
        }
      />
      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-aqua p-7 md:p-9 border border-border">
          <h3 className="text-2xl font-serif text-primary">Orthodontic Consultation</h3>
          <p className="mt-2 text-lg text-foreground">
            Consultation Fee:{" "}
            <strong className="font-serif text-2xl text-primary font-bold">
              [₹XXX]
            </strong>
          </p>

          <p className="mt-6 text-sm font-semibold text-foreground">What’s included</p>
          <ul className="mt-3 space-y-2.5 text-sm text-foreground">
            {[
              "Orthodontic assessment",
              "Discussion of your main concern",
              "Braces and aligner options explained",
              "Treatment suitability discussion",
              "Estimated treatment duration explained where appropriate",
              "Treatment cost factors explained",
              "Scan information explained",
            ].map((i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{i}</span>
              </li>
            ))}
          </ul>

          <blockquote className="mt-6 rounded-2xl bg-card p-4 text-sm font-semibold text-primary border border-border shadow-xs">
            Complimentary 3D smile scan when you start aligner treatment.
          </blockquote>
          <p className="mt-3 text-xs text-muted-foreground">
            3D scanning charges outside this offer: [Editable / clarify with clinic]
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-7 shadow-soft md:p-9">
          {submitted ? (
            <SuccessState />
          ) : (
            <>
              <h3 className="mb-5 font-serif text-2xl text-primary">Request your consultation</h3>
              <BookingForm full cta="Request My Consultation" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export function Doctor() {
  const d = clinic.doctor;

  return (
    <section className="bg-deep px-5 py-20 text-deep-foreground md:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
        <img
          src={doctorImg}
          alt={`Orthodontist at ${clinic.name}`}
          loading="lazy"
          width={1024}
          height={1280}
          className="aspect-[4/5] w-full rounded-[2rem] object-cover border border-deep-line shadow-soft"
        />
        <div>
          <p className="eyebrow text-aqua-strong font-bold">ORTHODONTIC CARE · {clinic.area.toUpperCase()}</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif">Meet Your Orthodontist</h2>
          <p className="mt-2 text-sm text-aqua-strong font-semibold">
            {clinic.experienceText} · {clinic.name} ({clinic.area})
          </p>

          <dl className="mt-6 divide-y divide-deep-line border-y border-deep-line">
            {[
              ["Doctor Name", d.name],
              ["Qualification", d.qualification],
              ["Specialty", d.specialty],
              ["Experience", d.experience],
              ["Clinic Association", d.association],
              ["Registration", d.registration],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3 text-sm">
                <dt className="text-deep-muted">{k}</dt>
                <dd className="text-right font-medium text-white">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-deep-muted leading-relaxed">
            Your orthodontist will assess your teeth and bite, discuss your goals and explain which
            treatment options may be appropriate for you.
          </p>
          <Btn className="mt-8" onClick={() => scrollToId("book")}>
            Book With Our Orthodontist <ArrowRight className="h-4 w-4" />
          </Btn>
        </div>
      </div>
    </section>
  );
}

const bookingJourneySteps = [
  ["Request Your Consultation", "Submit your consultation request online in 30 seconds."],
  ["ABC Confirms Your Appointment", "The team at ABC contacts you to confirm your convenient appointment time."],
  ["Meet the Orthodontist", "Meet the specialist at ABC in Anna Nagar to discuss what you'd like to improve."],
  ["Orthodontic Assessment", "The orthodontist examines your teeth, bite and facial alignment."],
  ["Treatment Options Explained", "Clear aligner and braces options, estimated duration and cost are explained."],
  ["You Decide", "You have complete freedom to consider the recommendations before deciding to proceed."],
];

export function NextSteps() {
  const [open, setOpen] = useState(0);

  return (
    <section id="steps" className="bg-aqua px-5 py-20 md:py-28 border-b border-border/60">
      <SectionHead
        eyebrow="THE PROCESS"
        title={`What Happens When You Book at ${clinic.shortName}?`}
        sub="A straightforward, transparent clinical pathway from your first consultation request to your personalized treatment plan."
      />
      <ol className="mx-auto mt-12 max-w-2xl">
        {bookingJourneySteps.map(([t, d], i) => (
          <li key={t} className="relative pl-14">
            {i < bookingJourneySteps.length - 1 && (
              <span
                className={cn(
                  "absolute left-[1.15rem] top-10 h-full w-0.5",
                  i < open ? "bg-accent" : "bg-aqua-strong",
                )}
                aria-hidden
              />
            )}
            <button
              onClick={() => setOpen(i)}
              aria-expanded={open === i}
              className="w-full pb-6 text-left cursor-pointer"
            >
              <span
                className={cn(
                  "absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition",
                  i <= open
                    ? "bg-accent text-accent-foreground"
                    : "bg-card text-primary border border-border",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="block pt-2 font-serif text-xl text-primary">{t}</span>
              <span
                className={cn(
                  "grid transition-all",
                  open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <span className="overflow-hidden text-muted-foreground">
                  <span className="block pt-2 leading-relaxed text-sm">{d}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="mx-auto mt-6 max-w-2xl rounded-2xl bg-card p-6 text-center border border-border shadow-xs">
        <p className="font-serif text-xl text-primary">
          Requesting a consultation does not commit you to starting treatment.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          3D scanning fee: {clinic.scanFee}
          {clinic.scanOfferActive &&
            " · Complimentary when you start qualifying aligner treatment."}
        </p>
        <Btn className="mt-6" onClick={() => scrollToId("final")}>
          Request My Appointment <ArrowRight className="h-4 w-4" />
        </Btn>
      </div>
    </section>
  );
}

export function Proof() {
  return (
    <section className="bg-background px-5 py-20 md:py-28">
      <SectionHead
        eyebrow="PATIENT REVIEWS"
        title="Real orthodontic experiences"
        sub={`Consented reviews from patients treated at ${clinic.name} in Anna Nagar, Chennai.`}
      />
      <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
        {[
          {
            quote:
              "“The consultation at ABC Anna Nagar was thorough and relaxed. The doctor explained both braces and aligners clearly with zero pressure.”",
            patient: "Priya S.",
            treatment: "Clear Aligners",
          },
          {
            quote:
              "“The 3D scan at ABC was quick and comfortable. Seeing the expected movement on screen gave me complete peace of mind.”",
            patient: "Rahul M.",
            treatment: "Orthodontic Assessment",
          },
          {
            quote:
              "“Professional orthodontist-led care from day one. I'm half-way through treatment and already notice a remarkable difference.”",
            patient: "Ananya K.",
            treatment: "Ceramic Braces",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex min-h-48 flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-xs"
          >
            <div>
              <div className="flex gap-1 text-accent mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="font-serif text-base italic text-foreground leading-relaxed">
                {item.quote}
              </p>
            </div>
            <p className="mt-4 text-sm font-semibold text-primary">
              {item.patient} · <span className="text-muted-foreground">{item.treatment}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

const faqs = [
  [
    "What does the consultation at ABC include?",
    `An orthodontic assessment of your teeth and bite, discussion of your main concern, an explanation of braces and aligner options, and an overview of duration and cost factors. Consultation fee: ${clinic.consultationFee}.`,
  ],
  [
    "How is treatment cost decided at ABC?",
    "Cost can vary depending on treatment type, complexity, duration and your individual treatment plan. The clinic will explain applicable costs after your clinical assessment.",
  ],
  [
    "How long might treatment take?",
    "Treatment duration varies according to your individual orthodontic needs and the chosen treatment plan. Your orthodontist will discuss an estimate after assessment.",
  ],
  [
    "When is the 3D scan complimentary?",
    clinic.scanOfferActive
      ? `The 3D smile scan is complimentary when you start qualifying aligner treatment under the stated clinic offer. Otherwise applicable scan charges (${clinic.scanFee}) should be confirmed with the clinic.`
      : `3D scan charges: ${clinic.scanFee}. Please confirm with the clinic.`,
  ],
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-cream px-5 py-20 md:py-28 border-b border-border/60">
      <SectionHead eyebrow="FAQ" title="Questions before your consultation?" />
      <div className="mx-auto mt-10 max-w-2xl divide-y divide-border border-y border-border">
        {faqs.map(([q, a], i) => (
          <div key={q}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-4 py-5 text-left font-serif text-xl text-primary cursor-pointer"
            >
              {q}
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-accent transition-transform",
                  open === i && "rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all",
                open === i ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]",
              )}
            >
              <p className="overflow-hidden text-muted-foreground leading-relaxed text-sm">{a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Location() {
  return (
    <section className="bg-background px-5 py-20 md:py-24 border-b border-border/60">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 items-center">
        <div>
          <p className="eyebrow text-accent font-bold">VISIT THE CLINIC</p>
          <h2 className="mt-3 text-4xl font-serif text-primary">
            Orthodontic Care in {clinic.area}
          </h2>
          <p className="mt-5 font-serif text-2xl text-primary">{clinic.name}</p>
          <p className="mt-2 text-muted-foreground">{clinic.address}</p>
          <p className="mt-3 flex items-center gap-2 text-sm text-foreground">
            <Clock className="h-4 w-4 text-accent" />
            Opening Hours: {clinic.hours}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={clinic.directionsHref}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("directions_clicked")}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-deep transition"
            >
              <MapPin className="h-4 w-4" />
              Get Directions
            </a>
            <a
              href={clinic.phoneHref}
              onClick={() => track("phone_clicked")}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-primary/25 px-6 text-sm font-semibold text-primary hover:bg-secondary transition"
            >
              <Phone className="h-4 w-4" />
              Call {clinic.phone}
            </a>
            <a
              href={clinic.whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("whatsapp_clicked")}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-primary/25 px-6 text-sm font-semibold text-primary hover:bg-secondary transition"
            >
              <MessageCircle className="h-4 w-4 text-accent" />
              WhatsApp Clinic
            </a>
          </div>
        </div>

        {/* Real Interactive Sample Map for 45, Anna Nagar, Chennai */}
        <div className="relative h-[280px] sm:h-[300px] md:h-[320px] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <iframe
            title="ABC Dental Hospitals Clinic Location Map"
            src="https://maps.google.com/maps?q=45,+Anna+Nagar,+Chennai&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="h-full w-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          {/* Floating Location Overlay Card */}
          <div className="pointer-events-auto absolute bottom-3 left-3 right-3 md:right-auto md:max-w-xs rounded-2xl bg-card/95 p-3 shadow-soft backdrop-blur-md border border-border">
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent mt-0.5">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-serif text-sm font-bold text-primary leading-tight">{clinic.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{clinic.address}</p>
                <p className="text-[10px] font-semibold text-accent mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Hours: 9 AM to 9 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FinalBooking() {
  const { submitted } = useLead();

  return (
    <section id="final" className="bg-deep px-5 py-20 text-deep-foreground md:py-28">
      <div className="mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-2">
        <div>
          <p className="eyebrow text-aqua-strong font-bold">BOOK YOUR CONSULTATION</p>
          <h2 className="mt-2 text-4xl leading-tight md:text-5xl font-serif">
            Ready to Explore Your Smile Options?
          </h2>
          <p className="mt-4 text-deep-muted leading-relaxed">
            Request an orthodontic consultation at {clinic.name} in {clinic.area} and discuss
            braces, clear aligners and the options that may suit your individual needs.
          </p>

          <div className="mt-6 rounded-2xl bg-white/10 p-5 border border-white/15">
            <p className="font-serif text-xl font-bold text-white">{clinic.name}</p>
            <p className="text-xs text-deep-muted mt-1">{clinic.address}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-aqua-strong">
              <span>{clinic.reviewRatingText}</span>
              <span>·</span>
              <span>{clinic.experienceText}</span>
            </div>
          </div>

          <div className="mt-6">
            <a
              href={clinic.whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("whatsapp_clicked")}
              className="inline-flex items-center gap-2 text-sm text-aqua-strong hover:underline"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp {clinic.shortName} directly
            </a>
          </div>
        </div>

        <div className="rounded-3xl bg-card p-7 shadow-soft md:p-9 text-card-foreground">
          {submitted ? (
            <SuccessState />
          ) : (
            <BookingForm full cta="Book My Aligner Consultation" />
          )}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-deep px-5 pb-28 pt-12 text-xs text-deep-muted md:pb-12 border-t border-deep-line">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <DentalLogo size="md" light={true} />
          <div className="sm:border-l sm:border-white/15 sm:pl-4 sm:ml-2">
            <p className="text-white/90 font-medium">
              Orthodontic Care · {clinic.area} · Phone: {clinic.phone}
            </p>
            <p className="mt-1 text-[11px] text-deep-muted/80">
              {clinic.experienceText} · {clinic.reviewRatingText}
            </p>
          </div>
        </div>

        <div>
          <Btn onClick={() => scrollToId("book")}>Book Aligner Consultation</Btn>
        </div>
      </div>

      <div className="mx-auto max-w-6xl border-t border-deep-line/60 mt-8 pt-4 text-center md:text-left text-[11px] text-deep-muted/70">
        © {clinic.name}. Information on this page is general and not a diagnosis. Suitability for
        any treatment is determined after clinical assessment.
      </div>
    </footer>
  );
}

export function MobileBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const on = (e: FocusEvent) =>
      setHidden((e.target as HTMLElement)?.matches?.("input, textarea, select") ?? false);
    const off = () => setHidden(false);
    document.addEventListener("focusin", on);
    document.addEventListener("focusout", off);
    return () => {
      document.removeEventListener("focusin", on);
      document.removeEventListener("focusout", off);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border bg-background/95 p-3 backdrop-blur-md transition-transform md:hidden shadow-lg",
        hidden && "translate-y-full",
      )}
    >
      <Btn className="flex-1 min-h-12" onClick={() => scrollToId("book")}>
        Book Consultation
      </Btn>
      <a
        href={clinic.whatsappHref}
        target="_blank"
        rel="noreferrer"
        onClick={() => track("whatsapp_clicked")}
        aria-label={`WhatsApp ${clinic.shortName}`}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 text-primary hover:bg-secondary transition"
      >
        <MessageCircle className="h-5 w-5 text-accent" />
      </a>
    </div>
  );
}
