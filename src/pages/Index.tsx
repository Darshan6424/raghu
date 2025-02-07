import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Activity, Bell, Phone } from "lucide-react";
import LocationPicker from "@/components/LocationPicker";
import NewsSection from "@/components/NewsSection";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">QuakeReady</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
          <Button variant="ghost" onClick={() => navigate("/prepare")}>Prepare</Button>
          <Button variant="ghost" onClick={() => navigate("/during")}>During</Button>
          <Button variant="ghost" onClick={() => navigate("/after")}>After</Button>
          <Button variant="ghost" onClick={() => navigate("/resources")}>Resources</Button>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-destructive text-white hover:bg-destructive/90">
                  Report
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px]">
                    <div className="grid gap-1">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => navigate("/report-missing")}
                      >
                        Report Missing Person
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => navigate("/damage-report")}
                      >
                        Report Damage
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => navigate("/damage-reports-list")}
                      >
                        View All Reports
                      </Button>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center gap-4 mb-12">
          <Button variant="destructive" size="lg" onClick={() => navigate("/report-missing")}>
            Emergency Plan
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/learn-more")}>
            Learn More
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="card p-6 hover:shadow-md transition-shadow">
            <Shield className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Prepare</h3>
            <p className="text-sm text-gray-600">Create your earthquake preparedness kit</p>
          </div>
          <div className="card p-6 hover:shadow-md transition-shadow">
            <Activity className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">During</h3>
            <p className="text-sm text-gray-600">Know what to do when the ground shakes</p>
          </div>
          <div className="card p-6 hover:shadow-md transition-shadow">
            <Bell className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Alert System</h3>
            <p className="text-sm text-gray-600">Sign up for early warning notifications</p>
          </div>
          <div className="card p-6 hover:shadow-md transition-shadow">
            <Phone className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Emergency Contacts</h3>
            <p className="text-sm text-gray-600">Keep important numbers handy</p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-destructive text-white rounded-lg p-8 mb-12">
          <h2 className="text-xl font-bold mb-6 text-center">Earthquake Statistics</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">20,000+</div>
              <div className="text-sm">Earthquakes Annually</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-sm">Countries at Risk</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Millions</div>
              <div className="text-sm">Lives Saved by Preparedness</div>
            </div>
          </div>
        </div>

        {/* Latest Seismic Activity */}
        <h2 className="text-2xl font-bold mb-6">Latest Seismic Activity</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6">
            <div className="text-2xl font-bold text-primary mb-2">6.2</div>
            <div className="font-semibold mb-2">Pacific Ring of Fire</div>
            <div className="text-sm text-gray-600 mb-4">2 hours ago</div>
            <Button variant="link" size="sm">View Details</Button>
          </div>
          <div className="card p-6">
            <div className="text-2xl font-bold text-primary mb-2">4.7</div>
            <div className="font-semibold mb-2">San Andreas Fault</div>
            <div className="text-sm text-gray-600 mb-4">1 day ago</div>
            <Button variant="link" size="sm">View Details</Button>
          </div>
          <div className="card p-6">
            <div className="text-2xl font-bold text-primary mb-2">5.5</div>
            <div className="font-semibold mb-2">Himalayas Region</div>
            <div className="text-sm text-gray-600 mb-4">3 days ago</div>
            <Button variant="link" size="sm">View Details</Button>
          </div>
        </div>

        {/* Map and Resources Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Earthquake Map</h2>
            <LocationPicker 
              onLocationSelected={() => {}}
              readOnly={true}
            />
            <Button className="w-full mt-4">View Full Map</Button>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Educational Resources</h2>
            <ul className="space-y-4">
              <li>
                <Button variant="link" className="text-left">Understanding Plate Tectonics</Button>
              </li>
              <li>
                <Button variant="link" className="text-left">Building an Emergency Kit</Button>
              </li>
              <li>
                <Button variant="link" className="text-left">Earthquake-Safe Home Improvements</Button>
              </li>
              <li>
                <Button variant="link" className="text-left">First Aid for Earthquake Injuries</Button>
              </li>
            </ul>
            <Button className="w-full mt-6">Explore All Resources</Button>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="card p-8 text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Stay Informed</h2>
          <p className="text-gray-600 mb-6">Sign up for real-time earthquake alerts and safety tips.</p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="input flex-1" />
            <Button>Subscribe</Button>
          </div>
        </div>

        {/* News Section */}
        <NewsSection />
      </div>
    </div>
  );
};

export default Index;
