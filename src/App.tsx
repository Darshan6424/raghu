
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import MissingPersonsList from "./pages/MissingPersonsList";
import DamageReportsList from "./pages/DamageReportsList";
import MissingPersonDetail from "./pages/MissingPersonDetail";
import DamageReportDetail from "./pages/DamageReportDetail";
import Admin from "./pages/Admin";

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
            <Route path="/missing-persons-list" element={<MissingPersonsList />} />
            <Route path="/missing-persons/:id" element={<MissingPersonDetail />} />
            <Route path="/damage-reports-list" element={<DamageReportsList />} />
            <Route path="/damage-reports/:id" element={<DamageReportDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/first-aid/:topic" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
