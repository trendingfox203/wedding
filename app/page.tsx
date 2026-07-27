import { HeroSection } from "@/components/HeroSection";
import { VideoSectionsGroup } from "@/components/VideoSectionsGroup";
import { DetailsSection } from "@/components/DetailsSection";
import { DressCodeSection } from "@/components/DressCodeSection";
import { FAQSection } from "@/components/FAQSection";
import { RSVPForm } from "@/components/RSVPForm";
import { UntilWeMeetAgainSection } from "@/components/UntilWeMeetAgainSection";

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />
      <VideoSectionsGroup />
      <DetailsSection />
      <DressCodeSection />
      <FAQSection />
      <RSVPForm />
      <UntilWeMeetAgainSection />
    </main>
  );
}
