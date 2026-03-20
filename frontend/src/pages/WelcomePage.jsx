import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

function WelcomePage() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Community Health AI Assistant";
  const navigate = useNavigate();

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // will redirect the user to login page after 5 seconds
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      navigate("/login");
    }, 7000);

    return () => clearTimeout(redirectTimeout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900/20 to-slate-900 flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-12">
        {/* Icon with pulse effect */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Outer glow circles */}
            <div className="absolute inset-0 animate-pulse">
              <div className="w-24 h-24 rounded-full border-2 border-teal-400/50 absolute inset-0"></div>
            </div>
            <div
              className="absolute inset-0 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="w-28 h-28 rounded-full border border-cyan-400/30 absolute inset-0 -top-2 -left-2"></div>
            </div>

            {/* Icon container */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400/20 to-cyan-400/20 border-2 border-teal-400 flex items-center justify-center relative z-20">
              <Heart
                className="w-12 h-12 text-teal-300 animate-pulse"
                fill="currentColor"
              />
            </div>
          </div>
        </div>

        {/* Title with typing animation */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight min-h-16">
            {displayText}
            <span className="animate-pulse">|</span>
          </h1>
          <p className="text-cyan-300 text-lg animate-fade-in">
            Powering Community Health
          </p>
        </div>

        {/* Heart Monitor Loading Animation */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
            {/* SVG Heart Monitor */}
            <svg
              viewBox="0 0 1000 100"
              className="w-full h-24 text-teal-300"
              preserveAspectRatio="none"
            >
              <style>{`
                @keyframes drawLine {
                  0% { stroke-dashoffset: 1000; }
                  100% { stroke-dashoffset: 0; }
                }

                .heartline {
                  stroke: currentColor;
                  stroke-width: 2;
                  fill: none;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                  filter: drop-shadow(0 0 2px rgba(34, 197, 94, 0.5));
                }

                .heartline-animated {
                  animation: drawLine 2.5s linear infinite;
                  stroke-dasharray: 1000;
                }
              `}</style>

              {/* Static baseline before heart */}
              <polyline className="heartline" points="0,50 100,50" />

              {/* Animated heart monitor line */}
              <polyline
                className="heartline heartline-animated"
                points="100,50 120,50 130,20 140,80 150,50 180,50 190,30 200,70 210,50 240,50 250,50 260,45 265,40 270,50 275,35 280,50 290,50 310,50 320,50 330,45 335,40 340,48 345,35 350,50 360,50 380,50 400,50 410,50 420,45 425,40 430,50 435,35 440,50 450,50 470,50 490,50 500,50 510,50 520,50 530,50 540,50 550,50 560,50 570,50 580,50 590,50 600,50 610,50 620,50 630,50 640,50 650,50 660,50 670,50 680,50 690,50 700,50 710,50 720,50 730,50 740,50 750,50 760,50 770,50 780,50 790,50 800,50 810,50 820,50 830,50 840,50 850,50 860,50 870,50 880,50 890,50 900,50 910,50 920,50 930,50 940,50 950,50 960,50 970,50 980,50 990,50 1000,50"
              />
            </svg>

            {/* Loading text */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-slate-300 text-sm font-medium">
                Loading
              </span>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"></span>
                <span
                  className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></span>
                <span
                  className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
              </div>
            </div>
          </div>
        </div>

        {/* Status text */}
        <p className="text-slate-400 text-sm animate-fade-in">
          Initializing AI systems and loading data...
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 2s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default WelcomePage;
