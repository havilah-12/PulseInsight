import { Activity, HeartPulse, Shield } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-white/10 bg-gradient-to-r from-[#4f7cff] via-[#5b68f6] to-[#6f59e8] shadow-lg">
      <div className="container mx-auto px-6 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-2xl bg-white/20 p-3 shadow-inner backdrop-blur-sm">
                <HeartPulse className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-wide text-white">
                  PulseInsight
                </h1>
                <p className="text-sm font-medium text-white/80">
                  AI-Powered Lab Intelligence Platform
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 md:gap-6">
            <div className="flex items-center space-x-2 text-white transition hover:text-white/90">
              <Activity className="h-5 w-5 drop-shadow" />
              <span className="text-sm font-medium">Patient Insights</span>
            </div>
            <div className="flex items-center space-x-2 text-white transition hover:text-white/90">
              <Shield className="h-5 w-5 drop-shadow" />
              <span className="text-sm font-medium">Secure Reports</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
