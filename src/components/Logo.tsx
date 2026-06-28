import { useState } from 'react';
import { useLogo } from '../hooks/useLogo';

interface LogoProps {
  height?: number;
  className?: string;
  compact?: boolean;
  textOnly?: boolean;
  href?: string;
}

export function Logo({ height = 48, className = '', compact = false, textOnly = false, href }: LogoProps) {
  const { logoUrl } = useLogo();
  const [imgFailed, setImgFailed] = useState(false);

  const showImage = !textOnly && logoUrl && !imgFailed;
  const inner = showImage ? (
    <ImageLogo 
      src={logoUrl ? `${logoUrl}?v=${Date.now()}` : ""} 
      height={height} 
      compact={compact} 
      onFail={() => setImgFailed(true)} 
    />
  ) : (
    <TextLogo compact={compact} height={height} />
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

function ImageLogo({ src, height, compact, onFail }: { src: string; height: number; compact: boolean; onFail: () => void }) {
  if (compact) {
    return (
      <img src={src} alt="GOWTHAM EDITS logo" width={height} height={height}
        className="rounded-xl object-contain" style={{ height, width: height }} draggable={false} onError={onFail} />
    );
  }
  return (
    <img src={src} alt="GOWTHAM EDITS" height={height} style={{ height, width: 'auto' }}
      className="object-contain" draggable={false} onError={onFail} />
  );
}

function TextLogo({ compact, height }: { compact: boolean; height: number }) {
  if (compact) {
    return (
      <span className="grid place-items-center rounded-xl bg-ink-950 font-display font-black text-white"
        style={{ height, width: height, fontSize: height * 0.35 }}>
        G<span className="text-gold-400">E</span>
      </span>
    );
  }
  const size = Math.max(14, Math.round(height * 0.45));
  return (
    <span className="flex flex-col leading-none" style={{ fontSize: size }}>
      <span className="font-display font-extrabold text-white">Gowtham</span>
      <span className="font-display font-extrabold text-gold-400" style={{ fontSize: size * 0.9 }}>edits</span>
    </span>
  );
}
