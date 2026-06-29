import { useQuery, useQueryClient } from '@tanstack/react-query';
import { siteSettingsService } from '../services/supabaseServices';
import { queryKeys } from './useSupabaseQueries';

export function useLogo() {
  const qc = useQueryClient();

  const { data: logoUrl = '', isLoading: loading } = useQuery({
    queryKey: queryKeys.logo,
    queryFn: () => siteSettingsService.getLogoUrl(),
    staleTime: 1000 * 60 * 60, // 1 hour cache
    gcTime: 1000 * 60 * 60,    // 1 hour cache
    retry: 3,                  // Increased retries for network resilience
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const setLogoUrl = (url: string) => {
    qc.setQueryData(queryKeys.logo, url);
  };

  return { logoUrl, loading, setLogoUrl };
}
