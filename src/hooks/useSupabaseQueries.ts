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

// ─── Public (read-only) hooks ────────────────────────────────────────────────

export function useAboutSettings(): UseQueryResult<AboutSettings | null> {
  return useQuery({
    queryKey: queryKeys.about,
    queryFn: () => aboutService.getPublic(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useServices(): UseQueryResult<Service[]> {
  return useQuery({
    queryKey: queryKeys.services,
    queryFn: async () => {
      try {
        return await servicesService.getPublished();
      } catch {
        return SERVICES as unknown as Service[];
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function usePricing(): UseQueryResult<PricingTier[]> {
  return useQuery({
    queryKey: queryKeys.pricing,
    queryFn: async () => {
      try {
        return await pricingService.getPublished();
      } catch {
        return PRICING as unknown as PricingTier[];
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function usePortfolio(): UseQueryResult<PortfolioItem[]> {
  return useQuery({
    queryKey: queryKeys.portfolio,
    queryFn: async () => {
      try {
        return await portfolioService.getPublished();
      } catch {
        return PROJECTS as unknown as PortfolioItem[];
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useTestimonials(): UseQueryResult<Testimonial[]> {
  return useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: async () => {
      try {
        return await testimonialsService.getPublished();
      } catch {
        return TESTIMONIALS as unknown as Testimonial[];
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useFAQs(): UseQueryResult<FaqItem[]> {
  return useQuery({
    queryKey: queryKeys.faqs,
    queryFn: async () => {
      try {
        return await faqService.getPublished();
      } catch {
        return FAQS as unknown as FaqItem[];
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useHeroSettings(): UseQueryResult<HeroSettings | null> {
  return useQuery({
    queryKey: queryKeys.hero,
    queryFn: () => heroService.get(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useStats(): UseQueryResult<Stat[]> {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: () => statsService.getPublished(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useSiteSettings(): UseQueryResult<Record<string, unknown>> {
  return useQuery({
    queryKey: queryKeys.siteSettings,
    queryFn: () => siteSettingsService.getAll(),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
}

export function useLogoUrl(): UseQueryResult<string> {
  return useQuery({
    queryKey: queryKeys.logo,
    queryFn: () => siteSettingsService.getLogoUrl(),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
}

// ─── Admin (read + mutate) hooks ─────────────────────────────────────────────

export function useServicesAdmin() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.servicesAdmin,
      queryFn: () => servicesService.getAll(),
      retry: 1,
    }),
    create: useMutation({
      mutationFn: (payload: Partial<Service>) => servicesService.create(payload),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: queryKeys.servicesAdmin });
        qc.invalidateQueries({ queryKey: queryKeys.services });
      },
    }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<Service> }) =>
        servicesService.update(id, patch),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: queryKeys.servicesAdmin });
        qc.invalidateQueries({ queryKey: queryKeys.services });
      },
    }),
    remove: useMutation({
      mutationFn: (id: string) => servicesService.remove(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: queryKeys.servicesAdmin });
        qc.invalidateQueries({ queryKey: queryKeys.services });
      },
    }),
  };
}

export function usePricingAdmin() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.pricingAdmin,
      queryFn: () => pricingService.getAll(),
      retry: 1,
    }),
    create: useMutation({
      mutationFn: (payload: Partial<PricingTier>) => pricingService.create(payload),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: queryKeys.pricingAdmin });
        qc.invalidateQueries({ queryKey: queryKeys.pricing });
      },
    }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<PricingTier> }) =>
        pricingService.update(id, patch),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: queryKeys.pricingAdmin });
        qc.invalidateQueries({ queryKey: queryKeys.pricing });
      },
    }),
    remove: useMutation({
      mutationFn: (id: string) => pricingService.remove(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: queryKeys.pricingAdmin });
        qc.invalidateQueries({ queryKey: queryKeys.pricing });
      },
    }),
  };
}

export function usePortfolioAdmin() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.portfolioAdmin,
      queryFn: () => portfolioService.getAll(),
      retry: 1,
    }),
    create: useMutation({
      mutationFn: (payload: Partial<PortfolioItem>) => portfolioService.create(payload),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: queryKeys.portfolioAdmin });
        qc.invalidateQueries({ queryKey: queryKeys.portfolio });
      },
    }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<PortfolioItem> }) =>
        portfolioService.update(id, patch),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: queryKeys.portfolioAdmin });
        qc.invalidateQueries({ queryKey: queryKeys.portfolio });
      },
    }),
    remove: useMutation({
      mutationFn: (id: string) => portfolioService.remove(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: queryKeys.portfolioAdmin });
        qc.invalidateQueries({ queryKey: queryKeys.portfolio });
      },
    }),
  };
}

export function useTestimonialsAdmin() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.testimonialsAdmin,
      queryFn: () => testimonialsService.getAll(),
      retry: 1,
    }),
    create: useMutation({
      mutationFn: (payload: Partial<Testimonial>) => testimonialsService.create(payload),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: queryKeys.testimonialsAdmin });
        qc.invalidateQueries({ queryKey: queryKeys.testimonials });
      },
    }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<Testimonial> }) =>
        testimonialsService.update(id, patch),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: queryKeys.testimonialsAdmin });
        qc.invalidateQueries({ queryKey: queryKeys.testimonials });
      },
    }),
    remove: useMutation({
      mutationFn: (id: string) => testimonialsService.remove(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: queryKeys.testimonialsAdmin });
        qc.invalidateQueries({ queryKey: queryKeys.testimonials });
      },
    }),
  };
}

export function useFAQsAdmin() {
  const qc = useQueryClient();
  return {
    query: useQuery({
      queryKey: queryKeys.faqsAdmin,
      queryFn: () => faqService.getAll(),
      retry: 1,
    }),
    create: useMutation({
      mutationFn: (payload: Partial<FaqItem>) => faqService.create(payload),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: queryKeys.faqsAdmin });
        qc.invalidateQueries({ queryKey: queryKeys.faqs });
      },
    }),
    update: useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<FaqItem> }) =>
        faqService.update(id, patch),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: queryKeys.faqsAdmin });
        qc.invalidateQueries({ queryKey: queryKeys.faqs });
      },
    }),
    remove: useMutation({
      mutationFn: (id: string) => faqService.remove(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: queryKeys.faqsAdmin });
        qc.invalidateQueries({ queryKey: queryKeys.faqs });
      },
    }),
  };
}

export function useAboutAdminMutations() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AboutSettings>) => aboutService.upsert(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.about });
      qc.invalidateQueries({ queryKey: queryKeys.aboutAdmin });
    },
  });
}

export function useHeroMutations() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<HeroSettings>) => heroService.upsert(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.hero });
    },
  });
}

export function useLogoMutations() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => siteSettingsService.updateLogoUrl(url),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.logo });
      qc.invalidateQueries({ queryKey: queryKeys.siteSettings });
    },
  });
}
