import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let value = 0;

    const timer = setInterval(() => {
      value += Math.floor(Math.random() * 8) + 2;

      if (value >= 100) {
        value = 100;
        clearInterval(timer);
      }

      setProgress(value);
    }, 35);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black">

      {/* Background Glow */}
      <div className="absolute h-[420px] w-[420px] rounded-full bg-gold-500/10 blur-[140px]" />

      <div className="relative flex w-full max-w-md flex-col items-center px-8">

        {/* Logo */}
        <div className="animate-fade-in">
          <Logo height={85} />
        </div>

        {/* Heading */}
        <h2 className="mt-8 text-center font-display text-3xl font-bold text-white">
          Crafting
          <span className="text-gradient-gold"> Cinematic Stories</span>
        </h2>

        {/* Subtitle */}
        <p className="mt-3 text-center text-sm tracking-[0.25em] uppercase text-stone-400">
          Preparing Experience...
        </p>

        {/* Progress Bar */}
        <div className="mt-10 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-1 rounded-full bg-gold-gradient transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage */}
        <div className="mt-4 text-sm font-semibold text-gold-400">
          {progress}%
        </div>

        {/* Bottom Text */}
        <p className="mt-8 text-center text-xs uppercase tracking-[0.35em] text-stone-500">
          Powered by Webroly
        </p>

      </div>
    </div>
  );
}
