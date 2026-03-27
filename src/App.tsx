import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AudienceProvider } from "@/contexts/AudienceContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import NotFound from "./pages/NotFound.tsx";
import MemberLayout from "./components/layout/MemberLayout.tsx";
import MemberHome from "./pages/member/MemberHome.tsx";
import CulturalCompanion from "./pages/member/CulturalCompanion.tsx";
import CoachPage from "./pages/member/CoachPage.tsx";
import AssessmentPage from "./pages/member/AssessmentPage.tsx";
import ProfilePage from "./pages/member/ProfilePage.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import CoachDashboard from "./pages/coach/CoachDashboard.tsx";

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
                <Route path="home" element={<MemberHome />} />
                <Route path="cultural" element={<CulturalCompanion />} />
                <Route path="coach" element={<CoachPage />} />
                <Route path="assessment" element={<AssessmentPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="admin" element={<AdminDashboard />} />
                <Route path="coach-dashboard" element={<CoachDashboard />} />
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
