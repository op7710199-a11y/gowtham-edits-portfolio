/*
  Logo component — renders the official GOWTHAM EDITS brand logo.
  Uses the uploaded logo image with responsive sizing for all sections.
*/

interface LogoProps {
  height?: number;
  className?: string;
  compact?: boolean;
  textOnly?: boolean;
  href?: string;
}

export function Logo({ height = 48, className = '', compact = false, textOnly = false, href }: LogoProps) {
  const inner = textOnly ? (
    <TextLogo compact={compact} height={height} />
  ) : (
    <ImageLogo height={height} compact={compact} />
  );

  const base = `inline-flex items-center shrink-0 ${className}`;

  if (href) {
    return (
      <a href={href} className={base} aria-label="GOWTHAM EDITS — home">
        {inner}
      </a>
    );
  }
  return <span className={base}>{inner}</span>;
}

function ImageLogo({ height, compact }: { height: number; compact: boolean }) {
  if (compact) {
    return (
      <img
        src="/logo.png"
        alt="Gowtham Edits Logo"
        width={height}
        height={height}
        className="rounded-xl object-contain"
        style={{ height, width: height }}
        draggable={false}
        loading="eager"
      />
    );
  }
  return (
    <img
      src="/logo.png"
      alt="Gowtham Edits Logo"
      height={height}
      style={{ height, width: 'auto' }}
      className="object-contain"
      draggable={false}
      loading="eager"
    />
  );
}

function TextLogo({ compact, height }: { compact: boolean; height: number }) {
  if (compact) {
    return (
      <span
        className="grid place-items-center rounded-xl bg-ink-950 font-display font-black text-white"
        style={{ height, width: height, fontSize: height * 0.35 }}
      >
        G<span className="text-gold-400">E</span>
      </span>
    );
  }
  const size = Math.max(14, Math.round(height * 0.45));
  return (
    <span className="flex flex-col leading-none" style={{ fontSize: size }}>
      <span className="font-display font-extrabold text-white">Gowtham</span>
      <span className="font-display font-extrabold text-gold-400" style={{ fontSize: size * 0.9 }}>
        edits
      </span>
    </span>
  );
}
