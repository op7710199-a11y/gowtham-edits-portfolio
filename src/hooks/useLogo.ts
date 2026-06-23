import { useQuery, useQueryClient } from '@tanstack/react-query';
import { siteSettingsService } from '../services/supabaseServices';
import { queryKeys } from './useSupabaseQueries';

export function useLogo() {
  const qc = useQueryClient();
  const { data: logoUrl, isLoading: loading } = useQuery({
    queryKey: queryKeys.logo,
    queryFn: async () => {
      try {
        return await siteSettingsService.getLogoUrl();
      } catch {
        return '';
      }
    },
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });

  const setLogoUrl = (url: string) => {
    qc.setQueryData(queryKeys.logo, url);
  };

  return { logoUrl: logoUrl ?? '', loading, setLogoUrl };
}
