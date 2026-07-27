"use client";

import { useEffect, useRef, useState } from "react";
import { SaveTheDateSection } from "./SaveTheDateSection";
import { TimelineSection } from "./TimelineSection";
import { GallerySection } from "./GallerySection";
import { VideoBackground } from "./VideoBackground";

export function VideoSectionsGroup() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      {visible && (
        <div className="fixed inset-0 -z-10 h-screen w-full overflow-hidden">
          <VideoBackground />
        </div>
      )}
      <SaveTheDateSection />
      <TimelineSection />
      <GallerySection />
    </div>
  );
}
