
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PersonalDetailsFormProps {
  name: string;
  lastSeen: string;
  age: string;
  gender: string;
  features: string;
  contact: string;
  onChange: (field: string, value: string) => void;
}

const PersonalDetailsForm = ({
  name,
  lastSeen,
  age,
  gender,
  features,
  contact,
  onChange,
}: PersonalDetailsFormProps) => {
  return (
    <div className="space-y-3">
      <Input
        placeholder="Name of the Lost Person"
        value={name}
        onChange={(e) => onChange('name', e.target.value)}
        required
        className="border-2 rounded-lg py-2 px-3"
      />
      <Input
        placeholder="Last Seen At"
        value={lastSeen}
        onChange={(e) => onChange('lastSeen', e.target.value)}
        required
        className="border-2 rounded-lg py-2 px-3"
      />
      <div className="grid grid-cols-[1fr,1fr,2fr] gap-3">
        <Input
          placeholder="Age"
          type="number"
          value={age}
          onChange={(e) => onChange('age', e.target.value)}
          className="border-2 rounded-lg py-2 px-3"
        />
        <Input
          placeholder="Gender"
          value={gender}
          onChange={(e) => onChange('gender', e.target.value)}
          className="border-2 rounded-lg py-2 px-3"
        />
        <Input
          placeholder="Phone Number (Yours)"
          value={contact}
          onChange={(e) => onChange('contact', e.target.value)}
          required
          className="border-2 rounded-lg py-2 px-3"
        />
      </div>
      <Textarea
        placeholder="Identifying Features"
        value={features}
        onChange={(e) => onChange('features', e.target.value)}
        className="border-2 rounded-lg py-2 px-3 min-h-[80px] resize-none"
      />
    </div>
  );
};

export default PersonalDetailsForm;
