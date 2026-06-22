import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

let cachedLogoUrl: string | null = null;
const listeners = new Set<(url: string) => void>();

function notify(url: string) {
  cachedLogoUrl = url;
  listeners.forEach((fn) => fn(url));
}

export function useLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(cachedLogoUrl);
  const [loading, setLoading] = useState(cachedLogoUrl === null);

  useEffect(() => {
    const listener = (url: string) => setLogoUrl(url);
    listeners.add(listener);

    if (cachedLogoUrl === null) {
      (async () => {
        try {
          const { data, error } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'logo_url')
            .maybeSingle();
          if (!error && data) {
            const val = typeof data.value === 'string' ? data.value : (data.value as string)?.toString?.() ?? '';
            notify(val || '');
          } else {
            notify('');
          }
        } catch {
          notify('');
        } finally {
          setLoading(false);
        }
      })();
    }

    return () => { listeners.delete(listener); };
  }, []);

  return { logoUrl, loading, setLogoUrl: notify };
}
