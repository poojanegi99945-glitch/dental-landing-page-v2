/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
  X,
  CheckCircle2,
  Clock,
  Layers,
  Target,
  Camera,
  Upload,
  Link as LinkIcon,
  RotateCcw,
} from "lucide-react";
import {
  STATIC_RESULTS,
  RESULT_FILTERS,
  type StaticResultCase,
  type ResultFilterTag,
} from "@/lib/results-config";
import { StaticBeforeAfterImage } from "./StaticBeforeAfterCard";
import { Btn, SectionHead } from "./ui";
import { track, scrollToId } from "@/lib/lead";
import { clinic } from "@/lib/clinic-config";

export function BeforeAfterResults() {
  const [activeFilter, setActiveFilter] = useState<ResultFilterTag>("all");
  const [activeModalCase, setActiveModalCase] = useState<StaticResultCase | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasTracked = useRef<boolean>(false);
  const [, setCustomImgState] = useState<number>(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeModalCase) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        try {
          localStorage.setItem(`custom_case_img_${activeModalCase.id}`, dataUrl);
          window.dispatchEvent(new Event("case_image_updated"));
          setCustomImgState((prev) => prev + 1);
        } catch {
          window.alert("Image is large for browser storage. Please try a compressed image under 2MB or use a URL.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlPrompt = () => {
    if (!activeModalCase) return;
    const url = window.prompt(`Enter image URL for ${activeModalCase.concern} (PNG, JPG, or WebP):`);
    if (url && url.trim()) {
      localStorage.setItem(`custom_case_img_${activeModalCase.id}`, url.trim());
      window.dispatchEvent(new Event("case_image_updated"));
      setCustomImgState((prev) => prev + 1);
    }
  };

  const handleResetImage = () => {
    if (!activeModalCase) return;
    localStorage.removeItem(`custom_case_img_${activeModalCase.id}`);
    window.dispatchEvent(new Event("case_image_updated"));
    setCustomImgState((prev) => prev + 1);
  };

  // Filter cases
  const filteredCases = STATIC_RESULTS.filter((c) => {
    if (activeFilter === "all") return true;
    return c.tags.includes(activeFilter);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTracked.current) {
            hasTracked.current = true;
            track("results_section_viewed");
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleFilterSelect = (filterId: ResultFilterTag) => {
    setActiveFilter(filterId);
    track("result_filter_selected", { filterSelected: filterId });
  };

  const handleScroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = direction === "left" ? -320 : 320;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="results"
      className="bg-cream px-5 py-20 md:py-28 border-b border-border/60"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <SectionHead
          eyebrow="REAL PATIENT RESULTS"
          title="Real People. Real Smile Journeys."
          sub={`Explore orthodontic treatment examples from ${clinic.shortName}. Every smile, treatment plan and outcome is individual.`}
        />

        {/* Filter Chips (Horizontally scrollable on mobile) */}
        <div className="mt-10 flex justify-start md:justify-center overflow-x-auto pb-3 scrollbar-none">
          <div
            role="tablist"
            aria-label="Filter results by treatment type or concern"
            className="flex items-center gap-2 p-1.5 rounded-2xl bg-card border border-border shadow-xs"
          >
            {RESULT_FILTERS.map((f) => {
              const isSelected = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleFilterSelect(f.id)}
                  className={`min-h-10 whitespace-nowrap rounded-xl px-4 text-xs md:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Carousel Controls Header */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground">
            Showing {filteredCases.length} {filteredCases.length === 1 ? "case" : "cases"}
          </p>
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Previous cases"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-primary hover:bg-secondary transition cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Next cases"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-primary hover:bg-secondary transition cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results Carousel */}
        {/* Desktop ~4 cards, Tablet 2-3 cards, Mobile ~1.15 cards */}
        <div
          ref={carouselRef}
          className="mt-4 flex gap-5 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory"
        >
          {filteredCases.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                setActiveModalCase(c);
                track("result_case_selected", { caseId: c.id, concern: c.concern });
              }}
              className="group flex-none w-[82vw] max-w-[310px] sm:w-[280px] lg:w-[260px] rounded-3xl border border-border bg-card p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-soft cursor-pointer snap-start flex flex-col justify-between"
            >
              <div>
                {/* Prepared Static Before/After Image */}
                <StaticBeforeAfterImage caseData={c} />

                {/* Case Details */}
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-accent">
                      {c.concern}
                    </span>
                    <span className="rounded-full bg-aqua px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {c.treatment}
                    </span>
                  </div>

                  <p className="font-serif text-base font-medium text-foreground pt-1">
                    {c.duration}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-primary font-semibold">
                <span>View Case Details</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Results Disclaimer directly under carousel */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-6 text-xs text-muted-foreground leading-relaxed shadow-xs">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <p>
              <strong className="text-foreground">Clinical Note & Disclaimer: </strong>
              Individual orthodontic needs, treatment plans, treatment duration and outcomes vary.
              These examples represent clinic cases where appropriate patient consent has been
              obtained and do not guarantee the same result for every patient. An orthodontic
              assessment is required to discuss your individual treatment options.
            </p>
          </div>
        </div>

        {/* Results CTA Block */}
        <div className="mt-14 rounded-3xl bg-card border border-border p-8 md:p-12 text-center shadow-soft">
          <p className="eyebrow text-accent font-bold tracking-widest mb-2">
            WONDERING ABOUT YOUR OWN SMILE?
          </p>
          <h3 className="font-serif text-3xl md:text-4xl text-primary max-w-2xl mx-auto leading-tight">
            Explore Your Treatment Options
          </h3>
          <p className="mt-4 max-w-xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed">
            An orthodontic assessment can help you understand your teeth, bite and available
            treatment options.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Btn
              onClick={() => {
                track("hero_cta_click", { location: "results_cta" });
                scrollToId("book");
              }}
              className="w-full sm:w-auto"
            >
              Book My Aligner Consultation <ArrowRight className="h-4 w-4" />
            </Btn>
            <button
              type="button"
              onClick={() => scrollToId("compare")}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/25 px-6 text-sm font-semibold text-primary hover:bg-secondary transition cursor-pointer"
            >
              Compare Braces & Aligners
            </button>
          </div>
        </div>
      </div>

      {/* Case Lightbox Modal */}
      {activeModalCase && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-rise"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModalCase(null);
          }}
        >
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl text-foreground">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="eyebrow text-accent font-bold">
                  {activeModalCase.caseNumber} · {activeModalCase.concern}
                </span>
                <h3 className="mt-1 font-serif text-2xl text-primary">
                  {activeModalCase.treatment}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalCase(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5">
              <StaticBeforeAfterImage caseData={activeModalCase} className="aspect-[16/10]" />

              {/* In-App Clinic Photo Uploader */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-secondary/50 p-2.5 text-xs border border-border">
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-accent" />
                  Clinic Case Photo:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 rounded-lg bg-card px-2.5 py-1 text-xs font-semibold text-primary border border-border hover:bg-background transition cursor-pointer shadow-2xs"
                  >
                    <Upload className="h-3 w-3 text-accent" /> Upload Photo
                  </button>
                  <button
                    type="button"
                    onClick={handleUrlPrompt}
                    className="inline-flex items-center gap-1 rounded-lg bg-card px-2.5 py-1 text-xs font-semibold text-foreground border border-border hover:bg-background transition cursor-pointer shadow-2xs"
                  >
                    <LinkIcon className="h-3 w-3 text-muted-foreground" /> Paste URL
                  </button>
                  {typeof window !== "undefined" &&
                    localStorage.getItem(`custom_case_img_${activeModalCase.id}`) && (
                      <button
                        type="button"
                        onClick={handleResetImage}
                        title="Reset to default illustration"
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-destructive hover:bg-destructive/10 transition cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" /> Reset
                      </button>
                    )}
                </div>
              </div>
            </div>

            <dl className="mt-6 divide-y divide-border border-y border-border text-xs sm:text-sm">
              <div className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">Primary Concern</dt>
                <dd className="font-semibold text-foreground">{activeModalCase.concern}</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">Treatment</dt>
                <dd className="font-semibold text-foreground">{activeModalCase.treatment}</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">Duration</dt>
                <dd className="font-semibold text-foreground">{activeModalCase.duration}</dd>
              </div>
            </dl>

            <div className="mt-4 rounded-2xl bg-cream p-4 text-xs text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground mb-1">Clinical Context</p>
              {activeModalCase.description}
            </div>

            <div className="mt-6 text-center">
              <Btn
                onClick={() => {
                  setActiveModalCase(null);
                  scrollToId("book");
                }}
                className="w-full sm:w-auto"
              >
                Discuss Similar Case With Orthodontist <ArrowRight className="h-4 w-4" />
              </Btn>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
