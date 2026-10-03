import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export interface LeadGamesLeadData {
  name: string;
  mobile: string;
  email: string;
  note: string;
  source: string;
  leadOwner: string;
  pageUrl: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  submittedAt: string;
}

/**
 * Analytics dispatcher ready for Meta Pixel, GA4, GTM, or custom analytics integration.
 */
export function dispatchLeadGamesAnalytics(
  eventName:
    | "lead_games_popup_viewed"
    | "lead_games_popup_closed"
    | "lead_games_popup_minimized"
    | "lead_games_floating_cta_viewed"
    | "lead_games_floating_cta_clicked"
    | "lead_games_popup_reopened"
    | "lead_games_popup_form_started"
    | "lead_games_popup_submitted"
    | "lead_games_popup_success",
  data?: Record<string, unknown>,
) {
  if (typeof window !== "undefined") {
    // Window custom event hook for analytics listener
    window.dispatchEvent(
      new CustomEvent(eventName, { detail: data || {} }),
    );
    // Ready for future gtag / fbq if configured
    const win = window as unknown as {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
      fbq?: (...args: unknown[]) => void;
    };
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({ event: eventName, ...data });
    }
  }
}

/**
 * Clean reusable submission function ready for CRM / n8n / Webhook connection.
 */
export async function submitLeadGamesEnquiry(
  lead: LeadGamesLeadData,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Record lead safely in browser storage for testing & durability
    const existingRaw = localStorage.getItem("lead_games_leads");
    const existing: LeadGamesLeadData[] = existingRaw
      ? JSON.parse(existingRaw)
      : [];
    existing.push(lead);
    localStorage.setItem("lead_games_leads", JSON.stringify(existing));

    // Simulated network turn (900ms) for realistic UX and loading state
    await new Promise((resolve) => setTimeout(resolve, 900));

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to submit lead",
    };
  }
}

