/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, HelpCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Btn, SectionHead } from "./ui";
import { useLead, track, scrollToId } from "@/lib/lead";

interface ComparisonItem {
  attribute: string;
  aligners: string;
  braces: string;
}

const COMPARISON_ROWS: ComparisonItem[] = [
  {
    attribute: "Visibility",
    aligners: "Designed to be less noticeable when worn.",
    braces: "More visible depending on the type.",
  },
  {
    attribute: "Removability",
    aligners: "Removable as instructed.",
    braces: "Fixed during treatment.",
  },
  {
    attribute: "Eating Routine",
    aligners: "Typically removed while eating.",
    braces: "Some food-care adjustments may be advised.",
  },
  {
    attribute: "Daily Commitment",
    aligners: "Requires consistent daily wear as instructed.",
    braces: "Fixed treatment with regular care required.",
  },
  {
    attribute: "Cleaning",
    aligners: "Regular teeth and aligner cleaning required.",
    braces: "Careful cleaning around brackets and wires required.",
  },
  {
    attribute: "Suitability",
    aligners: "Determined after orthodontic assessment.",
    braces: "Determined after orthodontic assessment.",
  },
];

export function CompareSection() {
  const { checkDone } = useLead();
  const [activeMobileTab, setActiveMobileTab] = useState<"aligners" | "braces">("aligners");
  const sectionRef = useRef<HTMLElement>(null);
  const hasTracked = useRef<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTracked.current) {
            hasTracked.current = true;
            track("comparison_viewed");
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCtaClick = () => {
    track("comparison_cta_clicked", { assessmentCompleted: checkDone });
    if (checkDone) {
      scrollToId("book");
    } else {
      scrollToId("smile-check");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="compare"
      className="bg-aqua px-5 py-20 md:py-28 border-b border-border/60"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHead
          eyebrow="COMPARE YOUR OPTIONS"
          title="Braces or Clear Aligners?"
          sub="See how the two options differ before discussing suitability with your orthodontist."
        />

        {/* Desktop 3-Column Comparison Table */}
        <div className="mt-12 hidden md:block overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
          <div className="grid grid-cols-[1.2fr_1.4fr_1.4fr] border-b border-border bg-cream px-8 py-5 text-sm font-bold text-primary">
            <span>Consideration</span>
            <span className="flex items-center gap-1.5 text-primary">
              <span className="h-2 w-2 rounded-full bg-accent" /> Clear Aligners
            </span>
            <span className="flex items-center gap-1.5 text-primary">
              <span className="h-2 w-2 rounded-full bg-aqua-strong" /> Braces
            </span>
          </div>

          <div className="divide-y divide-border">
            {COMPARISON_ROWS.map((row, idx) => (
              <div
                key={row.attribute}
                className={`grid grid-cols-[1.2fr_1.4fr_1.4fr] items-center px-8 py-5 text-sm transition-colors ${
                  idx % 2 === 0 ? "bg-card" : "bg-cream/40"
                }`}
              >
                <span className="font-semibold text-primary">{row.attribute}</span>
                <span className="text-foreground pr-4 leading-relaxed">{row.aligners}</span>
                <span className="text-muted-foreground leading-relaxed">{row.braces}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Tabbed/Card View */}
        <div className="mt-8 md:hidden">
          <div className="flex rounded-full bg-card p-1 border border-border shadow-xs">
            <button
              type="button"
              onClick={() => setActiveMobileTab("aligners")}
              className={`flex-1 rounded-full py-2.5 text-xs font-bold transition-all cursor-pointer ${
                activeMobileTab === "aligners"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground"
              }`}
            >
              Clear Aligners
            </button>
            <button
              type="button"
              onClick={() => setActiveMobileTab("braces")}
              className={`flex-1 rounded-full py-2.5 text-xs font-bold transition-all cursor-pointer ${
                activeMobileTab === "braces"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground"
              }`}
            >
              Braces
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {COMPARISON_ROWS.map((row) => (
              <div key={row.attribute} className="rounded-2xl border border-border bg-card p-4 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-accent">
                  {row.attribute}
                </p>
                <p className="mt-1.5 font-serif text-base text-primary">
                  {activeMobileTab === "aligners" ? row.aligners : row.braces}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-aqua text-primary mb-3">
            <HelpCircle className="h-6 w-6 text-accent" />
          </div>
          <h3 className="font-serif text-2xl text-primary">
            Not sure which option suits your needs?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Your orthodontist can assess your teeth, bite and treatment goals before discussing the
            appropriate options.
          </p>

          <div className="mt-6">
            <Btn onClick={handleCtaClick}>
              Find Out What Suits Me <ArrowRight className="h-4 w-4" />
            </Btn>
          </div>
        </div>
      </div>
    </section>
  );
}
