/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-accent text-accent-foreground shadow-accent hover:brightness-105 active:scale-[0.98]",
  deep: "bg-primary text-primary-foreground hover:bg-deep",
  outline: "border border-primary/25 text-primary hover:bg-secondary",
  ghostLight: "border border-deep-line text-deep-foreground hover:bg-deep-line/40",
};

export function Btn({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 cursor-pointer",
        variants[variant],
        className,
      )}
    />
  );
}

export function OptionCard({
  selected,
  onClick,
  title,
  desc,
  role = "radio",
}: {
  selected: boolean;
  onClick: () => void;
  title: ReactNode;
  desc?: ReactNode;
  role?: "radio" | "checkbox";
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-2xl border-2 bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
        selected ? "border-accent bg-accent/5 shadow-soft" : "border-border",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          selected ? "border-accent bg-accent text-accent-foreground" : "border-input bg-card",
        )}
      >
        {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      <span>
        <span className="block font-semibold text-foreground">{title}</span>
        {desc && <span className="mt-1 block text-sm text-muted-foreground">{desc}</span>}
      </span>
    </button>
  );
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  dark,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className={cn("eyebrow mb-4 tracking-widest", dark ? "text-aqua-strong" : "text-accent")}>
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-4xl leading-tight md:text-5xl font-serif",
          dark ? "text-deep-foreground" : "text-primary",
        )}
      >
        {title}
      </h2>
      {sub && (
        <p className={cn("mt-4 text-base md:text-lg", dark ? "text-deep-muted" : "text-muted-foreground")}>
          {sub}
        </p>
      )}
    </div>
  );
}

export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>
    {children}
  </label>
);

export const inputCls =
  "h-12 w-full rounded-2xl border border-input bg-card px-4 text-base text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25 placeholder:text-muted-foreground/60";

export function Segmented({
  options,
  value,
  onChange,
  name,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  name: string;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-3">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn(
            "min-h-12 flex-1 rounded-2xl border-2 px-4 text-sm font-semibold transition cursor-pointer",
            value === o
              ? "border-accent bg-accent/5 text-foreground"
              : "border-border bg-card text-foreground hover:bg-muted/40",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
