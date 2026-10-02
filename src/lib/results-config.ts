/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import crowdingImg from "@/assets/CROWDING.png";
import spacingImg from "@/assets/SPACING.png";
import crookedTeethImg from "@/assets/CROOKED_TEETH.png";
import forwardlyPlacedImg from "@/assets/FORWARDLY_PLACED.png";
import deepBiteImg from "@/assets/DEEP_BITE.png";
import openBiteImg from "@/assets/OPEN_BITE.png";

export type ResultFilterTag =
  | "all"
  | "crowding"
  | "spacing"
  | "crooked-teeth"
  | "forwardly-placed"
  | "open-bite"
  | "deep-bite"
  | "clear-aligners"
  | "braces";

export interface FilterOption {
  id: ResultFilterTag;
  label: string;
}

export const RESULT_FILTERS: FilterOption[] = [
  { id: "all", label: "All" },
  { id: "crowding", label: "Crowding" },
  { id: "spacing", label: "Spacing" },
  { id: "crooked-teeth", label: "Crooked Teeth" },
  { id: "forwardly-placed", label: "Forwardly Placed" },
  { id: "open-bite", label: "Open Bite" },
  { id: "deep-bite", label: "Deep Bite" },
  { id: "clear-aligners", label: "Clear Aligners" },
  { id: "braces", label: "Braces" },
];

export interface StaticResultCase {
  id: string;
  caseNumber: string;
  concern: string;
  treatment: string;
  duration: string;
  optionalAligners?: string;
  description: string;
  tags: ResultFilterTag[];
  clinicalType: "crowding" | "spacing" | "crooked" | "forward" | "open-bite" | "deep-bite";
  imageUrl?: string;
}

/**
 * STATIC CLINICAL CASE REPOSITORY
 * Prepared static Before/After representations.
 * Real clinic data placeholders for ABC Dental Hospitals, Anna Nagar Chennai.
 */
export const STATIC_RESULTS: StaticResultCase[] = [
  {
    id: "case-01",
    caseNumber: "CASE 01",
    concern: "CROWDING",
    treatment: "Clear Aligners",
    duration: "7 Months · 25 Aligners",
    description:
      "Patient presented with moderate upper and lower anterior crowding and rotation. Planned with sequential aligner staging to coordinate arch form.",
    tags: ["crowding", "clear-aligners"],
    clinicalType: "crowding",
    imageUrl: crowdingImg,
  },
  {
    id: "case-02",
    caseNumber: "CASE 02",
    concern: "SPACING",
    treatment: "Clear Aligners",
    duration: "[Actual Clinic-Supplied Duration]",
    optionalAligners: "18 Aligners",
    description:
      "Midline diastema and anterior generalized spacing managed discreetly with clear aligners while maintaining posterior canine guidance.",
    tags: ["spacing", "clear-aligners"],
    clinicalType: "spacing",
    imageUrl: spacingImg,
  },
  {
    id: "case-03",
    caseNumber: "CASE 03",
    concern: "CROOKED TEETH",
    treatment: "Braces",
    duration: "[Actual Clinic-Supplied Duration]",
    description:
      "Severely displaced lateral incisors and rotated premolars aligned with low-friction ceramic fixed appliances.",
    tags: ["crooked-teeth", "braces", "crowding"],
    clinicalType: "crooked",
    imageUrl: crookedTeethImg,
  },
  {
    id: "case-04",
    caseNumber: "CASE 04",
    concern: "FORWARDLY PLACED",
    treatment: "Braces",
    duration: "[Actual Clinic-Supplied Duration]",
    description:
      "Excessive anterior overjet with proinclined upper front teeth. Corrected with coordinated fixed orthodontic biomechanics.",
    tags: ["forwardly-placed", "braces"],
    clinicalType: "forward",
    imageUrl: forwardlyPlacedImg,
  },
  {
    id: "case-05",
    caseNumber: "CASE 05",
    concern: "DEEP BITE",
    treatment: "Clear Aligners",
    duration: "[Actual Clinic-Supplied Duration]",
    optionalAligners: "28 Aligners",
    description:
      "Excessive vertical overbite covering lower incisors. Leveled curve of Spee and intrusion ramps re-established functional occlusal clearance.",
    tags: ["deep-bite", "clear-aligners"],
    clinicalType: "deep-bite",
    imageUrl: deepBiteImg,
  },
  {
    id: "case-06",
    caseNumber: "CASE 06",
    concern: "OPEN BITE",
    treatment: "Braces",
    duration: "[Actual Clinic-Supplied Duration]",
    description:
      "Anterior open bite with lack of vertical incisal contact. Vertical mechanics and tongue posture guidance achieved positive anterior overlap.",
    tags: ["open-bite", "braces"],
    clinicalType: "open-bite",
    imageUrl: openBiteImg,
  },
];
