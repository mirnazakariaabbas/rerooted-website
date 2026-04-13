import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AudienceProvider } from "@/contexts/AudienceContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import MemberLayout from "./components/layout/MemberLayout";
import MemberHome from "./pages/member/MemberHome";
import CulturalCompanion from "./pages/member/CulturalCompanion";
import CoachPage from "./pages/member/CoachPage";
import AssessmentPage from "./pages/member/AssessmentPage";
import ProgressPage from "./pages/member/ProgressPage";
import ProfilePage from "./pages/member/ProfilePage";
import CoachDashboard from "./pages/coach/CoachDashboard";
import AdminHome from "./pages/admin/AdminHome";
import ContactsPage from "./pages/admin/users/ContactsPage";
import MembersPage from "./pages/admin/users/MembersPage";
import OrganizationsPage from "./pages/admin/users/OrganizationsPage";
import CoachesPage from "./pages/admin/users/CoachesPage";
import AutomatedEmailsPage from "./pages/admin/content/AutomatedEmailsPage";
import NewsletterPage from "./pages/admin/content/NewsletterPage";
import AdminUsersPage from "./pages/admin/users/AdminUsersPage";
import SecurityMetricsPage from "./pages/admin/system/SecurityMetricsPage";
import AuditLogPage from "./pages/admin/system/AuditLogPage";
import EngagementAnalyticsPage from "./pages/admin/analytics/EngagementAnalyticsPage";
import ActiveSessionsPage from "./pages/admin/system/ActiveSessionsPage";
import IpAllowlistPage from "./pages/admin/system/IpAllowlistPage";
import RssMentionsPage from "./pages/admin/content/RssMentionsPage";
import SubscribersPage from "./pages/admin/users/SubscribersPage";
import LinkedInContactsPage from "./pages/admin/users/LinkedInContactsPage";
import RoleHistoryPage from "./pages/admin/users/RoleHistoryPage";
import SeoAnalyticsPage from "./pages/admin/intelligence/SeoAnalyticsPage";
import CompetitiveAnalysisPage from "./pages/admin/intelligence/CompetitiveAnalysisPage";
import PlaceholderPage from "./pages/admin/PlaceholderPage";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";
import About from "./pages/About";
import Services from "./pages/Services";
import ContactPage from "./pages/Contact";
import PreRooted from "./pages/journey/PreRooted";
import RootingIn from "./pages/journey/RootingIn";
import Thrive from "./pages/journey/Thrive";
import RootingBack from "./pages/journey/RootingBack";
import BlogManagerPage from "./pages/admin/content/BlogManagerPage";
import TestimonialsPage from "./pages/admin/content/TestimonialsPage";
import PageContentPage from "./pages/admin/content/PageContentPage";
import MessagesPage from "./pages/member/MessagesPage";
import MessagesOverviewPage from "./pages/admin/content/MessagesOverviewPage";
import AnnouncementsPage from "./pages/admin/content/AnnouncementsPage";
import ContentCalendarPage from "./pages/admin/content/ContentCalendarPage";
import SocialDraftsPage from "./pages/admin/content/SocialDraftsPage";
import MarketingAnalyticsPage from "./pages/admin/analytics/MarketingAnalyticsPage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import CookieBanner from "./components/CookieBanner";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AudienceProvider>
          <Toaster />
          <Sonner />
           <BrowserRouter>
            <ScrollToTop />
             <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/journey/pre-rooted" element={<PreRooted />} />
              <Route path="/journey/rooting-in" element={<RootingIn />} />
              <Route path="/journey/thrive" element={<Thrive />} />
              <Route path="/journey/rooting-back" element={<RootingBack />} />
              <Route path="/app" element={<MemberLayout />}>
                <Route index element={<Navigate to="/app/home" replace />} />
                <Route path="home" element={<MemberHome />} />
                <Route path="cultural" element={<CulturalCompanion />} />
                <Route path="coach" element={<CoachPage />} />
                <Route path="assessment" element={<AssessmentPage />} />
                <Route path="progress" element={<ProgressPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="coach-dashboard" element={<CoachDashboard />} />
                {/* Admin routes */}
                <Route path="admin">
                  <Route index element={<Navigate to="/app/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminHome />} />
                  <Route path="users/contacts" element={<ContactsPage />} />
                  <Route path="users/members" element={<MembersPage />} />
                  <Route path="users/organizations" element={<OrganizationsPage />} />
                  <Route path="users/coaches" element={<CoachesPage />} />
                  <Route path="users/admins" element={<AdminUsersPage />} />
                  <Route path="users/subscribers" element={<SubscribersPage />} />
                  <Route path="users/linkedin" element={<LinkedInContactsPage />} />
                  <Route path="users/history" element={<RoleHistoryPage />} />
                  <Route path="content/emails" element={<AutomatedEmailsPage />} />
                  <Route path="content/newsletter" element={<NewsletterPage />} />
                  <Route path="content/rss" element={<RssMentionsPage />} />
                  <Route path="content/blog" element={<BlogManagerPage />} />
                  <Route path="content/testimonials" element={<TestimonialsPage />} />
                  <Route path="content/pages" element={<PageContentPage />} />
                  <Route path="content/messages" element={<MessagesOverviewPage />} />
                  
                  <Route path="content/announcements" element={<AnnouncementsPage />} />
                  <Route path="content/calendar" element={<ContentCalendarPage />} />
                  <Route path="content/social-drafts" element={<SocialDraftsPage />} />
                  <Route path="system/security" element={<SecurityMetricsPage />} />
                  <Route path="system/audit" element={<AuditLogPage />} />
                  <Route path="system/sessions" element={<ActiveSessionsPage />} />
                  <Route path="system/ip-allowlist" element={<IpAllowlistPage />} />
                  <Route path="intelligence/seo" element={<SeoAnalyticsPage />} />
                  <Route path="intelligence/competitors" element={<CompetitiveAnalysisPage />} />
                  <Route path="analytics" element={<EngagementAnalyticsPage />} />
                  <Route path="analytics/marketing" element={<MarketingAnalyticsPage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieBanner />
          </BrowserRouter>
        </AudienceProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
