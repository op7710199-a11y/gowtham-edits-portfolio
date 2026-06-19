import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

// Public site — existing section components
import { useState } from 'react';
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
import { usePublicData } from './hooks/data';

function PublicSite() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const publicData = usePublicData();

  if (publicData.loading) return <LoadingScreen />;

  return (
    <div className="relative min-h-screen bg-ink-950 text-stone-200">
      <Navbar />
      <main>
        <Hero stats={[
          { value: 240, label: 'Projects Completed', suffix: '+' },
          { value: 180, label: 'Happy Clients', suffix: '+' },
          { value: 1200, label: 'Content Delivered', suffix: '+' },
        ]} />
        <ServicesPreview services={publicData.services} />
        <FeaturedProjects portfolio={publicData.portfolio} onOpenProject={setActiveProjectId} />
        <WhyChoose />
        <About />
        <Portfolio
          portfolio={publicData.portfolio}
          externalActiveId={activeProjectId}
          onActiveIdChange={setActiveProjectId}
        />
        <Services services={publicData.services} />
        <Pricing pricing={publicData.pricing} />
        <ProcessSection />
        <InquiryCTA
          heading="Your project deserves a cinematic edit."
          subtext="Whether it's a wedding film, a viral reel, or a bike cinematic — let's build something that lasts."
        />
        <TestimonialsSection testimonials={publicData.testimonials} />
        <InquiryCTA
          heading="Ready to turn your moments into cinema?"
          subtext="Join 180+ happy clients who turned raw footage into films they replay forever."
        />
        <FAQ faqs={publicData.faqs} />
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
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Admin login — public */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin — protected */}
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

          {/* Public site */}
          <Route path="/*" element={<PublicSite />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
