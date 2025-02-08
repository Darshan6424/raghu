
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const WhatIf = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="text-center py-6">
        <h1 className="text-[#ea384c] text-6xl font-bold mb-2">E.R.H.</h1>
        <div className="flex justify-center items-center gap-2">
          <img 
            src="/lovable-uploads/ababb18d-ccda-4ea2-9ff8-482dbcc51bf2.png" 
            alt="Heartbeat Line"
            className="w-full max-w-[1200px] h-12 object-contain"
          />
        </div>
        <h2 className="text-2xl mt-2">Earthquake Response Hub</h2>
      </div>

      {/* Navigation Menu */}
      <div className="bg-[#ea384c] text-white p-4 flex justify-around items-center rounded-xl mx-4">
        <Link to="/check-status">
          <Button variant="link" className="text-white hover:text-white/80">
            Check Status
          </Button>
        </Link>
        <Link to="/emergency-contacts">
          <Button variant="link" className="text-white hover:text-white/80">
            Emergency Contacts
          </Button>
        </Link>
        <Link to="/about">
          <Button variant="link" className="text-white hover:text-white/80">
            About Us
          </Button>
        </Link>
        <Link to="/how-to-use">
          <Button variant="link" className="text-white hover:text-white/80">
            How To Use The site
          </Button>
        </Link>
      </div>

      {/* News Carousel */}
      <div className="relative my-8 px-4">
        <div className="flex items-center justify-between gap-4">
          <button className="text-[#ea384c]">
            <ChevronLeft size={40} />
          </button>
          
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div className="bg-gray-300 rounded-3xl p-6 text-center">
              <h3 className="text-lg font-semibold">
                NEWS IN THESE BOXES, are links that lead to site of news
              </h3>
            </div>
            <div className="bg-gray-300 rounded-3xl p-6 text-center">
              <h3 className="text-lg font-semibold">
                NEWS IN THESE BOXES, are links that lead to site of news
              </h3>
            </div>
            <div className="bg-gray-300 rounded-3xl p-6 text-center">
              <h3 className="text-lg font-semibold">
                NEWS IN THESE BOXES, are links that lead to site of news
              </h3>
            </div>
          </div>

          <button className="text-[#ea384c]">
            <ChevronRight size={40} />
          </button>
        </div>
      </div>

      {/* Report Forms and Contact Info */}
      <div className="flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-4">
          <span className="text-lg">About Us</span>
          <div className="flex gap-2">
            <a href="#" className="text-blue-600">
              <svg viewBox="0 0 24 24" className="w-8 h-8">
                <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="mailto:contact@erh.com" className="text-red-600">
              <svg viewBox="0 0 24 24" className="w-8 h-8">
                <path fill="currentColor" d="M20.64 4H3.36C2.05 4 1 5.05 1 6.36v11.28C1 18.95 2.05 20 3.36 20h17.28c1.31 0 2.36-1.05 2.36-2.36V6.36C23 5.05 21.95 4 20.64 4zM12 14.41L3.52 7.03h16.96L12 14.41z"/>
              </svg>
            </a>
            <a href="tel:100" className="text-black">
              <svg viewBox="0 0 24 24" className="w-8 h-8">
                <path fill="currentColor" d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="p-6 border-2 border-[#ea384c] rounded-2xl mb-4">
            <img src="/placeholder.svg" alt="Report Icon" className="w-16 h-16" />
            <Button variant="destructive" className="mt-2">
              Report Forms
            </Button>
          </div>
        </div>

        <div className="text-right">
          <div>
            Rescue-Police: <a href="tel:100" className="text-[#ea384c] underline">100</a>
          </div>
          <div>
            Hospital: <a href="tel:4223807" className="text-[#ea384c] underline">4223807</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIf;
