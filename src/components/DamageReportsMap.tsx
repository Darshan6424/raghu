
import LocationPicker from "@/components/LocationPicker";
import { DamageReport } from "@/types/damageReports";

interface DamageReportsMapProps {
  reports: DamageReport[];
}

const DamageReportsMap = ({ reports }: DamageReportsMapProps) => {
  const reportsWithCoordinates = reports.filter(report => report.latitude && report.longitude);
  const initialCoordinates = reportsWithCoordinates.length > 0 
    ? { lat: reportsWithCoordinates[0].latitude!, lng: reportsWithCoordinates[0].longitude! }
    : { lat: 28.3949, lng: 84.1240 }; // Nepal's center coordinates

  if (reportsWithCoordinates.length === 0) return null;

  return (
    <div className="mb-8">
      <LocationPicker
        initialLat={initialCoordinates.lat}
        initialLng={initialCoordinates.lng}
        onLocationSelected={() => {}}
        readOnly={true}
        markers={reportsWithCoordinates.map(report => ({
          lat: report.latitude!,
          lng: report.longitude!,
          popup: `
            <strong>${report.location}</strong><br/>
            ${report.description}<br/>
            ${new Date(report.created_at).toLocaleDateString()}
          `
        }))}
      />
    </div>
  );
};

export default DamageReportsMap;
