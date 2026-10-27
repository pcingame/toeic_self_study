export default function WaveformBars({
  active = false,
  bars = 5,
  className = "",
}: {
  active?: boolean;
  bars?: number;
  className?: string;
}) {
  return (
    <span className={`waveform h-4 ${active ? "is-active" : ""} ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} className="waveform-bar" />
      ))}
    </span>
  );
}
