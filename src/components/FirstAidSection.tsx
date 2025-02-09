
import { Button } from "@/components/ui/button";

const FirstAidSection = () => {
  const handleReadMore = () => {
    window.open("https://www.redcross.org.uk/first-aid/learn-first-aid/videos", "_blank");
  };

  return (
    <section id="first-aid" className="min-h-screen py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">First Aid Information</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { title: "Head Injuries", content: "Common in earthquakes. Keep person still, check breathing, and call emergency services immediately." },
            { title: "Fractures", content: "Immobilize the injured area, apply ice packs, and seek medical attention." },
            { title: "Cuts & Bleeding", content: "Apply direct pressure with clean cloth, elevate the wound, and clean with antiseptic if available." },
            { title: "Crush Injuries", content: "Call emergency services immediately. Do not attempt to free the person without professional help." }
          ].map((info, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">{info.title}</h3>
              <p className="text-gray-600 mb-4">{info.content}</p>
              <Button variant="link" onClick={handleReadMore}>
                Read More
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FirstAidSection;
