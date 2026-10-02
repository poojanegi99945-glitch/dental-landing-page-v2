/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { clinic } from "./clinic-config";

export type Lead = {
  name: string;
  phone: string;
  email: string;
  concern: string;
  treatmentInterest: string;
  previousTreatment: string;
  treatmentPriority: string[];
  treatmentTimeline: string;
  consultationGoal: string[];
  leadIntent: "" | "High Intent" | "Medium Intent" | "Researching";
  preferredContactMethod: string;
  preferredAppointmentTime: string;
  smileCheckCompleted: boolean;
  smilePreviewUsed: boolean;
  resultCasesViewed: string[];
  source: string;
  campaign: string;
  landingPage: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  submittedAt: string;
};

const empty: Lead = {
  name: "",
  phone: "",
  email: "",
  concern: "",
  treatmentInterest: "",
  previousTreatment: "",
  treatmentPriority: [],
  treatmentTimeline: "",
  consultationGoal: [],
  leadIntent: "",
  preferredContactMethod: "",
  preferredAppointmentTime: "",
  smileCheckCompleted: false,
  smilePreviewUsed: false,
  resultCasesViewed: [],
  source: "",
  campaign: "",
  landingPage: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  submittedAt: "",
};

export type TrackEvent =
  | "landing_page_view"
  | "hero_cta_click"
  | "concern_selected"
  | "smile_check_started"
  | "smile_check_question_completed"
  | "smile_check_completed"
  | "treatment_options_viewed"
  | "treatment_option_selected"
  | "comparison_viewed"
  | "comparison_cta_clicked"
  | "results_section_viewed"
  | "result_filter_selected"
  | "result_case_selected"
  | "before_after_slider_used"
  | "result_fullscreen_opened"
  | "result_cta_clicked"
  | "smile_preview_started"
  | "smile_preview_completed"
  | "smile_preview_cta_clicked"
  | "consultation_form_viewed"
  | "consultation_form_started"
  | "consultation_started"
  | "consultation_submitted"
  | "whatsapp_clicked"
  | "phone_clicked"
  | "directions_clicked";

export function track(event: TrackEvent, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
}

// Internal CRM-only classification. Never shown to visitors, not a medical assessment.
export function deriveIntent(l: Lead): Lead["leadIntent"] {
  if (l.treatmentTimeline === "As soon as possible") return "High Intent";
  if (l.treatmentTimeline === "Within 1–3 months" && l.concern && l.concern !== "I'm not sure yet")
    return "High Intent";
  if (l.treatmentTimeline.startsWith("Within")) return "Medium Intent";
  if (l.treatmentInterest === "I'm comparing both") return "Medium Intent";
  return "Researching";
}

type Ctx = {
  lead: Lead;
  update: (p: Partial<Lead>) => void;
  checkDone: boolean;
  setCheckDone: (v: boolean) => void;
  recordCaseViewed: (caseId: string) => void;
  recordSmilePreviewUsed: () => void;
  submitted: boolean;
  submit: (p: Partial<Lead>) => Promise<void>;
};

const LeadCtx = createContext<Ctx | null>(null);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [lead, setLead] = useState<Lead>(empty);
  const [checkDone, setCheckDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setLead((l) => ({
      ...l,
      utmSource: q.get("utm_source") ?? "",
      utmMedium: q.get("utm_medium") ?? "",
      utmCampaign: q.get("utm_campaign") ?? "",
      utmContent: q.get("utm_content") ?? "",
      source: q.get("utm_source") ?? (document.referrer ? "referral" : "direct"),
      campaign: q.get("utm_campaign") ?? "braces-aligners",
      landingPage: window.location.href,
    }));
    track("landing_page_view");
  }, []);

  const update = (p: Partial<Lead>) => setLead((l) => ({ ...l, ...p }));

  const recordCaseViewed = (caseId: string) => {
    setLead((l) => {
      if (l.resultCasesViewed.includes(caseId)) return l;
      return { ...l, resultCasesViewed: [...l.resultCasesViewed, caseId] };
    });
  };

  const recordSmilePreviewUsed = () => {
    setLead((l) => ({ ...l, smilePreviewUsed: true }));
  };

  const handleSetCheckDone = (val: boolean) => {
    setCheckDone(val);
    setLead((l) => ({ ...l, smileCheckCompleted: val }));
  };

  const submit = async (p: Partial<Lead>) => {
    const final: Lead = {
      ...lead,
      ...p,
      smileCheckCompleted: checkDone,
      submittedAt: new Date().toISOString(),
    };
    final.leadIntent = deriveIntent(final);
    setLead(final);

    try {
      const saved = JSON.parse(localStorage.getItem("leads") || "[]");
      localStorage.setItem("leads", JSON.stringify([...saved, final]));

      if (clinic.leadWebhookUrl) {
        await fetch(clinic.leadWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(final),
        });
      }
    } catch (e) {
      console.error("Lead delivery failed", e);
    }

    track("consultation_submitted", {
      leadIntent: final.leadIntent,
      concern: final.concern,
      treatmentInterest: final.treatmentInterest,
      smileCheckCompleted: final.smileCheckCompleted,
      smilePreviewUsed: final.smilePreviewUsed,
    });
    setSubmitted(true);
  };

  return (
    <LeadCtx.Provider
      value={{
        lead,
        update,
        checkDone,
        setCheckDone: handleSetCheckDone,
        recordCaseViewed,
        recordSmilePreviewUsed,
        submitted,
        submit,
      }}
    >
      {children}
    </LeadCtx.Provider>
  );
}

export function useLead() {
  const c = useContext(LeadCtx);
  if (!c) throw new Error("useLead outside provider");
  return c;
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