export function LeadGamesLeadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStartedForm, setHasStartedForm] = useState(false);

  // Form fields: EXACTLY FOUR (Name, Mobile Number, Email ID, Note)
  // Preserved across minimization and reopening!
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  // Inline validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    mobile?: string;
    email?: string;
  }>({});

  // Focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const floatingCtaRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Read UTM and referrer params once on mount
  const attributionRef = useRef({
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    utmTerm: "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
    pageUrl: typeof window !== "undefined" ? window.location.href : "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      attributionRef.current = {
        utmSource: searchParams.get("utm_source") || "",
        utmMedium: searchParams.get("utm_medium") || "",
        utmCampaign: searchParams.get("utm_campaign") || "",
        utmContent: searchParams.get("utm_content") || "",
        utmTerm: searchParams.get("utm_term") || "",
        referrer: document.referrer || "",
        pageUrl: window.location.href,
      };
    }
  }, []);

  // 10-Second Automatic Timer trigger (only ONCE per browser session)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if URL has test overrides
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset_popup") === "true") {
      sessionStorage.removeItem("leadGamesPopupShown");
      sessionStorage.removeItem("leadGamesPopupSubmitted");
    }

    const isSubmitted = sessionStorage.getItem("leadGamesPopupSubmitted") === "true";
    if (isSubmitted) {
      setHasSubmitted(true);
      return;
    }

    const alreadyShown = sessionStorage.getItem("leadGamesPopupShown") === "true";

    // Immediate popup test override via URL (?popup=true or ?test_popup=true)
    if (params.get("popup") === "true" || params.get("test_popup") === "true") {
      sessionStorage.setItem("leadGamesPopupShown", "true");
      setIsOpen(true);
      setIsMinimized(false);
      dispatchLeadGamesAnalytics("lead_games_popup_viewed");
      return;
    }

    // If already shown earlier in this session, restore the floating CTA so the user can reopen it
    if (alreadyShown) {
      console.info("[Lead Games] Popup was already triggered in this browser session. Floating CTA is active.");
      setIsMinimized(true);
      return;
    }

    console.info("[Lead Games] 10-second timer started. Popup will appear in 10 seconds.");

    const timer = setTimeout(() => {
      // Re-verify session storage before popping up
      const checkAgain = sessionStorage.getItem("leadGamesPopupShown");
      if (checkAgain !== "true") {
        sessionStorage.setItem("leadGamesPopupShown", "true");
        previousFocusRef.current = document.activeElement as HTMLElement | null;
        setIsOpen(true);
        setIsMinimized(false);
        console.info("[Lead Games] 10 seconds elapsed. Popup automatically displayed.");
        dispatchLeadGamesAnalytics("lead_games_popup_viewed");
      }
    }, 10000); // exactly 10 seconds

    // Expose helpers on window for easy testing in browser console
    const win = window as unknown as {
      openLeadGamesPopup?: () => void;
      resetLeadGamesPopup?: () => void;
    };
    win.openLeadGamesPopup = () => {
      sessionStorage.setItem("leadGamesPopupShown", "true");
      setIsOpen(true);
      setIsMinimized(false);
    };
    win.resetLeadGamesPopup = () => {
      sessionStorage.removeItem("leadGamesPopupShown");
      sessionStorage.removeItem("leadGamesPopupSubmitted");
      setIsOpen(false);
      setIsMinimized(false);
      setHasSubmitted(false);
      console.info("[Lead Games] Popup state reset. Refresh to re-test 10s timer.");
    };

    return () => clearTimeout(timer);
  }, []);

  // Prevent background scrolling while open & restore scroll position
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Focus first input (or modal if empty)
      const focusTimer = setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        } else if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 50);

      return () => {
        document.body.style.overflow = originalOverflow;
        clearTimeout(focusTimer);
      };
    }
  }, [isOpen]);

  // Handle ESC key press and focus trap
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        handleMinimize();
      }

      // Simple Focus Trap inside modal
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusableElements.length === 0) return;
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // When visitor closes or presses ESC: minimize into Floating CTA
  const handleMinimize = () => {
    setIsOpen(false);
    sessionStorage.setItem("leadGamesPopupShown", "true");
    dispatchLeadGamesAnalytics("lead_games_popup_closed");

    // If already submitted, do not show floating CTA
    if (!hasSubmitted) {
      setIsMinimized(true);
      dispatchLeadGamesAnalytics("lead_games_popup_minimized");
      dispatchLeadGamesAnalytics("lead_games_floating_cta_viewed");
    }

    // Restore previous focus if available
    if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
      previousFocusRef.current.focus();
    }
  };

  // When visitor clicks the Floating CTA: reopen the SAME popup with preserved data
  const handleReopen = () => {
    previousFocusRef.current = floatingCtaRef.current;
    dispatchLeadGamesAnalytics("lead_games_floating_cta_clicked");
    dispatchLeadGamesAnalytics("lead_games_popup_reopened");
    setIsMinimized(false);
    setIsOpen(true);
  };

  const handleFieldFocus = () => {
    if (!hasStartedForm) {
      setHasStartedForm(true);
      dispatchLeadGamesAnalytics("lead_games_popup_form_started");
    }
  };

  // Indian phone validator + international check:
  // Accepts 10-digit numbers (like 9876543210), optional +91 or 0 prefix, spaces or dashes
  const validateMobile = (value: string): boolean => {
    const cleaned = value.replace(/[\s\-\(\)]/g, "");
    return /^(?:\+?91|0)?[6-9]\d{9}$/.test(cleaned);
  };

  // Standard email format validator
  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newErrors: { name?: string; mobile?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Please enter your name";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!mobile.trim()) {
      newErrors.mobile = "Please enter your mobile number";
    } else if (!validateMobile(mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    dispatchLeadGamesAnalytics("lead_games_popup_submitted", {
      name: name.trim(),
      email: email.trim(),
    });

    const leadPayload: LeadGamesLeadData = {
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      note: note.trim(),
      source: "ABC Dentals Interactive Demo",
      leadOwner: "Lead Games",
      pageUrl: attributionRef.current.pageUrl,
      referrer: attributionRef.current.referrer,
      utmSource: attributionRef.current.utmSource,
      utmMedium: attributionRef.current.utmMedium,
      utmCampaign: attributionRef.current.utmCampaign,
      utmContent: attributionRef.current.utmContent,
      utmTerm: attributionRef.current.utmTerm,
      submittedAt: new Date().toISOString(),
    };

    const res = await submitLeadGamesEnquiry(leadPayload);

    setIsSubmitting(false);
    if (res.success) {
      setHasSubmitted(true);
      setIsMinimized(false);
      sessionStorage.setItem("leadGamesPopupShown", "true");
      dispatchLeadGamesAnalytics("lead_games_popup_success");
    }
  };

  // Close from success state
  const handleSuccessClose = () => {
    setIsOpen(false);
    setIsMinimized(false); // Do NOT show floating CTA after successful submission
  };

  return (
    <>
      {/* FLOATING CTA (Bottom-right, appears when minimized, hidden if modal open or after submission) */}
      {isMinimized && !isOpen && !hasSubmitted && (
        <div
          className="fixed bottom-[84px] right-4 md:bottom-6 md:right-6 z-40 animate-in fade-in slide-in-from-bottom-2 duration-300"
          style={{
            fontFamily:
              "Plus Jakarta Sans, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
          }}
        >
          <button
            ref={floatingCtaRef}
            type="button"
            onClick={handleReopen}
            aria-label="Contact Lead Games about a landing page for my clinic"
            className="group flex items-center gap-2.5 pl-3 pr-4 py-2.5 md:pl-3.5 md:pr-5 md:py-3 rounded-full bg-[#0B1B3A] text-white border border-[#5B3DF5]/40 shadow-xl shadow-[#0B1B3A]/30 hover:shadow-2xl hover:bg-[#122347] hover:border-[#5B3DF5] active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] focus:ring-offset-2"
          >
            {/* Small Lead Games text badge / icon */}
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#5B3DF5] text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </span>

            <div className="flex flex-col text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B3DF5] leading-none mb-0.5">
                Lead Games
              </span>
              <span className="text-xs sm:text-sm font-bold tracking-tight text-white group-hover:text-white leading-tight">
                <span className="hidden sm:inline">Get This for Your Clinic</span>
                <span className="sm:hidden">Get This for Your Clinic</span>
              </span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all ml-0.5" />
          </button>
        </div>
      )}

      {/* LEAD GAMES MODAL POPUP */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-games-modal-title"
          aria-describedby="lead-games-modal-desc"
        >
          {/* Dark translucent backdrop */}
          <div
            className="fixed inset-0 bg-[#0B1B3A]/75 backdrop-blur-sm transition-opacity duration-200"
            onClick={handleMinimize}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div
            ref={modalRef}
            tabIndex={-1}
            className="relative z-10 w-full max-w-[540px] my-auto bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
            style={{
              fontFamily:
                "Plus Jakarta Sans, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
            }}
          >
            {/* Subtle decorative top accent line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#5B3DF5] via-[#7B61FF] to-[#FF7A1A]" />

            {/* Close Button X */}
            <button
              type="button"
              onClick={hasSubmitted ? handleSuccessClose : handleMinimize}
              aria-label="Close dialog"
              className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-[#0B1B3A] hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Inner Content */}
            <div className="p-6 sm:p-8">
              {!hasSubmitted ? (
                <div>
                  {/* Header / Brand */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black tracking-wider uppercase bg-[#0B1B3A] text-white">
                      LEAD GAMES
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      Interactive Demo
                    </span>
                  </div>

                  {/* Headline */}
                  <h2
                    id="lead-games-modal-title"
                    className="text-xl sm:text-2xl font-extrabold text-[#0B1B3A] tracking-tight leading-snug"
                  >
                    Want a Landing Page Like This for Your Clinic?
                  </h2>

                  {/* Supporting Text */}
                  <p
                    id="lead-games-modal-desc"
                    className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed"
                  >
                    We build interactive lead-generation experiences for clinics.
                    Share your details and our team will get in touch.
                  </p>

                  {/* Small Context Note */}
                  <div className="mt-3 py-1.5 px-3 rounded-lg bg-[#F6F7FB] border border-slate-200/60 text-[11px] text-slate-500">
                    You're currently viewing our interactive dental landing-page demo.
                  </div>

                  {/* EXACTLY FOUR FORM FIELDS */}
                  <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {/* FIELD 1: Name */}
                    <div>
                      <label
                        htmlFor="lg-name"
                        className="block text-xs font-bold uppercase tracking-wider text-[#0B1B3A] mb-1.5"
                      >
                        Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        ref={firstInputRef}
                        id="lg-name"
                        type="text"
                        name="name"
                        autoComplete="name"
                        placeholder="Your Name"
                        value={name}
                        onFocus={handleFieldFocus}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) {
                            setErrors((prev) => ({ ...prev, name: undefined }));
                          }
                        }}
                        className={`w-full min-h-[48px] px-3.5 py-2.5 text-sm rounded-xl bg-white border ${
                          errors.name
                            ? "border-rose-500 ring-1 ring-rose-500"
                            : "border-slate-300 hover:border-slate-400 focus:border-[#5B3DF5] focus:ring-2 focus:ring-[#5B3DF5]/20"
                        } text-slate-900 placeholder:text-slate-400 outline-none transition-all`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-rose-600 font-medium">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* FIELD 2: Mobile Number */}
                    <div>
                      <label
                        htmlFor="lg-mobile"
                        className="block text-xs font-bold uppercase tracking-wider text-[#0B1B3A] mb-1.5"
                      >
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="lg-mobile"
                        type="tel"
                        inputMode="tel"
                        name="mobile"
                        autoComplete="tel"
                        placeholder="Your Mobile Number"
                        value={mobile}
                        onFocus={handleFieldFocus}
                        onChange={(e) => {
                          setMobile(e.target.value);
                          if (errors.mobile) {
                            setErrors((prev) => ({ ...prev, mobile: undefined }));
                          }
                        }}
                        className={`w-full min-h-[48px] px-3.5 py-2.5 text-sm rounded-xl bg-white border ${
                          errors.mobile
                            ? "border-rose-500 ring-1 ring-rose-500"
                            : "border-slate-300 hover:border-slate-400 focus:border-[#5B3DF5] focus:ring-2 focus:ring-[#5B3DF5]/20"
                        } text-slate-900 placeholder:text-slate-400 outline-none transition-all`}
                      />
                      {errors.mobile && (
                        <p className="mt-1 text-xs text-rose-600 font-medium">
                          {errors.mobile}
                        </p>
                      )}
                    </div>

                    {/* FIELD 3: Email ID */}
                    <div>
                      <label
                        htmlFor="lg-email"
                        className="block text-xs font-bold uppercase tracking-wider text-[#0B1B3A] mb-1.5"
                      >
                        Email ID <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="lg-email"
                        type="email"
                        inputMode="email"
                        name="email"
                        autoComplete="email"
                        placeholder="Your Email Address"
                        value={email}
                        onFocus={handleFieldFocus}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) {
                            setErrors((prev) => ({ ...prev, email: undefined }));
                          }
                        }}
                        className={`w-full min-h-[48px] px-3.5 py-2.5 text-sm rounded-xl bg-white border ${
                          errors.email
                            ? "border-rose-500 ring-1 ring-rose-500"
                            : "border-slate-300 hover:border-slate-400 focus:border-[#5B3DF5] focus:ring-2 focus:ring-[#5B3DF5]/20"
                        } text-slate-900 placeholder:text-slate-400 outline-none transition-all`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-rose-600 font-medium">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* FIELD 4: Note */}
                    <div>
                      <label
                        htmlFor="lg-note"
                        className="block text-xs font-bold uppercase tracking-wider text-[#0B1B3A] mb-1.5"
                      >
                        Note <span className="text-xs font-normal text-slate-400 normal-case">(Optional)</span>
                      </label>
                      <textarea
                        id="lg-note"
                        name="note"
                        rows={3}
                        placeholder="Tell us briefly what you're looking for..."
                        value={note}
                        onFocus={handleFieldFocus}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-slate-300 hover:border-slate-400 focus:border-[#5B3DF5] focus:ring-2 focus:ring-[#5B3DF5]/20 text-slate-900 placeholder:text-slate-400 outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Primary CTA */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full min-h-[48px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-[#5B3DF5] hover:bg-[#4828E8] active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none shadow-md shadow-[#5B3DF5]/20 transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          SUBMIT
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </button>

                    {/* Privacy Text */}
                    <p className="text-center text-[12px] text-slate-500 leading-normal pt-1">
                      “Your details will only be used by Lead Games to respond to your enquiry.”
                    </p>
                  </form>
                </div>
              ) : (
                /* SUCCESS STATE */
                <div className="py-6 sm:py-8 text-center animate-in fade-in duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-[#0B1B3A] text-white mb-2">
                    LEAD GAMES
                  </span>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1B3A] tracking-tight">
                    Thanks! We Received Your Enquiry.
                  </h3>

                  <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-sm mx-auto">
                    The Lead Games team will get in touch with you shortly.
                  </p>

                  <div className="mt-8 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleSuccessClose}
                      className="w-full min-h-[48px] px-6 py-3 rounded-xl font-bold text-white bg-[#0B1B3A] hover:bg-[#152a54] active:scale-[0.99] shadow-md transition-all cursor-pointer"
                    >
                      Continue Exploring Demo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
