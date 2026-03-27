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
import ActiveSessionsPage from "./pages/admin/system/ActiveSessionsPage";
import IpAllowlistPage from "./pages/admin/system/IpAllowlistPage";
import RssMentionsPage from "./pages/admin/content/RssMentionsPage";
import SubscribersPage from "./pages/admin/users/SubscribersPage";
import LinkedInContactsPage from "./pages/admin/users/LinkedInContactsPage";
import RoleHistoryPage from "./pages/admin/users/RoleHistoryPage";
import SeoAnalyticsPage from "./pages/admin/intelligence/SeoAnalyticsPage";
import CompetitiveAnalysisPage from "./pages/admin/intelligence/CompetitiveAnalysisPage";
import PlaceholderPage from "./pages/admin/PlaceholderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AudienceProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/app" element={<MemberLayout />}>
                <Route index element={<Navigate to="/app/home" replace />} />
                <Route path="home" element={<MemberHome />} />
                <Route path="cultural" element={<CulturalCompanion />} />
                <Route path="coach" element={<CoachPage />} />
                <Route path="assessment" element={<AssessmentPage />} />
                <Route path="profile" element={<ProfilePage />} />
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
                  <Route path="system/security" element={<SecurityMetricsPage />} />
                  <Route path="system/audit" element={<AuditLogPage />} />
                  <Route path="system/sessions" element={<ActiveSessionsPage />} />
                  <Route path="system/ip-allowlist" element={<IpAllowlistPage />} />
                  <Route path="intelligence/seo" element={<SeoAnalyticsPage />} />
                  <Route path="intelligence/competitors" element={<CompetitiveAnalysisPage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AudienceProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
