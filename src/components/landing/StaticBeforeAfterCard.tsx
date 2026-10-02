/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import type { StaticResultCase } from "@/lib/results-config";

interface StaticBeforeAfterProps {
  caseData: StaticResultCase;
  className?: string;
}

export function StaticBeforeAfterImage({ caseData, className = "" }: StaticBeforeAfterProps) {
  const { clinicalType } = caseData;

  return (
    <div
      className={`relative aspect-[16/10] w-full select-none overflow-hidden rounded-2xl bg-[#090b10] border border-border shadow-xs ${className}`}
    >
      {/* Side-by-side static split: LEFT is Before, RIGHT is After */}
      <div className="absolute inset-0 grid grid-cols-2">
        {/* LEFT: Before */}
        <div className="relative h-full w-full overflow-hidden border-r border-white/20 bg-gradient-to-br from-[#101b24] to-[#080d12]">
          <svg viewBox="0 0 200 150" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
            {/* Gum tissue */}
            <path
              d="M 10,25 C 50,15 100,30 190,20 L 190,55 C 150,45 100,50 10,48 Z"
              fill="#be3d52"
              opacity="0.9"
            />
            {/* Before Teeth - specific malocclusion */}
            {clinicalType === "spacing" ? (
              <g fill="#f5f5f4">
                <rect x="25" y="45" width="22" height="42" rx="4" />
                <rect x="52" y="42" width="26" height="48" rx="5" />
                {/* Diastema gap */}
                <rect x="110" y="42" width="26" height="48" rx="5" />
                <rect x="142" y="45" width="22" height="42" rx="4" />
              </g>
            ) : clinicalType === "crowding" || clinicalType === "crooked" ? (
              <g fill="#f5f5f4">
                <rect x="30" y="46" width="24" height="44" rx="4" transform="rotate(-5 30 46)" />
                {/* Overlapping central */}
                <rect x="58" y="42" width="30" height="52" rx="5" />
                {/* Rotated overlapping lateral */}
                <rect x="85" y="44" width="26" height="48" rx="4" fill="#e2e8f0" transform="rotate(8 85 44)" />
                <rect x="115" y="43" width="28" height="50" rx="5" />
                <rect x="146" y="47" width="24" height="43" rx="4" />
              </g>
            ) : clinicalType === "open-bite" ? (
              <g fill="#f5f5f4">
                {/* Incisors not meeting vertically */}
                <rect x="35" y="38" width="24" height="38" rx="4" />
                <rect x="65" y="35" width="28" height="40" rx="5" />
                <rect x="98" y="35" width="28" height="40" rx="5" />
                <rect x="130" y="38" width="24" height="38" rx="4" />
                {/* Lower open incisal curve */}
                <rect x="68" y="98" width="25" height="30" rx="4" fill="#cbd5e1" opacity="0.6" />
                <rect x="98" y="98" width="25" height="30" rx="4" fill="#cbd5e1" opacity="0.6" />
              </g>
            ) : (
              /* Deep bite or Forwardly placed */
              <g fill="#f5f5f4">
                <rect x="30" y="45" width="24" height="45" rx="4" />
                <rect x="60" y="40" width="32" height="60" rx="5" />
                <rect x="98" y="40" width="32" height="60" rx="5" />
                <rect x="136" y="45" width="24" height="45" rx="4" />
              </g>
            )}
            {/* Lip contour */}
            <path d="M 0,110 C 60,125 140,125 200,110 L 200,150 L 0,150 Z" fill="#2d1319" opacity="0.9" />
          </svg>

          {/* BEFORE Badge */}
          <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
            BEFORE
          </span>
        </div>

        {/* RIGHT: After */}
        <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#0c222c] to-[#07161d]">
          <svg viewBox="0 0 200 150" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
            {/* Gum tissue harmonised */}
            <path
              d="M 10,22 C 60,18 140,18 190,22 L 190,52 C 140,46 60,46 10,52 Z"
              fill="#be3d52"
              opacity="0.9"
            />
            {/* After Teeth - Harmonious aligned arch */}
            <g fill="#f8fafc">
              <rect x="25" y="45" width="24" height="45" rx="4" />
              <rect x="52" y="41" width="28" height="50" rx="5" />
              {/* Perfectly closed midline contact */}
              <rect x="81" y="40" width="32" height="52" rx="5" />
              <rect x="114" y="40" width="32" height="52" rx="5" />
              <rect x="147" y="44" width="24" height="46" rx="4" />
              {/* Specular enamel reflection */}
              <path d="M 92,48 Q 94,65 92,82" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
              <path d="M 124,48 Q 122,65 124,82" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            </g>
            {/* Balanced lower lip smile arc */}
            <path d="M 0,112 C 60,130 140,130 200,112 L 200,150 L 0,150 Z" fill="#2d1319" opacity="0.9" />
          </svg>

          {/* AFTER Badge */}
          <span className="absolute bottom-2 right-2 rounded bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
            AFTER
          </span>
        </div>
      </div>

      {/* Center divider line */}
      <div className="pointer-events-none absolute bottom-0 top-0 left-1/2 w-0.5 -translate-x-1/2 bg-white/70 shadow-sm" />
    </div>
  );
}
