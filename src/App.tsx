/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LeadProvider } from "@/lib/lead";
import { ConcernSelector, SmileCheck } from "@/components/landing/SmileCheck";
import {
  Header,
  Hero,
  TrustStrip,
  Offer,
  Doctor,
  NextSteps,
  Proof,
  Faq,
  Location,
  FinalBooking,
  Footer,
  MobileBar,
} from "@/components/landing/Sections";
import { TreatmentOptions } from "@/components/landing/TreatmentOptions";
import { CompareSection } from "@/components/landing/CompareSection";
import { BeforeAfterResults } from "@/components/landing/BeforeAfterResults";
import { LeadGamesLeadPopup } from "@/components/landing/LeadGamesLeadPopup";

export default function App() {
  return (
    <LeadProvider>
      {/* 01. Minimal Header */}
      <Header />

      <main>
        {/* 02. Hero — Thinking About Straighter Teeth? */}
        <Hero />

        {/* 03. Clinical Trust Strip */}
        <TrustStrip />

        {/* 04. Concern Selector — What Would You Like to Improve? */}
        <ConcernSelector />

        {/* 05. 60-Second Interactive Smile Check & 06. Personalised Result */}
        <SmileCheck />

        {/* 07. Consultation Offer + Short Lead Form */}
        <Offer />

        {/* 08. OUR ORTHODONTIC SERVICES */}
        <TreatmentOptions />

        {/* 09. Braces vs Clear Aligners Comparison */}
        <CompareSection />

        {/* 10. Meet Your Orthodontist */}
        <Doctor />

        {/* 11. REAL PEOPLE. REAL SMILE JOURNEYS (Static Before/After results) */}
        <BeforeAfterResults />

        {/* 13. What Happens When You Book? */}
        <NextSteps />

        {/* 14. Patient Reviews */}
        <Proof />

        {/* 15. FAQ */}
        <Faq />

        {/* 16. Clinic Location */}
        <Location />

        {/* 17. Final Consultation Form & 18. Appointment Request Received */}
        <FinalBooking />
      </main>

      {/* 19. Footer & Persistent Mobile CTA */}
      <Footer />
      <MobileBar />

      {/* Lead Games B2B Lead Capture Popup (10s timer, once per session) */}
      <LeadGamesLeadPopup />
    </LeadProvider>
  );
}
