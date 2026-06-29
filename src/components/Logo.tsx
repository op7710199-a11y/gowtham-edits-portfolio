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
  const [retry, setRetry] = useState(0);

  // Validate that it's a real URL
  const validLogo = typeof logoUrl === 'string' && logoUrl.startsWith('https://');
  const showImage = !textOnly && validLogo && !imgFailed;
  
  const inner = showImage ? (
    <ImageLogo 
      src={logoUrl} 
      retry={retry}
      height={height} 
      compact={compact} 
      onFail={() => setImgFailed(true)}
      onRetry={() => setRetry((r) => r + 1)}
    />
  ) : (
    <TextLogo compact={compact} height={height} />
  );

  const base = `inline-flex items-center flex-none ${className}`;

  if (href) {
    return <a href={href} className={base} aria-label="GOWTHAM EDITS — home">{inner}</a>;
  }
  return <span className={base}>{inner}</span>;
}

function ImageLogo({ src, retry, height, onFail, onRetry }: any) {
  const handleError = () => {
    if (retry < 2) {
      onRetry();
    } else {
      onFail();
    }
  };

  return (
    <img 
      src={retry ? `${src}?retry=${retry}` : src} 
      alt="GOWTHAM EDITS" 
      loading="eager"
      decoding="async"
      style={{ height, width: "auto", maxWidth: "100%", display: "block" }}
      className="object-contain" 
      draggable={false} 
      onError={handleError} 
    />
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
