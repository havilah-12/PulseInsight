import { Activity, Heart, Shield } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-[#2563eb] via-[#6366f1] to-[#ec4899] shadow-lg border-b border-white/10">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Left Brand Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/30 p-2 rounded-xl shadow-inner backdrop-blur-sm">
                <Heart className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-wide">
                  NirogAryog
                </h1>
                <p className="text-white/80 text-sm font-medium">
                  Healthcare Analytics Platform
                </p>
              </div>
            </div>
          </div>

          {/* Right Features */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-white hover:text-white/90 transition">
              <Activity className="h-5 w-5 drop-shadow" />
              <span className="text-sm font-medium">Live Monitoring</span>
            </div>
            <div className="flex items-center space-x-2 text-white hover:text-white/90 transition">
              <Shield className="h-5 w-5 drop-shadow" />
              <span className="text-sm font-medium">Secure Platform</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
