import { useQuery, useQueryClient } from '@tanstack/react-query';
import { siteSettingsService } from '../services/supabaseServices';
import { queryKeys } from './useSupabaseQueries';

export function useLogo() {
  const qc = useQueryClient();

  const { data: logoUrl = '', isLoading: loading } = useQuery({
    queryKey: queryKeys.logo,
    queryFn: () => siteSettingsService.getLogoUrl(),
    staleTime: 0,
    gcTime: 0,
    retry: 2,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  const setLogoUrl = (url: string) => {
    qc.setQueryData(queryKeys.logo, url);
  };

  return { logoUrl, loading, setLogoUrl };
}
