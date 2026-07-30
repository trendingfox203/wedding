"use client";

import { useRef } from "react";
import { HeroSection } from "@/components/HeroSection";
import { VideoSectionsGroup } from "@/components/VideoSectionsGroup";
import { DetailsSection, type DetailsHandle } from "@/components/DetailsSection";
import { FAQSection } from "@/components/FAQSection";
import { RSVPForm } from "@/components/RSVPForm";
import { UntilWeMeetAgainSection } from "@/components/UntilWeMeetAgainSection";
import type { TimelineHandle } from "@/components/TimelineSection";
import { useSlideNavigation } from "@/lib/useSlideNavigation";

export default function Home() {
  const timelineRef = useRef<TimelineHandle>(null);
  const detailsRef = useRef<DetailsHandle>(null);
  useSlideNavigation(timelineRef, detailsRef);

  return (
    <main className="flex-1">
      <HeroSection />
      <VideoSectionsGroup timelineRef={timelineRef} />
      <DetailsSection ref={detailsRef} />
      <FAQSection />
      <RSVPForm />
      <UntilWeMeetAgainSection />
    </main>
  );
}
