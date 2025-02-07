
import HeroSection from "@/components/HeroSection";
import MissingPersonForm from "@/components/MissingPersonForm";
import DamageReportForm from "@/components/DamageReportForm";
import FirstAidSection from "@/components/FirstAidSection";
import ExpertConsultationForm from "@/components/ExpertConsultationForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <MissingPersonForm />
      <DamageReportForm />
      <FirstAidSection />
      <ExpertConsultationForm />
    </div>
  );
};

export default Index;
