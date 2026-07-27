export function VideoBackground({ className = "" }: { className?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className={`h-full w-full object-cover grayscale ${className}`}
      >
        <source src="/video/wed.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
