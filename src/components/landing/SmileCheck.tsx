/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { OptionCard, Btn, SectionHead } from "./ui";
import { useLead, track, scrollToId, type Lead } from "@/lib/lead";

export const concerns = [
  {
    key: "Crooked teeth",
    title: "Crooked Teeth",
    desc: "Some teeth appear rotated or uneven.",
    q1: "Straighter teeth",
    noun: "crooked teeth",
  },
  {
    key: "Gaps between teeth",
    title: "Gaps Between Teeth",
    desc: "Visible spaces between one or more teeth.",
    q1: "Close gaps",
    noun: "gap",
  },
  {
    key: "Crowded teeth",
    title: "Crowded Teeth",
    desc: "Teeth may overlap or have limited space.",
    q1: "Reduce crowding",
    noun: "crowding",
  },
  {
    key: "Bite concerns",
    title: "Bite Concerns",
    desc: "Concerned about how your upper and lower teeth meet.",
    q1: "Improve my bite",
    noun: "bite",
  },
  {
    key: "Not sure",
    title: "Not Sure",
    desc: "I'd like the orthodontist to take a look.",
    q1: "I'm not sure yet",
    noun: "smile",
  },
];

type Q = { field: keyof Lead; q: string; options: string[]; multi?: number };
const questions: Q[] = [
  {
    field: "concern",
    q: "What would you most like to improve?",
    options: ["Straighter teeth", "Close gaps", "Reduce crowding", "Improve my bite", "I'm not sure yet"],
  },
  {
    field: "treatmentInterest",
    q: "Which option are you currently interested in?",
    options: ["Clear aligners", "Braces", "I'm comparing both", "I need the orthodontist to recommend"],
  },
  {
    field: "previousTreatment",
    q: "Have you had braces or aligner treatment before?",
    options: [
      "No",
      "Yes, braces",
      "Yes, clear aligners",
      "I started treatment but didn't complete it",
      "Prefer to discuss this with the orthodontist",
    ],
  },
  {
    field: "treatmentPriority",
    q: "What matters most to you when considering treatment?",
    options: [
      "Less visible treatment",
      "Removable option",
      "Treatment cost",
      "Treatment duration",
      "Ease of daily routine",
      "I mainly want the orthodontist's recommendation",
    ],
    multi: 2,
  },
  {
    field: "treatmentTimeline",
    q: "When are you considering starting treatment?",
    options: ["As soon as possible", "Within 1–3 months", "Within 3–6 months", "Just researching for now"],
  },
  {
    field: "consultationGoal",
    q: "What would you like to understand during your consultation?",
    options: [
      "Which treatment suits me",
      "Approximate treatment cost",
      "Expected treatment duration",
      "Whether aligners may be an option",
      "All of the above",
    ],
    multi: 5,
  },
];

export function ConcernSelector() {
  const { lead, update } = useLead();
  const selected = concerns.find((c) => c.q1 === lead.concern);

  return (
    <section id="concern" className="bg-background px-5 py-20 md:py-28 border-b border-border/60">
      <SectionHead
        eyebrow="STEP ONE"
        title="What would you like to improve?"
        sub="Start with what you notice about your smile. An orthodontic assessment is needed to determine which treatment options are appropriate."
      />
      <div role="radiogroup" className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2">
        {concerns.map((c) => (
          <OptionCard
            key={c.key}
            title={c.title}
            desc={c.desc}
            selected={lead.concern === c.q1}
            onClick={() => {
              update({ concern: c.q1 });
              track("concern_selected", { concern: c.key });
            }}
          />
        ))}
      </div>
      <div className="mt-10 text-center">
        {selected && (
          <p className="animate-rise mb-5 font-serif text-xl italic text-primary">
            Let's learn a little more about your {selected.noun} concern.
          </p>
        )}
        <Btn
          onClick={() => {
            track("smile_check_started");
            scrollToId("smile-check");
          }}
        >
          Continue to My Smile Check <ArrowRight className="h-4 w-4" />
        </Btn>
      </div>
    </section>
  );
}

