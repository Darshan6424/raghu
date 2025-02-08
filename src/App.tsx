
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import DamageReportsList from "./pages/DamageReportsList";
import PreviousDetailReport from "./pages/PreviousDetailReport";
import DetailedReport from "./pages/DetailedReport";
import Comments from "./pages/Comments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/damage-reports-list" element={<DamageReportsList />} />
            <Route path="/previous-detail-report" element={<PreviousDetailReport />} />
            <Route path="/detailed-report/:id" element={<DetailedReport />} />
            <Route path="/comments/:id" element={<Comments />} />
            <Route path="/first-aid/:topic" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
