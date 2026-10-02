/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Btn, SectionHead } from "./ui";
import { track, scrollToId } from "@/lib/lead";

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  ctaText: string;
  targetId: string;
  visualType: "aligners" | "braces" | "consultation" | "scan";
}

const SERVICES: ServiceItem[] = [
  {
    id: "clear-aligners",
    number: "01",
    title: "Clear Aligners",
    description: "A discreet, removable orthodontic treatment option for suitable cases.",
    ctaText: "Explore Clear Aligners",
    targetId: "compare",
    visualType: "aligners",
  },
  {
    id: "braces",
    number: "02",
    title: "Braces",
    description:
      "Fixed orthodontic treatment options tailored to individual alignment and bite needs.",
    ctaText: "Explore Braces",
    targetId: "compare",
    visualType: "braces",
  },
  {
    id: "consultation",
    number: "03",
    title: "Orthodontic Consultation",
    description:
      "Meet an orthodontist to discuss your teeth, bite, concerns and available treatment options.",
    ctaText: "Book Consultation",
    targetId: "book",
    visualType: "consultation",
  },
  {
    id: "scan",
    number: "04",
    title: "3D Smile Scan",
    description:
      "Digital scanning can help the orthodontic team assess your smile and support treatment planning where appropriate.",
    ctaText: "Learn About Your Assessment",
    targetId: "steps",
    visualType: "scan",
  },
];

function ServiceCardVisual({ type, title }: { type: ServiceItem["visualType"]; title: string }) {
  if (type === "aligners") {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c2333] via-[#075E6B] to-[#0c2333] p-4 text-white shadow-inner">
        <svg viewBox="0 0 320 200" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle dental studio lighting */}
          <ellipse cx="160" cy="100" rx="120" ry="70" fill="#18AEC0" fillOpacity="0.12" filter="blur(20px)" />
          {/* Transparent aligner tray curvature */}
          <path
            d="M 50,135 C 65,75 125,50 160,50 C 195,50 255,75 270,135 C 255,145 220,95 160,95 C 100,95 65,145 50,135 Z"
            fill="url(#aligner-tray-grad)"
            stroke="#18AEC0"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Aligner attachments */}
          <rect x="105" y="78" width="12" height="10" rx="3" fill="#ffffff" fillOpacity="0.8" />
          <rect x="203" y="78" width="12" height="10" rx="3" fill="#ffffff" fillOpacity="0.8" />
          <rect x="154" y="68" width="12" height="10" rx="3" fill="#ffffff" fillOpacity="0.8" />
          <defs>
            <linearGradient id="aligner-tray-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#18AEC0" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.65" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/75 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
          Clear Polymer Aligners
        </span>
      </div>
    );
  }

  if (type === "braces") {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#122633] via-primary to-[#122633] p-4 text-white shadow-inner">
        <svg viewBox="0 0 320 200" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="160" cy="100" rx="120" ry="60" fill="#18AEC0" fillOpacity="0.1" filter="blur(20px)" />
          {/* Continuous orthodontic archwire */}
          <path d="M 40,110 Q 160,70 280,110" stroke="#18AEC0" strokeWidth="3.5" strokeLinecap="round" />
          {/* Ceramic & metal brackets */}
          {[60, 100, 140, 180, 220, 260].map((x, i) => (
            <g key={x} transform={`translate(${x - 12}, ${85 + Math.sin(i * 0.7) * 4})`}>
              <rect width="24" height="24" rx="4" fill="#FAF8F4" stroke="#0B2942" strokeWidth="1.5" />
              <line x1="4" y1="12" x2="20" y2="12" stroke="#18AEC0" strokeWidth="2.5" />
              <circle cx="7" cy="7" r="1.5" fill="#18AEC0" />
              <circle cx="17" cy="7" r="1.5" fill="#18AEC0" />
            </g>
          ))}
        </svg>
        <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/75 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
          Discreet Fixed Brackets
        </span>
      </div>
    );
  }

  if (type === "consultation") {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-deep via-primary to-deep p-4 text-white shadow-inner flex flex-col items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-aqua/20 border border-aqua/40 text-aqua-strong mb-2 shadow-sm">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
            <path d="M12 7v5l3 3" />
            <path d="M8 21v-4a4 4 0 0 1 8 0v4" />
          </svg>
        </div>
        <span className="font-serif text-lg text-white">Face-to-Face Specialist Assessment</span>
        <span className="text-xs text-aqua-strong mt-0.5">Bite analysis, examination & planning</span>
        <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/75 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
          Clinical Examination
        </span>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c2333] via-[#075E6B] to-[#122633] p-4 text-white shadow-inner flex flex-col items-center justify-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 border border-white/40 text-white mb-2 animate-pulse shadow-sm">
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7V5a2 2 0 0 1 2-2h2" />
          <path d="M17 3h2a2 2 0 0 1 2 2v2" />
          <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
          <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
          <line x1="7" y1="12" x2="17" y2="12" />
        </svg>
      </div>
      <span className="font-serif text-lg text-white">Optical 3D Intraoral Scanner</span>
      <span className="text-xs text-aqua-strong mt-0.5">Fast, comfortable digital impressions</span>
      <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/75 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
        Digital Scanner Interface
      </span>
    </div>
  );
}

export function TreatmentOptions() {
  const sectionRef = useRef<HTMLElement>(null);
  const hasTracked = useRef<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTracked.current) {
            hasTracked.current = true;
            track("treatment_options_viewed");
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCardClick = (service: ServiceItem) => {
    track("treatment_option_selected", { optionId: service.id });
    scrollToId(service.targetId);
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="bg-card px-5 py-20 md:py-28 border-b border-border/60"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <SectionHead
          eyebrow="OUR ORTHODONTIC SERVICES"
          title="Explore Orthodontic Care at ABC"
          sub="From your first orthodontic assessment to ongoing treatment support, explore orthodontic care available at ABC in Anna Nagar, Chennai."
        />

        {/* 4 Large Premium Service Cards (2x2 or 4-column) */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div
              key={s.id}
              onClick={() => handleCardClick(s)}
              className="group flex flex-col justify-between rounded-3xl border border-border bg-cream/40 p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-soft cursor-pointer"
            >
              <div>
                <ServiceCardVisual type={s.visualType} title={s.title} />

                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow rounded-md bg-aqua px-2.5 py-1 text-[10px] font-bold text-primary">
                      Service {s.number}
                    </span>
                  </div>

                  <h3 className="mt-3 font-serif text-2xl text-primary group-hover:text-accent transition-colors">
                    {s.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:text-accent transition-colors">
                  {s.ctaText} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Unified Journey Reassurance */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground mb-4">
            Every service is clinician-led and tailored to your individual bite and alignment goals.
          </p>
          <Btn onClick={() => scrollToId("smile-check")}>
            Start My 60-Second Smile Check <ArrowRight className="h-4 w-4" />
          </Btn>
        </div>
      </div>
    </section>
  );
}
