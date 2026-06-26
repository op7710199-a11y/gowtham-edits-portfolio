import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  aboutService,
  servicesService,
  pricingService,
  portfolioService,
  testimonialsService,
  faqService,
  heroService,
  statsService,
  siteSettingsService,
} from '../services/supabaseServices';
import { SERVICES, PRICING, PROJECTS, TESTIMONIALS, FAQS } from './seed';
import type {
  AboutSettings,
  Service,
  PricingTier,
  PortfolioItem,
  Testimonial,
  FaqItem,
  HeroSettings,
  Stat,
} from '../types/database';

// ─── Query Keys ─────────────────────────────────────────────────────────────

export const queryKeys = {
  about: ['about'] as const,
  aboutAdmin: ['about', 'admin'] as const,
  services: ['services'] as const,
  servicesAdmin: ['services', 'admin'] as const,
  pricing: ['pricing'] as const,
  pricingAdmin: ['pricing', 'admin'] as const,
  portfolio: ['portfolio'] as const,
  portfolioAdmin: ['portfolio', 'admin'] as const,
  testimonials: ['testimonials'] as const,
  testimonialsAdmin: ['testimonials', 'admin'] as const,
  faqs: ['faqs'] as const,
  faqsAdmin: ['faqs', 'admin'] as const,
  hero: ['hero'] as const,
  stats: ['stats'] as const,
  siteSettings: ['siteSettings'] as const,
  logo: ['logo'] as const,
};

// ─── Constants ─────────────────────────────────────────────────────────────

const DEFAULT_QUERY_OPTIONS = {
  staleTime: 0,
  gcTime: 5 * 60 * 1000,
  retry: 2,
  refetchOnMount: true,
  refetchOnReconnect: true,
  refetchOnWindowFocus: true,
  networkMode: "online" as const,
};

// ─── Public (read-only) hooks ────────────────────────────────────────────────

export function useAboutSettings(): UseQueryResult<AboutSettings | null> {
  return useQuery({
    queryKey: queryKeys.about,
    queryFn: async () => {
      try {
        return await aboutService.getPublic();
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export function useServices(): UseQueryResult<Service[]> {
  return useQuery({
    queryKey: queryKeys.services,
    queryFn: async () => {
      try {
        return await servicesService.getPublished();
      } catch (error) {
        console.error(error);
        return SERVICES as unknown as Service[];
      }
    },
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export function usePricing(): UseQueryResult<PricingTier[]> {
  return useQuery({
    queryKey: queryKeys.pricing,
    queryFn: async () => {
      try {
        return await pricingService.getPublished();
      } catch (error) {
        console.error(error);
        return PRICING as unknown as PricingTier[];
      }
    },
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export function usePortfolio(): UseQueryResult<PortfolioItem[]> {
  return useQuery({
    queryKey: queryKeys.portfolio,
    queryFn: async () => {
      try {
        return await portfolioService.getPublished();
      } catch (error) {
        console.error(error);
        return PROJECTS as unknown as PortfolioItem[];
      }
    },
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export function useTestimonials(): UseQueryResult<Testimonial[]> {
  return useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: async () => {
      try {
        return await testimonialsService.getPublished();
      } catch (error) {
        console.error(error);
        return TESTIMONIALS as unknown as Testimonial[];
      }
    },
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export function useFAQs(): UseQueryResult<FaqItem[]> {
  return useQuery({
    queryKey: queryKeys.faqs,
    queryFn: async () => {
      try {
        return await faqService.getPublished();
      } catch (error) {
        console.error(error);
        return FAQS as unknown as FaqItem[];
      }
    },
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export function useHeroSettings(): UseQueryResult<HeroSettings | null> {
  return useQuery({
    queryKey: queryKeys.hero,
    queryFn: async () => {
      try {
        return await heroService.get();
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export function useStats(): UseQueryResult<Stat[]> {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: async () => {
      try {
        return await statsService.getPublished();
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export function useSiteSettings(): UseQueryResult<Record<string, unknown>> {
  return useQuery({
    queryKey: queryKeys.siteSettings,
    queryFn: async () => {
      try {
        return await siteSettingsService.getAll();
      } catch (error) {
        console.error(error);
        return {};
      }
    },
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export function useLogoUrl(): UseQueryResult<string> {
  return useQuery({
    queryKey: queryKeys.logo,
    queryFn: async () => {
      try {
        return await siteSettingsService.getLogoUrl();
      } catch (error) {
        console.error(error);
        return '';
      }
    },
    ...DEFAULT_QUERY_OPTIONS,
  });
}

// ─── Admin (read + mutate) hooks ─────────────────────────────────────────────

export function useServicesAdmin() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.servicesAdmin,
      queryFn: () => servicesService.getAll(),
      ...DEFAULT_QUERY_OPTIONS,
      retry: 1,
    }),
    create: useMutation({
      mutationFn: (payload: Partial<Service>) => servicesService.create(payload),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queryKeys.servicesAdmin });
        await qc.invalidateQueries({ queryKey: queryKeys.services });
        await qc.refetchQueries({ queryKey: queryKeys.services });
      },
      onError: (error) => { console.error(error); },
    }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<Service> }) =>
        servicesService.update(id, patch),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queryKeys.servicesAdmin });
        await qc.invalidateQueries({ queryKey: queryKeys.services });
        await qc.refetchQueries({ queryKey: queryKeys.services });
      },
      onError: (error) => { console.error(error); },
    }),
    remove: useMutation({
      mutationFn: (id: string) => servicesService.remove(id),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queryKeys.servicesAdmin });
        await qc.invalidateQueries({ queryKey: queryKeys.services });
        await qc.refetchQueries({ queryKey: queryKeys.services });
      },
      onError: (error) => { console.error(error); },
    }),
  };
}

export function usePricingAdmin() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.pricingAdmin,
      queryFn: () => pricingService.getAll(),
      ...DEFAULT_QUERY_OPTIONS,
      retry: 1,
    }),
    create: useMutation({
      mutationFn: (payload: Partial<PricingTier>) => pricingService.create(payload),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queryKeys.pricingAdmin });
        await qc.invalidateQueries({ queryKey: queryKeys.pricing });
        await qc.refetchQueries({ queryKey: queryKeys.pricing });
      },
      onError: (error) => { console.error(error); },
    }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<PricingTier> }) =>
        pricingService.update(id, patch),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queryKeys.pricingAdmin });
        await qc.invalidateQueries({ queryKey: queryKeys.pricing });
        await qc.refetchQueries({ queryKey: queryKeys.pricing });
      },
      onError: (error) => { console.error(error); },
    }),
    remove: useMutation({
      mutationFn: (id: string) => pricingService.remove(id),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queryKeys.pricingAdmin });
        await qc.invalidateQueries({ queryKey: queryKeys.pricing });
        await qc.refetchQueries({ queryKey: queryKeys.pricing });
      },
      onError: (error) => { console.error(error); },
    }),
  };
}

