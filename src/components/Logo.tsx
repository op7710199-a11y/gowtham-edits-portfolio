/*
  Logo component — renders the official GOWTHAM EDITS brand logo.
  The logo is the brush-script wordmark: "Gowtham" in white, "edits" in gold,
  on a black background. We embed it as an <img> pointing to /logo.svg.
  A pure-CSS fallback text version renders automatically if the image fails to load.
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
  const fallback = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    img.onerror = null;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent && !parent.querySelector('[data-text-fallback]')) {
      const span = document.createElement('span');
      span.setAttribute('data-text-fallback', '');
      span.className = 'flex flex-col leading-none';
      span.style.fontSize = `${Math.max(14, Math.round(height * 0.45))}px`;
      span.innerHTML = '<span class="font-display font-extrabold text-white" style="font-size:1em">Gowtham</span><span class="font-display font-extrabold text-gold-400" style="font-size:0.9em">edits</span>';
      parent.appendChild(span);
    }
  };

  if (compact) {
    return (
      <img
        src="/logo.svg"
        alt="GOWTHAM EDITS logo"
        width={height}
        height={height}
        className="rounded-xl object-contain"
        style={{ height, width: height }}
        draggable={false}
        onError={fallback}
      />
    );
  }
  return (
    <img
      src="/logo.svg"
      alt="GOWTHAM EDITS"
      height={height}
      style={{ height, width: 'auto' }}
      className="object-contain"
      draggable={false}
      onError={fallback}
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
