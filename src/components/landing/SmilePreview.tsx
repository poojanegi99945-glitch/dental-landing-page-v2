/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ArrowRight, Info, Sparkles, CheckCircle2 } from "lucide-react";
import { Btn } from "./ui";
import { track, scrollToId } from "@/lib/lead";
import { clinic } from "@/lib/clinic-config";

export function SmilePreview() {
  return (
    <section
      id="smile-preview"
      className="bg-background px-5 py-20 md:py-28 border-b border-border/60"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] rounded-3xl border border-border bg-cream p-8 md:p-14 shadow-soft">
          {/* LEFT SIDE */}
          <div>
            <span className="eyebrow rounded-full bg-aqua px-3.5 py-1.5 text-xs font-bold text-primary inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> SMILE PREVIEW
            </span>

            <h2 className="mt-4 font-serif text-3xl leading-tight text-primary md:text-5xl">
              Visualise Your Smile Journey
            </h2>

            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              See an illustrative smile preview and discuss possible orthodontic treatment options
              with our team at {clinic.shortName}.
            </p>

            <ul className="mt-6 space-y-2.5 text-sm text-foreground">
              {[
                "Illustrative digital simulation of dental alignment",
                "Understand potential arch coordination and symmetry",
                "Discuss options during your orthodontic assessment",
              ].map((text) => (
                <li key={text} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Btn
                onClick={() => {
                  track("hero_cta_click", { location: "smile_preview_showcase" });
                  scrollToId("compare");
                }}
              >
                Explore My Options <ArrowRight className="h-4 w-4" />
              </Btn>

              <button
                type="button"
                onClick={() => scrollToId("book")}
                className="text-sm font-semibold text-primary underline-offset-4 hover:underline cursor-pointer"
              >
                Book Consultation with {clinic.shortName}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: Prepared Static Smile Comparison Graphic */}
          <div className="flex flex-col items-center">
            <div className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl border-2 border-border bg-[#090b10] shadow-soft">
              {/* Static Split: Left Before | Right After */}
              <div className="absolute inset-0 grid grid-cols-2">
                {/* BEFORE */}
                <div className="relative h-full w-full overflow-hidden border-r border-white/30 bg-gradient-to-br from-[#121c24] to-[#080d12]">
                  <svg viewBox="0 0 240 180" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
                    {/* Upper gingiva */}
                    <path d="M 10,30 C 60,20 120,35 230,25 L 230,70 C 180,55 120,60 10,58 Z" fill="#be3d52" opacity="0.9" />
                    {/* Irregular / crowded pre-op teeth */}
                    <g fill="#f5f5f4">
                      <rect x="35" y="55" width="28" height="52" rx="4" transform="rotate(-6 35 55)" />
                      <rect x="68" y="50" width="36" height="62" rx="5" />
                      <rect x="102" y="52" width="30" height="56" rx="4" fill="#e2e8f0" transform="rotate(7 102 52)" />
                      <rect x="136" y="51" width="34" height="60" rx="5" />
                      <rect x="175" y="56" width="28" height="52" rx="4" />
                    </g>
                    {/* Lower lip line */}
                    <path d="M 0,135 C 70,152 170,152 240,135 L 240,180 L 0,180 Z" fill="#2d1319" opacity="0.9" />
                  </svg>
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/80 px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                    BEFORE
                  </span>
                </div>

                {/* AFTER (Illustrative Preview) */}
                <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#0c2333] via-primary to-[#0c2333]">
                  <svg viewBox="0 0 240 180" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
                    {/* Harmonious gumline */}
                    <path d="M 10,28 C 70,22 170,22 230,28 L 230,65 C 170,58 70,58 10,65 Z" fill="#be3d52" opacity="0.9" />
                    {/* Aligned smile arc */}
                    <g fill="#f8fafc">
                      <rect x="30" y="54" width="28" height="54" rx="4" />
                      <rect x="62" y="49" width="34" height="60" rx="5" />
                      <rect x="98" y="48" width="38" height="62" rx="5" />
                      <rect x="138" y="48" width="38" height="62" rx="5" />
                      <rect x="178" y="53" width="28" height="55" rx="4" />
                      {/* Specular enamel reflection */}
                      <path d="M 112,58 Q 114,80 112,100" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
                      <path d="M 152,58 Q 150,80 152,100" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
                    </g>
                    {/* Lower lip smile arc */}
                    <path d="M 0,135 C 70,158 170,158 240,135 L 240,180 L 0,180 Z" fill="#2d1319" opacity="0.9" />
                  </svg>
                  <span className="absolute bottom-3 right-3 rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-accent-foreground uppercase tracking-wider backdrop-blur-xs">
                    AFTER
                  </span>
                </div>
              </div>

              {/* Static Center Divider */}
              <div className="pointer-events-none absolute bottom-0 top-0 left-1/2 w-0.5 -translate-x-1/2 bg-white/80 shadow-md">
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-white bg-primary text-white text-[10px] font-bold shadow-md">
                  ⇄
                </div>
              </div>

              {/* Top watermark badge */}
              <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-mono text-slate-300 backdrop-blur-xs">
                ILLUSTRATIVE VISUALISATION
              </span>
            </div>
          </div>
        </div>

        {/* SMILE PREVIEW DISCLAIMER directly underneath */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-4 text-xs text-muted-foreground leading-relaxed shadow-xs max-w-4xl mx-auto">
          <div className="flex items-start gap-2.5">
            <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <p>
              <strong className="text-foreground">Illustrative preview only: </strong>
              This does not represent a diagnosis, treatment plan or guaranteed treatment outcome.
              Actual orthodontic results vary and require clinical assessment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