export function usePortfolioAdmin() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.portfolioAdmin,
      queryFn: () => portfolioService.getAll(),
      ...DEFAULT_QUERY_OPTIONS,
      retry: 1,
    }),
    create: useMutation({
      mutationFn: (payload: Partial<PortfolioItem>) => portfolioService.create(payload),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queryKeys.portfolioAdmin });
        await qc.invalidateQueries({ queryKey: queryKeys.portfolio });
        await qc.refetchQueries({ queryKey: queryKeys.portfolio });
      },
      onError: (error) => { console.error(error); },
    }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<PortfolioItem> }) =>
        portfolioService.update(id, patch),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queryKeys.portfolioAdmin });
        await qc.invalidateQueries({ queryKey: queryKeys.portfolio });
        await qc.refetchQueries({ queryKey: queryKeys.portfolio });
      },
      onError: (error) => { console.error(error); },
    }),
    remove: useMutation({
      mutationFn: (id: string) => portfolioService.remove(id),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queryKeys.portfolioAdmin });
        await qc.invalidateQueries({ queryKey: queryKeys.portfolio });
        await qc.refetchQueries({ queryKey: queryKeys.portfolio });
      },
      onError: (error) => { console.error(error); },
    }),
  };
}

export function useTestimonialsAdmin() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.testimonialsAdmin,
      queryFn: () => testimonialsService.getAll(),
      ...DEFAULT_QUERY_OPTIONS,
      retry: 1,
    }),
    create: useMutation({
      mutationFn: (payload: Partial<Testimonial>) => testimonialsService.create(payload),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queryKeys.testimonialsAdmin });
        await qc.invalidateQueries({ queryKey: queryKeys.testimonials });
        await qc.refetchQueries({ queryKey: queryKeys.testimonials });
      },
      onError: (error) => { console.error(error); },
    }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<Testimonial> }) =>
        testimonialsService.update(id, patch),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queryKeys.testimonialsAdmin });
        await qc.invalidateQueries({ queryKey: queryKeys.testimonials });
        await qc.refetchQueries({ queryKey: queryKeys.testimonials });
      },
      onError: (error) => { console.error(error); },
    }),
    remove: useMutation({
      mutationFn: (id: string) => testimonialsService.remove(id),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queryKeys.testimonialsAdmin });
        await qc.invalidateQueries({ queryKey: queryKeys.testimonials });
        await qc.refetchQueries({ queryKey: queryKeys.testimonials });
      },
      onError: (error) => { console.error(error); },
    }),
  };
}

export function useFAQsAdmin() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.faqsAdmin,
      queryFn: () => faqService.getAll(),
      ...DEFAULT_QUERY_OPTIONS,
      retry: 1,
    }),
    create: useMutation({
      mutationFn: (payload: Partial<FaqItem>) => faqService.create(payload),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queryKeys.faqsAdmin });
        await qc.invalidateQueries({ queryKey: queryKeys.faqs });
        await qc.refetchQueries({ queryKey: queryKeys.faqs });
      },
      onError: (error) => { console.error(error); },
    }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<FaqItem> }) =>
        faqService.update(id, patch),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queryKeys.faqsAdmin });
        await qc.invalidateQueries({ queryKey: queryKeys.faqs });
        await qc.refetchQueries({ queryKey: queryKeys.faqs });
      },
      onError: (error) => { console.error(error); },
    }),
    remove: useMutation({
      mutationFn: (id: string) => faqService.remove(id),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queryKeys.faqsAdmin });
        await qc.invalidateQueries({ queryKey: queryKeys.faqs });
        await qc.refetchQueries({ queryKey: queryKeys.faqs });
      },
      onError: (error) => {
        console.error(error);
      },
    }),
  };
        }
