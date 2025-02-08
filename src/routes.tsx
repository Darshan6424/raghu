
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import DamageReportsList from "./pages/DamageReportsList";
import PreviousDetailReport from "./pages/PreviousDetailReport";
import DetailedReport from "./pages/DetailedReport";
import Comments from "./pages/Comments";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/main" element={<MainPage />} />
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/damage-reports-list" element={<DamageReportsList />} />
      <Route path="/previous-detail-report" element={<PreviousDetailReport />} />
      <Route path="/detailed-report/:id" element={<DetailedReport />} />
      <Route path="/comments/:id" element={<Comments />} />
      <Route path="/first-aid/:topic" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