export function SmileCheck() {
  const { lead, update, checkDone, setCheckDone } = useLead();
  const [step, setStep] = useState(0);
  const q = questions[step];
  const val = lead[q.field];

  const toggle = (o: string) => {
    if (!q.multi) return update({ [q.field]: o } as Partial<Lead>);
    const arr = (val as string[]) || [];
    if (arr.includes(o)) return update({ [q.field]: arr.filter((x) => x !== o) } as Partial<Lead>);
    const next = q.multi === 2 ? [...arr, o].slice(-2) : [...arr, o];
    update({ [q.field]: next } as Partial<Lead>);
  };
  const answered = Array.isArray(val) ? val.length > 0 : !!val;

  const next = () => {
    track("smile_check_question_completed", { question: step + 1 });
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setCheckDone(true);
      track("smile_check_completed");
    }
  };

  return (
    <section id="smile-check" className="bg-aqua px-5 py-20 md:py-28 border-b border-border/60">
      <SectionHead
        eyebrow="INTERACTIVE QUALIFICATION"
        title="Your 60-Second Smile Check"
        sub="Answer a few quick questions so the clinic has more context before speaking with you."
      />
      <div className="mx-auto mt-12 max-w-2xl rounded-3xl bg-card p-6 shadow-soft md:p-10 border border-border">
        {!checkDone ? (
          <div key={step} className="animate-rise">
            <div className="mb-2 flex justify-between text-sm font-semibold text-muted-foreground">
              <span>
                Question {step + 1} of {questions.length}
              </span>
              {q.multi && <span>{q.multi === 2 ? "Choose up to two" : "Choose any"}</span>}
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${((step + 1) / questions.length) * 100}%` }}
              />
            </div>

            <h3 className="mt-8 font-serif text-2xl text-primary md:text-3xl">{q.q}</h3>

            <div role={q.multi ? "group" : "radiogroup"} className="mt-6 grid gap-3">
              {q.options.map((o) => (
                <OptionCard
                  key={o}
                  role={q.multi ? "checkbox" : "radio"}
                  title={o}
                  selected={Array.isArray(val) ? val.includes(o) : val === o}
                  onClick={() => toggle(o)}
                />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              <Btn
                variant="outline"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                aria-label="Previous question"
              >
                <ArrowLeft className="h-4 w-4" />
              </Btn>
              <Btn onClick={next} disabled={!answered} className="flex-1 sm:flex-none">
                {step === questions.length - 1 ? "See My Summary" : "Next"} <ArrowRight className="h-4 w-4" />
              </Btn>
            </div>
          </div>
        ) : (
          <div className="animate-rise">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <p className="eyebrow text-accent font-bold">ASSESSMENT COMPLETED</p>
            </div>
            <h3 className="mt-1 font-serif text-3xl text-primary">
              Your Smile Consultation Summary
            </h3>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Your main concern", lead.concern],
                ["You're interested in", lead.treatmentInterest],
                ["What matters to you", lead.treatmentPriority.join(" + ")],
                ["Your timing", lead.treatmentTimeline],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-cream p-4 border border-border">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k}</dt>
                  <dd className="mt-1 font-serif text-lg text-primary">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 border-l-2 border-accent pl-4 text-xs text-muted-foreground leading-relaxed">
              Your answers give the orthodontic team useful context for your consultation. Whether
              braces, clear aligners or another approach is appropriate can only be determined after a
              clinical assessment.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Btn onClick={() => scrollToId("book")}>
                Request My Consultation <ArrowRight className="h-4 w-4" />
              </Btn>
              <Btn variant="outline" onClick={() => scrollToId("treatment-options")}>
                Explore Treatment Options
              </Btn>
            </div>

            <button
              type="button"
              className="mt-4 text-xs text-muted-foreground underline hover:text-primary cursor-pointer"
              onClick={() => {
                setCheckDone(false);
                setStep(0);
              }}
            >
              Change my answers
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
