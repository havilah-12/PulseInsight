import { useState } from "react";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import WarningChart from "../components/DiseaseChart"; /* Reused filename */
import PatientList from "../components/CommentList";   /* Reused filename */
import Uploader from "../components/Uploader";
import { useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const queryClient = useQueryClient();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    queryClient.invalidateQueries();
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Lab Report Analytics Dashboard
            </h2>
            <p className="text-muted-foreground">
              Monitor patient medical parameters and out-of-range warnings
            </p>
          </div>
          <a href={`${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/export-report`} download>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-indigo-400/20">
              Download Report
            </button>
          </a>
        </div>
        
        <Uploader onUploadSuccess={handleUploadSuccess} />

        <div key={refreshKey}>
          <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PatientList />
          </div>
          <div>
            <WarningChart />
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
