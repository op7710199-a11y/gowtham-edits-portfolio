import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { PortfolioManager } from './pages/admin/PortfolioManager';
import { ServicesManager } from './pages/admin/ServicesManager';
import { PricingManager } from './pages/admin/PricingManager';
import { TestimonialsManager } from './pages/admin/TestimonialsManager';
import { InquiriesManager } from './pages/admin/InquiriesManager';
import { UsersManager } from './pages/admin/UsersManager';
import { ActivityLogs } from './pages/admin/ActivityLogs';
import { SiteSettingsPage } from './pages/admin/SiteSettings';
import { FaqsManager } from './pages/admin/FaqsManager';
import { StatsManager } from './pages/admin/StatsManager';
import { HeroSettingsPage } from './pages/admin/HeroSettings';
import { AboutManager } from './pages/admin/AboutManager';
import { LogoManager } from './pages/admin/LogoManager';
import { Navbar } from './components/Navbar';
import { FloatingWhatsApp, MobileCTABar, BackToTop } from './components/FloatingActions';
import { Hero } from './components/sections/Hero';
import { ServicesPreview } from './components/sections/ServicesPreview';
import { FeaturedProjects } from './components/sections/FeaturedProjects';
import { WhyChoose } from './components/sections/WhyChoose';
import { ProcessSection } from './components/sections/ProcessSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { InquiryCTA } from './components/sections/InquiryCTA';
import { About } from './components/sections/About';
import { Portfolio } from './components/sections/Portfolio';
import { Services } from './components/sections/Services';
import { Pricing } from './components/sections/Pricing';
import { FAQ } from './components/sections/FAQ';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/sections/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { AITools } from './components/sections/AITools';
import { useServices, usePricing, usePortfolio, useTestimonials, useFAQs } from './hooks/useSupabaseQueries';

function PublicSite() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const servicesQ = useServices();
  const pricingQ = usePricing();
  const portfolioQ = usePortfolio();
  const testimonialsQ = useTestimonials();
  const faqsQ = useFAQs();

  const stillLoading =
    servicesQ.isLoading || pricingQ.isLoading || portfolioQ.isLoading;

  if (stillLoading) return <LoadingScreen />;

  return (
    <div className="relative min-h-screen bg-ink-950 text-stone-200">
      <Navbar />
      <main>
        <Hero />
        <ServicesPreview services={servicesQ.data ?? []} />
        <FeaturedProjects portfolio={portfolioQ.data ?? []} onOpenProject={setActiveProjectId} />
        <WhyChoose />
        <About />
        <Portfolio
          portfolio={portfolioQ.data ?? []}
          externalActiveId={activeProjectId}
          onActiveIdChange={setActiveProjectId}
        />
        <Services services={servicesQ.data ?? []} />
        <Pricing pricing={pricingQ.data ?? []} />
        <ProcessSection />
        <AITools />
        <InquiryCTA
          heading="Your project deserves a cinematic edit."
          subtext="Whether it's a wedding film, a viral reel, or a bike cinematic — let's build something that lasts."
        />
        <TestimonialsSection testimonials={testimonialsQ.data ?? []} />
        <FAQ faqs={faqsQ.data ?? []} />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
      <MobileCTABar />
    </div>
  );
}

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/admin/login" element={<Login />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['super_admin', 'admin', 'editor']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="portfolio" element={<PortfolioManager />} />
              <Route path="hero" element={<ProtectedRoute roles={['super_admin', 'admin']}><HeroSettingsPage /></ProtectedRoute>} />
              <Route path="logo" element={<ProtectedRoute roles={['super_admin']}><LogoManager /></ProtectedRoute>} />
              <Route path="stats" element={<ProtectedRoute roles={['super_admin', 'admin']}><StatsManager /></ProtectedRoute>} />
              <Route path="about" element={<ProtectedRoute roles={['super_admin', 'admin']}><AboutManager /></ProtectedRoute>} />
              <Route path="services" element={<ProtectedRoute roles={['super_admin', 'admin']}><ServicesManager /></ProtectedRoute>} />
              <Route path="pricing" element={<ProtectedRoute roles={['super_admin', 'admin']}><PricingManager /></ProtectedRoute>} />
              <Route path="testimonials" element={<ProtectedRoute roles={['super_admin', 'admin']}><TestimonialsManager /></ProtectedRoute>} />
              <Route path="inquiries" element={<ProtectedRoute roles={['super_admin', 'admin']}><InquiriesManager /></ProtectedRoute>} />
              <Route path="faqs" element={<ProtectedRoute roles={['super_admin', 'admin']}><FaqsManager /></ProtectedRoute>} />
              <Route path="users" element={<ProtectedRoute roles={['super_admin']}><UsersManager /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute roles={['super_admin']}><SiteSettingsPage /></ProtectedRoute>} />
              <Route path="activity" element={<ProtectedRoute roles={['super_admin', 'admin']}><ActivityLogs /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>

            <Route path="/*" element={<PublicSite />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
