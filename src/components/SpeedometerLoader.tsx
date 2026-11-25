import { useEffect, useState } from "react";

interface Props {
  label?: string;
  duration?: number; // ms
}

/** Animated car speedometer — pin sweeps 0 → 220 km/h while loading */
const SpeedometerLoader = ({ label = "Loading…", duration = 1200 }: Props) => {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out
      const eased = 1 - Math.pow(1 - t, 2.2);
      setSpeed(Math.round(eased * 220));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  // -120deg (0) to +120deg (220)
  const angle = -120 + (speed / 220) * 240;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {/* outer ring */}
          <defs>
            <linearGradient id="speedArc" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(0 0% 12%)" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
          {/* arc track */}
          <path
            d="M 18 90 A 50 50 0 1 1 102 90"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* progress arc */}
          <path
            d="M 18 90 A 50 50 0 1 1 102 90"
            fill="none"
            stroke="url(#speedArc)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="220"
            strokeDashoffset={220 - (speed / 220) * 220}
            style={{ transition: "stroke-dashoffset 60ms linear" }}
          />
          {/* tick marks */}
          {Array.from({ length: 11 }).map((_, i) => {
            const a = (-120 + (i / 10) * 240) * (Math.PI / 180);
            const x1 = 60 + Math.cos(a) * 44;
            const y1 = 60 + Math.sin(a) * 44;
            const x2 = 60 + Math.cos(a) * 38;
            const y2 = 60 + Math.sin(a) * 38;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" />;
          })}
          {/* needle */}
          <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "60px 60px", transition: "transform 60ms linear" }}>
            <line x1="60" y1="60" x2="60" y2="22" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="60" cy="60" r="5" fill="hsl(var(--primary))" />
            <circle cx="60" cy="60" r="2" fill="hsl(0 0% 100%)" />
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 pointer-events-none">
          <span className="text-lg font-bold font-mono text-foreground">{speed}</span>
          <span className="text-[10px] text-muted-foreground -mt-1">km/h</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground tracking-wider uppercase animate-pulse">{label}</p>
    </div>
  );
};

export default SpeedometerLoader;
