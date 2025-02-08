
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
}

const Main = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "NEWS IN THESE BOXES, are links that lead to site of news",
      summary: "Further text summary of news"
    },
    {
      id: 2,
      title: "NEWS IN THESE BOXES, are links that lead to site of news",
      summary: "Further text summary of news"
    },
    {
      id: 3,
      title: "NEWS IN THESE BOXES, are links that lead to site of news",
      summary: "Further text summary of news"
    },
    {
      id: 4,
      title: "NEWS IN THESE BOXES, are links that lead to site of news",
      summary: "Further text summary of news"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === newsItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? newsItems.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Report Forms Button */}
      <div className="flex justify-end mb-8">
        <Link 
          to="/report-forms" 
          className="bg-[#ea384c] text-white px-6 py-2 rounded-xl hover:opacity-90 transition-opacity"
        >
          Report Forms
        </Link>
      </div>

      {/* SHIELD Title with Heartbeat Line */}
      <div className="relative flex items-center justify-center mb-12">
        <div className="absolute w-full">
          <svg className="w-full h-16" viewBox="0 0 1200 100">
            <path
              d="M0,50 Q300,0 600,50 T1200,50"
              fill="none"
              stroke="#ea384c"
              strokeWidth="2"
            />
          </svg>
        </div>
        <h1 className="text-[#ea384c] text-6xl font-bold bg-white px-8 z-10">
          SHIELD
        </h1>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4 mb-12">
        <Link 
          to="/check-status" 
          className="flex-1 bg-[#ea384c] text-white py-3 rounded-xl text-center hover:opacity-90 transition-opacity"
        >
          Check Status
        </Link>
        <Link 
          to="/contacts" 
          className="flex-1 bg-[#ea384c] text-white py-3 rounded-xl text-center hover:opacity-90 transition-opacity"
        >
          Contacts
        </Link>
        <Link 
          to="/about-us" 
          className="flex-1 bg-[#ea384c] text-white py-3 rounded-xl text-center hover:opacity-90 transition-opacity"
        >
          About Us
        </Link>
        <Link 
          to="/how-to-use" 
          className="flex-1 bg-[#ea384c] text-white py-3 rounded-xl text-center hover:opacity-90 transition-opacity"
        >
          How To Use The site
        </Link>
      </div>

      {/* News Carousel */}
      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-center">
          <button 
            onClick={prevSlide}
            className="p-2 text-[#ea384c] hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft size={40} />
          </button>

          <div className="flex-1 overflow-hidden">
            <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {newsItems.map((item) => (
                <div key={item.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gray-200 p-6 rounded-xl mb-4">
                    <h3 className="text-gray-800 text-lg mb-2">{item.title}</h3>
                  </div>
                  <div className="border border-gray-300 p-4 rounded-xl">
                    <p className="text-gray-600">{item.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={nextSlide}
            className="p-2 text-[#ea384c] hover:bg-gray-100 rounded-full"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
