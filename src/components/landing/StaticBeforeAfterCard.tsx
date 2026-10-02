/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import type { StaticResultCase } from "@/lib/results-config";

interface StaticBeforeAfterProps {
  caseData: StaticResultCase;
  className?: string;
}

export function StaticBeforeAfterImage({ caseData, className = "" }: StaticBeforeAfterProps) {
  const { clinicalType, imageUrl } = caseData;
  const [imgFailed, setImgFailed] = useState(false);
  const [customSrc, setCustomSrc] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`custom_case_img_${caseData.id}`);
    }
    return null;
  });
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(customSrc || imageUrl);
  const [hasTriedLower, setHasTriedLower] = useState(false);

  React.useEffect(() => {
    const updateSrc = () => {
      const saved = typeof window !== "undefined" ? localStorage.getItem(`custom_case_img_${caseData.id}`) : null;
      setCustomSrc(saved);
      setCurrentSrc(saved || imageUrl);
      setImgFailed(false);
      setHasTriedLower(false);
    };

    updateSrc();
    window.addEventListener("case_image_updated", updateSrc);
    return () => window.removeEventListener("case_image_updated", updateSrc);
  }, [caseData.id, imageUrl]);

  const handleImgError = () => {
    if (!hasTriedLower && currentSrc && !currentSrc.startsWith("data:") && currentSrc !== currentSrc.toLowerCase()) {
      setHasTriedLower(true);
      setCurrentSrc(currentSrc.toLowerCase());
    } else {
      setImgFailed(true);
    }
  };

  // If caseData has an image specified and it hasn't failed to load, render the actual photo
  if (currentSrc && !imgFailed) {
    return (
      <div
        className={`relative aspect-[16/10] w-full select-none overflow-hidden rounded-2xl bg-[#090b10] border border-border shadow-xs ${className}`}
      >
        <img
          src={currentSrc}
          alt={`${caseData.concern} Before and After Treatment Result`}
          className="h-full w-full object-cover"
          onError={handleImgError}
          referrerPolicy="no-referrer"
        />
        {/* BEFORE Badge */}
        <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
          BEFORE
        </span>
        {/* AFTER Badge */}
        <span className="absolute bottom-2 right-2 rounded bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
          AFTER
        </span>
        {/* Center divider line */}
        <div className="pointer-events-none absolute bottom-0 top-0 left-1/2 w-0.5 -translate-x-1/2 bg-white/80 shadow-md" />
      </div>
    );
  }

  // Realistic clinical smile rendering tailored to clinicalType
  return (
    <div
      className={`relative aspect-[16/10] w-full select-none overflow-hidden rounded-2xl bg-[#0b0c10] border border-border shadow-xs ${className}`}
    >
      {/* Side-by-side static split: LEFT is Before, RIGHT is After */}
      <div className="absolute inset-0 grid grid-cols-2">
        {/* ===================== LEFT: BEFORE ===================== */}
        <div className="relative h-full w-full overflow-hidden border-r border-white/20 bg-gradient-to-br from-[#12161b] to-[#0a0d11]">
          <svg viewBox="0 0 200 150" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="lipGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#cf6c6f" />
                <stop offset="100%" stopColor="#9e3b43" />
              </linearGradient>
              <linearGradient id="gumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d25867" />
                <stop offset="100%" stopColor="#ad3543" />
              </linearGradient>
              <linearGradient id="toothShadow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#dedbd5" />
                <stop offset="100%" stopColor="#fdfcf8" />
              </linearGradient>
              <linearGradient id="toothBack" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c5c1b8" />
                <stop offset="100%" stopColor="#e3dfd7" />
              </linearGradient>
            </defs>

            {/* Dark oral cavity background */}
            <rect width="200" height="150" fill="#180c10" />

            {/* Upper Lip contour */}
            <path
              d="M 0,22 C 35,28 65,12 100,18 C 135,12 165,28 200,22 L 200,0 L 0,0 Z"
              fill="url(#lipGradient)"
            />

            {/* Upper Scalloped Gingiva */}
            <path
              d="M 10,24 C 30,22 45,36 60,35 C 75,34 85,25 105,25 C 125,25 135,35 150,35 C 165,35 180,24 195,24 L 195,48 C 175,44 150,42 100,40 C 50,42 25,44 10,48 Z"
              fill="url(#gumGradient)"
            />

            {clinicalType === "crowding" || clinicalType === "crooked" ? (
              <g>
                {/* Lower crowded anterior teeth visible below */}
                <g fill="url(#toothBack)">
                  {/* Lower incisors crooked/overlapping */}
                  <rect x="55" y="86" width="18" height="26" rx="3" transform="rotate(-8 55 86)" />
                  <rect x="72" y="83" width="19" height="29" rx="3" transform="rotate(6 72 83)" />
                  <rect x="91" y="85" width="20" height="27" rx="3" transform="rotate(-5 91 85)" />
                  <rect x="110" y="84" width="18" height="28" rx="3" transform="rotate(7 110 84)" />
                  <rect x="127" y="88" width="18" height="24" rx="3" />
                </g>

                {/* Upper Teeth - Accurate crowding layout from reference CROWDING.png */}
                {/* Right Canine */}
                <path
                  d="M 32,45 C 32,40 45,38 48,45 L 49,82 C 45,86 35,84 32,80 Z"
                  fill="url(#toothShadow)"
                />
                {/* Tucked/Rotated Lateral Incisor (In Shadow behind central) */}
                <path
                  d="M 47,44 C 47,40 68,39 68,44 L 67,82 C 60,84 48,82 47,80 Z"
                  fill="url(#toothBack)"
                />
                {/* Left Central Incisor (Prominent, overlapping) */}
                <path
                  d="M 64,41 C 64,36 94,36 94,41 L 93,89 C 85,91 66,91 64,88 Z"
                  fill="#fdfcf9"
                  stroke="#cfcac0"
                  strokeWidth="0.8"
                />
                {/* Right Central Incisor (Rotated angle) */}
                <path
                  d="M 94,42 C 94,37 122,37 122,42 L 120,88 C 112,90 96,90 94,88 Z"
                  fill="#f6f3eb"
                  stroke="#cfcac0"
                  strokeWidth="0.8"
                />
                {/* Left Lateral Incisor (Overlapped) */}
                <path
                  d="M 120,44 C 120,40 142,40 142,45 L 140,82 C 132,84 121,83 120,81 Z"
                  fill="url(#toothBack)"
                />
                {/* Left Canine */}
                <path
                  d="M 141,45 C 141,40 160,42 160,48 L 157,80 C 150,83 142,82 141,79 Z"
                  fill="url(#toothShadow)"
                />
              </g>
            ) : clinicalType === "spacing" ? (
              <g fill="#f5f5f4">
                <rect x="25" y="45" width="22" height="42" rx="4" />
                <rect x="52" y="42" width="26" height="48" rx="5" />
                {/* Diastema gap */}
                <rect x="110" y="42" width="26" height="48" rx="5" />
                <rect x="142" y="45" width="22" height="42" rx="4" />
              </g>
            ) : clinicalType === "open-bite" ? (
              <g fill="#f5f5f4">
                <rect x="35" y="38" width="24" height="38" rx="4" />
                <rect x="65" y="35" width="28" height="40" rx="5" />
                <rect x="98" y="35" width="28" height="40" rx="5" />
                <rect x="130" y="38" width="24" height="38" rx="4" />
                <rect x="68" y="98" width="25" height="30" rx="4" fill="#cbd5e1" opacity="0.6" />
                <rect x="98" y="98" width="25" height="30" rx="4" fill="#cbd5e1" opacity="0.6" />
              </g>
            ) : (
              <g fill="#f5f5f4">
                <rect x="30" y="45" width="24" height="45" rx="4" />
                <rect x="60" y="40" width="32" height="60" rx="5" />
                <rect x="98" y="40" width="32" height="60" rx="5" />
                <rect x="136" y="45" width="24" height="45" rx="4" />
              </g>
            )}

            {/* Lower Lip Smile Contour */}
            <path
              d="M 0,108 C 45,124 155,124 200,108 L 200,150 L 0,150 Z"
              fill="url(#lipGradient)"
            />
          </svg>

          {/* BEFORE Badge */}
          <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
            BEFORE
          </span>
        </div>

        {/* ===================== RIGHT: AFTER ===================== */}
        <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#0c222c] to-[#07161d]">
          <svg viewBox="0 0 200 150" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="alignedTooth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#f8fbfd" />
                <stop offset="100%" stopColor="#eaf1f5" />
              </linearGradient>
            </defs>

            {/* Oral cavity dark backdrop */}
            <rect width="200" height="150" fill="#180c10" />

            {/* Upper Lip contour */}
            <path
              d="M 0,22 C 35,26 65,14 100,18 C 135,14 165,26 200,22 L 200,0 L 0,0 Z"
              fill="url(#lipGradient)"
            />

            {/* Symmetrical Scalloped Gingiva */}
            <path
              d="M 10,22 C 40,24 60,34 76,34 C 92,34 94,28 100,28 C 106,28 108,34 124,34 C 140,34 160,24 190,22 L 190,44 C 150,40 100,38 10,44 Z"
              fill="url(#gumGradient)"
            />

            {/* Lower Teeth - Straightened and Aligned Arch */}
            <g fill="#e6edf2">
              <rect x="52" y="85" width="18" height="24" rx="3" />
              <rect x="71" y="83" width="19" height="26" rx="3" />
              <rect x="91" y="82" width="18" height="27" rx="3" />
              <rect x="110" y="83" width="19" height="26" rx="3" />
              <rect x="130" y="85" width="18" height="24" rx="3" />
            </g>

            {/* Upper Teeth - Harmonious Aligned Arch */}
            <g fill="url(#alignedTooth)" stroke="#d3dfe6" strokeWidth="0.8">
              {/* Canine Right */}
              <path d="M 28,45 C 28,38 44,38 45,45 L 45,82 C 40,86 32,84 28,80 Z" />
              {/* Lateral Incisor Right */}
              <path d="M 46,42 C 46,37 68,37 68,42 L 67,85 C 60,88 48,87 46,84 Z" />
              {/* Central Incisor Right */}
              <path d="M 69,38 C 69,33 99,33 99,38 L 98,89 C 88,92 71,92 69,89 Z" />
              {/* Central Incisor Left */}
              <path d="M 100,38 C 100,33 130,33 130,38 L 129,89 C 127,92 110,92 100,89 Z" />
              {/* Lateral Incisor Left */}
              <path d="M 131,42 C 131,37 153,37 153,42 L 152,85 C 150,87 138,88 131,84 Z" />
              {/* Canine Left */}
              <path d="M 154,45 C 154,38 170,38 171,45 L 170,82 C 166,84 158,86 154,80 Z" />
            </g>

            {/* Specular enamel reflection highlights */}
            <path
              d="M 80,48 Q 82,65 80,82"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M 118,48 Q 116,65 118,82"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M 58,50 Q 59,62 58,74"
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M 141,50 Q 140,62 141,74"
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.5"
            />

            {/* Lower Lip Smile Arc */}
            <path
              d="M 0,106 C 45,126 155,126 200,106 L 200,150 L 0,150 Z"
              fill="url(#lipGradient)"
            />
          </svg>

          {/* AFTER Badge */}
          <span className="absolute bottom-2 right-2 rounded bg-primary/95 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
            AFTER
          </span>
        </div>
      </div>

      {/* Center divider line */}
      <div className="pointer-events-none absolute bottom-0 top-0 left-1/2 w-0.5 -translate-x-1/2 bg-white/80 shadow-md" />
    </div>
  );
}
